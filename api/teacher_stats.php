<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db_connection.php';

$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

if ($teacher_id == 0) {
    echo json_encode(["success" => false, "message" => "Teacher ID is required"]);
    exit();
}

$response = ["success" => false, "message" => ""];

try {
    // Get active quizzes count
    $sql = "SELECT COUNT(*) as count FROM quizzes 
            WHERE teacher_id = ? AND status = 'published' 
            AND (end_date IS NULL OR end_date > NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $active_quizzes = $row['count'] ?? 0;
    $stmt->close();

    // Get total students assigned to teacher
    $sql = "SELECT COUNT(DISTINCT u.id) as count 
            FROM users u
            INNER JOIN quiz_attempts qa ON u.id = qa.user_id
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND u.role = 'student'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $total_students = $row['count'] ?? 0;
    $stmt->close();

    // Get total questions created by teacher
    $sql = "SELECT COUNT(*) as count FROM questions 
            WHERE teacher_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $total_questions = $row['count'] ?? 0;
    $stmt->close();

    // Get pending grading count (quizzes with attempts but not graded)
    $sql = "SELECT COUNT(DISTINCT qa.id) as count 
            FROM quiz_attempts qa
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND qa.status = 'completed' 
            AND qa.score IS NULL";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $pending_grading = $row['count'] ?? 0;
    $stmt->close();

    $response = [
        "success" => true,
        "active_quizzes" => $active_quizzes,
        "total_students" => $total_students,
        "total_questions" => $total_questions,
        "pending_grading" => $pending_grading
    ];

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>