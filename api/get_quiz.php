<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

$quizId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($quizId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid quiz ID']);
    exit;
}

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM quizzes WHERE id = ?");
$stmt->bind_param("i", $quizId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $quiz = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'quiz' => $quiz
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Quiz not found']);
}

$stmt->close();
$conn->close();
?>