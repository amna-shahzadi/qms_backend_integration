<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../backend/db.php';

$quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;

$conn = getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($quiz_id > 0) {
    // Get questions for specific quiz
    $stmt = $conn->prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY id");
    $stmt->bind_param("i", $quiz_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // Get all questions
    $result = $conn->query("SELECT * FROM questions ORDER BY id");
}

if ($result) {
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'questions' => $questions,
        'count' => count($questions)
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error fetching questions']);
}

$conn->close();
?>