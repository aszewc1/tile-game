<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require 'dbh.inc.php';

$game_num = $_POST['idval'];

$sql = 'SELECT * FROM games WHERE idGame=?';
$stmt = mysqli_stmt_init($conn);
if (!mysqli_stmt_prepare($stmt, $sql)) {
    header("Location: ../home.php?error=sqlerror");
    exit();
}
else {
    mysqli_stmt_bind_param($stmt, "i", $game_num);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if ($row = mysqli_fetch_assoc($result)) {
        $_SESSION['gameID'] = $game_num;
        $_SESSION['row_load'] = $row['gameRow'];
        $_SESSION['col_load'] = $row['gameCol'];
        $_SESSION['typ_load'] = $row['gameType'];
        $_SESSION['stt_load'] = json_decode($row['gameState']);
        header("Location: ../home.php?load=success");
        exit();
    }
}

mysqli_stmt_close($stmt);
mysqli_close($conn);