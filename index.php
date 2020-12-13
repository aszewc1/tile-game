<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tiling | Home</title>
    </head>
    <body>
        <div class="domain">
            <h1>Tiling Game</h1>
            <div class="radioSelect">
                <div class="loginfo">
                    <a href="signin.php" class="hbtn">Sign up</a>
                    <a href="login.php" class="hbtn">Login</a>
                </div>
                <div class="gameselect">
                    <?php
                        if (isset($_SESSION['userID'])) {
                            $userName = $_SESSION['userMail'];
                            echo '<a href="home.php" class="hbtn">Play as ' . $userName . '</a>';
                        }
                        else {
                            echo '<a href="home.php" class="hbtn">Play as Guest</a>';
                        }
                    ?>
                </div>
            </div>
            <div>
                <container class="gameControl">
                  <div style="text-align: left; width: 80%;">
                    <h2>About</h2>
                    <p>
                        Welcome to the Tiling Game! To play, first select one of the two gamemodes: Hanf or Jockusch.
                        These gamemodes are named after some famous logicians.
                        <br><br>
                        Login and signup now work! Social signup is still in progress.
                    </p>
                  </div>
                </container>
            </div>
        </div>
    </body>
</html>