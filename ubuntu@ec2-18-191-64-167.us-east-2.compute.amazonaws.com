<?php
    unset($_SESSION['datas']);
    header("Location: ../home.php");