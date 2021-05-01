<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tiling | Sign Up</title>
    </head>
    <body>
        <div id="signin" class="signpop">
            <a href="index.php">
                <span class="close">&times;</span>
            </a>
            <form class="signpop-content" action="includes/signin.inc.php" method="post">
                <div class="container">
                    <div class="row">
                        <h2 style="text-align:center">Sign Up</h2>
                        <?php
                            if (isset($_GET['error'])) {
                                if ($_GET['error'] == "emptyfields") {
                                    echo '<p style="text-align: center">Fill in all fields!</p>';
                                }
                                else if ($_GET['error'] == "invalidmail") {
                                    echo '<p style="text-align: center">Please use a valid email.</p>';
                                }
                                else if ($_GET['error'] == "passnomatch") {
                                    echo '<p style="text-align: center">Passwords do not match.</p>';
                                }
                                else if ($_GET['error'] == "sqlerror") {
                                    echo '<p style="text-align: center">Oops! Something went wrong; try again.</p>';
                                }
                                else if ($_GET['error'] == "emailtaken") {
                                    echo '<p style="text-align: center">Email already in use.</p>';
                                }
                            }
                            else if ($_GET['signup'] == "success") {
                                echo '<p style="color: green; text-align: center">Signup successful!</p>';
                            }
                            else {
                                echo '<p style="text-align: center">Tell us about yourself</p>';
                            }
                        ?>
                        <div class="vl"></div>
                          
                        <div class="col">
                            <input type="text" name="email" placeholder="Enter Email" required>
                            <input type="password" name="psw" placeholder="Enter Password" required>
                            <input type="password" name="pswrep" placeholder="Repeat Password" required>
                        </div>
                          
                        <div class="col">
                            <input type="submit" name="signin-submit" value="Sign Up" class="btn sub">
                            <a href="index.php">
                                <input type="button" value="Cancel" class="cncl">
                            </a>
                        </div>
                    </div>
                    <br>
                </div>
            </form>
        </div>
    </body>
</html>