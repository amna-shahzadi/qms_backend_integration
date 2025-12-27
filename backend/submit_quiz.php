<?php
session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$quizId = $data['quizId'] ?? null;
$answers = $data['answers'] ?? [];

if (!$quizId || empty($answers)) {
    echo json_encode(["status" => "error", "message" => "Invalid Data"]);
    exit;
}

$studentId = $_SESSION['user_id'];
$score = 0;

/* Get correct answers */
$stmt = $conn->prepare(
    "SELECT id, correct_option FROM questions WHERE quiz_id = ?"
);
$stmt->bind_param("i", $quizId);
$stmt->execute();
$res = $stmt->get_result();

$correctAnswers = [];
while ($row = $res->fetch_assoc()) {
    $correctAnswers[$row['id']] = $row['correct_option'];
}

/* Calculate score */
foreach ($answers as $qId => $opt) {
    if (isset($correctAnswers[$qId]) && $correctAnswers[$qId] === $opt) {
        $score++;
    }
}

/* Save quiz attempt */
$stmt = $conn->prepare(
    "INSERT INTO quiz_attempts (quiz_id, student_id, score)
     VALUES (?, ?, ?)"
);
$stmt->bind_param("iii", $quizId, $studentId, $score);
$stmt->execute();
$attemptId = $stmt->insert_id;

/* Save each answer */
$stmt = $conn->prepare(
    "INSERT INTO student_answers (attempt_id, question_id, selected_option)
     VALUES (?, ?, ?)"
);

foreach ($answers as $qId => $opt) {
    $stmt->bind_param("iis", $attemptId, $qId, $opt);
    $stmt->execute();
}

echo json_encode([
    "status" => "success",
    "score" => $score,
    "total" => count($correctAnswers),
    "correctAnswers" => $correctAnswers
]);

