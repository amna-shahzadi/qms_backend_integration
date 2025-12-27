<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// If not JSON, try form data
if (!$data) {
    parse_str($input, $data);
}

// If still no data, use $_POST
if (!$data && $_POST) {
    $data = $_POST;
}

// Validate required field
if (!isset($data['id']) || empty($data['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Question ID is required'
    ]);
    exit;
}

// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'quiz_php_main';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit;
}

// First, get the quiz_id to update the count
$quiz_id = null;
$check_sql = "SELECT quiz_id FROM questions WHERE id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("i", $data['id']);
$check_stmt->execute();
$check_stmt->bind_result($quiz_id);
$check_stmt->fetch();
$check_stmt->close();

if (!$quiz_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Question not found'
    ]);
    exit;
}

// Prepare SQL statement for deletion
$sql = "DELETE FROM questions WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $data['id']);

// Execute
if ($stmt->execute()) {
    // Update quiz's total_questions count
    $update_sql = "UPDATE quizzes SET total_questions = GREATEST(0, total_questions - 1) WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("i", $quiz_id);
    $update_stmt->execute();
    $update_stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Question deleted successfully',
        'affected_rows' => $stmt->affected_rows
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete question: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>