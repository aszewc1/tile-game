<?php
session_start();
if (array_key_exists('rows', $_POST) && array_key_exists('cols', $_POST) &&
    array_key_exists('set', $_POST) && array_key_exists('state', $_POST)) {
    //header("Content-Type: application/json; charset=UTF-8");
    require 'dbh.inc.php';

    $rows = $_POST['rows'];
    $cols = $_POST['cols'];
    $game = $_POST['set'];
    $state = $_POST['state'];

    echo '<script>alert("hi")</script>';

    if (empty($rows) || empty($cols) || empty($game) || empty($state)) {
        header("Location: ../home.php?error=emptygame");
        exit();
    }
    else {
        $sql = "INSERT INTO games (gameRow, gameCol, gameType, gameState) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            //header("Location: ../home.php?error=sqlerror");
            exit();
        }
        else {
            mysqli_stmt_bind_param($stmt, "iiss", $rows, $cols, $game, $state);
            mysqli_stmt_execute($stmt);
            //header("Location: ../home.php?save=success");
            exit();
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
else {
    echo '<script>alert("bye")</script>';
    header("Location: ../home.php?error=notposted");
    exit();
}