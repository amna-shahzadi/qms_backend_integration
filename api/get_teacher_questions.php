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

$response = ["success" => false, "message" => "", "questions" => []];

try {
    // Get all questions created by teacher
    $sql = "SELECT q.*, 
            qz.title as quiz_title,
            qz.subject as quiz_subject
            FROM questions q
            LEFT JOIN quizzes qz ON q.quiz_id = qz.id
            WHERE q.teacher_id = ?
            ORDER BY q.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $questions = [];
    $stats = ["easy" => 0, "medium" => 0, "hard" => 0];
    $categories = [];
    
    while ($row = $result->fetch_assoc()) {
        $questions[] = [
            "id" => $row['id'],
            "question_text" => $row['question_text'],
            "category" => $row['category'],
            "difficulty" => $row['difficulty'],
            "option_a" => $row['option_a'],
            "option_b" => $row['option_b'],
            "option_c" => $row['option_c'],
            "option_d" => $row['option_d'],
            "correct_option" => $row['correct_option'],
            "marks" => $row['marks'],
            "quiz_id" => $row['quiz_id'],
            "quiz_title" => $row['quiz_title'],
            "quiz_subject" => $row['quiz_subject'],
            "created_at" => $row['created_at']
        ];
        
        // Update difficulty stats
        $difficulty = strtolower($row['difficulty']);
        if (isset($stats[$difficulty])) {
            $stats[$difficulty]++;
        }
        
        // Update category stats
        $category = $row['category'] ?: 'Uncategorized';
        if (!isset($categories[$category])) {
            $categories[$category] = 0;
        }
        $categories[$category]++;
    }
    
    $stmt->close();
    
    $response = [
        "success" => true,
        "questions" => $questions,
        "stats" => $stats,
        "categories" => $categories,
        "total" => count($questions)
    ];

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>