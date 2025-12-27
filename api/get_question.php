<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Check if id parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Question ID is required']);
    exit;
}

$question_id = intval($_GET['id']);

// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'qms_db';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Prepare SQL statement
$sql = "SELECT * FROM questions WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $question_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $question = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'question' => $question
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Question not found'
    ]);
}

$stmt->close();
$conn->close();
?>