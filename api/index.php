<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

Response::cors($config);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
$uri = preg_replace('#^/api#', '', $uri) ?: '/';
$uri = rtrim($uri, '/') ?: '/';

try {
    // Public routes
    if ($method === 'GET' && $uri === '/categories') {
        Response::json(['categories' => Categories::getNav($db)]);
    }

    if ($method === 'GET' && $uri === '/products') {
        Response::json(['products' => Products::getCatalog($db)]);
    }

    if ($method === 'GET' && $uri === '/products/new') {
        $limit = max(1, (int) ($_GET['limit'] ?? 4));
        Response::json(['products' => Products::getNew($db, $limit)]);
    }

    if ($method === 'GET' && $uri === '/products/suggest') {
        $q = $_GET['q'] ?? '';
        Response::json(Products::getSuggestions($db, $q));
    }

    if ($method === 'GET' && $uri === '/products/quantity-options') {
        Response::json(['map' => Products::getQuantityOptionsMap($db)]);
    }

    if ($method === 'GET' && preg_match('#^/products/(\d+)$#', $uri, $m)) {
        $product = Products::getById($db, (int) $m[1]);
        if (!$product) {
            Response::error('Product not found', 404);
        }
        Response::json(['product' => $product]);
    }

    // Admin auth
    if ($method === 'POST' && $uri === '/admin/auth/login') {
        $body = json_body();
        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';
        if ($username === '' || $password === '') {
            Response::error('Username and password required', 400);
        }
        $user = Auth::login($db, $config, $username, $password);
        Response::json(['user' => $user]);
    }

    if ($method === 'GET' && $uri === '/admin/auth/session') {
        $user = Auth::getSessionUser($db, $config);
        if (!$user) {
            Response::json(['user' => null], 401);
        }
        Response::json(['user' => $user]);
    }

    if ($method === 'DELETE' && $uri === '/admin/auth/session') {
        Auth::logout($db, $config);
        Response::json(['ok' => true]);
    }

    // Admin protected
    if ($method === 'GET' && $uri === '/admin/categories') {
        Auth::requireSession($db, $config);
        Response::json(['categories' => Categories::getNav($db)]);
    }

    if ($method === 'GET' && $uri === '/admin/products') {
        Auth::requireSession($db, $config);
        Response::json(Products::adminList($db, $_GET));
    }

    if ($method === 'GET' && preg_match('#^/admin/products/(\d+)$#', $uri, $m)) {
        Auth::requireSession($db, $config);
        $product = Products::adminGetById($db, (int) $m[1]);
        if (!$product) {
            Response::error('Product not found', 404);
        }
        Response::json(['product' => $product]);
    }

    if ($method === 'POST' && $uri === '/admin/upload') {
        Auth::requireSession($db, $config);
        Response::json(Upload::handle($config));
    }

    if ($method === 'GET' && $uri === '/admin/changes') {
        $user = Auth::requireSession($db, $config);
        Response::json(Changes::query($db, array_merge($_GET, [
            'userId' => $user['id'],
            'userRole' => $user['role'],
        ])));
    }

    if ($method === 'POST' && $uri === '/admin/changes') {
        $user = Auth::requireSession($db, $config);
        $body = json_body();
        if (empty($body['action']) || !array_key_exists('payload', $body)) {
            Response::error('action and payload are required', 400);
        }
        Response::json(Changes::submit($db, [
            'action' => $body['action'],
            'productId' => $body['productId'] ?? null,
            'payload' => $body['payload'],
            'userId' => $user['id'],
            'userRole' => $user['role'],
        ]));
    }

    if ($method === 'POST' && preg_match('#^/admin/changes/(\d+)/review$#', $uri, $m)) {
        $user = Auth::requireAdmin($db, $config);
        $body = json_body();
        $decision = $body['decision'] ?? '';
        if (!in_array($decision, ['approve', 'reject'], true)) {
            Response::error('Invalid decision', 400);
        }
        $result = Changes::review(
            $db,
            (int) $m[1],
            $user['id'],
            $decision,
            $body['reviewNote'] ?? null
        );
        Response::json(['change' => $result]);
    }

    if ($method === 'POST' && $uri === '/admin/subcategories') {
        Auth::requireAdmin($db, $config);
        $body = json_body();
        $categoryId = (int) ($body['id_category'] ?? 0);
        $name = trim($body['name'] ?? '');
        if ($categoryId <= 0 || $name === '') {
            Response::error('Categoría y nombre son obligatorios', 400);
        }
        $subcategory = Categories::createSubcategory($db, $categoryId, $name);
        Response::json(['subcategory' => $subcategory], 201);
    }

    if ($method === 'PATCH' && preg_match('#^/admin/subcategories/(\d+)$#', $uri, $m)) {
        Auth::requireAdmin($db, $config);
        $body = json_body();
        $name = trim($body['name'] ?? '');
        if ($name === '') {
            Response::error('El nombre es obligatorio', 400);
        }
        $subcategory = Categories::updateSubcategory($db, (int) $m[1], $name);
        Response::json(['subcategory' => $subcategory]);
    }

    Response::error('Not found', 404);
} catch (Throwable $e) {
    error_log($e->getMessage());
    Response::error('Internal server error', 500);
}
