<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once '../backend/db.php';

$conn = getConnection();

// Get average score
$result = $conn->query("SELECT AVG(score) as avg_score FROM quiz_attempts WHERE score IS NOT NULL");
$avg_score = $result->fetch_assoc()['avg_score'] ?? 0;

// Get completion rate (attempts vs total users)
$result = $conn->query("SELECT COUNT(DISTINCT user_id) as unique_attempts FROM quiz_attempts");
$unique_attempts = $result->fetch_assoc()['unique_attempts'] ?? 0;

$result = $conn->query("SELECT COUNT(*) as total_users FROM users WHERE role = 'student'");
$total_students = $result->fetch_assoc()['total_users'] ?? 1;

$completion_rate = $total_students > 0 ? ($unique_attempts / $total_students) * 100 : 0;

// Get active users today
$today = date('Y-m-d');
$result = $conn->query("SELECT COUNT(DISTINCT user_id) as active_today FROM quiz_attempts WHERE DATE(started_at) = '$today'");
$active_users_today = $result->fetch_assoc()['active_today'] ?? 0;

// Get daily attempts for last 7 days
$daily_data = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $result = $conn->query("SELECT COUNT(*) as attempts FROM quiz_attempts WHERE DATE(started_at) = '$date'");
    $attempts = $result->fetch_assoc()['attempts'] ?? 0;
    
    $daily_data[] = [
        'date' => $date,
        'day' => date('D', strtotime($date)),
        'attempts' => (int)$attempts
    ];
}

// Get quiz performance data
$quiz_performance = [];
$result = $conn->query("
    SELECT q.title, 
           COUNT(qa.id) as attempts,
           AVG(qa.score) as avg_score,
           MIN(qa.score) as min_score,
           MAX(qa.score) as max_score
    FROM quizzes q
    LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
    GROUP BY q.id
    ORDER BY attempts DESC
    LIMIT 5
");

while ($row = $result->fetch_assoc()) {
    $quiz_performance[] = [
        'title' => $row['title'],
        'attempts' => (int)$row['attempts'],
        'avg_score' => round((float)$row['avg_score'], 1),
        'min_score' => (float)$row['min_score'],
        'max_score' => (float)$row['max_score']
    ];
}

echo json_encode([
    'success' => true,
    'average_score' => round((float)$avg_score, 1),
    'completion_rate' => round((float)$completion_rate, 1),
    'active_users_today' => (int)$active_users_today,
    'daily_data' => $daily_data,
    'quiz_performance' => $quiz_performance,
    'metrics' => [
        'total_students' => (int)$total_students,
        'unique_attempts' => (int)$unique_attempts,
        'total_quizzes' => $conn->query("SELECT COUNT(*) as count FROM quizzes")->fetch_assoc()['count'],
        'total_questions' => $conn->query("SELECT COUNT(*) as count FROM questions")->fetch_assoc()['count']
    ]
]);
?>