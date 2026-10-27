<?php

declare(strict_types=1);

namespace App;

use PDO;

final class OrderRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function all(): array
    {
        return $this->db->query('SELECT * FROM orders ORDER BY id DESC')->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM orders WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(string $customer, string $product, float $amount, string $status): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO orders (customer, product, amount, status, created_at)
             VALUES (:customer, :product, :amount, :status, :created_at)'
        );
        $stmt->execute([
            'customer' => $customer,
            'product' => $product,
            'amount' => $amount,
            'status' => $status,
            'created_at' => gmdate('c'),
        ]);

        return $this->find((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $payload): array
    {
        $current = $this->find($id);
        if (!$current) {
            throw new \RuntimeException('Missing order');
        }

        $customer = trim((string) ($payload['customer'] ?? $current['customer']));
        $product = trim((string) ($payload['product'] ?? $current['product']));
        $amount = (float) ($payload['amount'] ?? $current['amount']);
        $status = (string) ($payload['status'] ?? $current['status']);

        $stmt = $this->db->prepare(
            'UPDATE orders
             SET customer = :customer, product = :product, amount = :amount, status = :status
             WHERE id = :id'
        );
        $stmt->execute([
            'customer' => $customer,
            'product' => $product,
            'amount' => $amount,
            'status' => $status,
            'id' => $id,
        ]);

        return $this->find($id);
    }

    public function delete(int $id): void
    {
        $stmt = $this->db->prepare('DELETE FROM orders WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    public function stats(): array
    {
        $total = (int) $this->db->query('SELECT COUNT(*) FROM orders')->fetchColumn();
        $sum = (float) $this->db->query('SELECT COALESCE(SUM(amount), 0) FROM orders')->fetchColumn();
        $paid = (int) $this->db->query("SELECT COUNT(*) FROM orders WHERE status = 'paid'")->fetchColumn();

        return [
            'orders' => $total,
            'revenue' => $sum,
            'paid' => $paid,
        ];
    }
}
