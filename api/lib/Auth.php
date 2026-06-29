<?php
declare(strict_types=1);

final class Auth
{
    public static function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    public static function login(PDO $db, array $config, string $username, string $password): array
    {
        $stmt = $db->prepare('SELECT id, username, passwordHash, role FROM AdminUsers WHERE username = ? LIMIT 1');
        $stmt->execute([trim($username)]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['passwordHash'])) {
            Response::error('Credenciales inválidas', 401);
        }

        $token = bin2hex(random_bytes(32));
        $tokenHash = self::hashToken($token);
        $expiresAt = (new DateTimeImmutable('now'))
            ->modify('+' . (int) $config['session_days'] . ' days')
            ->format('Y-m-d H:i:s');

        $insert = $db->prepare('INSERT INTO AdminSessions (token, userId, expiresAt) VALUES (?, ?, ?)');
        $insert->execute([$tokenHash, $user['id'], $expiresAt]);

        self::setSessionCookie($config, $token);

        return [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
        ];
    }

    public static function setSessionCookie(array $config, string $token): void
    {
        $name = $config['session_cookie'];
        $maxAge = (int) $config['session_days'] * 86400;
        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

        setcookie($name, $token, [
            'expires' => time() + $maxAge,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => $secure,
        ]);
    }

    public static function clearSessionCookie(array $config): void
    {
        $name = $config['session_cookie'];
        setcookie($name, '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function getTokenFromRequest(array $config): ?string
    {
        $name = $config['session_cookie'];
        return $_COOKIE[$name] ?? null;
    }

    public static function getSessionUser(PDO $db, array $config): ?array
    {
        $token = self::getTokenFromRequest($config);
        if (!$token) {
            return null;
        }

        $stmt = $db->prepare(
            'SELECT s.id AS sessionId, s.expiresAt, u.id, u.username, u.role
             FROM AdminSessions s
             INNER JOIN AdminUsers u ON u.id = s.userId
             WHERE s.token = ?
             LIMIT 1'
        );
        $stmt->execute([self::hashToken($token)]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        if (strtotime($row['expiresAt']) < time()) {
            $delete = $db->prepare('DELETE FROM AdminSessions WHERE id = ?');
            $delete->execute([$row['sessionId']]);
            return null;
        }

        return [
            'id' => (int) $row['id'],
            'username' => $row['username'],
            'role' => $row['role'],
        ];
    }

    public static function requireSession(PDO $db, array $config): array
    {
        $user = self::getSessionUser($db, $config);
        if (!$user) {
            Response::error('Unauthorized', 401);
        }
        return $user;
    }

    public static function requireAdmin(PDO $db, array $config): array
    {
        $user = self::requireSession($db, $config);
        if ($user['role'] !== 'ADMIN') {
            Response::error('Forbidden', 403);
        }
        return $user;
    }

    public static function logout(PDO $db, array $config): void
    {
        $token = self::getTokenFromRequest($config);
        if ($token) {
            $delete = $db->prepare('DELETE FROM AdminSessions WHERE token = ?');
            $delete->execute([self::hashToken($token)]);
        }
        self::clearSessionCookie($config);
    }
}
