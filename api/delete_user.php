<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../backend/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if user exists
$check_stmt = $conn->prepare("SELECT id, name FROM users WHERE id = ?");
if (!$check_stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    $conn->close();
    exit;
}

$check_stmt->bind_param("i", $data['id']);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    $check_stmt->close();
    $conn->close();
    exit;
}

$user = $check_result->fetch_assoc();
$user_id = $data['id'];
$user_name = $user['name'];

// Start transaction
$conn->begin_transaction();

try {
    // First, log the activity BEFORE deleting (so we have the user info)
    $admin_id = 1; // Assuming admin ID is 1, or get from session
    $action = 'user_deleted';
    $description = "Deleted user: $user_name (ID: $user_id)";
    
    $log_stmt = $conn->prepare("INSERT INTO user_activity (user_id, action, description, created_at) VALUES (?, ?, ?, NOW())");
    if (!$log_stmt) {
        throw new Exception('Database error: ' . $conn->error);
    }
    $log_stmt->bind_param("iss", $admin_id, $action, $description);
    $log_stmt->execute();
    $log_stmt->close();
    
    // Now delete related records from user_activity (if they exist)
    $delete_activity_stmt = $conn->prepare("DELETE FROM user_activity WHERE user_id = ?");
    if ($delete_activity_stmt) {
        $delete_activity_stmt->bind_param("i", $user_id);
        $delete_activity_stmt->execute();
        $delete_activity_stmt->close();
    }
    
    // Now delete the user
    $delete_user_stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    if (!$delete_user_stmt) {
        throw new Exception('Database error: ' . $conn->error);
    }
    $delete_user_stmt->bind_param("i", $user_id);
    $delete_user_stmt->execute();
    
    $affected_rows = $delete_user_stmt->affected_rows;
    $delete_user_stmt->close();
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => 'User deleted successfully',
        'user_name' => $user_name,
        'user_id' => $user_id,
        'affected_rows' => $affected_rows
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    echo json_encode([
        'success' => false, 
        'message' => 'Error deleting user: ' . $e->getMessage()
    ]);
}

$check_stmt->close();
$conn->close();
?>