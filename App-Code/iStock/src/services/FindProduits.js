//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ProductsManager from '../Database/ProductsManager';
import ProductsLotDlcDluoManager from '../Database/ProductsLotDlcDluoManager';
import CheckConnections from '../services/CheckConnections';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';

const LIMIT = "50";
const DEFAULT_SETTINGS = new DefaultSettings();

// create a component
class FindProduits extends Component {
    constructor(props) {
        super(props);
    }
    
    async getAllProductsFromServer(token){
        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
          console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
          console.log('CheckConnectivity_noNotification ', 'false');
          return false;
        }
      
        const productsManager = new ProductsManager();
        await productsManager.initDB();
        await productsManager.CREATE_PRODUCT_TABLE();

        const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
        await productsLotDlcDluoManager.initDB();
        await productsLotDlcDluoManager.CREATE_ProductsLotDlcDluo_TABLE();
    
        console.log('productsManager', 'getAllProductsFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;
    
        return await new Promise(async (resolve)=> {
          while(i_ < 600){
            console.log(`${token.server}/api/index.php/istockapi/products?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&DOLAPIKEY=${token.token}`);
            await axios.get(`${token.server}/api/index.php/istockapi/products?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
                    console.log('Status == 200');
                    //console.log(response.data);
    
                    const res = await productsManager.INSERT_PRODUCT_L(response.data);
                    if(res){
                      i_++;
                      console.log('next request....');
                    }
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

    async getAllLatestProductsFromServer(token){
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
      const sqlfilters_obj = DEFAULT_SETTINGS.get_product_update_limit_by_days(settings.limitProductsUpdate);

      if(sqlfilters_obj == null){
        return false;
      }
      // END Limit of Products update
      
      const productsManager = new ProductsManager();
      await productsManager.initDB();

      const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
      await productsLotDlcDluoManager.initDB();

      let ind = 0;

      return await new Promise(async (resolve)=> {
        const ITEM_LIMIT = sqlfilters_obj.limit;
        const PAGE_LIMIT_CONFIG = 30;
        const CAL = ITEM_LIMIT / PAGE_LIMIT_CONFIG;
        const PAGE_LIMIT = (CAL > 0 ? (Number.isInteger(CAL) ? CAL : Math.round(CAL)+1 ) : 0);
        let PAGE = 0;

        while(PAGE < PAGE_LIMIT){
          const url = `${token.server}/api/index.php/istockapi/products?sortfield=t.tms&sortorder=DESC&limit=${ITEM_LIMIT}&page=${PAGE}`;
          console.log(`${url}&DOLAPIKEY=${token.token}`);
          
          await axios.get(`${url}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
            if(response.status == 200){
              console.log('Status == 200');

              for(let i=0; i<response.data.length; i++){
                const product_item =  response.data[i];

                //check if product exist with id from server
                const isProductExist = await productsManager.IS_PRODUCT_EXIST_BY_PRODUCT_ID(product_item.id);

                if(isProductExist == null && Object.keys(isProductExist).length == 0){
                  console.log('isProductExist == null');
                  await productsManager.INSERT_PRODUCT_L([product_item]);
                }
                else if(isProductExist != null && Object.keys(isProductExist).length > 0){
                  console.log('Object.keys(isProductExist).length > 0');
                  await productsManager.UPDATE_PRODUCT_BY_PRODUCT_ID([product_item]);
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
export default FindProduits;
