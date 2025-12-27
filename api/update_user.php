<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

// Get posted data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (
    empty($data['id']) ||
    empty($data['name']) ||
    empty($data['email']) ||
    empty($data['role'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$userId = intval($data['id']);
$name = $data['name'];
$email = $data['email'];
$role = $data['role'];

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if email already exists for another user
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
if (!$checkStmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    $conn->close();
    exit;
}

$checkStmt->bind_param("si", $email, $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already in use by another user']);
    $checkStmt->close();
    $conn->close();
    exit;
}

// Update user
$stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    $checkStmt->close();
    $conn->close();
    exit;
}

$stmt->bind_param("sssi", $name, $email, $role, $userId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'User updated successfully'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error updating user: ' . $stmt->error
    ]);
}

$stmt->close();
$checkStmt->close();
$conn->close();
?>