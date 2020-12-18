<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css" />
        <script src="theGame.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tiling | User</title>
    </head>
    <body>
        <div class="domain">
            <h1>Tiling Game</h1>
            <div class="radioSelect">
                <div class="loginfo">
                    <?php
                        if (isset($_SESSION['userID'])) {
                            echo '<a href="home.php" class="hbtn">Welcome, '.$_SESSION['userMail'].'</a>';
                            echo '<form action="includes/logout.inc.php" method="post" style="margin=0; width=76px; display: inline-block">
                                    <input type="submit" name="logout-submit" value="Logout" class="hbtn" style="background-color: #0071E3">
                                  </form>';
                            echo '<form action="includes/save.inc.php" method="get" style="margin=0; width=76px; display: inline-block">
                                    <input type="submit" name="save-submit" value="Save Game" class="hbtn" onclick="Game.save()">
                                  </form>';
                        }
                        else {
                            echo '<a href="home.php" class="hbtn">Welcome, Guest</a>';
                            echo '<a href="login.php" class="hbtn">Login</a>';
                        }
                    ?>
                </div>
                <div class="gameselect">
                    <?php
                        if (isset($_SESSION['datas'])) {
                            echo '<input type="radio" onclick="if(this.checked){chooseGame("U")}" id="Upload" name="game">';
                            echo '<label for="Upload" class="hbtn">Play Upload</label>';
                        }
                        else {
                            echo '<input type="radio" id="Upload" name="game">';
                            echo '<label for="Upload"><a href="upload.php" class="hbtn">Upload</a></label>';
                        }
                    ?>
                    <input type="radio" onclick="if(this.checked){chooseGame('H')}" id="Hanf" name="game">
                    <label for="Hanf" class="hbtn">Hanf</label>
                    <input type="radio" onclick="if(this.checked){chooseGame('J')}" id="Jockusch" name="game">
                    <label for="Jockusch" class="hbtn">Jockusch</label>
                    <div class="check"></div>
                </div>
                <br><p></p>
                <container class="gameControl">
                    <div class="gridCtrl" id="grid-display">
                        <div style="text-align: left; padding: 10px;">    
                            <?php
                            if (isset($_SESSION['userID'])) {
                                echo '<p>Hello, '.$_SESSION['userMail'].'</p>';
                            }
                            else {
                                echo '<p>Hello, guest. Your user information will show up here after logging in!</p>';
                            }
                            ?>
                        </div>
                    </div>
                    <div class="scrollMenu" id="menuRef">
                        <div style="text-align: left; padding: 5px;">    
                            <p>Saved games coming soon!</p>
                        </div>
                    </div>
                </container>
            </div>
        </div>
    </body>
</html>