<?php
    session_start();
    unset($_SESSION['gameID']);
    header("Location: ../home.php");