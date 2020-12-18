<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
if ( isset($_POST["submit"]) ) {
  if ( isset($_FILES["file"])) {
    //if there was an error uploading the file
    if ($_FILES["file"]["error"] > 0) {
      echo "Return Code: " . $_FILES["file"]["error"] . "<br/>";
    }
    else {
      //Print file details
      echo "Upload: " . $_FILES["file"]["name"] . "<br/>";
      echo "Type: " . $_FILES["file"]["type"] . "<br/>";
      echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br/>";
      echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br/>";
 
      //if file already exists
      //TODO: make this see if a file with the same contents already exists
      $target_dir = "uploads/";
      //if (file_exists($target_dir . $_FILES["file"]["name"])) {
      //  echo $_FILES["file"]["name"] . " already exists. ";
      //}
      //else {
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        if($fileType != "csv") {
          echo "Sorry, only CSV files are allowed.";
        }
        else if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
          echo "The file ". htmlspecialchars(basename( $_FILES["file"]["name"])) . " has been uploaded.<br />";
        }
        else {
          echo "Sorry, there was an error uploading your file.";
        }
      //}
    }
  }
  else {
    echo "No file selected <br />";
  }
}

ini_set('auto_detect_line_endings', true);
if (isset($target_file) && ($file = fopen($target_file , 'r' )) !== FALSE) {
  echo "File opened.<br />";
  $row = 1;
  $fullData = [];
  while (($data = fgetcsv($file, 1000, ",")) !== FALSE) {
    $fullData[] = $data;
    $num = count($data);
    echo "<p> $num fields in line $row: <br /></p>\n";
    $row++;
    for ($c=0; $c < $num; $c++) {
        echo $data[$c] . "<br />\n";
    }
  }
  fclose($file);
  $_SESSION['datas'] = $fullData;
  header("Location: ../home.php?upload=success");
  exit();
}
?>