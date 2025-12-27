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

$response = ["success" => false, "message" => ""];

try {
    // Calculate student engagement rate (students who attempted quizzes in last 7 days)
    $sql = "SELECT COUNT(DISTINCT ua.user_id) as active_students,
            (SELECT COUNT(DISTINCT u.id) 
             FROM users u
             INNER JOIN quiz_attempts qa2 ON u.id = qa2.user_id
             INNER JOIN quizzes q2 ON qa2.quiz_id = q2.id
             WHERE q2.teacher_id = ? AND u.role = 'student') as total_students
            FROM user_activity ua
            INNER JOIN users u ON ua.user_id = u.id
            INNER JOIN quiz_attempts qa ON u.id = qa.user_id
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND u.role = 'student' 
            AND ua.activity_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $teacher_id, $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $active_students = $row['active_students'] ?? 0;
    $total_students = $row['total_students'] ?? 1; // Avoid division by zero
    $engagement_rate = $total_students > 0 ? round(($active_students / $total_students) * 100, 2) : 0;
    $stmt->close();

    // Calculate quiz completion rate
    $sql = "SELECT 
            COUNT(CASE WHEN qa.status = 'completed' THEN 1 END) as completed_attempts,
            COUNT(*) as total_attempts
            FROM quiz_attempts qa
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $completed_attempts = $row['completed_attempts'] ?? 0;
    $total_attempts = $row['total_attempts'] ?? 1;
    $completion_rate = $total_attempts > 0 ? round(($completed_attempts / $total_attempts) * 100, 2) : 0;
    $stmt->close();

    // Calculate average time spent per quiz
    $sql = "SELECT AVG(qa.time_taken) as avg_time_spent
            FROM quiz_attempts qa
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND qa.status = 'completed' 
            AND qa.time_taken IS NOT NULL";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $avg_time_spent = $row['avg_time_spent'] ? round($row['avg_time_spent'] / 60, 1) : 0; // Convert to minutes
    $stmt->close();

    // Get performance trends (last 30 days)
    $sql = "SELECT 
            DATE(qa.attempt_date) as attempt_date,
            COUNT(*) as daily_attempts,
            AVG(qa.score) as daily_avg_score
            FROM quiz_attempts qa
            INNER JOIN quizzes q ON qa.quiz_id = q.id
            WHERE q.teacher_id = ? AND qa.attempt_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND qa.status = 'completed'
            GROUP BY DATE(qa.attempt_date)
            ORDER BY attempt_date";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $performance_trends = [];
    while ($row = $result->fetch_assoc()) {
        $performance_trends[] = [
            "date" => $row['attempt_date'],
            "attempts" => $row['daily_attempts'],
            "avg_score" => round($row['daily_avg_score'], 2)
        ];
    }
    $stmt->close();

    // Get top performing quizzes
    $sql = "SELECT 
            q.id, 
            q.title,
            COUNT(qa.id) as total_attempts,
            AVG(qa.score) as avg_score,
            MAX(qa.score) as highest_score,
            MIN(qa.score) as lowest_score
            FROM quizzes q
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.status = 'completed'
            WHERE q.teacher_id = ?
            GROUP BY q.id, q.title
            ORDER BY avg_score DESC
            LIMIT 5";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $top_quizzes = [];
    while ($row = $result->fetch_assoc()) {
        $top_quizzes[] = [
            "id" => $row['id'],
            "title" => $row['title'],
            "total_attempts" => $row['total_attempts'],
            "avg_score" => round($row['avg_score'], 2),
            "highest_score" => $row['highest_score'],
            "lowest_score" => $row['lowest_score']
        ];
    }
    $stmt->close();

    $response = [
        "success" => true,
        "engagement_rate" => $engagement_rate,
        "completion_rate" => $completion_rate,
        "avg_time_spent" => $avg_time_spent,
        "performance_trends" => $performance_trends,
        "top_quizzes" => $top_quizzes,
        "total_students" => $total_students,
        "active_students" => $active_students
    ];

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>