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
      $target_dir = "uploads/";
      if (file_exists($target_dir . $_FILES["file"]["name"])) {
        echo $_FILES["file"]["name"] . " already exists. ";
      }
      else {
        //Store file in directory "uploads" with the name of "uploaded_file.txt"
        $storagename = "uploaded_file.txt";
        //move_uploaded_file($_FILES["file"]["tmp_name"], $target_dir . $storagename);
        //echo "Stored in: " . $target_dir . $_FILES["file"]["name"] . "<br/>";

        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
          echo "The file ". htmlspecialchars(basename( $_FILES["file"]["name"])) . " has been uploaded.";
        }
        else {
          echo "Sorry, there was an error uploading your file.";
        }
      }
    }
  }
  else {
    echo "No file selected <br />";
  }
}

if (isset($storagename) && $file = fopen($target_dir . $storagename , r ) ) {

  echo "File opened.<br />";

  $firstline = fgets ($file, 4096 );
      //Gets the number of fields, in CSV-files the names of the fields are mostly given in the first line
  $num = strlen($firstline) - strlen(str_replace(";", "", $firstline));

      //save the different fields of the firstline in an array called fields
  $fields = array();
  $fields = explode( ";", $firstline, ($num+1) );

  $line = array();
  $i = 0;

      //CSV: one line is one record and the cells/fields are seperated by ";"
      //so $dsatz is an two dimensional array saving the records like this: $dsatz[number of record][number of cell]
  while ( $line[$i] = fgets ($file, 4096) ) {

      $dsatz[$i] = array();
      $dsatz[$i] = explode( ";", $line[$i], ($num+1) );

      $i++;
  }

      echo "<table>";
      echo "<tr>";
  for ( $k = 0; $k != ($num+1); $k++ ) {
      echo "<td>" . $fields[$k] . "</td>";
  }
      echo "</tr>";

  foreach ($dsatz as $key => $number) {
              //new table row for every record
      echo "<tr>";
      foreach ($number as $k => $content) {
                      //new table cell for every field of the record
          echo "<td>" . $content . "</td>";
      }
  }

  echo "</table>";
}

/*$target_dir = "../uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    echo "File is not a CSV file.";
    $uploadOk = 0;
  }
}

// Check if file already exists
if (file_exists($target_file)) {
  echo "Sorry, file already exists.";
  $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
  echo "Sorry, your file is too large.";
  $uploadOk = 0;
}

// Allow certain file formats
if($fileType != "csv") {
  echo "Sorry, only CSV files are allowed.";
  $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    echo "The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["name"])). " has been uploaded.";
  } else {
    echo "Sorry, there was an error uploading your file.";
  }
}*/
?>