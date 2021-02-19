<?php
if(isset($_GET)) {
// Load Dolibarr environment
	//include "../../main.inc.php";
	include "../../../master.inc.php";
	
	
    $ref = null;
	$server = null;
	$modulepart = null;
    $dolapikey = null;
    
    if(isset($_GET['ref'])) {
        $ref = $_GET['ref'];
    }
	if(isset($_GET['server'])) {
        $server = $_GET['server'];
    }
    if(isset($_GET['DOLAPIKEY'])) {
        $dolapikey = $_GET['DOLAPIKEY'];
    }
	if(isset($_GET['modulepart'])) {
        $modulepart = $_GET['modulepart'];
    }
    
    // no credential
    if($dolapikey == null) {
        echo 'no_credentials';
        return;
    }
    
    // no ref
    if($ref == null) {
        echo 'no_ref';
        return;
    } 
	
	// no module_part
    if($modulepart == null) {
        echo 'no_modulepart';
        return;
    }
	
	// no server
    if($server == null) {
        echo 'server';
        return;
    }
	
	
    $filePath = "produit/".$ref;
	// get admin account number
	$sql = "SELECT * FROM llx_ecm_files WHERE filepath = '".$filePath."' ";
	//print("<pre>".print_r($sql, true)."</pre>");
	//die();
	
	$res = $db->query($sql);
	
	$picFile = null;
	if ($res->num_rows > 0) {
		
		$ecmFiles;
		while($row = $db->fetch_array($sql)){

			$picFile = $row['filename'];
			//print("<pre>".print_r($row, true)."</pre>");
		}
	}
	
	if($picFile == null){
		echo 'No file found.';
		return;
	}

    $original_file = $ref."/".$picFile;
		
    // echo $original_file;
    // url de telechargement de l'image
    $url=$server."/api/index.php/documents/download?modulepart=".$modulepart."&original_file=".$original_file."&DOLAPIKEY=".$dolapikey;

	//  Initiate curl
    $ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL, $url);
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);
    
    // Will dump a beauty json
    $resultArr = json_decode($result, true);
    
    // var_dump($resultArr); return;
    if (isset($resultArr['error'])) {
        echo $resultArr['error']['message'];
        return;
    }

    // Si le dossier du module_part n'existe pas, alors on le crée
	if (!file_exists("images/".$modulepart)) {
        mkdir("images/".$modulepart, 0777, true);
    }

    // $targetPath="D:/timekeeping/logs/94-20160908.dat";
    $file_name = "images/".$modulepart."/".$resultArr['filename'];
	
    // $data = file_get_contents($targetPath);
    $content= base64_decode($resultArr['content']);
    $file = fopen($file_name, 'w');    
    fwrite($file, $content);
    fclose($file);
    
    header('content-type: image/jpg');
    readfile($file_name);
    ob_clean();
    flush();
    return;
    
    echo 'modulepart = '.$modulepart.'\n original_file = '.$original_file.'\n dolapikey = '.$dolapikey;
}
