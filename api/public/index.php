<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require dirname(__DIR__) . '/src/bootstrap.php';

use App\Database;
use App\OrderRepository;

$db = Database::connection();
$orders = new OrderRepository($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$uri = preg_replace('#^/api#', '', $uri) ?: '/';

function json_response(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json(): array
{
    $raw = file_get_contents('php://input') ?: '{}';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

if ($method === 'GET' && $uri === '/orders') {
    json_response($orders->all());
}

if ($method === 'POST' && $uri === '/orders') {
    $payload = read_json();
    $customer = trim((string) ($payload['customer'] ?? ''));
    $product = trim((string) ($payload['product'] ?? ''));
    $amount = (float) ($payload['amount'] ?? 0);
    $status = (string) ($payload['status'] ?? 'new');

    if ($customer === '' || $product === '' || $amount <= 0) {
        json_response(['error' => 'Invalid payload'], 422);
    }

    json_response($orders->create($customer, $product, $amount, $status), 201);
}

if (preg_match('#^/orders/(\d+)$#', $uri, $m)) {
    $id = (int) $m[1];
    $existing = $orders->find($id);
    if (!$existing) {
        json_response(['error' => 'Not found'], 404);
    }

    if ($method === 'GET') {
        json_response($existing);
    }

    if ($method === 'PATCH') {
        $payload = read_json();
        json_response($orders->update($id, $payload));
    }

    if ($method === 'DELETE') {
        $orders->delete($id);
        json_response(['ok' => true]);
    }
}

if ($method === 'GET' && $uri === '/stats') {
    json_response($orders->stats());
}

json_response(['error' => 'Not found'], 404);
