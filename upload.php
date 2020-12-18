<?php
    session_start();
?>
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="style.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tiling | CSV Upload</title>
  </head>
  <body>
    <div class="signpop">
      <a href="index.php">
        <span class="close">&times;</span>
      </a>
      <form class="signpop-content" action="includes/upload.inc.php" method="post" enctype="multipart/form-data">
        <div class="container">
          <div class="row">
            <div class="col">
              <h2 style="text-align:center">Select a .csv file to upload:</h2>
              <input type="file" name="file" id="file" class="btn">
              <input type="submit" value="Upload CSV" name="submit" class="btn sub">
            </div>
          </div>
        </div>
      </form>    
    </div>
  </body>
</html>