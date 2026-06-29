<?php
declare(strict_types=1);

final class Upload
{
    private const ALLOWED_MIME = [
        'image/jpeg' => '.jpg',
        'image/png' => '.png',
        'image/webp' => '.webp',
        'image/gif' => '.gif',
    ];
    private const MAX_SIZE = 5 * 1024 * 1024;
    private const MAX_FILES = 10;

    public static function handle(array $config): array
    {
        if (empty($_FILES['files'])) {
            Response::error('No files uploaded', 400);
        }

        $files = $_FILES['files'];
        $paths = [];
        $count = is_array($files['name']) ? count($files['name']) : 1;

        if ($count > self::MAX_FILES) {
            Response::error('Too many files', 400);
        }

        if (!is_dir($config['upload_dir'])) {
            mkdir($config['upload_dir'], 0755, true);
        }

        for ($i = 0; $i < $count; $i++) {
            $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $tmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $size = is_array($files['size']) ? $files['size'][$i] : $files['size'];
            $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($error !== UPLOAD_ERR_OK) {
                continue;
            }
            if ($size > self::MAX_SIZE) {
                Response::error('File too large', 400);
            }

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $tmp);
            finfo_close($finfo);

            if (!isset(self::ALLOWED_MIME[$mime])) {
                Response::error('Unsupported file type', 400);
            }

            $ext = self::ALLOWED_MIME[$mime];
            $safe = self::sanitizeFilename($name);
            $filename = $safe . '-' . time() . '-' . bin2hex(random_bytes(4)) . $ext;
            $dest = rtrim($config['upload_dir'], '/') . '/' . $filename;

            if (!move_uploaded_file($tmp, $dest)) {
                Response::error('Upload failed', 500);
            }

            $paths[] = rtrim($config['upload_url_prefix'], '/') . '/' . $filename;
        }

        return ['paths' => $paths];
    }

    private static function sanitizeFilename(string $name): string
    {
        $name = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name);
        $name = strtolower($name);
        $name = preg_replace('/[^a-z0-9.-]+/', '-', $name) ?? 'imagen';
        $name = trim($name, '-');
        return $name !== '' ? $name : 'imagen';
    }
}
