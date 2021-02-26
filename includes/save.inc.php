<?php
session_start();
if (array_key_exists('rows', $_POST) && array_key_exists('cols', $_POST) &&
    array_key_exists('set', $_POST) && array_key_exists('state', $_POST) &&
    isset($_SESSION['userID'])) {
    require 'dbh.inc.php';

    $rows = $_POST['rows'];
    $cols = $_POST['cols'];
    $game = $_POST['set'];
    $state = $_POST['state'];

    if (empty($rows) || empty($cols) || empty($game) || empty($state)) {
        header("Location: ../home.php?error=emptygame");
        exit();
    }
    else {
        if (isset($_SESSION['gameID'])) {
            $sql = 'UPDATE games SET gameRow=?, gameCol=?, gameState=? WHERE idGame=?';
            $stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($stmt, $sql)) {
                header("Location: ../home.php?error=sqlerror");
                exit();
            }
            else {
                mysqli_stmt_bind_param($stmt, "iisi", $rows, $cols, $state, $_SESSION['gameID']);
                mysqli_stmt_execute($stmt);
                header("Location: ../home.php?update=success");
                exit();
            }
        }
        else {
            $sql = "INSERT INTO games (idUsers, gameRow, gameCol, gameType, gameState) VALUES (?, ?, ?, ?, ?)";
            $stmt = mysqli_stmt_init($conn);
            if (!mysqli_stmt_prepare($stmt, $sql)) {
                header("Location: ../home.php?error=sqlerror");
                exit();
            }
            else {
                mysqli_stmt_bind_param($stmt, "iiiss", $_SESSION['userID'], $rows, $cols, $game, $state);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);
                if ($row = mysqli_fetch_assoc($result)) {
                    $_SESSION['gameID'] = $row['idGame'];
                }
                header("Location: ../home.php?save=success");
                exit();
            }
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
else {
    echo 'failed save';
    header("Location: ../home.php?error=notposted");
    exit();
}