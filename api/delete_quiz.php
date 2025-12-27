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

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if quiz exists
$check_stmt = $conn->prepare("SELECT id, title FROM quizzes WHERE id = ?");
$check_stmt->bind_param("i", $data['id']);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Quiz not found']);
    exit;
}

$quiz = $check_result->fetch_assoc();

// Delete quiz
$stmt = $conn->prepare("DELETE FROM quizzes WHERE id = ?");
$stmt->bind_param("i", $data['id']);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'Quiz deleted successfully',
        'quiz_title' => $quiz['title']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting quiz: ' . $stmt->error]);
}

$stmt->close();
$check_stmt->close();
$conn->close();
?>