<?php
header('Content-Type: application/json');
require_once '../backend/db.php';

$conn = getConnection();

// Get total users
$result = $conn->query("SELECT COUNT(*) as total FROM users");
$total_users = $result->fetch_assoc()['total'];

// Get total quizzes
$result = $conn->query("SELECT COUNT(*) as total FROM quizzes");
$total_quizzes = $result->fetch_assoc()['total'];

// Get total questions
$result = $conn->query("SELECT COUNT(*) as total FROM questions");
$total_questions = $result->fetch_assoc()['total'];

// Get total quiz attempts
$result = $conn->query("SELECT COUNT(*) as total FROM quiz_attempts");
$total_attempts = $result->fetch_assoc()['total'];

echo json_encode([
    'success' => true,
    'total_users' => $total_users,
    'total_quizzes' => $total_quizzes,
    'total_questions' => $total_questions,
    'total_attempts' => $total_attempts
]);
?>