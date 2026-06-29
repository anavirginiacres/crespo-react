<?php
declare(strict_types=1);

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Missing api/config.php — copy config.example.php']);
    exit;
}

$config = require $configPath;

require_once __DIR__ . '/lib/Response.php';
require_once __DIR__ . '/lib/Database.php';
require_once __DIR__ . '/lib/Auth.php';
require_once __DIR__ . '/lib/Categories.php';
require_once __DIR__ . '/lib/Products.php';
require_once __DIR__ . '/lib/Changes.php';
require_once __DIR__ . '/lib/Upload.php';

$db = Database::connect($config['db']);

function slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-');
}

function json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
