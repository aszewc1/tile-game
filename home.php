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
                <div class="loginfo" id="select-bar">
                    <?php
                        if (isset($_SESSION['userID'])) {
                            echo '<a href="home.php" class="hbtn">Welcome, '.$_SESSION['userMail'].'</a>';
                            echo '<form action="includes/logout.inc.php" method="post" style="margin=0; width=76px; display: inline-block">
                                    <input type="submit" name="logout-submit" value="Logout" class="hbtn" style="background-color: #0071E3">
                                  </form>';
                            if ($_GET['save'] == "success") {
                                echo '<input type="button" class="hbtn" onclick="savegame();" value="Saved!" style="margin: 0; width: 120px; display: inline-block">';
                            }
                            else {
                                echo '<input type="button" class="hbtn" onclick="savegame();" value="Save Game" style="margin: 0; width: 120px; display: inline-block">';
                            }
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
                            echo '<form action="includes/clear.inc.php" method="post" style="margin=0; width=76px; display: inline-block">
                                    <input type="submit" name="logout-submit" value="Clear Upload" class="hbtn" style="background-color: #0071E3">
                                  </form>';
                    ?>

                    <script>
                        MYset = new Set();
                        var multiArr = <?php echo json_encode($_SESSION['datas']); ?>;
                        for (var i = 0; i < multiArr.length; i++) {
                            var T = multiArr[i];
                            MYset.add(new Tile(T[0], T[1], T[2], T[3], T[4]));
                        }
                    </script>

                    <?php
                            echo '<input type="radio" onclick="if(this.checked){chooseGame()}" id="Play_Upload" name="game">';
                            echo '<label for="Play_Upload" class="hbtn">Play Upload</label>';
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
                            <?php
                            if (isset($_SESSION['userID'])) {
                                require './includes/dbh.inc.php';
                                $sql = 'SELECT * FROM games WHERE idUsers=?';
                                $stmt = mysqli_stmt_init($conn);
                                if (!mysqli_stmt_prepare($stmt, $sql)) {
                                    header("Location: ../home.php?error=sqlerror&games-fail-load");
                                    exit();
                                }
                                else {
                                    mysqli_stmt_bind_param($stmt, "i", $_SESSION['userID']);
                                    mysqli_stmt_execute($stmt);
                                    $result = mysqli_stmt_get_result($stmt);
                                    while ($row = mysqli_fetch_assoc($result)) {
                                        echo '<p>'.$row['gameType'].' Game</p>';
                                        echo '<form action="includes/load.inc.php" method="post" style="margin=0; width=76px; display: inline-block">
                                                <input type="number" name="idval" value="'.$row['idGame'].'" style="visibility: hidden">
                                                <input type="submit" name="load-submit" value="'.$row['idGame'].'" class="hbtn" style="background-color: #0071E3">
                                              </form>';
                                        //echo '<input type="button" class="hbtn" onclick="savegame();" value="'.$row['idGame'].'" style="margin: 0; width: 120px; display: inline-block">';
                                    }
                                }
                                mysqli_stmt_close($stmt);
                                mysqli_close($conn);
                            }
                            else {
                                echo '<p>Create account or login to display saved games.</p>';
                            }
                            ?>
                        </div>
                    </div>
                </container>
            </div>
        </div>

        <?php
            if (isset($_SESSION['gameID'])) {
                echo "hi";
        ?>

        <script>
            console.log("loading game...");
            Game.restore(<?php echo $_SESSION['row_load']; ?>,
                        <?php echo $_SESSION['col_load']; ?>,
                        <?php echo $_SESSION['typ_load']; ?>,
                        <?php echo json_encode($_SESSION['stt_load']); ?>);
        </script>

        <?php
            }
            else {
                echo "shit";
            }
        ?>

    </body>
</html>