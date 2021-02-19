import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import FindCommandeContacts from '../services/FindCommandeContacts';
import CheckConnections from '../services/CheckConnections';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';

const LIMIT = "50"; //Limite of orders in each page
const DEFAULT_SETTINGS = new DefaultSettings();

class FindCommandes extends Component {
  constructor(props) {
    super(props);
  }


  async getAllOrdersFromServer(token){
    //check for internet connection
    const conn = new CheckConnections();
    if(await conn.CheckConnectivity_noNotification()){
      console.log('CheckConnectivity_noNotification ', 'true');
    }
    else{
      console.log('CheckConnectivity_noNotification ', 'false');
      return false;
    }

    // Limit of orders downloaded
    const settingsManager = new SettingsManager();
    await settingsManager.initDB();
    const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
      return val;
    });

    if(settings == null){
      return false;
    }
    const sqlfilters = DEFAULT_SETTINGS.get_Orders_Bigger_than_date_from_value(settings.limitOrdersDownload);

    if(sqlfilters == null){
      return false;
    }
    // END Limit of orders downloaded

    const orderManager = new OrderManager();
    await orderManager.initDB();
    await orderManager.CREATE_ORDER_TABLE();

    console.log('orderManager', 'getAllOrdersFromServer()');
    console.log('token', token);
    
    let i_ = 0;
    let ind = 0;

    const ORDER_PROMISE = await new Promise(async (resolve)=> {
      while(i_ < 600){
        const url_v1 = `${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`;
        const url_v2 = `${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&sqlfilters=${sqlfilters}`;
        console.log(url_v2);
        
        await axios.get(url_v2, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){

                const res_1 = await orderManager.INSERT_ORDERS(response.data);

                if(res_1){
                  i_++;
                  console.log('next request....');
                }
            }else{
                console.log('Status != 200');
                console.log(response.data);
            }

        }).catch(async (error) => {
            // handle error
            console.log('error : ', error);
            if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
              console.log('zzzzz');
              ind += 1;
              if (ind == 1) {
                i_ = 610; // equals higher than the loop
                console.log('ind = ' + ind);
                return await resolve(true);
              }
              console.log('ind =! 1 :: ind => '+ind);
            }
            console.log('error.Error+"".indexOf("404") > -1 is different');
        });
      }
    });


    if(ORDER_PROMISE){
      const findCommandeContacts = new FindCommandeContacts();
      const res = await findCommandeContacts.getAllContactsFromServer(token).then(async (val) => {
        return val;
      });

      if(res){
        return true;
      }else{
        return false;
      }
    }
    
  }

}

export default FindCommandes;