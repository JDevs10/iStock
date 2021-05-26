//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import UserManager from '../Database/UserManager';
import CheckConnections from '../services/CheckConnections';
import DefaultSettings from '../utilities/DefaultSettings';
import SettingsManager from '../Database/SettingsManager';

const DEFAULT_SETTINGS = new DefaultSettings();

// create a component
class FindUsers extends Component {
    constructor(props) {
        super(props);
    }

    async getAllUsersFromServer(token){
      //check for internet connection
      const conn = new CheckConnections();
      if(await conn.CheckConnectivity_noNotification()){
        console.log('CheckConnectivity_noNotification ', 'true');
      }
      else{
        console.log('CheckConnectivity_noNotification ', 'false');
        return;
      }
      
        const userManager = new UserManager();
        await userManager.initDB();
        await userManager.CREATE_USER_TABLE();
    
        console.log('userManager', 'getAllUsersFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;
    
        return await new Promise(async (resolve)=> {
          while(i_ < 600){
            console.log(`${token.server}/api/index.php/users?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}&DOLAPIKEY=${token.token}`);
            await axios.get(`${token.server}/api/index.php/users?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
                    console.log('Status == 200');
                    //console.log(response.data);
    
                    const res = await userManager.INSERT_USER(response.data);
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

    async getAllLatestUsersFromServer(token){
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
      const sqlfilters_obj = DEFAULT_SETTINGS.get_objet_update_limit_by_days(settings.limitUsersUpdate);

      if(sqlfilters_obj == null){
        return false;
      }
      // END Limit of Products update
      
      const userManager = new UserManager();
      await userManager.initDB();

      let ind = 0;

      return await new Promise(async (resolve)=> {
        const ITEM_LIMIT = sqlfilters_obj.limit;
        const PAGE_LIMIT_CONFIG = 30;
        const CAL = ITEM_LIMIT / PAGE_LIMIT_CONFIG;
        const PAGE_LIMIT = (CAL > 0 ? (Number.isInteger(CAL) ? CAL : Math.round(CAL)+1 ) : 0);
        let PAGE = 0;

        while(PAGE < PAGE_LIMIT){
          const url = `${token.server}/api/index.php/users?sortfield=t.tms&sortorder=DESC&limit=${ITEM_LIMIT}&page=${PAGE}`;
          console.log(`${url}&DOLAPIKEY=${token.token}`);
          
          await axios.get(`${url}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
            if(response.status == 200){
              console.log('Status == 200');

              for(let i=0; i<response.data.length; i++){
                const user_item =  response.data[i];

                //check if product exist with id from server
                const isObjetExist = await userManager.IS_USER_EXIST_BY_USER_REF(user_item.ref);

                if(isObjetExist == null && Object.keys(isObjetExist).length == 0){
                  console.log('isObjetExist == null');
                  await userManager.INSERT_USER([user_item]);
                }
                else if(isObjetExist != null && Object.keys(isObjetExist).length > 0){
                  console.log('Object.keys(isObjetExist).length > 0');
                  await userManager.UPDATE_USER_BY_REF([user_item]);
                }
                
              }
              
              PAGE++;
              console.log('next request....');

            }else{
              console.log('Status != 200');
              // console.log(response.data);
            }
  
          }).catch(async (error) => {
            // handle error
            console.log('error : ', error);
            if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
              console.log('zzzzz');
              ind += 1;
              if (ind == 1) {
                PAGE = PAGE_LIMIT+10; // equals higher than the loop
                console.log('ind = ' + ind);
                return await resolve(true);
              }
              console.log('ind =! 1 :: ind => '+ind);
            }
            console.log('error.Error+"".indexOf("404") > -1 is different');
          });
        }

        await resolve(true);
      });

    }
}

//make this component available to the app
export default FindUsers;
