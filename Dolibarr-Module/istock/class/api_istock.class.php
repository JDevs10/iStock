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

dol_include_once('/istock/class/authentification.class.php');
dol_include_once('/istock/class/configuration.class.php');
dol_include_once('/istock/class/evenement.class.php');



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
    }
	
	/*##########################################################################################################################*/
	/*#############################################  Gestion Api Login  ########################################################*/
    
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
	
	/*##########################################################################################################################*/
	/*########################################  Gestion Api Authentification  ##################################################*/

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
	
	
	/*##########################################################################################################################*/
	/*##########################################  Gestion Api Configuration  ###################################################*/
	
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
	
	
	/*##########################################################################################################################*/
	/*############################################  Gestion Api Evenement  #####################################################*/

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
	
	
	
	/*##########################################################################################################################*/
	/*############################################  Gestion Api Products  ######################################################*/
	
	
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
		
		$sql  = "SELECT stock.fk_entrepot, lot.batch, lot.fk_product, lot.eatby, lot.sellby, stock.reel ";
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
	
	
	/*##########################################################################################################################*/
	/*############################################  Gestion Api Order  #####################################################*/
	
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
	
	
	
	/*##############################################################################################################################*/
	/*############################################  Gestion Api Order_Contact  #####################################################*/
	
	
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
					$sql_.= " WHERE ed.fk_expedition = ".$id;
					$sql_.= " AND ed.fk_origin_line = cd.rowid";
					$sql_.= " ORDER BY cd.rang, ed.fk_origin_line";
					
					$res = $this->db->query($sql_);
					if($this->db->num_rows($res)){
						
						$lines = array();
						$index_=0;
						while($row_ = $this->db->fetch_array($sql_)){ 
							
							$lines[$index_]["rowid"] 		= $row_["line_id"];
							$lines[$index_]["origin_line_id"]= $row_["fk_origin_line"];
							$lines[$index_]["fk_expedition"] = $id;
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
				
				return array(
					'success' => array(
						'code' => 200,
						'message' => "Delivery for order id '$origin_id' found, with ".($index+1)." Delivery/Deliveries)",
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
     * Get Shipment Lines by shipment id
     *
     * @param string	       $id	        Shipment id
     * @return  array 
     *
     * @url	GET shipment/{id}/lines
     */
	public function getShipmentLines($id){
		/*
		// Check parameters
		if (empty($id)){
			return -1;
		}
		
		global $conf;
		
		$lines = null;
		
		$sql_ = "SELECT cd.rowid, cd.fk_product, cd.label as custom_label, cd.description, cd.qty as qty_asked, cd.product_type";
		$sql_.= ", cd.total_ht, cd.total_localtax1, cd.total_localtax2, cd.total_ttc, cd.total_tva";
		$sql_.= ", cd.vat_src_code, cd.tva_tx, cd.localtax1_tx, cd.localtax2_tx, cd.localtax1_type, cd.localtax2_type, cd.info_bits, cd.price, cd.subprice, cd.remise_percent,cd.buy_price_ht as pa_ht";
		$sql_.= ", cd.fk_multicurrency, cd.multicurrency_code, cd.multicurrency_subprice, cd.multicurrency_total_ht, cd.multicurrency_total_tva, cd.multicurrency_total_ttc, cd.rang";
		$sql_.= ", ed.rowid as line_id, ed.qty as qty_shipped, ed.fk_origin_line, ed.fk_entrepot";
		$sql_.= ", p.ref as product_ref, p.label as product_label, p.fk_product_type";
		$sql_.= ", p.weight, p.weight_units, p.length, p.length_units, p.surface, p.surface_units, p.volume, p.volume_units, p.tobatch as product_tobatch";
		$sql_.= " FROM llx_expeditiondet as ed, llx_commandedet as cd";
		$sql_.= " LEFT JOIN llx_product as p ON p.rowid = cd.fk_product";
		$sql_.= " WHERE ed.fk_expedition = ".$id;
		$sql_.= " AND ed.fk_origin_line = cd.rowid";
		$sql_.= " ORDER BY cd.rang, ed.fk_origin_line";
		
		$result_ = $this->db->query($sql_);
		if ($result_)
		{
			if ($this->db->num_rows($result_) > 0)
			{
				$index_=0;
				$lines = array();
				
				while($row_ = $this->db->fetch_array($sql_)){ 
					
					$lines[$index_]["rowid"] 		= $row_["line_id"];
					$lines[$index_]["origin_line_id"]= $row_["fk_origin_line"];
					$lines[$index_]["fk_expedition"] = $id;
					$lines[$index_]["entrepot_id"] 	= $row_["fk_entrepot"];
					$lines[$index_]["qty_asked"] 	= $row_["qty_asked"];
					$lines[$index_]["qty_shipped"] 	= $row_["qty_shipped"];
					$lines[$index_]["rang"] 			= $row_["rang"];
					
					//print("<pre>".print_r($lines,true)."</pre>");
					
					$index_++;
				}
				
				//print("<pre>".print_r($lines,true)."</pre>");
				return array('linnesss' => $lines);
			}
			else
			{
				return array('linnesss' => "nothing");
			}
		}
		else
		{
			return array(
				'error' => array(
					'code' => 500,
					'message' => $this->db->error(),
					'data' => $lines
				)
			);
		}
		*/
	}
	
	
	/*##########################################################################################################################*/


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
