//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ThirdPartiesManager from '../Database/ThirdPartiesManager';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';

// create a component
class FindThirdPaties extends Component {
    constructor(props) {
        super(props);
    }

    async getAllThirdPartiesFromServer(token){
        const thirdPartiesManager = new ThirdPartiesManager();
        await thirdPartiesManager.initDB();
        await thirdPartiesManager.CREATE_TPM_TABLE();
    
        console.log('thirdPartiesManager', 'getAllThirdPartiesFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;
    
        return await new Promise(async (resolve)=> {
          while(i_ < 600){
            console.log(`${token.server}/api/index.php/thirdparties?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}&DOLAPIKEY=${token.token}`);
            await axios.get(`${token.server}/api/index.php/thirdparties?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
                    console.log('Status == 200');
                    //console.log(response.data);
    
                    const res = await thirdPartiesManager.INSERT_TPM(response.data);
                    if(res){
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

    async getLatestThirdPartiesFromServer(token){
      //check for internet connection
      const conn = new CheckConnections();
      if(await conn.CheckConnectivity_noNotification()){
        console.log('CheckConnectivity_noNotification ', 'true');
      }
      else{
        console.log('CheckConnectivity_noNotification ', 'false');
        return false;
      }

      // Limit of Products update
      const settingsManager = new SettingsManager();
      await settingsManager.initDB();

      const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
        return val;
      });

      if(settings == null){
        return false;
      }
      const sqlfilters_obj = DEFAULT_SETTINGS.get_objet_update_limit_by_days(settings.limitClientsUpdate);

      if(sqlfilters_obj == null){
        return false;
      }
      // END Limit of Products update
      
      const thirdPartiesManager = new ThirdPartiesManager();
      await thirdPartiesManager.initDB();

      let ind = 0;
  
      return await new Promise(async (resolve)=> {
        const ITEM_LIMIT = sqlfilters_obj.limit;
        const PAGE_LIMIT_CONFIG = 30;
        const CAL = ITEM_LIMIT / PAGE_LIMIT_CONFIG;
        const PAGE_LIMIT = (CAL > 0 ? (Number.isInteger(CAL) ? CAL : Math.round(CAL)+1 ) : 0);
        let PAGE = 0;

        while(PAGE < PAGE_LIMIT){
          const url = `${token.server}/api/index.php/thirdparties?sortfield=t.tms&sortorder=DESC&limit=${ITEM_LIMIT}&page=${PAGE}`;
          console.log(`${url}&DOLAPIKEY=${token.token}`);

          await axios.get(url, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
            if(response.status == 200){
              
              for(let i=0; i<response.data.length; i++){
                const item =  response.data[i];

                //check if product exist with id from server
                const isWarehouseExist = await thirdPartiesManager.IS_CLIENT_EXIST_BY_ID(item.ref);
                console.log('isWarehouseExist == ', isWarehouseExist);

                if(isWarehouseExist == null && Object.keys(isWarehouseExist).length == 0){
                  console.log('isWarehouseExist == null');
                  await thirdPartiesManager.INSERT_TPM([item]);
                }
                else if(isWarehouseExist != null && Object.keys(isWarehouseExist).length > 0){
                  console.log('Object.keys(isWarehouseExist).length > 0');
                  await thirdPartiesManager.UPDATE_CLIENT([item]);
                }
                
              }
              
              PAGE++;
              console.log('next request....');

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
                i_ = PAGE_LIMIT+10; // equals higher than the loop
                console.log('ind = ' + ind);
                await resolve(true);
              }
            }
          });
        }
        await resolve(true);
      });
  }
}

//make this component available to the app
export default FindThirdPaties;
