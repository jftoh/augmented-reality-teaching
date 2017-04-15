<?php
$myconfigdata = json_decode($_POST["config"]);

// echo $_POST;                           // (Testing)
ini_set('display_errors', 1); error_reporting(E_ALL); // (Testing)

$currentconfigfile = "config/testconfig.json";
file_put_contents($currentconfigfile, $myconfigdata);

//date_default_timezone_set("Asia/Singapore");
//$date = date("Y-m-d H:i:s");



//$th=fopen($currentconfigfile, "w") or exit("Can't open current configuration file");
// fwrite($th, $date . " (time of update to config)\n") or exit("Cannot write date to current configureation file");
//fwrite($th, $myconfigdata) or exit("Cannot write current configuration file");
//fclose($th) or exit("Cannot close currentconfigfile");;

// echo "File updated!"

?>
