<?php
declare(strict_types=1);

final class Products
{
    private static function matchesSearch(string $name, ?string $tags, string $term): bool
    {
        $lower = strtolower($term);
        if (str_contains(strtolower($name), $lower)) {
            return true;
        }
        return $tags !== null && str_contains(strtolower($tags), $lower);
    }

    private static function mapProductRow(array $row, bool $withRelations = true): array
    {
        $product = [
            'id' => (int) $row['id'],
            'id_category' => (int) $row['id_category'],
            'id_subcategory' => (int) $row['id_subcategory'],
            'name' => $row['name'],
            'caption' => $row['caption'],
            'image' => $row['image'],
            'materials' => $row['materials'],
            'measures' => $row['measures'],
            'quantity' => $row['quantity'],
            'details' => $row['details'],
            'caution' => $row['caution'],
            'colors' => $row['colors'],
            'delay' => $row['delay'],
            'tags' => $row['tags'],
            'new_product' => (bool) $row['new_product'],
        ];

        if ($withRelations) {
            $product['category'] = [
                'id' => (int) $row['id_category'],
                'name' => $row['category_name'] ?? '',
            ];
            $product['subcategory'] = [
                'id' => (int) $row['id_subcategory'],
                'name' => $row['subcategory_name'] ?? '',
            ];
        }

        return $product;
    }

    private static function baseSelect(): string
    {
        return 'SELECT p.*, c.name AS category_name, s.name AS subcategory_name
                FROM Products p
                INNER JOIN Categories c ON c.id = p.id_category
                INNER JOIN Subcategories s ON s.id = p.id_subcategory';
    }

    public static function getCatalog(PDO $db): array
    {
        $rows = $db->query(self::baseSelect() . ' ORDER BY p.name ASC')->fetchAll();
        return array_map(static fn ($row) => self::mapProductRow($row), $rows);
    }

    public static function getById(PDO $db, int $id): ?array
    {
        $stmt = $db->prepare(self::baseSelect() . ' WHERE p.id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }

        $product = self::mapProductRow($row);
        $images = $db->prepare('SELECT id, src FROM Images WHERE id_product = ? ORDER BY id ASC');
        $images->execute([$id]);
        $product['images'] = array_map(static function ($img) {
            return ['id' => (int) $img['id'], 'src' => $img['src']];
        }, $images->fetchAll());

        return $product;
    }

    public static function getNew(PDO $db, int $limit = 4): array
    {
        $stmt = $db->prepare(self::baseSelect() . ' WHERE p.new_product = 1 ORDER BY p.id DESC LIMIT ?');
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return array_map(static fn ($row) => self::mapProductRow($row), $stmt->fetchAll());
    }

    public static function getSuggestions(PDO $db, string $query, int $limit = 8): array
    {
        $term = trim($query);
        if (strlen($term) < 3) {
            return [];
        }

        $rows = $db->query('SELECT id, name, caption, tags FROM Products ORDER BY name ASC')->fetchAll();
        $results = [];

        foreach ($rows as $row) {
            if (self::matchesSearch($row['name'], $row['tags'], $term)) {
                $results[] = [
                    'id' => (int) $row['id'],
                    'name' => $row['name'],
                    'caption' => $row['caption'],
                    'tags' => $row['tags'],
                ];
                if (count($results) >= $limit) {
                    break;
                }
            }
        }

        return $results;
    }

    public static function getQuantityOptionsMap(PDO $db): array
    {
        $rows = $db->query('SELECT id, quantity FROM Products')->fetchAll();
        $map = [];

        foreach ($rows as $row) {
            $options = self::parseQuantityOptions($row['quantity']);
            if ($options) {
                $map[(int) $row['id']] = $options;
            }
        }

        return $map;
    }

    private static function parseQuantityOptions(?string $value): array
    {
        if (!$value) {
            return [];
        }
        $parts = array_filter(array_map('trim', explode(',', $value)));
        return array_values($parts);
    }

    public static function adminList(PDO $db, array $params): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = min(max(1, (int) ($params['limit'] ?? 25)), 100);
        $offset = ($page - 1) * $limit;

        $where = [];
        $bindings = [];

        $q = trim($params['q'] ?? '');
        if ($q !== '') {
            $where[] = '(p.name LIKE ? OR p.caption LIKE ? OR p.tags LIKE ? OR p.id = ?)';
            $like = '%' . $q . '%';
            $bindings[] = $like;
            $bindings[] = $like;
            $bindings[] = $like;
            $bindings[] = ctype_digit($q) ? (int) $q : 0;
        }

        $categoryId = (int) ($params['categoryId'] ?? 0);
        if ($categoryId > 0) {
            $where[] = 'p.id_category = ?';
            $bindings[] = $categoryId;
        }

        $subcategoryId = (int) ($params['subcategoryId'] ?? 0);
        if ($subcategoryId > 0) {
            $where[] = 'p.id_subcategory = ?';
            $bindings[] = $subcategoryId;
        }

        $whereSql = $where ? ' WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $db->prepare('SELECT COUNT(*) FROM Products p' . $whereSql);
        $countStmt->execute($bindings);
        $total = (int) $countStmt->fetchColumn();

        $listSql = 'SELECT p.id, p.name, p.caption, p.image, p.tags, p.new_product,
                           p.id_category, p.id_subcategory,
                           c.name AS category_name, s.name AS subcategory_name
                    FROM Products p
                    INNER JOIN Categories c ON c.id = p.id_category
                    INNER JOIN Subcategories s ON s.id = p.id_subcategory'
            . $whereSql . ' ORDER BY p.name ASC LIMIT ? OFFSET ?';

        $listStmt = $db->prepare($listSql);
        $i = 1;
        foreach ($bindings as $binding) {
            $listStmt->bindValue($i++, $binding);
        }
        $listStmt->bindValue($i++, $limit, PDO::PARAM_INT);
        $listStmt->bindValue($i, $offset, PDO::PARAM_INT);
        $listStmt->execute();

        $products = array_map(static function ($row) {
            return [
                'id' => (int) $row['id'],
                'name' => $row['name'],
                'caption' => $row['caption'],
                'image' => $row['image'],
                'tags' => $row['tags'],
                'new_product' => (bool) $row['new_product'],
                'id_category' => (int) $row['id_category'],
                'id_subcategory' => (int) $row['id_subcategory'],
                'category' => ['name' => $row['category_name']],
                'subcategory' => ['name' => $row['subcategory_name']],
            ];
        }, $listStmt->fetchAll());

        $totalPages = max(1, (int) ceil($total / $limit));

        return compact('products', 'total', 'page', 'limit', 'totalPages');
    }

    public static function adminGetById(PDO $db, int $id): ?array
    {
        $product = self::getById($db, $id);
        if (!$product) {
            return null;
        }
        return $product;
    }
}
