<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST");
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
$required_fields = ['id', 'quiz_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option'];
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

// First, get the old quiz_id to check if we need to update counts
$old_quiz_id = null;
$check_sql = "SELECT quiz_id FROM questions WHERE id = ?";
$check_stmt = $conn->prepare($check_sql);
$question_id = intval($data['id']);
$check_stmt->bind_param("i", $question_id);
$check_stmt->execute();
$check_stmt->bind_result($old_quiz_id);
$check_stmt->fetch();
$check_stmt->close();

// Prepare SQL statement for updating question
$sql = "UPDATE questions SET 
        quiz_id = ?, 
        question_text = ?, 
        option_a = ?, 
        option_b = ?, 
        option_c = ?, 
        option_d = ?, 
        correct_option = ? 
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Prepare failed: ' . $conn->error
    ]);
    exit;
}

// Extract values into variables
$new_quiz_id = intval($data['quiz_id']);
$question_text = trim($data['question_text']);
$option_a = trim($data['option_a']);
$option_b = trim($data['option_b']);
$option_c = trim($data['option_c']);
$option_d = trim($data['option_d']);

// Bind parameters - MUST use variables
$stmt->bind_param(
    "issssssi",
    $new_quiz_id,
    $question_text,
    $option_a,
    $option_b,
    $option_c,
    $option_d,
    $correct_option,
    $question_id
);

// Execute
if ($stmt->execute()) {
    // Update quiz total_questions counts if quiz_id changed
    if ($old_quiz_id && $old_quiz_id != $new_quiz_id) {
        // Decrease count from old quiz
        $decrease_sql = "UPDATE quizzes SET total_questions = GREATEST(0, total_questions - 1) WHERE id = ?";
        $decrease_stmt = $conn->prepare($decrease_sql);
        $decrease_stmt->bind_param("i", $old_quiz_id);
        $decrease_stmt->execute();
        $decrease_stmt->close();
        
        // Increase count in new quiz
        $increase_sql = "UPDATE quizzes SET total_questions = total_questions + 1 WHERE id = ?";
        $increase_stmt = $conn->prepare($increase_sql);
        $increase_stmt->bind_param("i", $new_quiz_id);
        $increase_stmt->execute();
        $increase_stmt->close();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Question updated successfully',
        'affected_rows' => $stmt->affected_rows
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update question: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>