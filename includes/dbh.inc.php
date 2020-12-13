<?php
    $servername = "localhost";
    $dBUsername = "root";
    $dBPassword = "uBuntu!1milTiles";
    $dBName = "loginsystem";

    $conn = mysqli_connect($servername, $dBUsername, $dBPassword, $dBName);

    if (!$conn) {
        die("Connection Failed: ".mysql_connect_error());
    }