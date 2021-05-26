import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import FindCommandeContacts from '../services/FindCommandeContacts';
import CheckConnections from '../services/CheckConnections';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';
import TokenManager from '../Database/TokenManager';
import OrderLinesManager from '../Database/OrderLinesManager';
import OrderContactManager from '../Database/OrderContactManager';
import WarehouseManager from '../Database/WarehouseManager';
import ProductsManager from '../Database/ProductsManager';
import ProductsLotDlcDluoManager from '../Database/ProductsLotDlcDluoManager';

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

  async updateOrderById(orderId){
    //check for internet connection
    const conn = new CheckConnections();
    if(await conn.CheckConnectivity_noNotification()){
      console.log('CheckConnectivity_noNotification ', 'true');
    }
    else{
      console.log('CheckConnectivity_noNotification ', 'false');
      return false;
    }

    
    const tokenManager = new TokenManager();
    await tokenManager.initDB();
    const token = await tokenManager.GET_TOKEN_BY_ID(1).then(async (val)=> {
      return val;
    });

    if(token == null){
      return false;
    }
    const sqlfilters = "(t.rowid:=:"+orderId+")";


    const orderManager = new OrderManager();
    await orderManager.initDB();

    const orderLinesManager = new OrderLinesManager();
    await orderLinesManager.initDB();

    const orderContactManager = new OrderContactManager();
    await orderContactManager.initDB();


    const url = `${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=DESC&limit=1&page=0&&sqlfilters=${sqlfilters}`;
    console.log(url);
    
    return await new Promise(async (resolve)=> {

      await axios.get(url, 
          { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
      .then(async (response) => {
          if(response.status == 200){

            //update order
            const res_1 = await orderManager.UPDATE_ORDER([response.data[0]]);

            //update order lines
            await orderLinesManager.DELETE_LINES_BY_ORDER_ID(orderId);
            const res_2 = await orderLinesManager.INSERT_ORDER_LINES(response.data[0].lines);

            //update order contact
            const res_3 = await new Promise(async (resolve) => {
              await axios.get(`${token.server}/api/index.php/istockapi/contact/order/${orderId}`,
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
              .then(async (response_2) => {

                if(response_2.status == 200){
                  const contact_item =  response_2.data;

                  //check if product exist with id from server
                  const isContactExist = await orderContactManager.IS_EXIST(contact_item.element_id);
    
                  if(isContactExist == null || Object.keys(isContactExist).length == 0){
                    console.log('isContactExist ', isContactExist);
                    await orderContactManager.INSERT_ORDER_CONTACT([contact_item]);
                  }
                  else if(isContactExist != null && Object.keys(isContactExist).length > 0){
                    console.log('Object.keys(isContactExist).length > 0');
                    await orderContactManager.UPDATE_CONTACT([contact_item]);
                  }

                  await resolve(true);
                }
                else{
                  await resolve(false);
                }

              }).catch(async (error) => {
                // handle error
                console.log('error order contact : ', error);
                await resolve(false);
              });
            });

            //update product from order
            const preWarehouseId = [];
            const res_4 = await new Promise(async (resolve) => {
              const productsManager = new ProductsManager();
              await productsManager.initDB();

              const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
              await productsLotDlcDluoManager.initDB();

              // push product id from order lines
              const ids_list = [];
              for(let i=0; i<response.data[0].lines.length; i++){
                ids_list.push(response.data[0].lines[i].fk_product);
              }
              
              if(ids_list != null && ids_list.length > 0){
                for(let x = 0; x < ids_list.length; x++){
                    let current_id = ids_list[x];
                    
                    const url = `${token.server}/api/index.php/istockapi/products?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
                    // writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_products.name, "Url => "+url+"&DOLAPIKEY="+token.token);
                    console.log(url);
                  
                    await axios.get(url, 
                        { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                    .then(async (response_2) => {
                        if(response_2.status == 200){
                            
                          //console.log("product response_2 : ", JSON.stringify(response_2.data));
    
                          for(let i=0; i<response_2.data.length; i++){
                              const product_item =  response_2.data[i];

                              // store for later
                              for(let LDDB=0; LDDB<product_item.Lot_DLC_DLUO_Batch.length; LDDB++){
                                preWarehouseId.push(product_item.Lot_DLC_DLUO_Batch[LDDB].fk_entrepot);
                              }
              
                              //check if product exist with id from server
                              const isProductExist = await productsManager.IS_PRODUCT_EXIST_BY_PRODUCT_ID(product_item.id);
                              console.log('isProductExist', isProductExist);

                              if(isProductExist == null || await Object.keys(isProductExist).length == 0){
                                console.log('isProductExist == null');
                                await productsManager.INSERT_PRODUCT_L([product_item]);
                              }
                              else if(isProductExist != null && await Object.keys(isProductExist).length > 0){
                                console.log('Object.keys(isProductExist).length > 0');
                                // console.log('Do nothing');
                                // await productsLotDlcDluoManager.DELETE_ProductsLotDlcDluo_FK_PRODUCT(product_item.id);
                                // await productsManager.DELETE_PRODUCT_BY_REF(product_item.ref);
                                // await productsManager.INSERT_PRODUCT_L([product_item]);
                                await productsManager.UPDATE_PRODUCT_BY_PRODUCT_ID([product_item]);
                              }
                          }
            
                        }else{
                          console.log('Status != 200');
                          // writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(response.data));
                          await resolve(false);
                        }
            
                    }).catch(async (error) => {
                      // handle error
                      console.log('Download => download_orders_products: ', error);
                      // writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(error));
                      await resolve(false);
                    });
                }
                await resolve(true);
              }

            });

            //update warehouse from order
            const res_5 = await new Promise(async (resolve) => {
              const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
              await productsLotDlcDluoManager.initDB();
              
              const ids_list = preWarehouseId;
              console.log("ids_list", ids_list);

              const warehouseManager = new WarehouseManager();
              await warehouseManager.initDB();

              if(ids_list != null && ids_list.length > 0){
      
                for(let x = 0; x < ids_list.length; x++){
                  let current_id = ids_list[x];
                  
                  // check if there is null
                  if(current_id == null ||current_id == "undefined"){
                    console.log('current_id == null');
                    console.log('skip current_id', (x+1));
                    continue;
                  }
          
                  const url = `${token.server}/api/index.php/warehouses?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
                  //writeLog(LOG_TYPE.URL, FindCommandes.name, this.download_orders_warehouse.name, "Url => "+url+"&DOLAPIKEY="+token.token);
                  console.log(url);
                  
                  await axios.get(url, { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } }).then(async (response_2) => {
                    if(response_2.status == 200){
        
                      for(let i=0; i<response_2.data.length; i++){
                        const warehouse_item =  response_2.data[i];
      
                        //check if product exist with id from server
                        const isWarehouseExist = await warehouseManager.IS_WAREHOUSE_EXIST_BY_ID(warehouse_item.id);
                        console.log('isWarehouseExist == ', isWarehouseExist);
      
                        if(isWarehouseExist == null && Object.keys(isWarehouseExist).length == 0){
                          console.log('isWarehouseExist == null');
                          await warehouseManager.INSERT_WAREHOUSE([warehouse_item]);
                        }
                        else if(isWarehouseExist != null && Object.keys(isWarehouseExist).length > 0){
                          console.log('Object.keys(isWarehouseExist).length > 0');
                          console.log('Do nothing');
                          await warehouseManager.UPDATE_WAREHOUSE_BY_ID([warehouse_item]);
                        }
                      }
        
                    }else{
                      console.log('Status != 200');
                      //writeLog(LOG_TYPE.WARNING, FindCommandes.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(response.data));
                      await resolve(false);
                    }
          
                  }).catch(async (error) => {
                      // handle error
                      console.log('Download => download_orders_warehouse: ', error);
                      // writeLog(LOG_TYPE.ERROR, FindCommandes.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(error));
                      await resolve(false);
                  });
                }
                await resolve(true);
              }
            });
            


            if(res_1 && res_2 && res_3 && res_4){
              await resolve(true);
            }else{
              await resolve(false);
            }
            
          }else{
            console.log('Status != 200');
            console.log(response.data);
            await resolve(false);
          }

      }).catch(async (error) => {
          // handle error
          console.log('error : ', error);
          await resolve(false);
      });

    });

  }

  async syncNewOrdersFromServer(token){
    const orderManager = new OrderManager
    const orderLinesManager = new OrderLinesManager
    await orderManager.initDB();
    await orderLinesManager.initDB();


    const findPreSync = new FindPreSync();
    const sync_info = await findPreSync.newSync(token).then(async (val) => {
      return await val;
    });


    if(!sync_info.status){
      changeKeepAwake(false);
      //writeLog(LOG_TYPE.ERROR, OrdersSync.name, this.sync_all.name, "Pre Sync data faild...");

      Alert.alert(
        "Fermeture iStock",
        "Le serveur Big Data Consulting n'est pas joignable... Error[xxx]",
        [
          { text: 'Ok', onPress: () => {
            this.setState({loadingNotify: "Fermeture...."});
            setTimeout(() => { 
              BackHandler.exitApp(); 
            }, 3000);
            } 
          },
        ],
        { cancelable: false }
      );
    }

    //writeLog(LOG_TYPE.INFO, OrdersSync.name, this.sync_all.name, "Start order downloads...");

    
  
    const res_orders = await new Promise(async (resolve) => {
      const ids_list = sync_info.res.orders;

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify: 'Téléchargement des Commandes...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          //writeLog(LOG_TYPE.URL, OrdersSync.name, this.sync_all.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const res_header = await orderManager.INSERT_ORDERS(response.data).then(async (val) => {
                  return val;
                });
                const res_line = await orderLinesManager.INSERT_ORDER_LINES(response.data[0].lines).then(async (val) => {
                  return val;
                });
  
              }else{
                console.log('Status != 200');
                //writeLog(LOG_TYPE.WARNING, OrdersSync.name, this.sync_all.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => sync_all: ', error);
              //writeLog(LOG_TYPE.ERROR, OrdersSync.name, this.sync_all.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });


    //writeLog(LOG_TYPE.INFO, OrdersSync.name, this.sync_all.name, "Download Orders Contacts...");

    const orderContactManager = new OrderContactManager();
    await orderContactManager.initDB();
  
    const res_orders_contacts = await new Promise(async (resolve) => {
      const ids_list = sync_info.res.orders_contacts;

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify: 'Téléchargement des contacts des commandes...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/istockapi/order/contacts/list?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          //writeLog(LOG_TYPE.URL, OrdersSync.name, this.sync_all.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await orderContactManager.INSERT_ORDER_CONTACT(response.data.success.data);
  
              }else{
                console.log('Status != 200');
                //writeLog(LOG_TYPE.WARNING, OrdersSync.name, this.sync_all.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => sync_all: ', error);
              //writeLog(LOG_TYPE.ERROR, OrdersSync.name, this.sync_all.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      changeKeepAwake(false);
      await resolve(true);
    });

  }
}

export default FindCommandes;