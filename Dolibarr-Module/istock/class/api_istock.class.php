<?php
/* Copyright (C) 2015   Jean-FranÃ§ois Ferry     <jfefe@aternatik.fr>
 * Copyright (C) 2020 SuperAdmin <fahd@anexys.fr>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

use Luracast\Restler\RestException;

require_once DOL_DOCUMENT_ROOT.'/product/class/product.class.php';
require_once DOL_DOCUMENT_ROOT.'/fourn/class/fournisseur.product.class.php';
require_once DOL_DOCUMENT_ROOT.'/commande/class/commande.class.php';

require_once DOL_DOCUMENT_ROOT.'/societe/class/societe.class.php';
require_once DOL_DOCUMENT_ROOT.'/categories/class/categorie.class.php';

dol_include_once('/istock/class/authentification.class.php');
dol_include_once('/istock/class/configuration.class.php');
dol_include_once('/istock/class/evenement.class.php');

require_once DOL_DOCUMENT_ROOT.'/expedition/class/expedition.class.php';
//require_once DOL_DOCUMENT_ROOT.'/custom/istock/backend/expedition.class.php';


//dol_include_once('/istock/backend/expedition.class.php');
//dol_include_once('/istock/backend/expeditionbatch.class.php');

/**
 * \file    istock/class/api_istock.class.php
 * \ingroup istock
 * \brief   File for API management of authentification.
 */

/**
 * API class for istock authentification
 *
 * @access protected
 * @class  DolibarrApiAccess {@requires user,external}
 */
class IStockApi extends DolibarrApi
{
    /**
     * @var Authentification $authentification {@type Authentification}
     */
    public $authentification;
	public $evenement;
	public $configuration;
	public $shipment;
	public $commande;
	public $company;
	
	/**
     * @var Product $product {@type Product}
     */
    public $product;
	
	/**
     * @var ProductFournisseur $productsupplier {@type ProductFournisseur}
     */
    public $productsupplier;

    /**
     * Constructor
     *
     * @url     GET /
     *
     */
    public function __construct()
    {
        global $db, $conf;
        $this->db = $db;
        $this->authentification = new Authentification($this->db);
		$this->evenement = new Evenement($this->db);
		$this->configuration = new Configuration($this->db);
		$this->product = new Product($this->db);
		$this->productsupplier = new ProductFournisseur($this->db);
		$this->shipment = new Expedition($this->db);
		$this->commande = new Commande($this->db);
		$this->company = new Societe($this->db);
    }
	
	/*###############################################################################################################################*/
	/*#############################################  Gestion Api Login  #############################################################*/
    #region Gestion Api Login
	
    /**
	 * Login
	 *
	 * Request the API token for a couple username / password.
	 * Using method POST is recommanded for security reasons (method GET is often logged by default by web servers with parameters so with login and pass into server log file).
	 * Both methods are provided for developer conveniance. Best is to not use at all the login API method and enter directly the "DOLAPIKEY" into field at the top right of page. Note: The API key (DOLAPIKEY) can be found/set on the user page.
	 *
	 * @param   string  $login			User login
	 * @param   string  $password		User password
	 * @param   string  $entity			Entity (when multicompany module is used). '' means 1=first company.
	 * @param   int     $reset          Reset token (0=get current token, 1=ask a new token and canceled old token. This means access using current existing API token of user will fails: new token will be required for new access)
     * @return  array                   Response status and user token
     *
	 * @throws 200
	 * @throws 403
	 * @throws 500
	 *
	 * @url GET /login/
	 * @url POST /login/
	 */
	 
	public function login($login, $password, $entity='', $reset=0) 
	{

	    global $conf, $dolibarr_main_authentication, $dolibarr_auto_user;

		// Authentication mode
		if (empty($dolibarr_main_authentication))
			$dolibarr_main_authentication = 'http,dolibarr';
		// Authentication mode: forceuser
		if ($dolibarr_main_authentication == 'forceuser')
		{
			if (empty($dolibarr_auto_user)) $dolibarr_auto_user='auto';
			if ($dolibarr_auto_user != $login)
			{
				dol_syslog("Warning: your instance is set to use the automatic forced login '".$dolibarr_auto_user."' that is not the requested login. API usage is forbidden in this mode.");
				throw new RestException(403, "Your instance is set to use the automatic login '".$dolibarr_auto_user."' that is not the requested login. API usage is forbidden in this mode.");
			}
		}
		// Set authmode
		$authmode = explode(',', $dolibarr_main_authentication);

		if ($entity != '' && ! is_numeric($entity))
		{
			throw new RestException(403, "Bad value for entity, must be the numeric ID of company.");
		}
		if ($entity == '') $entity=1;

		include_once DOL_DOCUMENT_ROOT . '/core/lib/security2.lib.php';
		$login = checkLoginPassEntity($login, $password, $entity, $authmode);
		if (empty($login))
		{
			throw new RestException(403, 'Access denied');
		}

		$token = 'failedtogenerateorgettoken';

		$tmpuser=new User($this->db);
		$tmpuser->fetch(0, $login, 0, 0, $entity);
		if (empty($tmpuser->id))
		{
			throw new RestException(500, 'Failed to load user');
		}

		// Renew the hash
		if (empty($tmpuser->api_key) || $reset)
		{
			$tmpuser->getrights();
			if (empty($tmpuser->rights->user->self->creer))
			{
				throw new RestException(403, 'User need write permission on itself to reset its API token');
			}

    		// Generate token for user
    		$token = dol_hash($login.uniqid().$conf->global->MAIN_API_KEY,1);

    		// We store API token into database
    		$sql = "UPDATE ".MAIN_DB_PREFIX."user";
    		$sql.= " SET api_key = '".$this->db->escape($token)."'";
    		$sql.= " WHERE login = '".$this->db->escape($login)."'";

    		dol_syslog(get_class($this)."::login", LOG_DEBUG);	// No log
    		$result = $this->db->query($sql);
    		if (!$result)
    		{
    			throw new RestException(500, 'Error when updating api_key for user :'.$this->db->lasterror());
    		}
		}
		else
		{
            $token = $tmpuser->api_key;
		}
		
		//print("<pre>".print_r($tmpuser,true)."</pre>");

		//return token
		return array(
			'success' => array(
				'code' => 200,
				'identifiant' => $tmpuser->lastname,
				'id' => $tmpuser->id,
				'token' => $token,
			    'entity' => $tmpuser->entity,
			    'message' => 'Welcome ' . $login.($reset?' - Token is new':' - This is your token (generated by a previous call). You can use it to make any REST API call, or enter it into the DOLAPIKEY field to use the Dolibarr API explorer.')
			)
		);
	}
	
	#endregion
	
	
	/*###############################################################################################################################*/
	/*#############################################  Gestion Api Authentification  ##################################################*/
	#region Gestion Api Authentification
	
    /**
     * Get properties of a authentification object
     *
     * Return an array with authentification informations
     *
     * @param 	int 	$id ID of authentification
     * @return 	array|mixed data without useless information
     *
     * @url	GET authentifications/{id}
     * @throws 	RestException
     */
    public function get($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->authentification->read) {
            throw new RestException(401);
        }

        $result = $this->authentification->fetch($id);
        if (! $result) {
            throw new RestException(404, 'Authentification not found');
        }
		
		/*
        if (! DolibarrApi::_checkAccessToResource('authentification', $this->authentification->id, 'istock_authentification')) {
            throw new RestException(401, 'Access to instance id='.$this->authentification->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        return $this->_cleanObjectDatas($this->authentification);
    }


    /**
     * List authentifications
     *
     * Get a list of authentifications
     *
     * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @param string           $sqlfilters          Other criteria to filter answers separated by a comma. Syntax example "(t.ref:like:'SO-%') and (t.date_creation:<:'20160101')"
     * @return  array                               Array of order objects
     *
     * @throws RestException
     *
     * @url	GET /authentifications/list
     */
    public function index($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0, $sqlfilters = '')
    {
        global $db, $conf;

        $obj_ret = array();
        $tmpobject = new Authentification($db);

        if(! DolibarrApiAccess::$user->rights->istock->authentification->read) {
            throw new RestException(401);
        }

        $socid = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : '';

        $restrictonsocid = 0;	// Set to 1 if there is a field socid in table of object

        // If the internal user must only see his customers, force searching by him
        $search_sale = 0;
        if ($restrictonsocid && ! DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) $search_sale = DolibarrApiAccess::$user->id;

        $sql = "SELECT t.rowid";
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql .= ", sc.fk_soc, sc.fk_user"; // We need these fields in order to filter by sale (including the case where the user can only see his prospects)
        $sql.= " FROM ".MAIN_DB_PREFIX.$tmpobject->table_element." as t";

        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= ", ".MAIN_DB_PREFIX."societe_commerciaux as sc"; // We need this table joined to the select in order to filter by sale
        $sql.= " WHERE 1 = 1";

        // Example of use $mode
        //if ($mode == 1) $sql.= " AND s.client IN (1, 3)";
        //if ($mode == 2) $sql.= " AND s.client IN (2, 3)";

        if ($tmpobject->ismultientitymanaged) $sql.= ' AND t.entity IN ('.getEntity('authentification').')';
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= " AND t.fk_soc = sc.fk_soc";
        if ($restrictonsocid && $socid) $sql.= " AND t.fk_soc = ".$socid;
        if ($restrictonsocid && $search_sale > 0) $sql.= " AND t.rowid = sc.fk_soc";		// Join for the needed table to filter by sale
        // Insert sale filter
        if ($restrictonsocid && $search_sale > 0) {
            $sql .= " AND sc.fk_user = ".$search_sale;
        }
        if ($sqlfilters)
        {
            if (! DolibarrApi::_checkFilters($sqlfilters)) {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
            $regexstring='\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql.=" AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql.= $db->order($sortfield, $sortorder);
        if ($limit)	{
            if ($page < 0) {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql.= $db->plimit($limit + 1, $offset);
        }

        $result = $db->query($sql);
        if ($result)
        {
            $num = $db->num_rows($result);
            while ($i < $num)
            {
                $obj = $db->fetch_object($result);
                $authentification_static = new Authentification($db);
                if($authentification_static->fetch($obj->rowid)) {
                    $obj_ret[] = $this->_cleanObjectDatas($authentification_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieving authentification list: '.$db->lasterror());
        }
        if( ! count($obj_ret)) {
            throw new RestException(404, 'No authentification found');
        }
        return $obj_ret;
    }

    /**
     * Create authentification object
     *
     * @param array $request_data   Request datas
     * @return int  ID of authentification
     *
     * @url	POST authentifications/create
     */
    public function post($request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->authentification->write) {
            throw new RestException(401);
        }
        // Check mandatory fields
        $result = $this->_validate($request_data);

        foreach($request_data as $field => $value) {
            $this->authentification->$field = $value;
        }
        if( ! $this->authentification->create(DolibarrApiAccess::$user)) {
            throw new RestException(500, "Error creating Authentification", array_merge(array($this->authentification->error), $this->authentification->errors));
        }
        return $this->authentification->id;
    }

    /**
     * Update authentification
     *
     * @param int   $id             Id of authentification to update
     * @param array $request_data   Datas
     * @return int
     *
     * @url	PUT authentifications/update/{id}
     */
    public function put($id, $request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->authentification->write) {
            throw new RestException(401);
        }

        $result = $this->authentification->fetch($id);
        if( ! $result ) {
            throw new RestException(404, 'Authentification not found');
        }

		/*
        if( ! DolibarrApi::_checkAccessToResource('authentification', $this->authentification->id, 'istock_authentification')) {
            throw new RestException(401, 'Access to instance id='.$this->authentification->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        foreach($request_data as $field => $value) {
            if ($field == 'id') continue;
            $this->authentification->$field = $value;
        }

        if ($this->authentification->update($id, DolibarrApiAccess::$user) > 0)
        {
            return $this->get($id);
        }
        else
        {
            throw new RestException(500, $this->authentification->error);
        }
    }

    /**
     * Delete authentification
     *
     * @param   int     $id   Authentification ID
     * @return  array
     *
     * @url	DELETE authentifications/delete/{id}
     */
    public function delete($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->authentification->delete) {
            throw new RestException(401);
        }
        $result = $this->authentification->fetch($id);
        if (! $result) {
            throw new RestException(404, 'Authentification not found');
        }

		/*
        if (! DolibarrApi::_checkAccessToResource('authentification', $this->authentification->id, 'istock_authentification')) {
            throw new RestException(401, 'Access to instance id='.$this->authentification->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        if (! $this->authentification->delete(DolibarrApiAccess::$user))
        {
            throw new RestException(500, 'Error when deleting Authentification : '.$this->authentification->error);
        }

        return array(
            'success' => array(
                'code' => 200,
                'message' => 'Authentification deleted'
            )
        );
    }
	
	#endregion
	
	
	/*###############################################################################################################################*/
	/*#############################################  Gestion Api Configuration  #####################################################*/
	#region Gestion Api Configuration
	
	/**
     * Get properties of a configuration object
     *
     * Return an array with configuration informations
     *
     * @param 	int 	$id ID of configuration
     * @return 	array|mixed data without useless information
     *
     * @url	GET configuration/{id}
     * @throws 	RestException
     */
    public function configurationGet($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->configuration->read) {
            throw new RestException(401);
        }

        $result = $this->configuration->fetch($id);
        if (! $result) {
            throw new RestException(404, 'Configuration not found');
        }

		/*
        if (! DolibarrApi::_checkAccessToResource('configuration', $this->configuration->id, 'istock_configuration')) {
            throw new RestException(401, 'Access to instance id='.$this->configuration->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        return $this->_cleanObjectDatas($this->configuration);
    }


    /**
     * List configurations
     *
     * Get a list of configurations
     *
     * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @param string           $sqlfilters          Other criteria to filter answers separated by a comma. Syntax example "(t.ref:like:'SO-%') and (t.date_creation:<:'20160101')"
     * @return  array                               Array of order objects
     *
     * @throws RestException
     *
     * @url	GET /configurations/list
     */
    public function configurationIndex($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0, $sqlfilters = '')
    {
        global $db, $conf;

        $obj_ret = array();
        $tmpobject = new Configuration($db);

        if(! DolibarrApiAccess::$user->rights->istock->configuration->read) {
            throw new RestException(401);
        }

        $socid = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : '';

        $restrictonsocid = 0;	// Set to 1 if there is a field socid in table of object

        // If the internal user must only see his customers, force searching by him
        $search_sale = 0;
        if ($restrictonsocid && ! DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) $search_sale = DolibarrApiAccess::$user->id;

        $sql = "SELECT t.rowid";
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql .= ", sc.fk_soc, sc.fk_user"; // We need these fields in order to filter by sale (including the case where the user can only see his prospects)
        $sql.= " FROM ".MAIN_DB_PREFIX.$tmpobject->table_element." as t";

        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= ", ".MAIN_DB_PREFIX."societe_commerciaux as sc"; // We need this table joined to the select in order to filter by sale
        $sql.= " WHERE 1 = 1";

        // Example of use $mode
        //if ($mode == 1) $sql.= " AND s.client IN (1, 3)";
        //if ($mode == 2) $sql.= " AND s.client IN (2, 3)";

        if ($tmpobject->ismultientitymanaged) $sql.= ' AND t.entity IN ('.getEntity('configuration').')';
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= " AND t.fk_soc = sc.fk_soc";
        if ($restrictonsocid && $socid) $sql.= " AND t.fk_soc = ".$socid;
        if ($restrictonsocid && $search_sale > 0) $sql.= " AND t.rowid = sc.fk_soc";		// Join for the needed table to filter by sale
        // Insert sale filter
        if ($restrictonsocid && $search_sale > 0) {
            $sql .= " AND sc.fk_user = ".$search_sale;
        }
        if ($sqlfilters)
        {
            if (! DolibarrApi::_checkFilters($sqlfilters)) {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
            $regexstring='\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql.=" AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql.= $db->order($sortfield, $sortorder);
        if ($limit)	{
            if ($page < 0) {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql.= $db->plimit($limit + 1, $offset);
        }

        $result = $db->query($sql);
        if ($result)
        {
            $num = $db->num_rows($result);
            while ($i < $num)
            {
                $obj = $db->fetch_object($result);
                $configuration_static = new Configuration($db);
                if($configuration_static->fetch($obj->rowid)) {
                    $obj_ret[] = $this->_cleanObjectDatas($configuration_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieving configuration list: '.$db->lasterror());
        }
        if( ! count($obj_ret)) {
            throw new RestException(404, 'No configuration found');
        }
        return $obj_ret;
    }

    /**
     * Create configuration object
     *
     * @param array $request_data   Request datas
     * @return int  ID of configuration
     *
     * @url	POST configuration/create
     */
    public function configurationPost($request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->configuration->write) {
            throw new RestException(401);
        }
        // Check mandatory fields
        $result = $this->_validate($request_data);

        foreach($request_data as $field => $value) {
            $this->configuration->$field = $value;
        }
        if( ! $this->configuration->create(DolibarrApiAccess::$user)) {
            throw new RestException(500, "Error creating Configuration", array_merge(array($this->configuration->error), $this->configuration->errors));
        }
        return $this->configuration->id;
    }

    /**
     * Update configuration
     *
     * @param int   $id             Id of configuration to update
     * @param array $request_data   Datas
     * @return int
     *
     * @url	PUT configuration/update/{id}
     */
    public function configurationsPutById($id, $request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->configuration->write) {
            throw new RestException(401);
        }

        $result = $this->configuration->fetch($id);
        if( ! $result ) {
            throw new RestException(404, 'Configuration not found');
        }

		/*
        if( ! DolibarrApi::_checkAccessToResource('configuration', $this->configuration->id, 'istock_configuration')) {
            throw new RestException(401, 'Access to instance id='.$this->configuration->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        foreach($request_data as $field => $value) {
            if ($field == 'id') continue;
            $this->configuration->$field = $value;
        }

        if ($this->configuration->update($id, DolibarrApiAccess::$user) > 0)
        {
            return $this->get($id);
        }
        else
        {
            throw new RestException(500, $this->configuration->error);
        }
    }
	
	/**
     * Delete configuration
     *
     * @param   int     $id   Configurations ID
     * @return  array
     *
     * @url	DELETE configuration/update/{id}
     */
    public function deleteConfigurationById($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->configuration->delete) {
            throw new RestException(401);
        }
		
		//find configuration
        $result = $this->configuration->fetch($id);
        if (! $result) {
            throw new RestException(404, 'Configuration not found');
        }

        //delete it
        if (! $this->configuration->delete(DolibarrApiAccess::$user))
        {
            throw new RestException(500, 'Error when deleting Configuration : '.$this->configuration->error);
        }

		//send success message
        return array(
            'success' => array(
                'code' => 200,
                'message' => 'Configuration deleted'
            )
        );
    }
	
	#endregion
	
	
	/*################################################################################################################################*/
	/*#############################################  Gestion Api Evenement  ##########################################################*/
	#region Gestion Api Evenement
	
    /**
     * Get properties of a evenement object
     *
     * Return an array with evenement informations
     *
     * @param 	int 	$id ID of evenement
     * @return 	array|mixed data without useless information
     *
     * @url	GET evenement/{id}
     * @throws 	RestException
     */
    public function evenementGet($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->evenement->read) {
            throw new RestException(401);
        }

        $result = $this->evenement->fetch($id);
        if (! $result) {
            throw new RestException(404, 'Evenement not found');
        }

		/*
        if (! DolibarrApi::_checkAccessToResource('evenement', $this->evenement->id, 'istock_authentification')) {
            throw new RestException(401, 'Access to instance id='.$this->evenement->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        return $this->_cleanObjectDatas($this->evenement);
    }


    /**
     * List evenements
     *
     * Get a list of evenements
     *
     * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @param string           $sqlfilters          Other criteria to filter answers separated by a comma. Syntax example "(t.ref:like:'SO-%') and (t.date_creation:<:'20160101')"
     * @return  array                               Array of order objects
     *
     * @throws RestException
     *
     * @url	GET /evenements/list
     */
    public function evenementIndex($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0, $sqlfilters = '')
    {
        global $db, $conf;

        $obj_ret = array();
        $tmpobject = new Evenement($db);

        if(! DolibarrApiAccess::$user->rights->istock->evenement->read) {
            throw new RestException(401);
        }

        $socid = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : '';

        $restrictonsocid = 0;	// Set to 1 if there is a field socid in table of object

        // If the internal user must only see his customers, force searching by him
        $search_sale = 0;
        if ($restrictonsocid && ! DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) $search_sale = DolibarrApiAccess::$user->id;

        $sql = "SELECT t.rowid";
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql .= ", sc.fk_soc, sc.fk_user"; // We need these fields in order to filter by sale (including the case where the user can only see his prospects)
        $sql.= " FROM ".MAIN_DB_PREFIX.$tmpobject->table_element." as t";

        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= ", ".MAIN_DB_PREFIX."societe_commerciaux as sc"; // We need this table joined to the select in order to filter by sale
        $sql.= " WHERE 1 = 1";

        // Example of use $mode
        //if ($mode == 1) $sql.= " AND s.client IN (1, 3)";
        //if ($mode == 2) $sql.= " AND s.client IN (2, 3)";

        if ($tmpobject->ismultientitymanaged) $sql.= ' AND t.entity IN ('.getEntity('evenement').')';
        if ($restrictonsocid && (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socid) || $search_sale > 0) $sql.= " AND t.fk_soc = sc.fk_soc";
        if ($restrictonsocid && $socid) $sql.= " AND t.fk_soc = ".$socid;
        if ($restrictonsocid && $search_sale > 0) $sql.= " AND t.rowid = sc.fk_soc";		// Join for the needed table to filter by sale
        // Insert sale filter
        if ($restrictonsocid && $search_sale > 0) {
            $sql .= " AND sc.fk_user = ".$search_sale;
        }
        if ($sqlfilters)
        {
            if (! DolibarrApi::_checkFilters($sqlfilters)) {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
            $regexstring='\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql.=" AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql.= $db->order($sortfield, $sortorder);
        if ($limit)	{
            if ($page < 0) {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql.= $db->plimit($limit + 1, $offset);
        }

        $result = $db->query($sql);
        if ($result)
        {
            $num = $db->num_rows($result);
            while ($i < $num)
            {
                $obj = $db->fetch_object($result);
                $evenement_static = new Evenement($db);
                if($evenement_static->fetch($obj->rowid)) {
                    $obj_ret[] = $this->_cleanObjectDatas($evenement_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieving evenement list: '.$db->lasterror());
        }
        if( ! count($obj_ret)) {
            throw new RestException(404, 'No evenement found');
        }
        return $obj_ret;
    }

    /**
     * Create evenement object
     *
     * @param array $request_data   Request datas
     * @return int  ID of evenement
     *
     * @url	POST evenement/create
     */
    public function evenementPost($request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->evenement->write) {
            throw new RestException(401);
        }
        // Check mandatory fields
        $result = $this->_validate($request_data);

        foreach($request_data as $field => $value) {
            $this->evenement->$field = $value;
        }
        if( ! $this->evenement->create(DolibarrApiAccess::$user)) {
            throw new RestException(500, "Error creating Evenement", array_merge(array($this->evenement->error), $this->evenement->errors));
        }
        return $this->evenement->id;
    }

    /**
     * Update evenement
     *
     * @param int   $id             Id of evenement to update
     * @param array $request_data   Datas
     * @return int
     *
     * @url	PUT evenement/update/{id}
     */
    public function evenementPut($id, $request_data = null)
    {
        if(! DolibarrApiAccess::$user->rights->istock->evenement->write) {
            throw new RestException(401);
        }

        $result = $this->evenement->fetch($id);
        if( ! $result ) {
            throw new RestException(404, 'Evenement not found');
        }

		/*
        if( ! DolibarrApi::_checkAccessToResource('evenement', $this->evenement->id, 'istock_evenement')) {
            throw new RestException(401, 'Access to instance id='.$this->evenement->id.' of object not allowed for login '.DolibarrApiAccess::$user->login);
        }
		*/

        foreach($request_data as $field => $value) {
            if ($field == 'id') continue;
            $this->evenement->$field = $value;
        }

        if ($this->evenement->update($id, DolibarrApiAccess::$user) > 0)
        {
            return $this->get($id);
        }
        else
        {
            throw new RestException(500, $this->evenement->error);
        }
    }

    /**
     * Delete evenement
     *
     * @param   int     $id   Evenement ID
     * @return  array
     *
     * @url	DELETE evenement/delete/{id}
     */
    public function evenementDelete($id)
    {
        if (! $this->evenement->delete(DolibarrApiAccess::$user))
        {
            throw new RestException(500, 'Error when deleting Evenement : '.$this->evenement->error);
        }

        return array(
            'success' => array(
                'code' => 200,
                'message' => 'Evenement deleted'
            )
        );
    }
	
	#endregion
	
	
	/*################################################################################################################################*/
	/*#############################################  Gestion Api Products  ###########################################################*/
	#region Gestion Api Products
	
	/**
     * List products
     *
     * Get a list of products
     *
     * @param  string $sortfield  Sort field
     * @param  string $sortorder  Sort order
     * @param  int    $limit      Limit for list
     * @param  int    $page       Page number
     * @param  int    $mode       Use this param to filter list (0 for all, 1 for only product, 2 for only service)
     * @param  int    $category   Use this param to filter list by category
     * @param  string $sqlfilters Other criteria to filter answers separated by a comma. Syntax example "(t.tobuy:=:0) and (t.tosell:=:1)"
     * @return array                Array of product objects
	 * 
	 * @url	GET products/
     */
    public function indexProducts($sortfield = "t.ref", $sortorder = 'ASC', $limit = 100, $page = 0, $mode = 0, $category = 0, $sqlfilters = '')
    {
        global $db, $conf;

        $obj_ret = array();

        $socid = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : '';

        $sql = "SELECT t.rowid, t.ref, t.ref_ext";
        $sql .= " FROM ".MAIN_DB_PREFIX."product as t";
        if ($category > 0) {
            $sql .= ", ".MAIN_DB_PREFIX."categorie_product as c";
        }
        $sql .= ' WHERE t.entity IN ('.getEntity('product').')';
        // Select products of given category
        if ($category > 0) {
            $sql .= " AND c.fk_categorie = ".$db->escape($category);
            $sql .= " AND c.fk_product = t.rowid ";
        }
        if ($mode == 1) {
            // Show only products
            $sql .= " AND t.fk_product_type = 0";
        } elseif ($mode == 2) {
            // Show only services
            $sql .= " AND t.fk_product_type = 1";
        }
        // Add sql filters
        if ($sqlfilters) {
            if (!DolibarrApi::_checkFilters($sqlfilters)) {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
            $regexstring = '\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql .= " AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql .= $db->order($sortfield, $sortorder);
        if ($limit) {
            if ($page < 0) {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql .= $db->plimit($limit + 1, $offset);
        }
		
		//print $sql;
		//die();

        $result = $db->query($sql);
        if ($result) {
            $num = $db->num_rows($result);
            $min = min($num, ($limit <= 0 ? $num : $limit));
            $i = 0;
            while ($i < $min)
            {
                $obj = $db->fetch_object($result);
                $product_static = new Product($db);
                if ($product_static->fetch($obj->rowid)) {
					$product_static->Lot_DLC_DLUO_Batch = $this->getLot_DLC_DLUO_BatchOfProduct($obj->rowid);
					
					//print("<pre>".print_r($product_static,true)."</pre>");
					//die();
                    $obj_ret[] = $this->_cleanObjectDatas($product_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieve product list : '.$db->lasterror());
        }
        if (!count($obj_ret)) {
            throw new RestException(404, 'No product found');
        }
        return $obj_ret;
    }
	
	
	/**
     * Get Lot/Série, DLC, DLUO, batch for a Product
     *	
	 * @param	string	$id 	Ex : product id
     * @return  array
     *
     * @url	GET get/lot-dlc-dluo-batch
     */
    private function getLot_DLC_DLUO_BatchOfProduct($id)
	{
		$obj_ret = array();
		
		$sql  = "SELECT batch.rowid as fk_origin_stock, stock.fk_entrepot, (SELECT ent.ref FROM llx_entrepot as ent WHERE ent.rowid = stock.fk_entrepot) as entrepot_label, lot.batch, lot.fk_product, lot.eatby, lot.sellby, batch.qty ";
		$sql .= "FROM llx_product_stock as stock, llx_product_batch as batch, llx_product_lot as lot ";
		$sql .= "WHERE stock.fk_product = ".$id." AND stock.rowid = batch.fk_product_stock AND batch.batch = lot.batch AND lot.fk_product = ".$id."";
		

		//print "SQL => $sql\n\n";

        $result = $this->db->query($sql);
		
		if ($result)
        {
			//print("<pre>".print_r($result,true)."</pre>");
			
            $num = $this->db->num_rows($result);
            while ($i < $num)
            {
                $obj = $this->db->fetch_object($result);
				$obj_ret[] = $obj;
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when Order Contact list: '.$this->db->lasterror());
        }
        if( ! count($obj_ret)) {
            return $obj_ret;
        }
		
		return $obj_ret;
	}
	
	#endregion
	
	
	/*################################################################################################################################*/
	/*#############################################  Gestion Api Order  ##############################################################*/
	#region Gestion Api Order
	
	/**
     * Get total number of oders before download the ordes
     *	
	 * @param	string	$module 	Ex : user|societe|product|order|entrepot
	 * @param	string	$dateFrom 	Ex : 2020-01-01
	 * @param	string	$dateTo	 	EX : 2020-02-15
     * @return  array
     *
     * @url	GET get/totals
     */
    public function getTotalNumberOfOrder($module, $dateFrom = null, $dateTo = null)
    {
		$table = "";
		$column = "";
		$message = "";
		if($module == "utilisateur" || $module == "user"){
			$table .= "user";
			$column = "datec";
		}
		if($module == "thirdparties" || $module == "societe"){
			$table .= "societe";
			$column = "datec";
		}
		if($module == "product" || $module == "produit"){
			$table .= "product";
			$column = "datec";
		}
		if($module == "commande" || $module == "order"){
			$table .= "commande";
			$column = "date_creation";
		}
		if($module == "warehouse" || $module == "entrepot"){
			$table .= "entrepot";
			$column = "datec";
		}
		
		$sql = "";
		if($dateFrom == null && $dateTo == null){
			$sql = "SELECT COUNT(*) as total FROM llx_$table";
			$message = "Total number of $module";
		}
		if($dateFrom != null && $dateTo == null){
			$sql = "SELECT COUNT(*) as total FROM llx_$table WHERE $column >= '$dateFrom%'";
			$message = "Total number of $module from $dateFrom";
		}
		if($dateFrom == null && $dateTo != null){
			$sql = "SELECT COUNT(*) as total FROM llx_$table WHERE $column <= '$dateTo%'";
			$message = "Total number of $module lower than $dateTo";
		}
		if($dateFrom != null && $dateTo != null){
			$sql = "SELECT COUNT(*) as total FROM llx_$table WHERE $column BETWEEN '$dateFrom%' AND '$dateTo%'";
			$message = "Total number of $module between $dateFrom and $dateTo ";
		}
		
        $result = $this->db->query($sql);
		
		if($result){
			if($result->num_rows > 0){
				$total_nb = 0;
				while($row = $this->db->fetch_array($sql)){
					//print("<pre>".print_r($row,true)."</pre>");
					
					$total_nb = $row['total'];
				}
				
				return array(
					'success' => array(
						'code' => 200,
						'message' => $message,
						'total' => $total_nb
					)
				);
				
			}else {
				throw new RestException(404, "No $module found");
			}
		}else {
            throw new RestException(503, "Error when $module list: ".$this->db->lasterror());
        }

    }
	
	
	
	/**
     * Get total number of oders before download the ordes
     *	
	 * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @param string   	       $thirdparty_ids	    Thirdparty ids to filter orders of (example '1' or '1,2,3') {@pattern /^[0-9,]*$/i}
     * @param string           $sqlfilters          Other criteria to filter answers separated by a comma. Syntax example "(t.ref:like:'SO-%') and (t.date_creation:<:'20160101')"
     * @return  array                               Array of order objects
     *
     * @url	GET get/sync_v2
     */
	public function sync_v2($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0, $thirdparty_ids = '', $sqlfilters = ''){
		global $db, $conf;

		$obj_ret = array();

        $main_obj = array();
		$order_array = array();
		$order_line_array = array();
		$order_contact_array = array();
		$client_array = array();
		$product_array = array();
		$productsLotDlcDluoManager_array = array();
		$shipment_array = array();
		$shipment_line_array = array();
		$user_array = array();
		$warehouse_array = array();

        // case of external user, $thirdparty_ids param is ignored and replaced by user's socid
        $socids = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : $thirdparty_ids;

        // If the internal user must only see his customers, force searching by him
        $search_sale = 0;
        if (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) $search_sale = DolibarrApiAccess::$user->id;

        $sql = "SELECT t.rowid";
        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= ", sc.fk_soc, sc.fk_user"; // We need these fields in order to filter by sale (including the case where the user can only see his prospects)
        $sql .= " FROM ".MAIN_DB_PREFIX."commande as t";

        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= ", ".MAIN_DB_PREFIX."societe_commerciaux as sc"; // We need this table joined to the select in order to filter by sale

        $sql .= ' WHERE t.entity IN ('.getEntity('commande').')';
        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= " AND t.fk_soc = sc.fk_soc";
        if ($socids) $sql .= " AND t.fk_soc IN (".$socids.")";
        if ($search_sale > 0) $sql .= " AND t.rowid = sc.fk_soc"; // Join for the needed table to filter by sale
        // Insert sale filter
        if ($search_sale > 0)
        {
            $sql .= " AND sc.fk_user = ".$search_sale;
        }
        // Add sql filters
        if ($sqlfilters)
        {
            if (!DolibarrApi::_checkFilters($sqlfilters))
            {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
	        $regexstring = '\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql .= " AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql .= $db->order($sortfield, $sortorder);
        if ($limit) {
            if ($page < 0)
            {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql .= $db->plimit($limit + 1, $offset);
        }

        dol_syslog("API Rest request");
        $result = $db->query($sql);

        if ($result)
        {
            $num = $db->num_rows($result);
            $min = min($num, ($limit <= 0 ? $num : $limit));
            $i = 0;
            while ($i < $min)
            {
                $obj = $db->fetch_object($result);
                $commande_static = new Commande($db);
                if ($commande_static->fetch($obj->rowid)) {
                    // Add external contacts ids
                    $commande_static->contacts_ids = $commande_static->liste_contact(-1, 'external', 1);
                    $obj_ret[] = $this->_cleanObjectDatas($commande_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieve commande list : '.$db->lasterror());
        }
        if (!count($obj_ret)) {
            throw new RestException(404, 'No order found');
        }
		//return $obj_ret;
		
		//print("<pre>".print_r($obj_ret,true)."</pre>");
		
		//JL
		// Filter the order array and get tmp list of all
		// clients, users, products, batchs, 
		
		
		$tmp_order = array();			//ok
		$tmp_order_ids = array();			//ok
		$tmp_order_lines_ids = array();			//ok
		$orders_contacts = array();		//ok
		$tmp_clients = array();			//ok
		$tmp_users = array();			//ok
		$tmp_products_ids = array();
		$tmp_products = array();		
		$tmp_batchs_ids = array();
		$tmp_shipments = array();			//ok
		
		if($obj_ret != null && count($obj_ret)>0){
			
			for($index=0; $index<count($obj_ret); $index++){
				
				$obj = $obj_ret[$index];
				
				// get and store orders
				$tmp_order_ids[] = $obj->id;
				($this->checkArrayDouble($tmp_order, $obj->id) ? null : $tmp_order[] = $obj );
				
				// get and store products of order
				for($_index_=0; $_index_<count($obj->lines); $_index_++){
					//$tmp_order_lines_ids[] = $obj->lines[$_index_]->id;
					$tmp_products_ids[] = $obj->lines[$_index_]->fk_product;
				}
				
				
				// get and store contact of order
				$tmp_res = $this->orderContactById($obj->id);
				($tmp_res == null ? null : $orders_contacts[] = $tmp_res );
				
				
				// get and store client of order
				$tmp_res = $this->clientById($obj->socid);
				($tmp_res == null ? null : $tmp_clients[] = $tmp_res );
				
				
				// get and store user of order
				$tmp_res = $this->userById($obj->user_author_id);
				($tmp_res == null ? null : $tmp_users[] = $tmp_res );
				
			}
			
			// get order contact obj of cmd id
			
			
					
		}
		else{
			return "No orders found!!!";
		}
		
		
		if($tmp_products_ids != null && count($tmp_products_ids)>0){
			// get and store products && Lot_DLC_DLUO_Batch		(rowid:=:10312)
			
			for($index=(count($tmp_products_ids) - 5); $index<count($tmp_products_ids); $index++){ 
				
				$tmp_res = $this->indexProducts($sortfield = "t.ref", $sortorder = 'ASC', $limit = 50, $page = 0, $mode = 0, $category = 0, "(t.rowid:=:".$tmp_products_ids[$index].")")[0];
				($tmp_res == null ? null : $tmp_products[] = $tmp_res ); // $tmp_res here will return an array
			}
			
		}
		
		
		if($tmp_order_ids != null && count($tmp_order_ids)>0){
			// get and store products && Lot_DLC_DLUO_Batch		(rowid:=:10312)
			
			for($index=(count($tmp_order_ids) - 5); $index<count($tmp_order_ids); $index++){ 
				
				// get and store shipments & shipment lines
				$tmp_res = $this->shipmentOfOrders_v2($tmp_order_ids[$index]);
				($tmp_res == null ? null : $tmp_shipments[] = $tmp_res ); // $tmp_res here will return an array
			}
			
		}
		
		
		return array(
			"tmp_order"=>$tmp_order,
			"orders_contacts"=>$orders_contacts,
			"tmp_clients"=>$tmp_clients,
			"tmp_users"=>$tmp_users,
			"tmp_products"=>$tmp_products,			//need to call this seperate via api
			"tmp_order_ids"=>$tmp_order_ids,
			"tmp_products_ids"=>$tmp_products_ids,
			"tmp_shipments"=>$tmp_shipments,			//need to call this seperate via api
			"sum"=> (count($tmp_order_ids) + count($tmp_clients_ids) + count($tmp_users_ids) + count($tmp_products_ids))
		);
		
	}
	
	// Check for array before adding doubles
	private function checkArrayDouble($theArray, $value){
		for($index_=0; $index_<count($theArray); $index_++){
			
			if($theArray[$index_] == $value){
				return true;
			}
		}
		return false;
	}
	
	
	/**
     * Fetch properties of a thirdparty object.
     *
     * Return an array with thirdparty informations
     *
     * @param    int	$rowid      Id of third party to load
     * @return array
     *
     * @throws RestException
    */
    private function clientById($rowid)
    {
		$sql = "SELECT s.rowid, s.nom as name, s.code_client as ref, s.address, s.town, s.zip, c.label as country, s.fk_pays as country_id, ";
		$sql.= "c.code as country_code, s.status, s.phone, s.client, s.fournisseur, s.note_private, s.note_public ";
		$sql.= "FROM llx_societe as s LEFT JOIN llx_c_effectif as e ON s.fk_effectif = e.id LEFT JOIN llx_c_country as c ON s.fk_pays = c.rowid ";
		$sql.= "LEFT JOIN llx_c_stcomm as st ON s.fk_stcomm = st.id LEFT JOIN llx_c_forme_juridique as fj ON s.fk_forme_juridique = fj.code ";
		$sql.= "LEFT JOIN llx_c_departements as d ON s.fk_departement = d.rowid LEFT JOIN llx_c_typent as te ON s.fk_typent = te.id ";
		$sql.= "LEFT JOIN llx_c_incoterms as i ON s.fk_incoterms = i.rowid ";
		$sql.= "LEFT JOIN llx_societe_remise as sr ON sr.rowid = (SELECT MAX(rowid) FROM llx_societe_remise WHERE fk_soc = s.rowid AND entity IN (1)) WHERE s.entity IN (1) AND s.rowid = $rowid";
		
        $result = $this->db->query($sql);
		
		if ($result)
        {
			//print("<pre>".print_r($result,true)."</pre>");
			
            $num = $this->db->num_rows($result);
            while ($i < $num)
            {
                $obj = $this->db->fetch_object($result);
				$obj_ret[] = $obj;
                $i++;
            }
			
			return $obj_ret[0];
        }
        else {
            return [];
        }
    }
	
	/**
     * Fetch properties of a user object.
     *
     * Return an array with user informations
     *
     * @param    int	$rowid      Id of user to load
     * @return array
     *
     * @throws RestException
    */
    private function userById($rowid)
    {
		$sql = "SELECT u.rowid as id, u.rowid as ref, u.firstname, u.lastname, u.admin, u.email, u.job ";
		$sql .= " FROM ".MAIN_DB_PREFIX."user as u";
		$sql .= " LEFT JOIN ".MAIN_DB_PREFIX."c_country as c ON u.fk_country = c.rowid";
		$sql .= " LEFT JOIN ".MAIN_DB_PREFIX."c_departements as d ON u.fk_state = d.rowid";
		
        $result = $this->db->query($sql);
		
		if ($result)
        {
			//print("<pre>".print_r($result,true)."</pre>");
			
            $num = $this->db->num_rows($result);
            while ($i < $num)
            {
                $obj = $this->db->fetch_object($result);
				$obj_ret[] = $obj;
                $i++;
            }
			
			return $obj_ret[0];
        }
        else {
            return [];
        }
    }
	#endregion
	
	
	/*################################################################################################################################*/
	/*#############################################  Gestion Api Order_Contact  ######################################################*/
	#region Gestion Api Order_Contact
	
	/**
     * Liste des contact orders
     *
     * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @return  array 
     *
     * @url	GET order/contacts/list
     */
	public function orderIndex($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0){
		
		$obj_ret = array();
		
		$sql = "SELECT * FROM llx_element_contact as t WHERE 1 = 1";
		$sql.= $this->db->order($sortfield, $sortorder);
		
        if ($limit)	{
            if ($page < 0) {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql.= $this->db->plimit($limit, $offset);
        }
		//print "SQL => $sql\n\n";
		//die();

        $result = $this->db->query($sql);
		
		if ($result)
        {
			//print("<pre>".print_r($result,true)."</pre>");
			
            $num = $this->db->num_rows($result);
            while ($i < $num)
            {
                $obj = $this->db->fetch_object($result);
				$obj_ret[] = $obj;
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when Order Contact list: '.$this->db->lasterror());
        }
        if( ! count($obj_ret)) {
            throw new RestException(404, 'No Order Contact found');
        }
		
		return array(
            'success' => array(
                'code' => 200,
                'message' => "Data between $offset and ".($page == 0 ? $limit : ($offset + $limit)),
				'data' => $obj_ret
            )
        );
	}
	
	
	/**
     * Contact order object from order id
     *
     * @param int		       $id		        Page number
     * @return  array 
     *
     * @url	GET contact/order/{id}
     */
	public function orderContactById($id){
		
		$obj_ret = array();
		
		$sql = "SELECT t.rowid, t.datecreate, t.statut, t.element_id, t.fk_c_type_contact, t.fk_socpeople ";
		$sql.= "FROM llx_element_contact as t, llx_c_type_contact as c ";
		$sql.= "WHERE t.fk_c_type_contact = c.rowid AND c.libelle = 'Responsable suivi de la commande' AND t.element_id = $id LIMIT 1";

		//print "SQL => $sql\n\n";

        $result = $this->db->query($sql);
		
		if ($result)
        {
			//print("<pre>".print_r($result,true)."</pre>");
			
            $num = $this->db->num_rows($result);
            while ($i < $num)
            {
                $obj = $this->db->fetch_object($result);
				$obj_ret[] = $obj;
                $i++;
            }
			
			return $obj_ret[0];
        }
        else {
            return [];
        }
	}
	#endregion
	
	
	/*################################################################################################################################*/
	/*#############################################  Gestion Api Expedition  #########################################################*/
	#region Gestion Api Expedition
	
	
	/**
     * List shipments
     *
     * Get a list of shipments
     *
     * @param string	       $sortfield	        Sort field
     * @param string	       $sortorder	        Sort order
     * @param int		       $limit		        Limit for list
     * @param int		       $page		        Page number
     * @param string   	       $thirdparty_ids	    Thirdparty ids to filter shipments of (example '1' or '1,2,3') {@pattern /^[0-9,]*$/i}
     * @param string           $sqlfilters          Other criteria to filter answers separated by a comma. Syntax example "(t.ref:like:'SO-%') and (t.date_creation:<:'20160101')"
     * @return  array                               Array of shipment objects
     *
     * @throws RestException
	 *
	 * 	@url	GET shipment/list
     */
    public function indexShipment($sortfield = "t.rowid", $sortorder = 'ASC', $limit = 100, $page = 0, $thirdparty_ids = '', $sqlfilters = '')
    {
        global $db, $conf;

        $obj_ret = array();

        // case of external user, $thirdparty_ids param is ignored and replaced by user's socid
        $socids = DolibarrApiAccess::$user->socid ? DolibarrApiAccess::$user->socid : $thirdparty_ids;

        // If the internal user must only see his customers, force searching by him
        $search_sale = 0;
        if (!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) $search_sale = DolibarrApiAccess::$user->id;

        $sql = "SELECT t.rowid";
        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= ", sc.fk_soc, sc.fk_user"; // We need these fields in order to filter by sale (including the case where the user can only see his prospects)
        $sql .= " FROM ".MAIN_DB_PREFIX."expedition as t";

        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= ", ".MAIN_DB_PREFIX."societe_commerciaux as sc"; // We need this table joined to the select in order to filter by sale

        $sql .= ' WHERE t.entity IN ('.getEntity('expedition').')';
        if ((!DolibarrApiAccess::$user->rights->societe->client->voir && !$socids) || $search_sale > 0) $sql .= " AND t.fk_soc = sc.fk_soc";
        if ($socids) $sql .= " AND t.fk_soc IN (".$socids.")";
        if ($search_sale > 0) $sql .= " AND t.rowid = sc.fk_soc"; // Join for the needed table to filter by sale
        // Insert sale filter
        if ($search_sale > 0)
        {
            $sql .= " AND sc.fk_user = ".$search_sale;
        }
        // Add sql filters
        if ($sqlfilters)
        {
            if (!DolibarrApi::_checkFilters($sqlfilters))
            {
                throw new RestException(503, 'Error when validating parameter sqlfilters '.$sqlfilters);
            }
            $regexstring = '\(([^:\'\(\)]+:[^:\'\(\)]+:[^:\(\)]+)\)';
            $sql .= " AND (".preg_replace_callback('/'.$regexstring.'/', 'DolibarrApi::_forge_criteria_callback', $sqlfilters).")";
        }

        $sql .= $db->order($sortfield, $sortorder);
        if ($limit) {
            if ($page < 0)
            {
                $page = 0;
            }
            $offset = $limit * $page;

            $sql .= $db->plimit($limit + 1, $offset);
        }
		
		//print "SQL $sql";
		//die();

        dol_syslog("API Rest request");
        $result = $db->query($sql);

        if ($result)
        {
            $num = $db->num_rows($result);
            $min = min($num, ($limit <= 0 ? $num : $limit));
            $i = 0;
            while ($i < $min)
            {
                $obj = $db->fetch_object($result);
                $shipment_static = new Expedition($db);
                if ($shipment_static->fetch($obj->rowid)) {
                    $obj_ret[] = $this->_cleanObjectDatas($shipment_static);
                }
                $i++;
            }
        }
        else {
            throw new RestException(503, 'Error when retrieve commande list : '.$db->lasterror());
        }
        if (!count($obj_ret)) {
            throw new RestException(404, 'No shipment found');
        }
        return $obj_ret;
    }

    /**
     * Create shipment object
     *
     * @param   array   $request_data   Request data
     * @return  int     ID of shipment
	 *
	 * 	@url	POST shipment/create
     */
    public function postShipment($request_data = null)
    {
        if (!DolibarrApiAccess::$user->rights->expedition->creer) {
            throw new RestException(401, "Insuffisant rights");
        }

         
		//print("<pre>".print_r($user,true)."</pre>");
		//print("<pre>".print_r(DolibarrApiAccess::$user,true)."</pre>");
		//die();

	
		global $conf, $hookmanager;

		$now = dol_now();
		$user = DolibarrApiAccess::$user;

		//require_once DOL_DOCUMENT_ROOT.'product/stock/class/mouvementstock.class.php';
		$error = 0;

		// Clean parameters
		$request_data["brouillon"] = 1;
		$request_data["tracking_number"] = dol_sanitizeFileName($request_data["tracking_number"]);
		if (empty($request_data["fk_project"])) $request_data["fk_project"] = 0;


		$this->db->begin();

		$sql = "INSERT INTO llx_expedition (ref, entity, ref_customer, ref_int, ref_ext, date_creation, fk_user_author, date_expedition, date_delivery, fk_soc, fk_projet, ";
		$sql .= "fk_address, fk_shipping_method, tracking_number, weight, size, width, height, weight_units, size_units, note_private, note_public, model_pdf, fk_incoterms, ";
		$sql .= "location_incoterms) VALUES (";
		$sql .= "'(PROV)'";
		$sql .= ", ".$conf->entity;
		$sql .= ", ".($request_data["ref_customer"] ? "'".$this->db->escape($request_data["ref_customer"])."'" : "null");
		$sql .= ", ".($request_data["ref_int"] ? "'".$this->db->escape($request_data["ref_int"])."'" : "null");
		$sql .= ", ".($request_data["ref_ext"] ? "'".$this->db->escape($request_data["ref_ext"])."'" : "null");
		$sql .= ", '".$this->db->idate($now)."'";
		$sql .= ", ".$user->id;
		$sql .= ", ".($request_data["date_expedition"] > 0 ? "'".$this->db->idate($request_data["date_expedition"])."'" : "null");
		$sql .= ", ".($request_data["date_delivery"] > 0 ? "'".$this->db->idate($request_data["date_delivery"])."'" : "null");
		$sql .= ", ".$request_data["socid"];
		$sql .= ", ".$request_data["fk_project"];
		$sql .= ", ".($request_data["fk_delivery_address"] > 0 ? $request_data["fk_delivery_address"] : "null");
		$sql .= ", ".($request_data["shipping_method_id"] > 0 ? $request_data["shipping_method_id"] : "null");
		$sql .= ", '".$this->db->escape($request_data["tracking_number"])."'";
		$sql .= ", ".$request_data["weight"];
		$sql .= ", ".$request_data["sizeS"];
		$sql .= ", ".$request_data["sizeW"];
		$sql .= ", ".$request_data["sizeH"];
		$sql .= ", ".($request_data["weight_units"] != '' ? (int) $request_data["weight_units"] : 'NULL');
		$sql .= ", ".($request_data["size_units"] != '' ? (int) $request_data["size_units"] : 'NULL');
		$sql .= ", ".(!empty($request_data["note_private"]) ? "'".$this->db->escape($request_data["note_private"])."'" : "null");
		$sql .= ", ".(!empty($request_data["note_public"]) ? "'".$this->db->escape($request_data["note_public"])."'" : "null");
		$sql .= ", ".(!empty($request_data["model_pdf"]) ? "'".$this->db->escape($request_data["model_pdf"])."'" : "null");
		$sql .= ", ".(int) $request_data["fk_incoterms"];
		$sql .= ", '".$this->db->escape($request_data["location_incoterms"])."'";
		$sql .= ")";

		$resql = $this->db->query($sql);
		if ($resql)
		{
			$inserted_shipment_id = $this->db->last_insert_id("llx_expedition");
 
			$sql = "UPDATE llx_expedition";
			$sql .= " SET ref = '(PROV".$inserted_shipment_id.")'";
			$sql .= " WHERE rowid = ".$inserted_shipment_id;
			
			$shipment_update = $this->db->query($sql);
			if(!$shipment_update){
				$error_ = $this->db->lasterror()." - sql=$sql";
				$this->db->rollback();
				return array(
					"code"=> -4,
					"error"=> "Could not update shipment ref, ".$error_
				);
			}
			
			// Link shipment element to order element
			$sql = "INSERT INTO llx_element_element (rowid, fk_source, sourcetype, fk_target, targettype) VALUES (NULL, ".$request_data["origin_id"].", 'commande', ".$inserted_shipment_id.", 'shipping')";
			$shipment_link = $this->db->query($sql);
			
			if(!$shipment_link){
				$error_ = $this->db->lasterror()." - sql=$sql";
				$this->db->rollback();
				return array(
					"code"=> -5,
					"error"=> "Could not link shipment to order, ".$error_
				);
			}

			if ($shipment_update && $shipment_link)
			{		
				// Insert of lines
				$num = count($request_data["lines"]);
				for ($i = 0; $i < $num; $i++)
				{
					$expeditionline["fk_expedition"] = $inserted_shipment_id;
					$expeditionline["entrepot_id"] = $request_data["lines"][$i]["entrepot_id"];
					$expeditionline["fk_origin_line"] = $request_data["lines"][$i]["origin_line_id"];
					$expeditionline["qty"] = $request_data["lines"][$i]["qty"];
					$expeditionline["rang"] = $request_data["lines"][$i]["rang"];
					$expeditionline["array_options"] = $request_data["lines"][$i]["array_options"];
					
					
					//print("<pre>".print_r($request_data["lines"][0],true)."</pre>");
					//print("<pre>".print_r($request_data["lines"][0]["entrepot_id"],true)."</pre>");
					//print("<pre>".print_r($expeditionline,true)."</pre>");
					//die();
						
					if (!isset($request_data["lines"][$i]["detail_batch"]))
					{	
						// no batch management
						if(!$this->insert_shipment_line($user, $expeditionline)["code"] > 0)
						{
							$error++;
						}
					}
					else
					{	
						//print("<pre>".print_r($this->insert_shipment_line($user, $expeditionline),true)."</pre>");
						//die();
						
						$res = $this->insert_shipment_line($user, $expeditionline);
						if(!$res["code"] > 0)
						{
							$error++;
						}
						
						for ($y = 0; $y < count($request_data["lines"][$i]["detail_batch"]); $y++)
						{
							$request_data["lines"][$i]["detail_batch"][$y]["fk_expeditiondet"] = $res["code"];
						}
						
						// with batch management
						$res = $this->create_shipment_line_batch($request_data["lines"][$i]["detail_batch"]);
						if (!$res["code"] > 0)
						{
							$error++;
						}
					}
				}


				if (!$error)
				{
					/*
					// Call trigger
					$result = $this->call_trigger('SHIPPING_CREATE', $user);
					if ($result < 0) { $error++; }
					// End call triggers
					*/

					if (!$error)
					{
						$this->db->commit();
						return $inserted_shipment_id;
					}
					else
					{
						$error_ = $this->db->lasterror()." - sql=$sql";
						$this->db->rollback();
						return array(
							"code"=> -1 * $error,
							"error"=> $error_
						);
					}
				}
				else
				{
					$error_ = $this->db->lasterror()." - sql=$sql";
					$this->db->rollback();
					return array(
						"code"=> -3,
						"error"=> $error_
					);
				}
			}
			else
			{
				$error_ = $this->db->lasterror()." - sql=$sql";
				$this->db->rollback();
				return array(
					"code"=> -2,
					"error"=> $error_
				);
			}
		}
		else
		{
			$error_ = $this->db->lasterror()." - sql=$sql";
			$this->db->rollback();
			return array(
				"code"=> -1,
				"error"=> $error_
			);
		}

    }
	
	
	/**
	 *	Insert line into database
	 *
	 *	@param      User	$user			User that modify
	 *	@param      int		$notrigger		1 = disable triggers
	 *	@return     int						<0 if KO, line id >0 if OK
	 */
	private function insert_shipment_line($user, $obj, $notrigger = 0)
	{
		global $langs, $conf;

		$error_shipment_line = 0;
		

		// Check parameters
		if (empty($obj["fk_expedition"]))
		{
			return array("code"=> -1, "error"=> 'ErrorMandatoryParametersNotProvided : fk_expedition');
		}
		if (empty($obj["entrepot_id"]))
		{
			return array("code"=> -1, "error"=> 'ErrorMandatoryParametersNotProvided : entrepot_id');
		}
		if (empty($obj["fk_origin_line"]))
		{
			return array("code"=> -1, "error"=> 'ErrorMandatoryParametersNotProvided : fk_origin_line');
		}
		if (empty($obj["qty"]))
		{
			return array("code"=> -1, "error"=> 'ErrorMandatoryParametersNotProvided : qty');
		}
		if (empty($obj["rang"]))
		{
			return array("code"=> -1, "error"=> 'ErrorMandatoryParametersNotProvided : rang');
		}
		if ($obj["rang"] <=-1)
		{
			return array("code"=> -1, "error"=> 'rang can not be negative!');
		}
		
		

		$this->db->begin();

		$sql = "INSERT INTO llx_expeditiondet (";
		$sql .= "fk_expedition";
		$sql .= ", fk_entrepot";
		$sql .= ", fk_origin_line";
		$sql .= ", qty";
		$sql .= ", rang";
		$sql .= ") VALUES (";
		$sql .= $obj["fk_expedition"];
		$sql .= ", ".(empty($obj["entrepot_id"]) ? 'NULL' : $obj["entrepot_id"]);
		$sql .= ", ".$obj["fk_origin_line"];
		$sql .= ", ".$obj["qty"];
		$sql .= ", ".$obj["rang"];
		$sql .= ")";

		$resql = $this->db->query($sql);
		if ($resql)
		{
			$last_insert_expeditiondet_id = $this->db->last_insert_id("llx_expeditiondet");

			/*
			if (!$error && !$notrigger)
			{
				// Call trigger
				$result = $this->call_trigger('LINESHIPPING_INSERT', $user);
				if ($result < 0)
				{
					$error_shipment_line++;
				}
				// End call triggers
			}
			*/

			if (!$error_shipment_line) {
				$this->db->commit();
				return array(
					"code"=> $last_insert_expeditiondet_id,
					"Sucess"=> "inserted"
				);
			}

			$this->db->rollback();
			return array(
				"code"=> -1,
				"error"=> "Could not insert"
			);
		}
		else
		{
			return array(
				"code"=> -2,
				"error"=> "Could not insert shipment line. Error in sql!\n\r sql=$sql"
			);
		}
	}
	
	
	/**
	 * Create expedition line batch
	 *
	 * @param 	object		$object_batch		full line informations
	 * @return	int							<0 if KO, >0 if OK
	 */
	private function create_shipment_line_batch($object_batch)
	{
		global $langs, $conf;
		
		//print("<pre>".print_r($object_batch,true)."</pre>");
		//die();

		$error_msg_array = array();
		$error_shipment_line_batch = 0;
		
		
		for($z=0; $z<count($object_batch); $z++)
		{
			// Check parameters
			if (empty($object_batch[$z]["fk_expeditiondet"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => fk_expeditiondet");
			}
			if (empty($object_batch[$z]["sellby"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => sellby");
			}
			if (empty($object_batch[$z]["eatby"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => eatby");
			}
			if (empty($object_batch[$z]["batch"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => batch");
			}
			if (empty($object_batch[$z]["qty"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => qty");
			}
			if (empty($object_batch[$z]["fk_origin_stock"]))
			{
				return array("code"=> -1, "error"=> "ErrorMandatoryParametersNotProvided : [".$z."] => fk_origin_stock");
			}
			
			$id_line_expdet = (int) $object_batch[$z]["fk_expeditiondet"];

			$sql = "INSERT INTO llx_expeditiondet_batch (";
			$sql .= "fk_expeditiondet";
			$sql .= ", sellby";
			$sql .= ", eatby";
			$sql .= ", batch";
			$sql .= ", qty";
			$sql .= ", fk_origin_stock";
			$sql .= ") VALUES (";
			$sql .= $id_line_expdet.",";
			$sql .= " ".(!isset($object_batch[$z]["sellby"]) || dol_strlen($object_batch[$z]["sellby"]) == 0 ? 'NULL' : ("'".$this->db->idate($object_batch[$z]["sellby"]))."'").",";
			$sql .= " ".(!isset($object_batch[$z]["eatby"]) || dol_strlen($object_batch[$z]["eatby"]) == 0 ? 'NULL' : ("'".$this->db->idate($object_batch[$z]["eatby"]))."'").",";
			$sql .= " ".(!isset($object_batch[$z]["batch"]) ? 'NULL' : ("'".$this->db->escape($object_batch[$z]["batch"])."'")).",";
			$sql .= " ".(!isset($object_batch[$z]["qty"]) ? ((!isset($object_batch[$z]["dluo_qty"])) ? 'NULL' : $object_batch[$z]["dluo_qty"]) : $object_batch[$z]["qty"]).","; // dluo_qty deprecated, use qty
			$sql .= " ".(!isset($object_batch[$z]["fk_origin_stock"]) ? 'NULL' : $object_batch[$z]["fk_origin_stock"]);
			$sql .= ")";
			
			$resql = $this->db->query($sql);
			if (!$resql) 
			{ 
				$error_shipment_line_batch++; 
				$error_msg_array[$z] = "- ".($z+1)." Error ".$this->db->lasterror(); 
			}
			
		}

		if (!$error_shipment_line_batch)
		{
            $inserted_shipment_line_batch = $this->db->last_insert_id("llx_expeditiondet_batch");
			return array(
				"code"=> $inserted_shipment_line_batch,
				"success"=> "All ".count($object_batch)." shipment lines(s) inserted!"
			);
		}
		else
		{
			$this->db->rollback();
			return array(
				"code"=> -1 * $error_shipment_line_batch,
				"error"=> "Error from ".count($object_batch)." sql execution(s): \n\r".$error_msg
			);
		}
		
		return 1;
	}
	
	
	/**
     * Delete a line to given shipment
     *
     *
     * @param int   $id             Id of shipment to update
     * @param int   $lineid         Id of line to delete
     *
     * @url	DELETE shipment/{id}/lines/{lineid}
     *
     * @return int
     *
     * @throws RestException 401
     * @throws RestException 404
     */
    public function deleteLineShipment($id, $lineid)
    {
        if (!DolibarrApiAccess::$user->rights->expedition->creer) {
            throw new RestException(401);
        }

        $result = $this->shipment->fetch($id);
        if (!$result) {
            throw new RestException(404, 'Shipment not found');
        }

        if (!DolibarrApi::_checkAccessToResource('expedition', $this->shipment->id)) {
            throw new RestException(401, 'Access not allowed for login '.DolibarrApiAccess::$user->login);
        }

        // TODO Check the lineid $lineid is a line of ojbect

        $request_data = (object) $request_data;
        $updateRes = $this->shipment->deleteline(DolibarrApiAccess::$user, $lineid);
        if ($updateRes > 0) {
            return $this->get($id);
        }
        else
        {
            throw new RestException(405, $this->shipment->error);
        }
    }

    /**
     * Update shipment general fields (won't touch lines of shipment)
     *
     * @param int   $id             Id of shipment to update
     * @param array $request_data   Datas
     *
     * @return int
	 *
	 * @url	PUT shipment/{id}/update
     */
    public function putShipment($id, $request_data = null)
    {
        if (!DolibarrApiAccess::$user->rights->expedition->creer) {
            throw new RestException(401);
        }

        $result = $this->shipment->fetch($id);
        if (!$result) {
            throw new RestException(404, 'Shipment not found');
        }

        if (!DolibarrApi::_checkAccessToResource('expedition', $this->shipment->id)) {
            throw new RestException(401, 'Access not allowed for login '.DolibarrApiAccess::$user->login);
        }
        foreach ($request_data as $field => $value) {
            if ($field == 'id') continue;
            $this->shipment->$field = $value;
        }

        if ($this->shipment->update(DolibarrApiAccess::$user) > 0)
        {
            return $this->get($id);
        }
        else
        {
            throw new RestException(500, $this->shipment->error);
        }
    }

    /**
     * Delete shipment
     *
     * @param   int     $id         Shipment ID
     *
	 *	@url DELETE    shipment/{id}
	 *	
     * @return  array
     */
    public function deleteShipment($id)
    {
    	if (!DolibarrApiAccess::$user->rights->expedition->supprimer) {
            throw new RestException(401);
        }
        $result = $this->shipment->fetch($id);
        if (!$result) {
            throw new RestException(404, 'Shipment not found');
        }

        if (!DolibarrApi::_checkAccessToResource('expedition', $this->shipment->id)) {
            throw new RestException(401, 'Access not allowed for login '.DolibarrApiAccess::$user->login);
        }

        if (!$this->shipment->delete(DolibarrApiAccess::$user)) {
            throw new RestException(500, 'Error when deleting shipment : '.$this->shipment->error);
        }

        return array(
            'success' => array(
                'code' => 200,
                'message' => 'Shipment deleted'
            )
        );
    }

    /**
     * Validate a shipment
     *
     * This may record stock movements if module stock is enabled and option to
     * decrease stock on shipment is on.
     *
     * @param   int $id             Shipment ID
     * @param   int $notrigger      1=Does not execute triggers, 0= execute triggers
     *
     * @url POST    shipment/{id}/validate
     *
     * @return  array
     * \todo An error 403 is returned if the request has an empty body.
     * Error message: "Forbidden: Content type `text/plain` is not supported."
     * Workaround: send this in the body
     * {
     *   "notrigger": 0
     * }
     */
    public function validateShipment($id, $notrigger = 0)
    {
        if (!DolibarrApiAccess::$user->rights->expedition->creer) {
            throw new RestException(401);
        }
        $result = $this->shipment->fetch($id);
        if (!$result) {
            throw new RestException(404, 'Shipment not found');
        }

        if (!DolibarrApi::_checkAccessToResource('expedition', $this->shipment->id)) {
            throw new RestException(401, 'Access not allowed for login '.DolibarrApiAccess::$user->login);
        }

        $result = $this->shipment->valid(DolibarrApiAccess::$user, $notrigger);
        if ($result == 0) {
            throw new RestException(304, 'Error nothing done. May be object is already validated');
        }
        if ($result < 0) {
            throw new RestException(500, 'Error when validating Shipment: '.$this->shipment->error);
        }
        $result = $this->shipment->fetch($id);
        if (!$result) {
            throw new RestException(404, 'Shipment not found');
        }

        if (!DolibarrApi::_checkAccessToResource('expedition', $this->shipment->id)) {
            throw new RestException(401, 'Access not allowed for login '.DolibarrApiAccess::$user->login);
        }

        $this->shipment->fetchObjectLinked();
        return $this->_cleanObjectDatas($this->shipment);
    }
	
	
	/**
     * Get Shipments by origin id
     *
     * @param string	       $origin_id	        Shipment order id
     * @return  array 
     *
     * @url	GET shipment/order/{origin_id}
     */
	public function shipmentOfOrders($origin_id){
		
		// Check parameters
		if (empty($origin_id)){
			return -1;
		}
		
		global $conf;
		
		$obj_ret = null;
		
		$sql = "SELECT e.rowid, e.ref, e.fk_soc as socid, e.date_creation, e.ref_customer, e.ref_ext, e.ref_int, e.fk_user_author, e.fk_statut, e.fk_projet as fk_project, e.billed, ";
		$sql.= "e.date_valid, e.weight, e.weight_units, e.size, e.size_units, e.width, e.height, ";
		$sql.= "e.date_expedition as date_expedition, e.model_pdf, e.fk_address, e.date_delivery, ";
		$sql.= "e.fk_shipping_method, e.tracking_number, e.note_private, e.note_public, ";
		$sql.= "e.fk_incoterms, e.location_incoterms, i.libelle as label_incoterms, ";
		$sql.= "s.libelle as shipping_method, el.fk_source as origin_id, el.sourcetype as origin ";
		$sql.= "FROM llx_expedition as e ";
		$sql.= "LEFT JOIN llx_element_element as el ON el.fk_target = e.rowid AND el.targettype = 'shipping' ";
		$sql.= "LEFT JOIN llx_c_incoterms as i ON e.fk_incoterms = i.rowid ";
		$sql.= "LEFT JOIN llx_c_shipment_mode as s ON e.fk_shipping_method = s.rowid ";
		$sql.= "WHERE e.entity IN (1) AND el.fk_source=$origin_id";
		
		$result = $this->db->query($sql);
		if ($result)
		{
			if ($this->db->num_rows($result))
			{
				$index=0;
				$obj_ret = array();
				
				while($row = $this->db->fetch_array($sql)){
					//print("<pre>".print_r($row,true)."</pre>");
					
					$obj_ret[$index]["rowid"] 				= $row["rowid"];
					$obj_ret[$index]["ref"] 				= $row["ref"];
					$obj_ret[$index]["socid"] 				= $row["socid"];
					$obj_ret[$index]["date_creation"] 		= $row["date_creation"];
					$obj_ret[$index]["ref_customer"] 		= $row["ref_customer"];
					$obj_ret[$index]["ref_ext"] 			= $row["ref_ext"];
					$obj_ret[$index]["ref_int"] 			= $row["ref_int"];
					$obj_ret[$index]["fk_user_author"] 		= $row["fk_user_author"];
					$obj_ret[$index]["fk_statut"] 			= $row["fk_statut"];
					$obj_ret[$index]["fk_project"] 			= $row["fk_project"];
					$obj_ret[$index]["billed"] 				= $row["billed"];
					$obj_ret[$index]["date_valid"] 			= $row["date_valid"];
					$obj_ret[$index]["weight"] 				= $row["weight"];
					$obj_ret[$index]["weight_units"] 		= $row["weight_units"];
					$obj_ret[$index]["size"] 				= $row["size"];
					$obj_ret[$index]["size_units"] 			= $row["size_units"];
					$obj_ret[$index]["width"] 				= $row["width"];
					$obj_ret[$index]["height"] 				= $row["height"];
					$obj_ret[$index]["date_expedition"] 	= $row["date_expedition"];
					$obj_ret[$index]["model_pdf"] 			= $row["model_pdf"];
					$obj_ret[$index]["fk_address"] 			= $row["fk_address"];
					$obj_ret[$index]["date_delivery"] 		= $row["date_delivery"];
					$obj_ret[$index]["fk_shipping_method"] 	= $row["fk_shipping_method"];
					$obj_ret[$index]["tracking_number"] 	= $row["tracking_number"];
					$obj_ret[$index]["note_private"] 		= $row["note_private"];
					$obj_ret[$index]["note_public"] 		= $row["note_public"];
					$obj_ret[$index]["fk_incoterms"] 		= $row["fk_incoterms"];
					$obj_ret[$index]["location_incoterms"] 	= $row["location_incoterms"];
					$obj_ret[$index]["label_incoterms"] 	= $row["label_incoterms"];
					$obj_ret[$index]["shipping_method"] 	= $row["shipping_method"];
					$obj_ret[$index]["origin_id"] 			= $row["origin_id"];
					$obj_ret[$index]["origin"] 				= $row["origin"];
					
					// Get lines
					$sql_ = "SELECT cd.rowid, cd.fk_product, cd.label as custom_label, cd.description, cd.qty as qty_asked, cd.product_type";
					$sql_.= ", cd.total_ht, cd.total_localtax1, cd.total_localtax2, cd.total_ttc, cd.total_tva";
					$sql_.= ", cd.vat_src_code, cd.tva_tx, cd.localtax1_tx, cd.localtax2_tx, cd.localtax1_type, cd.localtax2_type, cd.info_bits, cd.price, cd.subprice, cd.remise_percent,cd.buy_price_ht as pa_ht";
					$sql_.= ", cd.fk_multicurrency, cd.multicurrency_code, cd.multicurrency_subprice, cd.multicurrency_total_ht, cd.multicurrency_total_tva, cd.multicurrency_total_ttc, cd.rang";
					$sql_.= ", ed.rowid as line_id, ed.qty as qty_shipped, ed.fk_origin_line, ed.fk_entrepot";
					$sql_.= ", p.ref as product_ref, p.label as product_label, p.fk_product_type";
					$sql_.= ", p.weight, p.weight_units, p.length, p.length_units, p.surface, p.surface_units, p.volume, p.volume_units, p.tobatch as product_tobatch";
					$sql_.= " FROM llx_expeditiondet as ed, llx_commandedet as cd";
					$sql_.= " LEFT JOIN llx_product as p ON p.rowid = cd.fk_product";
					$sql_.= " WHERE ed.fk_expedition = ".$row["rowid"];
					$sql_.= " AND ed.fk_origin_line = cd.rowid";
					$sql_.= " ORDER BY cd.rang, ed.fk_origin_line";
					
					//print("<pre>".print_r($sql_,true)."</pre>");
					//die();
					
					$res = $this->db->query($sql_);
					if($this->db->num_rows($res) > 0){
						
						$lines = array();
						$tmp_lines_batch = array();
						$index_=0;
						while($row_ = $this->db->fetch_array($sql_)){ 
							
							$lines[$index_]["rowid"] 			= $row_["line_id"];
							$lines[$index_]["origin_line_id"]	= $row_["fk_origin_line"];
							$lines[$index_]["fk_expedition"] 	= $row["rowid"];
							$lines[$index_]["entrepot_id"] 		= $row_["fk_entrepot"];
							$lines[$index_]["qty_asked"] 		= $row_["qty_asked"];
							$lines[$index_]["qty_shipped"] 		= $row_["qty_shipped"];
							$lines[$index_]["rang"] 			= $row_["rang"];
							
							$ii["index"] = $index_;
							$ii["rowid"] = $lines[$index_]["rowid"];
							$tmp_lines_batch[] = $ii;
							
							//print("<pre>".print_r($lines,true)."</pre>");
							
							$index_++;
						}
						
						
						
						// check and get detail_batch
						$myIndex = 0;
						$cpt = count($tmp_lines_batch);
						while($myIndex < $cpt){
							$sql__ = "SELECT rowid, fk_expeditiondet, eatby, sellby, batch, qty, fk_origin_stock";
							$sql__.= " FROM llx_expeditiondet_batch";
							$sql__.= " WHERE fk_expeditiondet = ".$tmp_lines_batch[$myIndex]["rowid"];
							
							$res__ = $this->db->query($sql__);
							if($this->db->num_rows($res__) > 0){
								
								while($row__ = $this->db->fetch_array($sql__)){
									
									$detail_batch["rowid"] 			= $row__["rowid"];
									$detail_batch["fk_expeditiondet"] = $row__["fk_expeditiondet"];
									$detail_batch["eatby"] 			= $row__["eatby"];
									$detail_batch["sellby"] 			= $row__["sellby"];
									$detail_batch["batch"] 			= $row__["batch"];
									$detail_batch["qty"] 				= $row__["qty"];
									$detail_batch["fk_origin_stock"] 	= $row__["fk_origin_stock"];
									
									$lines[$tmp_lines_batch[$myIndex]["index"]]["detail_batch"][] = $detail_batch;
								}
							}
							$myIndex++;
						}
						
						
						$obj_ret[$index]["lines"] = $lines;
					}else{
						
						$obj_ret[$index]["lines"] = [];
					}
					
					
					$index++;
				}
				
				return array(
					'success' => array(
						'code' => 200,
						'message' => "Delivery for order id '$origin_id' found, with ".($index)." Delivery/Deliveries)",
						'data' => $obj_ret
					)
				);
			}
			else
			{
				return array(
					'error' => array(
						'code' => 404,
						'message' => "Delivery for order id '$origin_id' not found",
						'data' => $obj_ret
					)
				);
			}
		}
		else
		{
			return array(
				'error' => array(
					'code' => 500,
					'message' => $this->db->error(),
					'data' => $obj_ret
				)
			);
		}
	}
	
	
	
	/**
     * Get Shipments by origin id
     *
     * @param string	       $origin_id	        Shipment order id
     * @return  array 
     *
     */
	private function shipmentOfOrders_v2($origin_id){
		
		// Check parameters
		if (empty($origin_id)){
			return -1;
		}
		
		global $conf;
		
		$obj_ret = null;
		
		$sql = "SELECT e.rowid, e.ref, e.fk_soc as socid, e.date_creation, e.ref_customer, e.ref_ext, e.ref_int, e.fk_user_author, e.fk_statut, e.fk_projet as fk_project, e.billed, ";
		$sql.= "e.date_valid, e.weight, e.weight_units, e.size, e.size_units, e.width, e.height, ";
		$sql.= "e.date_expedition as date_expedition, e.model_pdf, e.fk_address, e.date_delivery, ";
		$sql.= "e.fk_shipping_method, e.tracking_number, e.note_private, e.note_public, ";
		$sql.= "e.fk_incoterms, e.location_incoterms, i.libelle as label_incoterms, ";
		$sql.= "s.libelle as shipping_method, el.fk_source as origin_id, el.sourcetype as origin ";
		$sql.= "FROM llx_expedition as e ";
		$sql.= "LEFT JOIN llx_element_element as el ON el.fk_target = e.rowid AND el.targettype = 'shipping' ";
		$sql.= "LEFT JOIN llx_c_incoterms as i ON e.fk_incoterms = i.rowid ";
		$sql.= "LEFT JOIN llx_c_shipment_mode as s ON e.fk_shipping_method = s.rowid ";
		$sql.= "WHERE e.entity IN (1) AND el.fk_source=$origin_id";
		
		$result = $this->db->query($sql);
		if ($result)
		{
			if ($this->db->num_rows($result))
			{
				$index=0;
				$obj_ret = array();
				
				while($row = $this->db->fetch_array($sql)){
					//print("<pre>".print_r($row,true)."</pre>");
					
					$obj_ret[$index]["rowid"] 				= $row["rowid"];
					$obj_ret[$index]["ref"] 				= $row["ref"];
					$obj_ret[$index]["socid"] 				= $row["socid"];
					$obj_ret[$index]["date_creation"] 		= $row["date_creation"];
					$obj_ret[$index]["ref_customer"] 		= $row["ref_customer"];
					$obj_ret[$index]["ref_ext"] 			= $row["ref_ext"];
					$obj_ret[$index]["ref_int"] 			= $row["ref_int"];
					$obj_ret[$index]["fk_user_author"] 		= $row["fk_user_author"];
					$obj_ret[$index]["fk_statut"] 			= $row["fk_statut"];
					$obj_ret[$index]["fk_project"] 			= $row["fk_project"];
					$obj_ret[$index]["billed"] 				= $row["billed"];
					$obj_ret[$index]["date_valid"] 			= $row["date_valid"];
					$obj_ret[$index]["weight"] 				= $row["weight"];
					$obj_ret[$index]["weight_units"] 		= $row["weight_units"];
					$obj_ret[$index]["size"] 				= $row["size"];
					$obj_ret[$index]["size_units"] 			= $row["size_units"];
					$obj_ret[$index]["width"] 				= $row["width"];
					$obj_ret[$index]["height"] 				= $row["height"];
					$obj_ret[$index]["date_expedition"] 	= $row["date_expedition"];
					$obj_ret[$index]["model_pdf"] 			= $row["model_pdf"];
					$obj_ret[$index]["fk_address"] 			= $row["fk_address"];
					$obj_ret[$index]["date_delivery"] 		= $row["date_delivery"];
					$obj_ret[$index]["fk_shipping_method"] 	= $row["fk_shipping_method"];
					$obj_ret[$index]["tracking_number"] 	= $row["tracking_number"];
					$obj_ret[$index]["note_private"] 		= $row["note_private"];
					$obj_ret[$index]["note_public"] 		= $row["note_public"];
					$obj_ret[$index]["fk_incoterms"] 		= $row["fk_incoterms"];
					$obj_ret[$index]["location_incoterms"] 	= $row["location_incoterms"];
					$obj_ret[$index]["label_incoterms"] 	= $row["label_incoterms"];
					$obj_ret[$index]["shipping_method"] 	= $row["shipping_method"];
					$obj_ret[$index]["origin_id"] 			= $row["origin_id"];
					$obj_ret[$index]["origin"] 				= $row["origin"];
					
					// Get lines
					$sql_ = "SELECT cd.rowid, cd.fk_product, cd.label as custom_label, cd.description, cd.qty as qty_asked, cd.product_type";
					$sql_.= ", cd.total_ht, cd.total_localtax1, cd.total_localtax2, cd.total_ttc, cd.total_tva";
					$sql_.= ", cd.vat_src_code, cd.tva_tx, cd.localtax1_tx, cd.localtax2_tx, cd.localtax1_type, cd.localtax2_type, cd.info_bits, cd.price, cd.subprice, cd.remise_percent,cd.buy_price_ht as pa_ht";
					$sql_.= ", cd.fk_multicurrency, cd.multicurrency_code, cd.multicurrency_subprice, cd.multicurrency_total_ht, cd.multicurrency_total_tva, cd.multicurrency_total_ttc, cd.rang";
					$sql_.= ", ed.rowid as line_id, ed.qty as qty_shipped, ed.fk_origin_line, ed.fk_entrepot";
					$sql_.= ", p.ref as product_ref, p.label as product_label, p.fk_product_type";
					$sql_.= ", p.weight, p.weight_units, p.length, p.length_units, p.surface, p.surface_units, p.volume, p.volume_units, p.tobatch as product_tobatch";
					$sql_.= " FROM llx_expeditiondet as ed, llx_commandedet as cd";
					$sql_.= " LEFT JOIN llx_product as p ON p.rowid = cd.fk_product";
					$sql_.= " WHERE ed.fk_expedition = ".$row["rowid"];
					$sql_.= " AND ed.fk_origin_line = cd.rowid";
					$sql_.= " ORDER BY cd.rang, ed.fk_origin_line";
					
					$res = $this->db->query($sql_);
					if($this->db->num_rows($res)){
						
						$lines = array();
						$index_=0;
						while($row_ = $this->db->fetch_array($sql_)){ 
							
							$lines[$index_]["rowid"] 		= $row_["line_id"];
							$lines[$index_]["origin_line_id"]= $row_["fk_origin_line"];
							$lines[$index_]["fk_expedition"] = $row["rowid"];
							$lines[$index_]["entrepot_id"] 	= $row_["fk_entrepot"];
							$lines[$index_]["qty_asked"] 	= $row_["qty_asked"];
							$lines[$index_]["qty_shipped"] 	= $row_["qty_shipped"];
							$lines[$index_]["rang"] 			= $row_["rang"];
							
							//print("<pre>".print_r($lines,true)."</pre>");
							
							$index_++;
						}
						
						$obj_ret[$index]["lines"] = $lines;
					}else{
						
						$obj_ret[$index]["lines"] = [];
					}
					
					// Get shipment lines
					//$obj_ret[$index]["lines"] = $this->getShipmentLines($row["rowid"]);
					
					$index++;
				}
				
				return $obj_ret;
			}
		}
		
		return $obj_ret;
	}
	
	
	#endregion
	
	
	/**
	 * Clean sensible object datas
	 *
	 * @param   object  $object    Object to clean
	 * @return    array    Array of cleaned object properties
	 */
	protected function _cleanObjectDatasCompany($object)
    {
        // phpcs:enable
		$object = parent::_cleanObjectDatasCompany($object);

		unset($object->nom); // ->name already defined and nom deprecated
		unset($object->name_bis); // ->name_alias already defined
		unset($object->note); // ->note_private and note_public already defined
		unset($object->departement);
		unset($object->departement_code);
		unset($object->pays);
		unset($object->particulier);
		unset($object->prefix_comm);

		unset($object->commercial_id); // This property is used in create/update only. It does not exists in read mode because there is several sales representatives.

		unset($object->total_ht);
		unset($object->total_tva);
		unset($object->total_localtax1);
		unset($object->total_localtax2);
		unset($object->total_ttc);

		unset($object->lines);
		unset($object->thirdparty);

		unset($object->fk_delivery_address); // deprecated feature

		return $object;
	}
	
	

    // phpcs:disable PEAR.NamingConventions.ValidFunctionName.PublicUnderscore
    /**
     * Clean sensible object datas
     *
     * @param   object  $object    Object to clean
     * @return    array    Array of cleaned object properties
     */
    protected function _cleanObjectDatas($object)
    {
        // phpcs:enable
    	$object = parent::_cleanObjectDatas($object);

    	unset($object->rowid);
    	unset($object->canvas);

    	/*unset($object->name);
    	unset($object->lastname);
    	unset($object->firstname);
    	unset($object->civility_id);
    	unset($object->statut);
    	unset($object->state);
    	unset($object->state_id);
    	unset($object->state_code);
    	unset($object->region);
    	unset($object->region_code);
    	unset($object->country);
    	unset($object->country_id);
    	unset($object->country_code);
    	unset($object->barcode_type);
    	unset($object->barcode_type_code);
    	unset($object->barcode_type_label);
    	unset($object->barcode_type_coder);
    	unset($object->total_ht);
    	unset($object->total_tva);
    	unset($object->total_localtax1);
    	unset($object->total_localtax2);
    	unset($object->total_ttc);
    	unset($object->fk_account);
    	unset($object->comments);
    	unset($object->note);
    	unset($object->mode_reglement_id);
    	unset($object->cond_reglement_id);
    	unset($object->cond_reglement);
    	unset($object->shipping_method_id);
    	unset($object->fk_incoterms);
    	unset($object->label_incoterms);
    	unset($object->location_incoterms);
		*/

    	// If object has lines, remove $db property
    	if (isset($object->lines) && is_array($object->lines) && count($object->lines) > 0)  {
    		$nboflines = count($object->lines);
    		for ($i=0; $i < $nboflines; $i++)
    		{
    			$this->_cleanObjectDatas($object->lines[$i]);

    			unset($object->lines[$i]->lines);
    			unset($object->lines[$i]->note);
    		}
    	}

        return $object;
    }

    /**
     * Validate fields before create or update object
     *
     * @param	array		$data   Array of data to validate
     * @return	array
     *
     * @throws	RestException
     */
    private function _validate($data)
    {
        $authentification = array();
        foreach ($this->authentification->fields as $field => $propfield) {
            if (in_array($field, array('rowid', 'entity', 'date_creation', 'tms', 'fk_user_creat')) || $propfield['notnull'] != 1) continue;   // Not a mandatory field
            if (!isset($data[$field]))
                throw new RestException(400, "$field field missing");
            $authentification[$field] = $data[$field];
        }
        return $authentification;
    }
}
