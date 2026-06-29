<?php
/**
 * Run once after importing schema.sql:
 * php database/seed.php
 *
 * Set passwords via environment variables or edit defaults below.
 */
declare(strict_types=1);

$configPath = __DIR__ . '/../api/config.php';
if (!file_exists($configPath)) {
    fwrite(STDERR, "Create api/config.php first.\n");
    exit(1);
}

$config = require $configPath;
require_once __DIR__ . '/../api/lib/Database.php';

$db = Database::connect($config['db']);

$categories = [
    ['Bordados', 'embroidery'],
    ['Cartelería', 'ads-sign-poster'],
    ['Enmarcados', 'picture-frame'],
    ['Estampados', 'tshirt-printing'],
    ['Identificadores', 'id-card'],
    ['Imprenta', 'multifunction-printer'],
    ['Indumentaria', 'uniform-tie'],
    ['Merchandising', 'merchandising'],
    ['Papelería', 'envelope-paper'],
    ['Fuerzas Seguridad', 'award'],
    ['Sellos', 'rubber-stamp'],
    ['Trofeos', 'trophy'],
    ['Grabados', 'laser-engravings-machine'],
];

$catInsert = $db->prepare('INSERT INTO Categories (name, icon) VALUES (?, ?)');

$existing = (int) $db->query('SELECT COUNT(*) FROM Categories')->fetchColumn();
if ($existing === 0) {
    foreach ($categories as [$name, $icon]) {
        $catInsert->execute([$name, $icon]);
    }
}

$passwords = [
    ['admin', getenv('ADMIN_PASSWORD') ?: 'admin123', 'ADMIN'],
    ['editor', getenv('ADMIN_EDITOR_PASSWORD') ?: 'editor123', 'USER'],
    ['fernando1967', getenv('ADMIN_FERNANDO_PASSWORD') ?: 'f3rn4nd0', 'ADMIN'],
    ['textil', getenv('ADMIN_TEXTIL_PASSWORD') ?: 'textil123', 'USER'],
];

$userInsert = $db->prepare(
    'INSERT INTO AdminUsers (username, passwordHash, role) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash), role = VALUES(role)'
);

foreach ($passwords as [$username, $password, $role]) {
    $userInsert->execute([$username, password_hash($password, PASSWORD_BCRYPT), $role]);
}

echo "Seed completado: categorías y usuarios admin.\n";
