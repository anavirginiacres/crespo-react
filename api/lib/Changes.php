<?php
declare(strict_types=1);

final class Changes
{
    public static function apply(PDO $db, string $action, ?int $productId, string $payloadJson): ?int
    {
        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) {
            throw new RuntimeException('Invalid payload');
        }

        switch ($action) {
            case 'CREATE_PRODUCT':
                $insert = $db->prepare(
                    'INSERT INTO Products
                    (id_category, id_subcategory, name, caption, image, materials, measures, quantity, details, caution, colors, delay, tags, new_product)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                $insert->execute([
                    (int) $payload['id_category'],
                    (int) $payload['id_subcategory'],
                    $payload['name'],
                    $payload['caption'] ?? null,
                    $payload['image'] ?? null,
                    $payload['materials'] ?? null,
                    $payload['measures'] ?? null,
                    $payload['quantity'] ?? null,
                    $payload['details'] ?? null,
                    $payload['caution'] ?? null,
                    $payload['colors'] ?? null,
                    $payload['delay'] ?? null,
                    $payload['tags'] ?? null,
                    !empty($payload['new_product']) ? 1 : 0,
                ]);
                $newId = (int) $db->lastInsertId();

                if (!empty($payload['galleryImages']) && is_array($payload['galleryImages'])) {
                    $imgInsert = $db->prepare('INSERT INTO Images (id_product, src) VALUES (?, ?)');
                    foreach ($payload['galleryImages'] as $src) {
                        $src = trim((string) $src);
                        if ($src !== '') {
                            $imgInsert->execute([$newId, $src]);
                        }
                    }
                }
                return $newId;

            case 'UPDATE_PRODUCT':
                if (!$productId) {
                    throw new RuntimeException('Product id required');
                }
                $fields = [
                    'id_category', 'id_subcategory', 'name', 'caption', 'image',
                    'materials', 'measures', 'quantity', 'details', 'caution',
                    'colors', 'delay', 'tags', 'new_product',
                ];
                $sets = [];
                $values = [];
                foreach ($fields as $field) {
                    if (array_key_exists($field, $payload)) {
                        $sets[] = "$field = ?";
                        $values[] = $field === 'new_product'
                            ? (!empty($payload[$field]) ? 1 : 0)
                            : $payload[$field];
                    }
                }
                if ($sets) {
                    $values[] = $productId;
                    $db->prepare('UPDATE Products SET ' . implode(', ', $sets) . ' WHERE id = ?')
                        ->execute($values);
                }
                return $productId;

            case 'ADD_IMAGE':
                if (!$productId) {
                    throw new RuntimeException('Product id required');
                }
                $db->prepare('INSERT INTO Images (id_product, src) VALUES (?, ?)')
                    ->execute([$productId, trim((string) ($payload['src'] ?? ''))]);
                return $productId;

            case 'DELETE_IMAGE':
                if (!$productId) {
                    throw new RuntimeException('Product id required');
                }
                $db->prepare('DELETE FROM Images WHERE id = ?')
                    ->execute([(int) ($payload['imageId'] ?? 0)]);
                return $productId;

            default:
                throw new RuntimeException('Unsupported action');
        }
    }

    public static function submit(PDO $db, array $input): array
    {
        $payloadJson = json_encode($input['payload'], JSON_UNESCAPED_UNICODE);
        $action = $input['action'];
        $productId = $input['productId'] ?? null;
        $userId = $input['userId'];
        $role = $input['userRole'];

        if ($role === 'ADMIN') {
            $appliedId = self::apply($db, $action, $productId, $payloadJson);
            $insert = $db->prepare(
                'INSERT INTO ProductChangeRequests
                (action, status, productId, payload, submittedById, reviewedById, reviewedAt)
                VALUES (?, ?, ?, ?, ?, ?, NOW())'
            );
            $insert->execute([
                $action,
                'APPROVED',
                $appliedId ?? $productId,
                $payloadJson,
                $userId,
                $userId,
            ]);
            $changeId = (int) $db->lastInsertId();
            return [
                'mode' => 'applied',
                'change' => self::getById($db, $changeId),
                'productId' => $appliedId,
            ];
        }

        $insert = $db->prepare(
            'INSERT INTO ProductChangeRequests (action, status, productId, payload, submittedById)
             VALUES (?, ?, ?, ?, ?)'
        );
        $insert->execute([$action, 'PENDING', $productId, $payloadJson, $userId]);
        $changeId = (int) $db->lastInsertId();

        return [
            'mode' => 'pending',
            'change' => self::getById($db, $changeId),
            'productId' => $productId,
        ];
    }

    public static function review(PDO $db, int $changeId, int $reviewerId, string $decision, ?string $reviewNote): array
    {
        $change = self::getById($db, $changeId);
        if (!$change) {
            Response::error('Change not found', 404);
        }
        if ($change['status'] !== 'PENDING') {
            Response::error('Change already reviewed', 409);
        }

        if ($decision === 'reject') {
            $db->prepare(
                'UPDATE ProductChangeRequests SET status = ?, reviewedById = ?, reviewNote = ?, reviewedAt = NOW() WHERE id = ?'
            )->execute(['REJECTED', $reviewerId, $reviewNote, $changeId]);
            return self::getById($db, $changeId);
        }

        $appliedId = self::apply(
            $db,
            $change['action'],
            $change['productId'] ? (int) $change['productId'] : null,
            $change['payload']
        );

        $db->prepare(
            'UPDATE ProductChangeRequests SET status = ?, productId = ?, reviewedById = ?, reviewNote = ?, reviewedAt = NOW() WHERE id = ?'
        )->execute(['APPROVED', $appliedId ?? $change['productId'], $reviewerId, $reviewNote, $changeId]);

        return self::getById($db, $changeId);
    }

    public static function query(PDO $db, array $input): array
    {
        $page = max(1, (int) ($input['page'] ?? 1));
        $limit = min(max(1, (int) ($input['limit'] ?? 25)), 100);
        $offset = ($page - 1) * $limit;

        $where = [];
        $bindings = [];

        if (($input['userRole'] ?? '') === 'USER') {
            $where[] = 'c.submittedById = ?';
            $bindings[] = (int) $input['userId'];
        }

        $statusGroup = $input['statusGroup'] ?? null;
        if ($statusGroup === 'pending') {
            $where[] = "c.status = 'PENDING'";
        } elseif ($statusGroup === 'completed') {
            $where[] = "c.status IN ('APPROVED', 'REJECTED')";
        }

        if (!empty($input['dateFrom'])) {
            $where[] = 'c.createdAt >= ?';
            $bindings[] = $input['dateFrom'] . ' 00:00:00';
        }
        if (!empty($input['dateTo'])) {
            $where[] = 'c.createdAt <= ?';
            $bindings[] = $input['dateTo'] . ' 23:59:59';
        }

        $productQuery = trim($input['product'] ?? '');
        if ($productQuery !== '') {
            if (ctype_digit($productQuery)) {
                $where[] = 'c.productId = ?';
                $bindings[] = (int) $productQuery;
            } else {
                $where[] = 'c.productId IN (SELECT id FROM Products WHERE name LIKE ?)';
                $bindings[] = '%' . $productQuery . '%';
            }
        }

        $keyword = trim($input['q'] ?? '');
        if ($keyword !== '') {
            $parts = ['(c.payload LIKE ? OR c.action LIKE ? OR su.username LIKE ?)'];
            $like = '%' . $keyword . '%';
            $bindings[] = $like;
            $bindings[] = $like;
            $bindings[] = $like;
            if (ctype_digit($keyword)) {
                $parts[0] = '(' . $parts[0] . ' OR c.id = ? OR c.productId = ?)';
                $bindings[] = (int) $keyword;
                $bindings[] = (int) $keyword;
            }
            $parts[0] .= ' OR c.productId IN (SELECT id FROM Products WHERE name LIKE ?)';
            $bindings[] = $like;
            $where[] = $parts[0];
        }

        $whereSql = $where ? ' WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $db->prepare(
            'SELECT COUNT(*) FROM ProductChangeRequests c
             INNER JOIN AdminUsers su ON su.id = c.submittedById' . $whereSql
        );
        $countStmt->execute($bindings);
        $total = (int) $countStmt->fetchColumn();

        $listSql = 'SELECT c.*, su.username AS submitted_username, su.role AS submitted_role,
                           ru.username AS reviewed_username, ru.role AS reviewed_role
                    FROM ProductChangeRequests c
                    INNER JOIN AdminUsers su ON su.id = c.submittedById
                    LEFT JOIN AdminUsers ru ON ru.id = c.reviewedById'
            . $whereSql . ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';

        $listStmt = $db->prepare($listSql);
        $i = 1;
        foreach ($bindings as $binding) {
            $listStmt->bindValue($i++, $binding);
        }
        $listStmt->bindValue($i++, $limit, PDO::PARAM_INT);
        $listStmt->bindValue($i, $offset, PDO::PARAM_INT);
        $listStmt->execute();

        $changes = [];
        foreach ($listStmt->fetchAll() as $row) {
            $changes[] = self::mapChangeRow($row);
        }

        $productIds = array_values(array_unique(array_filter(array_map(
            static fn ($c) => $c['productId'],
            $changes
        ))));

        $productMap = [];
        if ($productIds) {
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));
            $pStmt = $db->prepare(
                "SELECT p.*, c.name AS category_name, s.name AS subcategory_name
                 FROM Products p
                 INNER JOIN Categories c ON c.id = p.id_category
                 INNER JOIN Subcategories s ON s.id = p.id_subcategory
                 WHERE p.id IN ($placeholders)"
            );
            $pStmt->execute($productIds);
            foreach ($pStmt->fetchAll() as $pRow) {
                $product = Products::adminGetById($db, (int) $pRow['id']);
                if ($product) {
                    $productMap[(int) $pRow['id']] = $product;
                }
            }
        }

        $changesWithContext = array_map(static function ($change) use ($productMap) {
            $change['currentProduct'] = $change['productId']
                ? ($productMap[(int) $change['productId']] ?? null)
                : null;
            return $change;
        }, $changes);

        return [
            'changes' => $changesWithContext,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => max(1, (int) ceil($total / $limit)),
        ];
    }

    private static function getById(PDO $db, int $id): ?array
    {
        $stmt = $db->prepare(
            'SELECT c.*, su.username AS submitted_username, su.role AS submitted_role,
                    ru.username AS reviewed_username, ru.role AS reviewed_role
             FROM ProductChangeRequests c
             INNER JOIN AdminUsers su ON su.id = c.submittedById
             LEFT JOIN AdminUsers ru ON ru.id = c.reviewedById
             WHERE c.id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? self::mapChangeRow($row) : null;
    }

    private static function mapChangeRow(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'action' => $row['action'],
            'status' => $row['status'],
            'productId' => $row['productId'] !== null ? (int) $row['productId'] : null,
            'payload' => $row['payload'],
            'reviewNote' => $row['reviewNote'],
            'createdAt' => $row['createdAt'],
            'reviewedAt' => $row['reviewedAt'],
            'submittedBy' => [
                'username' => $row['submitted_username'],
                'role' => $row['submitted_role'],
            ],
            'reviewedBy' => $row['reviewed_username'] ? [
                'username' => $row['reviewed_username'],
                'role' => $row['reviewed_role'],
            ] : null,
        ];
    }
}
