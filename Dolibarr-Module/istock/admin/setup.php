<?php
/* Copyright (C) 2004-2017 Laurent Destailleur  <eldy@users.sourceforge.net>
 * Copyright (C) 2020 SuperAdmin <fahd@anexys.fr>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * \file    istock/admin/setup.php
 * \ingroup istock
 * \brief   IStock setup page.
 */

// Load Dolibarr environment
$res = 0;
// Try main.inc.php into web root known defined into CONTEXT_DOCUMENT_ROOT (not always defined)
if (!$res && !empty($_SERVER["CONTEXT_DOCUMENT_ROOT"])) $res = @include $_SERVER["CONTEXT_DOCUMENT_ROOT"]."/main.inc.php";
// Try main.inc.php into web root detected using web root calculated from SCRIPT_FILENAME
$tmp = empty($_SERVER['SCRIPT_FILENAME']) ? '' : $_SERVER['SCRIPT_FILENAME']; $tmp2 = realpath(__FILE__); $i = strlen($tmp) - 1; $j = strlen($tmp2) - 1;
while ($i > 0 && $j > 0 && isset($tmp[$i]) && isset($tmp2[$j]) && $tmp[$i] == $tmp2[$j]) { $i--; $j--; }
if (!$res && $i > 0 && file_exists(substr($tmp, 0, ($i + 1))."/main.inc.php")) $res = @include substr($tmp, 0, ($i + 1))."/main.inc.php";
if (!$res && $i > 0 && file_exists(dirname(substr($tmp, 0, ($i + 1)))."/main.inc.php")) $res = @include dirname(substr($tmp, 0, ($i + 1)))."/main.inc.php";
// Try main.inc.php using relative path
if (!$res && file_exists("../../main.inc.php")) $res = @include "../../main.inc.php";
if (!$res && file_exists("../../../main.inc.php")) $res = @include "../../../main.inc.php";
if (!$res) die("Include of main fails");

global $langs, $user;

// Libraries
require_once DOL_DOCUMENT_ROOT."/core/lib/admin.lib.php";
require_once '../lib/istock.lib.php';
require_once "../core/modules/modIStock.class.php";

// Translations
$langs->loadLangs(array("admin", "istock@istock"));

// Access control
if (!$user->admin) accessforbidden();

// Parameters
$action_1 = GETPOST('action_1', 'alpha');
$action_2 = GETPOST('action_2', 'alpha');
$backtopage = GETPOST('backtopage', 'alpha');

/*
$arrayofparameters = array(
	'ISTOCK_MYPARAM1'=>array('css'=>'minwidth200', 'enabled'=>1),
	'ISTOCK_MYPARAM2'=>array('css'=>'minwidth200', 'enabled'=>1),
	'ISTOCK_MYPARAM3'=>array('css'=>'minwidth200', 'enabled'=>1),
);
*/

// get my settings labels from modIStock const
$modIStock = new modIStock($db);
$arrayofparameters = array(
	'hhh' =>array('css'=>'minwidth200', 'enabled'=>1)
);

if( !file_exists('../backend/config_management.php') &&
	!file_exists('../backend/load_config_data.php')){
	die("[ERREUR::1001] => échec du chargement des fichiers!");
}
include ('../backend/load_config_data.php');
include ('../backend/config_management.php');

/*
 * Actions
 */

if ((float) DOL_VERSION >= 6)
{
	include DOL_DOCUMENT_ROOT.'/core/actions_setmoduleoptions.inc.php';
}



/*
 * View
 */

$page_name = "IStockSetup";
llxHeader('', $langs->trans($page_name));

// Subheader
$linkback = '<a href="'.($backtopage ? $backtopage : DOL_URL_ROOT.'/admin/modules.php?restore_lastsearch_values=1').'">'.$langs->trans("BackToModuleList").'</a>';

print load_fiche_titre($langs->trans($page_name), $linkback, 'object_istock@istock');

// Configuration header
$head = istockAdminPrepareHead();
dol_fiche_head($head, 'settings', '', -1, "istock@istock");

// Setup page goes here
// echo '<span class="opacitymedium">'.$langs->trans("IStockSetupPage").'</span><br><br>';


if($ISTOCK_KEY != ""){ 
?>
	<form id="form_istock_key_d" name="form_istock_key_d" method="POST" action="setup.php">
	
		<h3>La clé lience : </h3>
		<div style="display: flex;">
			<input type="hidden" name="action_1" value="update">
			<input type="hidden" name="action_2" value="delete_key">
			<input style="margin-right: 20px; width: 250px;" type="text" name="istock_key_d" maxlength="29" value="<?php print $ISTOCK_KEY ?>" readonly="readonly"/>
		</div>
		
	</form>
	<br>
	<br>
	<br>
<?php } ?>

<form id="form_istock" name="form_istock" method="POST" action="setup.php">
	
	<input type="hidden" name="action_1" value="update">
	<input type="hidden" name="action_2" value="update_account_creation">
	<h3>Autoriser la création des comptes en automatique : </h3>
	<input type="text" name="auto_count_creation" maxlength="5" value="<?php print $ISTOCK_AUTO_CREATION ?>"/>
	<br>
	<br>
	<br>
	<div class="maj_const _u__" onclick="document.getElementById('form_istock').submit()">Update</div>

</form>

<style>
.maj_const{
	border: 1px solid black;
	width: 100px;
	text-align: center;
	padding: 7px 0px;
	font-size: 15px;
	text-shadow: 1px 1px 1px black;
	color: white;
	cursor: pointer;
	transition:0.2s ease;
}
._g__{
	background: #585858;
	font-weight: bold;
}
._a__{
	background: #306da0;
	font-weight: bold;
}
._u__{
	background: #306da0;
	font-weight: bold;
}
._d__{
	background: #FF0000;
	font-weight: bold;
}
.maj_const:hover{
	opacity:0.7;
}
</style>
 
<?php

// Page end
dol_fiche_end();

llxFooter();
$db->close();
