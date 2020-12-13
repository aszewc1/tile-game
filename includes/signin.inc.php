<?php
if (isset($_POST['signin-submit'])) {
    require 'dbh.inc.php';

    $email = $_POST['email'];
    $password = $_POST['psw'];
    $passwordRepeat = $_POST['pswrep'];

    if (empty($email) || empty($password) || empty($passwordRepeat)) {
        header("Location: ../signin.php?error=emptyfields&email=".$email);
        exit();
    }
    else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../signin.php?error=invalidmail");
        exit();
    }
    else if ($password !== $passwordRepeat) {
        header("Location: ../signin.php?error=passnomatch&email=".$email);
        exit();
    }
    else {
        $sql = "SELECT emailUsers FROM users WHERE emailUsers=?";
        $stmt = mysqli_stmt_init($conn);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location: ../signin.php?error=sqlerror&email=".$email);
            exit();
        }
        else {
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_store_result($stmt);
            $resultCheck = mysqli_stmt_num_rows($stmt);
            if ($resultCheck > 0) {
                header("Location: ../signin.php?error=emailtaken");
                exit();
            }
            else {
                $sql = "INSERT INTO users (emailUsers, pwdUsers) VALUES (?, ?)";
                $stmt = mysqli_stmt_init($conn);
                if (!mysqli_stmt_prepare($stmt, $sql)) {
                    header("Location: ../signin.php?error=sqlerror&email=".$email);
                    exit();
                }
                else {
                    $hashedPwd = password_hash($password, PASSWORD_DEFAULT);

                    mysqli_stmt_bind_param($stmt, "ss", $email, $hashedPwd);
                    mysqli_stmt_execute($stmt);
                    header("Location: ../signin.php?signup=success");
                    exit();
                }
            }
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    /**if (empty($_POST["email"])) {
        $emailErr = "Email is required";
    } else {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format";
        }
        else {
            $email = test_input($_POST["email"]);
        }
    }

    if (empty($_POST["psw"])) {
        $pswErr = "Password is required";
    } else {
        if (!preg_match("/^[a-zA-Z ]*$/",$psw)) {
            $pswErr = "Only letters and white space allowed";
        }
        else {
            $psw = test_input($_POST["psw"]);
        }
    }

    if (empty($_POST["pswrep"])) {
        $pswrepErr = "Repeat password is required";
    } else {
        if ($psw != $pswrep) {
            $pswrepErr = "Passwords do not match";
        }
        else {
            $pswrep = test_input($_POST["pswrep"]);
        }
    }*/
}
else {
    header("Location: ../signin.php");
    exit();
}