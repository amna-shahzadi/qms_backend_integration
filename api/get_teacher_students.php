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

$response = ["success" => false, "message" => "", "students" => []];

try {
    // Get students who have attempted teacher's quizzes
    $sql = "SELECT DISTINCT 
            u.id, 
            u.name, 
            u.email, 
            u.created_at,
            MAX(qa.attempt_date) as last_active,
            COUNT(DISTINCT qa.id) as completed_quizzes,
            AVG(qa.score) as avg_score
            FROM users u
            INNER JOIN quiz_attempts qa ON u.id = qa.user_id
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND u.role = 'student' AND qa.status = 'completed'
            GROUP BY u.id, u.name, u.email, u.created_at
            ORDER BY u.name";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $students = [];
    $total_students = 0;
    $active_students = 0;
    $total_avg_score = 0;
    
    while ($row = $result->fetch_assoc()) {
        $last_active = $row['last_active'];
        $is_active = strtotime($last_active) >= strtotime('-7 days');
        
        if ($is_active) {
            $active_students++;
        }
        
        $avg_score = $row['avg_score'] ? round($row['avg_score'], 2) : 0;
        $total_avg_score += $avg_score;
        
        $students[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "email" => $row['email'],
            "last_active" => $last_active ? date('Y-m-d H:i', strtotime($last_active)) : 'Never',
        ];
        
        $total_students++;
    }
    
    $stmt->close();
    
    // Calculate overall average performance
    $avg_performance = $total_students > 0 ? round($total_avg_score / $total_students, 2) : 0;
    
    $response = [
        "success" => true,
        "students" => $students,
        "total_students" => $total_students,
    ];

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>