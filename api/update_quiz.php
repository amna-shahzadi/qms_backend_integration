<?php
// Add debugging at the top
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Log incoming request
$input = file_get_contents('php://input');
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Update Request: " . $input . "\n", FILE_APPEND);

// Get input data
$data = json_decode($input, true);

if (!$data) {
    parse_str($input, $data);
}

if (!$data && $_POST) {
    $data = $_POST;
}

// Validate required fields
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

$required_fields = ['title', 'subject', 'total_questions', 'total_marks', 'time_limit'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields),
        'missing_fields' => $missing_fields
    ]);
    exit;
}

// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database =  'qms_db';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Prepare SQL statement
$sql = "UPDATE quizzes SET 
        title = ?, 
        subject = ?, 
        total_questions = ?, 
        total_marks = ?, 
        time_limit = ? 
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

// Bind parameters
$stmt->bind_param(
    "ssiiii",
    $data['title'],
    $data['subject'],
    $data['total_questions'],
    $data['total_marks'],
    $data['time_limit'],
    $data['id']
);

// Execute
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Quiz updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No quiz found with that ID or no changes made']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>