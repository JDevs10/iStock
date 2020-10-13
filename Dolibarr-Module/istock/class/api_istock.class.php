<?php
/* Copyright (C) 2015   Jean-François Ferry     <jfefe@aternatik.fr>
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
     * @param   int     $id   Rvenement ID
     * @return  array
     *
     * @url	DELETE evenement/delete/{id}
     */
    public function evenementDelete($id)
    {
        if (! DolibarrApiAccess::$user->rights->istock->evenement->delete) {
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
