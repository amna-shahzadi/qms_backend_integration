<?php
$conn = new mysqli("localhost", "root", "", "qms_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function getConnection() {
    global $conn;
    return $conn;
}
?>
