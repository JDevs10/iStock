<?php
$action_1 = $_POST['action_1'];
$action_2 = $_POST['action_2'];

if ($action_1 == 'update')
{	
	if($action_2 == 'update_account_creation'){
		if($_POST['auto_count_creation'] != 'true' && $_POST['auto_count_creation'] != 'false'){
			?>
			<script>
				alert("La valeur de 'création des comptes en automatique' n'est pas respecté !\nVeuillez renseigner 'true' ou 'false' dans ce champ.");
			</script>
			<?php

		}else{
			//print("<pre>".print_r($_POST,true)."</pre>");
			$ISTOCK_AUTO_CREATION = $_POST['auto_count_creation'];
		
			if ($res->num_rows == 0) {
				
				//If first insert or no values in Database
				$sql = "INSERT INTO llx_istock_configuration (rowid, auto_creation) VALUES(1, '".$ISTOCK_AUTO_CREATION."')";
				$db->query($sql);

			}else{
				//Update values in Database
				$sql = "UPDATE llx_istock_configuration SET auto_creation='".$ISTOCK_AUTO_CREATION."' WHERE rowid = 1";
				$res = $db->query($sql);
			}
			
			$db->commit();
			header("location:setup.php");
		}
	}
}
?>