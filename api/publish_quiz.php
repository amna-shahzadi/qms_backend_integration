<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

$conn = getConnection();

// Update quiz status to published
$stmt = $conn->prepare("UPDATE quizzes SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = ?");
$stmt->bind_param("i", $data['id']);

if ($stmt->execute()) {
    // Log activity
    $activity_stmt = $conn->prepare("INSERT INTO user_activity (user_id, action, details, created_at) VALUES (?, 'publish', ?, NOW())");
    $admin_id = 1; // Admin user ID
    $details = "Published quiz ID: " . $data['id'];
    $activity_stmt->bind_param("is", $admin_id, $details);
    $activity_stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Quiz published successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error publishing quiz: ' . $conn->error]);
}
?>