<?php
/**
 * Copy this file to config.php and fill in your Wiros MySQL credentials.
 */
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'your_database_name',
        'user' => 'your_database_user',
        'pass' => 'your_database_password',
        'charset' => 'utf8mb4',
    ],
    'session_cookie' => 'crespo_admin_session',
    'session_days' => 7,
    'upload_dir' => dirname(__DIR__) . '/img/productos',
    'upload_url_prefix' => '/img/productos',
    'cors_origin' => '*', // set to your domain in production if needed
];
