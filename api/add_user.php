<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

// Get posted data
$data = json_decode(file_get_contents('php://input'), true);

// Log received data for debugging
error_log("Received data: " . print_r($data, true));

// Validate required fields
if (
    empty($data['name']) ||
    empty($data['email']) ||
    empty($data['password']) ||
    empty($data['role'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields. Please fill all fields.']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if user already exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
if (!$checkStmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$checkStmt->bind_param("s", $data['email']);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'User with this email already exists']);
    $checkStmt->close();
    $conn->close();
    exit;
}

// Hash password
$password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

// Insert user - Only include columns that exist in your database
// Assuming your users table has: id, name, email, password, role, created_at
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    $checkStmt->close();
    $conn->close();
    exit;
}

$stmt->bind_param("ssss", $data['name'], $data['email'], $password_hash, $data['role']);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    echo json_encode([
        'success' => true, 
        'message' => 'User added successfully',
        'user_id' => $userId
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error adding user: ' . $stmt->error
    ]);
}

$stmt->close();
$checkStmt->close();
$conn->close();
?>