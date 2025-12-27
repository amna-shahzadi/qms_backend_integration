<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Get all quizzes with question count
$query = "SELECT q.*, 
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
          FROM quizzes q 
          ORDER BY q.created_at DESC";
          
$result = $conn->query($query);

if ($result) {
    $quizzes = [];
    while ($row = $result->fetch_assoc()) {
        // Ensure all fields are present
        $row['title'] = $row['title'] ?? '';
        $row['subject'] = $row['subject'] ?? 'General';
        $row['total_questions'] = $row['total_questions'] ?? 0;
        $row['total_marks'] = $row['total_marks'] ?? 100;
        $row['time_limit'] = $row['time_limit'] ?? 60;
        $row['question_count'] = $row['question_count'] ?? 0;
        $row['created_at'] = $row['created_at'] ?? '';
        
        $quizzes[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'quizzes' => $quizzes,
        'count' => count($quizzes)
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error fetching quizzes: ' . $conn->error
    ]);
}

$conn->close();
?>