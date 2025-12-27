<?php
include "db.php";

$q = mysqli_query($conn, "SELECT * FROM quizzes LIMIT 1");
$quiz = mysqli_fetch_assoc($q);

$questionsQ = mysqli_query($conn, "SELECT * FROM questions WHERE quiz_id=".$quiz['id']);
$questions = [];

while ($row = mysqli_fetch_assoc($questionsQ)) {
    $questions[] = [
        "id" => $row['id'],
        "text" => $row['question'],
        "options" => json_decode($row['options'], true),
        "correctAnswer" => $row['correct_answer']
    ];
}

echo json_encode([
    "id" => $quiz['id'],
    "title" => $quiz['title'],
    "questions" => $questions
]);
?>

