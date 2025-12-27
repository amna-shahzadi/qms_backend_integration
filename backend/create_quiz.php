 <?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'];

mysqli_query($conn, "INSERT INTO quizzes(title) VALUES('$title')");
echo json_encode(["status"=>"success"]);
?>
