<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Validate required fields
$required_fields = ['quiz_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Validate correct_option value
$valid_options = ['a', 'b', 'c', 'd'];
$correct_option = strtolower($data['correct_option']);
if (!in_array($correct_option, $valid_options)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid correct_option value. Must be a, b, c, or d.'
    ]);
    exit;
}

// Database connection
$host = 'localhost';
$username = 'root'; // Change as needed
$password = ''; // Change as needed
$database = 'qms_db'; // Change to your database name

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Prepare SQL statement
$sql = "INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Prepare failed: ' . $conn->error
    ]);
    exit;
}

// Extract values into variables
$quiz_id = intval($data['quiz_id']);
$question_text = trim($data['question_text']);
$option_a = trim($data['option_a']);
$option_b = trim($data['option_b']);
$option_c = trim($data['option_c']);
$option_d = trim($data['option_d']);

// Bind parameters - MUST use variables, not direct array access
$stmt->bind_param(
    "issssss",
    $quiz_id,
    $question_text,
    $option_a,
    $option_b,
    $option_c,
    $option_d,
    $correct_option
);

// Execute
if ($stmt->execute()) {
    $new_question_id = $stmt->insert_id;
    
    // Update quiz's total_questions count
    $update_sql = "UPDATE quizzes SET total_questions = total_questions + 1 WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("i", $quiz_id);
    $update_stmt->execute();
    $update_stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Question added successfully',
        'question_id' => $new_question_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to add question: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>