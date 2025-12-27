<?php
// Add debugging at the top of your create_quiz.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Log incoming request
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Request: " . file_get_contents('php://input') . "\n", FILE_APPEND);

// Get input data
$input = file_get_contents('php://input');

// Try to parse as JSON first
$data = json_decode($input, true);

// If not JSON, try form data
if (!$data) {
    parse_str($input, $data);
}

// If still no data, use $_POST
if (!$data && $_POST) {
    $data = $_POST;
}

// Log parsed data
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . "\n", FILE_APPEND);

// Validate required fields
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
        'missing_fields' => $missing_fields,
        'received_data' => $data
    ]);
    exit;
}

// Database connection
$host = 'localhost';
$username = 'root'; // Change as needed
$password = ''; // Change as needed
$database = 'your_database'; // Change as needed

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare SQL statement
$sql = "INSERT INTO quizzes (title, subject, total_questions, total_marks, time_limit, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

// Bind parameters
$stmt->bind_param(
    "ssiii", 
    $data['title'],
    $data['subject'],
    $data['total_questions'],
    $data['total_marks'],
    $data['time_limit']
);

// Execute
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Quiz created successfully',
        'quiz_id' => $stmt->insert_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>