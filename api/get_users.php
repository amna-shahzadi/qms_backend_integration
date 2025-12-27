<?php
header('Content-Type: application/json');
require_once '../backend/db.php';

$conn = getConnection();
$result = $conn->query("SELECT * FROM users ORDER BY created_at DESC");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode([
    'success' => true,
    'users' => $users
]);
?>