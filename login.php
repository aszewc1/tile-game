<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tiling | Log In</title>
    </head>
    <body>
        <?php
            // define variables and set to empty values
            $emailErr = $pswErr = "";
            $email = $psw = "";
            
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                if (empty($_POST["email"])) {
                    $emailErr = "Email is required";
                } else {
                    $email = test_input($_POST["email"]);
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $emailErr = "Invalid email format";
                    }
                }

                if (empty($_POST["password"])) {
                    $pswErr = "Password is required";
                } else {
                    $psw = test_input($_POST["password"]);
                    if (!preg_match("/^[a-zA-Z ]*$/",$psw)) {
                        $pswErr = "Only letters and white space allowed";
                    }
                }
            }
            
            function test_input($data) {
                $data = trim($data);
                $data = stripslashes($data);
                $data = htmlspecialchars($data);
                return $data;
            }
        ?>

        <div id="login" class="signpop">
            <a href="index.php">
                <span class="close">&times;</span>
            </a>
            <form class="signpop-content" action="includes/login.inc.php" method="post">
                <div class="container">
                    <div class="row">
                        <h2 style="text-align:center">Login with Social Media or Manually</h2>
                        <?php
                            if (isset($_GET['error'])) {
                                if ($_GET['error'] == "emptyfields") {
                                    echo '<p style="color: purple; text-align: center">Fill in all fields!</p>';
                                }
                                else if ($_GET['error'] == "nouser") {
                                    echo '<p style="color: purple; text-align: center">No such user.</p>';
                                }
                                else if ($_GET['error'] == "wrongpass") {
                                    echo '<p style="color: purple; text-align: center">Password is wrong.</p>';
                                }
                                else if ($_GET['error'] == "sqlerror") {
                                    echo '<p style="color: purple; text-align: center">Oops! Something went wrong; try again.</p>';
                                }
                            }
                        ?>
                        <div class="vl">
                            <span class="vl-innertext">or</span>
                        </div>
                          
                        <div class="col">
                            <a href="#" class="fb btn">
                                <i class="fa fa-facebook fa-fw"></i> Login with Facebook
                            </a>
                            <a href="#" class="twitter btn">
                                <i class="fa fa-twitter fa-fw"></i> Login with Twitter
                            </a>
                            <a href="#" class="google btn">
                                <i class="fa fa-google fa-fw"></i> Login with Google+
                            </a>
                        </div>
                          
                        <div class="col">
                            <div class="hide-md-lg">
                                <p>Or sign in manually:</p>
                            </div>
                          
                            <input type="text" name="username" placeholder="Username" required>
                            <input type="password" name="password" placeholder="Password" required>
                            <input type="submit" name="login-submit" value="Login" class="btn sub">
                        </div>
                    </div>

                    <div class="bottom-container">
                        <div class="row">
                            <div class="col">
                                <a href="signin.php" style="color:white" class="btn">Create Account</a>
                            </div>
                            <div class="col">
                                <a href="#" style="color:white" class="btn">Forgot password?</a>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    </body>
</html>