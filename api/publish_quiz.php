<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["success" => false, "message" => "Quiz ID is required"]);
    exit();
}

$quiz_id = intval($data->id);
$response = ["success" => false, "message" => ""];

try {
    // First check if quiz has questions
    $sql = "SELECT COUNT(*) as question_count FROM questions WHERE quiz_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $quiz_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $question_count = $row['question_count'] ?? 0;
    $stmt->close();
    
    if ($question_count == 0) {
        $response["message"] = "Cannot publish quiz without questions";
        echo json_encode($response);
        exit();
    }
    
    // Check if quiz belongs to the requesting teacher (security check)
    $teacher_id = isset($data->teacher_id) ? intval($data->teacher_id) : 0;
    if ($teacher_id > 0) {
        $sql = "SELECT teacher_id FROM quizzes WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $quiz_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $actual_teacher_id = $row['teacher_id'] ?? 0;
        $stmt->close();
        
        if ($actual_teacher_id != $teacher_id) {
            $response["message"] = "You are not authorized to publish this quiz";
            echo json_encode($response);
            exit();
        }
    }
    
    // Update quiz status to published
    $sql = "UPDATE quizzes SET 
            status = 'published',
            is_active = 1,
            published_at = NOW(),
            updated_at = NOW()
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $quiz_id);
    
    if ($stmt->execute()) {
        $response = [
            "success" => true,
            "message" => "Quiz published successfully"
        ];
        
        // Log the activity
        $sql_log = "INSERT INTO activity_logs (user_id, activity_type, description, ip_address) 
                   VALUES (?, 'quiz_published', ?, ?)";
        $stmt_log = $conn->prepare($sql_log);
        $description = "Published quiz ID: " . $quiz_id;
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt_log->bind_param("iss", $teacher_id, $description, $ip_address);
        $stmt_log->execute();
        $stmt_log->close();
        
    } else {
        $response["message"] = "Failed to publish quiz";
    }
    
    $stmt->close();

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>