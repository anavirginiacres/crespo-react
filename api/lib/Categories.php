<?php
declare(strict_types=1);

final class Categories
{
    public static function getNav(PDO $db): array
    {
        $categories = $db->query('SELECT id, name, icon FROM Categories ORDER BY id ASC')->fetchAll();
        $subStmt = $db->query('SELECT id, id_category, name FROM Subcategories ORDER BY name ASC');
        $subsByCategory = [];

        foreach ($subStmt->fetchAll() as $sub) {
            $subsByCategory[(int) $sub['id_category']][] = $sub;
        }

        return array_map(static function (array $category) use ($subsByCategory) {
            $subs = $subsByCategory[(int) $category['id']] ?? [];

            return [
                'id' => (int) $category['id'],
                'name' => $category['name'],
                'slug' => slugify($category['name']),
                'icon' => $category['icon'],
                'subcategories' => array_map(static function (array $sub) {
                    return [
                        'id' => (int) $sub['id'],
                        'name' => $sub['name'],
                        'slug' => slugify($sub['name']),
                    ];
                }, $subs),
            ];
        }, $categories);
    }

    public static function findBySlug(PDO $db, string $slug): ?array
    {
        foreach (self::getNav($db) as $category) {
            if ($category['slug'] === slugify($slug)) {
                return $category;
            }
        }
        return null;
    }

    public static function findSubcategoryBySlug(PDO $db, string $categorySlug, string $subSlug): ?array
    {
        $category = self::findBySlug($db, $categorySlug);
        if (!$category) {
            return null;
        }

        $normalized = slugify($subSlug);
        foreach ($category['subcategories'] as $sub) {
            if ($sub['slug'] === $normalized) {
                $stmt = $db->prepare('SELECT * FROM Subcategories WHERE id = ? LIMIT 1');
                $stmt->execute([$sub['id']]);
                $row = $stmt->fetch();
                return $row ?: null;
            }
        }
        return null;
    }

    public static function createSubcategory(PDO $db, int $categoryId, string $name): array
    {
        $check = $db->prepare('SELECT id FROM Categories WHERE id = ? LIMIT 1');
        $check->execute([$categoryId]);
        if (!$check->fetch()) {
            Response::error('Categoría no encontrada', 404);
        }

        $insert = $db->prepare('INSERT INTO Subcategories (id_category, name) VALUES (?, ?)');
        $insert->execute([$categoryId, trim($name)]);

        return [
            'id' => (int) $db->lastInsertId(),
            'id_category' => $categoryId,
            'name' => trim($name),
        ];
    }

    public static function updateSubcategory(PDO $db, int $id, string $name): array
    {
        $stmt = $db->prepare('SELECT id FROM Subcategories WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Response::error('Subcategoría no encontrada', 404);
        }

        $update = $db->prepare('UPDATE Subcategories SET name = ? WHERE id = ?');
        $update->execute([trim($name), $id]);

        return [
            'id' => $id,
            'name' => trim($name),
        ];
    }
}
