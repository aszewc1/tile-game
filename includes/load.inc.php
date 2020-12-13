<?php
header("Content-Type: application/json; charset=UTF-8");
require 'dbh.inc.php';

$rows = $_POST['rows'];
$cols = $_POST['cols'];
$game = $_POST['set'];
$state = $_POST['state'];

$sql = "INSERT INTO games (gameRow, gameCol, gameType, gameState) VALUES (?, ?, ?, ?)";
$stmt = mysqli_stmt_init($conn);
if (!mysqli_stmt_prepare($stmt, $sql)) {
    header("Location: ../home.php?error=sqlerror");
    exit();
}
else {
    mysqli_stmt_bind_param($stmt, "iiss", $rows, $cols, $game, $state);
    mysqli_stmt_execute($stmt);
    header("Location: ../home.php?save=success");
    exit();
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

header("Content-Type: application/json; charset=UTF-8");
$obj = json_decode($_POST["x"], false);

$conn = new mysqli("myServer", "myUser", "myPassword", "Northwind");
$stmt = $conn->prepare("SELECT name FROM customers LIMIT ?");
$stmt->bind_param("s", $obj->limit);
$stmt->execute();
$result = $stmt->get_result();
$outp = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($outp);