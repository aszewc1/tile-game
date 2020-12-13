<?php
if (isset($_POST['login-submit'])) {
    require 'dbh.inc.php';

    $email = $_POST['username'];
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        header("Location: ../login.php?error=emptyfields");
        exit();
    }
    else {
        $sql = "SELECT * FROM users WHERE emailUsers=?";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location: ../login.php?error=sqlerror&email=".$email);
            exit();
        }
        else {
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_assoc($result)) {
                $pwdCheck = password_verify($password, $row['pwdUsers']);
                if ($pwdCheck == true) {
                    session_start();
                    $_SESSION['userID'] = $row['idUsers'];
                    $_SESSION['userMail'] = $row['emailUsers'];

                    header("Location: ../home.php?login=success");
                    exit();
                }
                else {
                    header("Location: ../login.php?error=wrongpass");
                    exit();
                }
            }
            else {
                header("Location: ../login.php?error=nouser");
                exit();
            }
        }
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
else {
    header("Location: ../login.php");
    exit();
}