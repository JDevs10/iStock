import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import ShipmentsManager from '../Database/ShipmentsManager';
import ShipmentsLinesManager from '../Database/ShipmentLinesManager';
import CheckConnections from '../services/CheckConnections';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';

const LIMIT = "20"; //Limite of orders in each page
const DEFAULT_SETTINGS = new DefaultSettings();


class FindShipments extends Component {
  constructor(props) {
    super(props);
  }


  async getAllShipmentsFromServer(token){

    //check for internet connection
    const conn = new CheckConnections();
    if(await conn.CheckConnectivity_noNotification()){
      console.log('CheckConnectivity_noNotification ', 'true');
    }
    else{
      console.log('CheckConnectivity_noNotification ', 'false');
      return false;
    }

    // Limit of Shipments downloaded
    const settingsManager = new SettingsManager();
    await settingsManager.initDB();
    const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
      return val;
    });

    if(settings == null){
      return false;
    }
    const sqlfilters = DEFAULT_SETTINGS.get_Shipments_Bigger_than_date_from_value(settings.limitOrdersDownload);

    if(sqlfilters == null){
      return false;
    }
    // END Limit of Shipments downloaded

    const shipmentsManager = new ShipmentsManager();
    await shipmentsManager.initDB();
    await shipmentsManager.CREATE_SHIPMENTS_TABLE();

    const shipmentsLinesManager = new ShipmentsLinesManager();
    await shipmentsLinesManager.initDB();
    await shipmentsLinesManager.CREATE_SHIPMENT_LINES_TABLE();

    // return true;
    
    console.log('shipmentsManager', 'ShipmentsManager()');
    console.log('token', token);
    
    let i_ = 0;
    let ind = 0;

    return await new Promise(async (resolve)=> {
      while(i_ < 600){
        const url_v1 = `${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`;
        const url_v2 = `${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&sqlfilters=${sqlfilters}&DOLAPIKEY=${token.token}`;
        console.log(url_v2);

        await axios.get(url_v2, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log(response.data);

                const res_1 = await shipmentsManager.INSERT_SHIPMENTS(response.data);
                console.log('res_1 : ', res_1);

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

  }

  async getShipmentByOriginId(token, origin_id){

  }

}

export default FindShipments;