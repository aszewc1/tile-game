<?php
    session_start();
    unset($_SESSION['datas']);
    header("Location: ../home.php");