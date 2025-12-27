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

$response = ["success" => false, "message" => "", "quizzes" => []];

try {
    $sql = "SELECT q.*, 
            (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as total_questions,
            (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id) as total_attempts,
            (SELECT AVG(score) FROM quiz_attempts WHERE quiz_id = q.id AND status = 'completed') as avg_score
            FROM quizzes q
            WHERE q.teacher_id = ?
            ORDER BY q.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $quizzes = [];
    while ($row = $result->fetch_assoc()) {
        $quizzes[] = [
            "id" => $row['id'],
            "title" => $row['title'],
            "subject" => $row['subject'],
            "description" => $row['description'],
            "total_questions" => $row['total_questions'] ?? 0,
            "total_marks" => $row['total_marks'],
            "time_limit" => $row['time_limit'],
            "status" => $row['status'],
            "is_active" => $row['is_active'],
            "start_date" => $row['start_date'],
            "end_date" => $row['end_date'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at'],
            "total_attempts" => $row['total_attempts'] ?? 0,
            "avg_score" => $row['avg_score'] ? round($row['avg_score'], 2) : null
        ];
    }
    
    $stmt->close();
    
    $response = [
        "success" => true,
        "quizzes" => $quizzes,
        "count" => count($quizzes)
    ];

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>