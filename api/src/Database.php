<?php

declare(strict_types=1);

namespace App;

use PDO;

final class Database
{
    public static function connection(): PDO
    {
        $dir = dirname(__DIR__) . '/storage';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $pdo = new PDO('sqlite:' . $dir . '/orderdesk.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer TEXT NOT NULL,
                product TEXT NOT NULL,
                amount REAL NOT NULL,
                status TEXT NOT NULL DEFAULT "new",
                created_at TEXT NOT NULL
            )'
        );

        return $pdo;
    }
}
