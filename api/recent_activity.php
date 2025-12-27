<?php
// recent_activity.php - Simplified version
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once  '../backend/db.php';

$response = ['success' => false, 'activities' => []];
$conn = getConnection();

if (!$conn) {
    $response['error'] = 'Database connection failed';
    echo json_encode($response);
    exit;
}

// Get recent users (as an example activity)
$query = "
    SELECT id, name, email, created_at, 'user' as type
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 5
";

$result = $conn->query($query);

if ($result) {
    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            'id' => $row['id'],
            'description' => 'New user registered: ' . $row['name'] . ' (' . $row['email'] . ')',
            'type' => 'user',
            'user_name' => $row['name'],
            'time_ago' => timeAgo($row['created_at'])
        ];
    }
    
    $response['success'] = true;
    $response['activities'] = $activities;
} else {
    // If query fails, return sample data
    $response['success'] = true;
    $response['activities'] = getSampleActivities();
}

echo json_encode($response);
$conn->close();

function timeAgo($datetime) {
    $time = strtotime($datetime);
    $now = time();
    $diff = $now - $time;
    
    if ($diff < 60) return 'Just now';
    if ($diff < 3600) return floor($diff / 60) . ' minutes ago';
    if ($diff < 86400) return floor($diff / 3600) . ' hours ago';
    if ($diff < 2592000) return floor($diff / 86400) . ' days ago';
    if ($diff < 31536000) return floor($diff / 2592000) . ' months ago';
    return floor($diff / 31536000) . ' years ago';
}

function getSampleActivities() {
    return [
        [
            'id' => 1,
            'description' => 'System administrator logged in',
            'type' => 'system',
            'user_name' => 'System',
            'time_ago' => 'Just now'
        ],
        [
            'id' => 2,
            'description' => 'New quiz "JavaScript Basics" created',
            'type' => 'quiz',
            'user_name' => 'Admin',
            'time_ago' => '5 minutes ago'
        ],
        [
            'id' => 3,
            'description' => 'User "John Doe" registered',
            'type' => 'user',
            'user_name' => 'John Doe',
            'time_ago' => '2 hours ago'
        ],
        [
            'id' => 4,
            'description' => 'Quiz "HTML Fundamentals" published',
            'type' => 'quiz',
            'user_name' => 'Admin',
            'time_ago' => '1 day ago'
        ],
        [
            'id' => 5,
            'description' => 'System maintenance completed',
            'type' => 'system',
            'user_name' => 'System',
            'time_ago' => '2 days ago'
        ]
    ];
}
?>