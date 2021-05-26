import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, StatusBar, AsyncStorage, Alert, BackHandler } from 'react-native';
import SettingsManager from '../../Database/SettingsManager';
import TokenManager from '../../Database/TokenManager';
import CheckData from '../../services/CheckData';
import CheckConnections from '../../services/CheckConnections';
import axios from 'axios';
import FindPreSync from '../../services/FindPreSync';
import OrderManager from '../../Database/OrderManager';
import OrderLinesManager from '../../Database/OrderLinesManager';
import OrderContactManager from '../../Database/OrderContactManager';
import ThirdPartiesManager from '../../Database/ThirdPartiesManager';
import UserManager from '../../Database/UserManager';
import ProductsManager from '../../Database/ProductsManager';
import FindImages from '../../services/FindImages';
import ProductsLotDlcDluoManager from '../../Database/ProductsLotDlcDluoManager';
import ShipmentsManager from '../../Database/ShipmentsManager';
import ShipmentLinesManager from '../../Database/ShipmentLinesManager';
import ShipmentLineDetailBatchManager from '../../Database/ShipmentLineDetailBatchManager';
import WarehouseManager from '../../Database/WarehouseManager';
import { changeKeepAwake } from '../../utilities/Utils';
import { STRINGS } from "../../utilities/STRINGS";
import DefaultSettings from '../../utilities/DefaultSettings';
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../../utilities/MyLogs';

const DEFAULT_SETTINGS = new DefaultSettings();
const BG = require('../../../img/waiting_bg.png');


class DownloadNew extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingNotify: '...',
      loadingNotify_2: '',
    };
  }

  async componentDidMount() {
    writeInitLog(LOG_TYPE.INFO, DownloadNew.name, this.componentDidMount.name);
    await this.sync();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      writeBackInitLog(LOG_TYPE.INFO, DownloadNew.name, this.componentDidMount.name);
      await this.sync();
      return;
    });
  }

  async sync(){
    writeInitLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name);

    changeKeepAwake(true);

    // check all data
    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Initialisation...'
      });
    }, 3000);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Get token from db...");
    
    // Get settings
    const sm = new SettingsManager();
    await sm.initDB();
    const settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
      return val;
    });

    //find token
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    if(token == null){
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Unknown token...");

      setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'ERREUR TOKEN unknown....\nFermeture....'
        });
      }, 5000);
      changeKeepAwake(false);
      
      writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.sync.name, "ERREUR TOKEN unknown.... Closing iStock....");
      
      BackHandler.exitApp(); 
      return;
    }


    const findPreSync = new FindPreSync();
    const sync_info = await findPreSync.newSync(token).then(async (val) => {
      return await val;
    });

    console.log("sync_info : ", JSON.stringify(sync_info));
    

    if(!sync_info.status){
      changeKeepAwake(false);
      writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.sync.name, "Pre Sync data faild...");

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

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Start downloads...");

    
    let currentStep = 1;
    let allSteps = 8;
    let currentDownloadItem = 1;
    let allDownloadItem = sync_info.Total_objs;
    const res = [];


    // Get all ids that need to be downloded
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Initialiser les Téléchargements...'
      });
    }, 500);
    
    
    // 1 // Get all users info from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Orders..."+currentStep+"/"+allSteps);

    const res1 = await this.download_orders_users(token, sync_info.res.users);

    res.push(res1);
    currentStep++;


    // 2 // Get all clients info from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Clients..."+currentStep+"/"+allSteps);

    const res2 = await this.download_orders_clients(token, sync_info.res.clients);

    res.push(res2);
    currentStep++;


    // 3 // Get all products from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Products..."+currentStep+"/"+allSteps);

    const res3 = await this.download_orders_products(token, sync_info.res.products);

    res.push(res3);
    currentStep++;


    // 4 // Get all product images from server
    if(settings.isUseImages){
      setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'Téléchargement des Produits image...'+currentStep+'/'+allSteps
        });
      }, 500);
  
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Product image..."+currentStep+"/"+allSteps);

      const findImages = new FindImages();
      const res4 = await findImages.getAllProductsImagesFromServer(token).then(async (val) => {
        console.log('findImages.getAllProductsImagesFromServer : ');
        console.log(val);
        return val;
      });
      res.push(res4);
    }else{
      console.log('findImages.getAllProductsImagesFromServer : no images downloaded.');
    }
    currentStep++;
    

    // 5 // Get all orders from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Orders..."+currentStep+"/"+allSteps);

    const res5 = await this.download_orders(token, sync_info.res.orders);

    res.push(res5);
    currentStep++;

    
    // 6 // Get all orders from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Orders..."+currentStep+"/"+allSteps);

    const res6 = await this.download_orders_contacts(token, sync_info.res.orders_contacts);

    res.push(res6);
    currentStep++;


    // 7 // Get all warehouse lines from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Warehouses..."+currentStep+"/"+allSteps);

    const res7 = await this.download_orders_warehouse(token, [], false);

    res.push(res7);
    currentStep++;
    

    // 8 // Get all shipments and shipment lines from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Etape téléchargements...'+currentStep+'/'+allSteps
      });
    }, 500);

    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Download Expeditions..."+currentStep+"/"+allSteps);

    const res8 = await this.download_orders_shipments(token, sync_info.res.shipments);

    res.push(res8);

    let res_ = true;
    for(let x = 0; x<res.length; x++){
      if(res[x] == false){ 
        res_ = false;
        break;
      }
    }

    changeKeepAwake(false);

   if(res_ == true){
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.sync.name, "Navigate to dashbord");

      setTimeout(() => {
        this.props.navigation.navigate('Dashboard');
        return;
      }, 2500);
    } else {
      writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.sync.name, "BDC server is not reachable, so exist app...");

      Alert.alert(
        "Fermeture iStock",
        "Le serveur Big Data Consulting n'est pas joignable...",
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
    
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image source={BG} style={styles.backdrop} />
        </View>
        <Image style={styles.logo} source={require('../../../img/Loading.gif')} />
        <Text style={styles.text}>{this.state.loadingNotify}</Text>
        <Text style={[styles.text, {paddingTop: 0}]}>{this.state.loadingNotify_2}</Text>
      </View>
    );
  }


  async download_orders(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders.name, "Download Orders...");

    const orderManager = new OrderManager();
    const orderLinesManager = new OrderLinesManager();
    await orderManager.initDB();
    await orderLinesManager.initDB();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des Commandes...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                for(let i=0; i<response.data.length; i++){
                    const order_item =  response.data[i];
    
                    //check if product exist with id from server
                    const isOrderExist = await orderManager.IS_ORDER_EXIST_BY_REF(order_item.ref);
    
                    if(isOrderExist == null || Object.keys(isOrderExist).length == 0){
                      console.log('isOrderExist == null');
                      await orderManager.INSERT_ORDERS([order_item]);
                      await orderLinesManager.INSERT_ORDER_LINES(response.data[0].lines);
                    }
                    else if(isOrderExist != null && Object.keys(isOrderExist).length > 0){
                      console.log('Object.keys(isOrderExist).length > 0');

                      const filterServerOrder = await this.filterServerOrderToLocalOrder(order_item);
                      const filterServerOrderLines = await this.filterServerOrderLinesTLocalOrderLines(order_item.lines);

                      // console.log("#############################################################");
                      // console.log("filterServerOrder", order_item);
                      // console.log("#############################################################");
                      // console.log("#############################################################");
                      // console.log("filterServerOrder", filterServerOrder);
                      // console.log("#############################################################");
                      // console.log("#############################################################");
                      // console.log("filterServerOrderLines", filterServerOrderLines);
                      // console.log("#############################################################");

                      await orderManager.UPDATE_ORDER([filterServerOrder]);
                      await orderLinesManager.UPDATE_ORDER_LINES(filterServerOrderLines);
                    }
                    
                }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_contacts(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_contacts.name, "Download Orders Contacts...");

    const orderContactManager = new OrderContactManager();
    await orderContactManager.initDB();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des contacts des commandes...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/istockapi/order/contacts/list?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_contacts.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){

                for(let i=0; i<response.data.success.data.length; i++){
                    const contact_item =  response.data.success.data[i];
    
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
                }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_contacts.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_contacts: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_contacts.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }

  
  async download_orders_clients(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_clients.name, "Download Orders Clients...");

    const thirdPartiesManager = new ThirdPartiesManager();
    await thirdPartiesManager.initDB();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des Clients...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/thirdparties?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_clients.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){

                for(let i=0; i<response.data.length; i++){
                    const tpm_item =  response.data[i];
    
                    //check if product exist with id from server
                    const isTPMExist = await thirdPartiesManager.IS_EXIST(tpm_item.ref);
    
                    if(isTPMExist == null || Object.keys(isTPMExist).length == 0){
                      console.log('isTPMExist == null');
                      await thirdPartiesManager.INSERT_TPM([tpm_item]);
                    }
                    else if(isTPMExist != null && Object.keys(isTPMExist).length > 0){
                      console.log('Object.keys(isTPMExist).length > 0');
                      await thirdPartiesManager.UPDATE_CLIENT([tpm_item]);
                    }
                }

  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_clients.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_clients: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_clients.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }

      await resolve(true);
    });
  }


  async download_orders_users(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_users.name, "Download Orders Users...");

    const userManager = new UserManager();
    await userManager.initDB();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des Utilisateurs...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/users?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_users.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                for(let i=0; i<response.data.length; i++){
                    const user_item =  response.data[i];
    
                    //check if product exist with id from server
                    const isObjetExist = await userManager.IS_USER_EXIST_BY_USER_REF(user_item.ref);
    
                    if(isObjetExist == null || Object.keys(isObjetExist).length == 0){
                      console.log('isObjetExist == null');
                      await userManager.INSERT_USER([user_item]);
                    }
                    else if(isObjetExist != null && Object.keys(isObjetExist).length > 0){
                      console.log('Object.keys(isObjetExist).length > 0');
                      await userManager.UPDATE_USER_BY_REF([user_item]);
                    }
                    
                  }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_users.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_users: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_users.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_products(token, ids_list) {
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_products.name, "Download Orders Products...");

      const productsManager = new ProductsManager();
      await productsManager.initDB();
    
      return await new Promise(async (resolve) => {

        if(ids_list != null && ids_list.length > 0){
          for(let x = 0; x < ids_list.length; x++){
              let current_id = ids_list[x];
      
              setTimeout(() => {
                  this.setState({
                  ...this.state,
                  loadingNotify_2: 'Téléchargement des Produits...'+(x+1)+'/'+ids_list.length
                  });
              }, 1000);
              
              const url = `${token.server}/api/index.php/istockapi/products?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
              writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_products.name, "Url => "+url+"&DOLAPIKEY="+token.token);
              console.log(url);
            
              await axios.get(url, 
                  { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
              .then(async (response) => {
                  if(response.status == 200){
                      
                      //console.log("product response : ", JSON.stringify(response.data));

                      for(let i=0; i<response.data.length; i++){
                          const product_item =  response.data[i];
          
                          //check if product exist with id from server
                          const isProductExist = await productsManager.IS_PRODUCT_EXIST_BY_PRODUCT_ID(product_item.id);
          
                          if(isProductExist == null || Object.keys(isProductExist).length == 0){
                              console.log('isProductExist == null');
                              await productsManager.INSERT_PRODUCT_L([product_item]);
                          }
                          else if(isProductExist != null && Object.keys(isProductExist).length > 0){
                              console.log('Object.keys(isProductExist).length > 0');
                              await productsManager.UPDATE_PRODUCT_BY_PRODUCT_ID([product_item]);
                          }
                      }
      
                  }else{
                      console.log('Status != 200');
                      writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(response.data));
                      await resolve(false);
                  }
      
              }).catch(async (error) => {
                  // handle error
                  console.log('Download => download_orders_products: ', error);
                  writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(error));
                  await resolve(false);
              });
          }
        }
        
      await resolve(true);
      });
  }


  async download_orders_warehouse(token, ids_list, isListFull = false) {
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_warehouse.name, "Download Orders Warehouses...");

      if(!isListFull){
        const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
        await productsLotDlcDluoManager.initDB();
        
        // get all warehouse id for lot
        const resw = await productsLotDlcDluoManager.GET_Warehouse_Ids_ProductsLotDlcDluo().then(async (val) => {
          return val;
        });

        const productsManager = new ProductsManager();
        await productsManager.initDB();
        const resww = await productsManager.GET_Warehouse_Ids().then(async (val) => {
          return val;
        });

        if(resww != null){
          for(let zz=0; zz<resw.length; zz++){
            for(let zz_=0; zz_<resww.length; zz_++){
              if(!resw.includes(resww[zz_].fk_default_warehouse)){
                resw.push(resww[zz_].fk_default_warehouse);
              }
            }
          }
        }
        ids_list = resw;

      }

      const warehouseManager = new WarehouseManager();
      await warehouseManager.initDB();
    
      return await new Promise(async (resolve) => {

        if(ids_list != null && ids_list.length > 0){

          let i_ = 0;
          let ind = 0;

          for(let x = 0; x < ids_list.length; x++){
            let current_id = ids_list[x];
            
            // check if there is null
            if(current_id == null ||current_id == "undefined"){
              console.log('current_id == null');
              console.log('skip current_id', (x+1));
              continue;
            }
    
            setTimeout(() => {
              this.setState({
                ...this.state,
                loadingNotify_2: 'Téléchargement des Entrepots...'+(x+1)+'/'+ids_list.length
              });
            }, 1000);
    
            const url = `${token.server}/api/index.php/warehouses?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
            writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_warehouse.name, "Url => "+url+"&DOLAPIKEY="+token.token);
            console.log(url);
            
            await axios.get(url, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
    
                  for(let i=0; i<response.data.length; i++){
                  const warehouse_item =  response.data[i];

                  //check if product exist with id from server
                  const isWarehouseExist = await warehouseManager.IS_WAREHOUSE_EXIST_BY_ID(warehouse_item.id);
                  console.log('isWarehouseExist == ', isWarehouseExist);

                  if(isWarehouseExist == null || Object.keys(isWarehouseExist).length == 0){
                    console.log('isWarehouseExist == null');
                    await warehouseManager.INSERT_WAREHOUSE([warehouse_item]);
                  }
                  else if(isWarehouseExist != null && Object.keys(isWarehouseExist).length > 0){
                    console.log('Object.keys(isWarehouseExist).length > 0');
                    await warehouseManager.UPDATE_WAREHOUSE_BY_ID([warehouse_item]);
                  }
                  
                }
    
                }else{
                  console.log('Status != 200');
                  writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(response.data));
                  await resolve(false);
                }
    
            }).catch(async (error) => {
                // handle error
                console.log('Download => download_orders_warehouse: ', error);
                // writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(error));
                // await resolve(false);

                if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
                  console.log('zzzzz');
                  ind += 1;
                  if (ind == 1) {
                    i_ = ids_list.length+10; // equals higher than the loop
                    console.log('ind = ' + ind);
                    await resolve(true);
                  }
                }
            });
          }
        }
        
        await resolve(true);
      });
  }


  async download_orders_shipments(token, ids_list) {
      writeLog(LOG_TYPE.INFO, DownloadNew.name, this.download_orders_shipments.name, "Download Orders Shipments...");

      const shipmentsManager = new ShipmentsManager();
      await shipmentsManager.initDB();
      
      const shipmentsLinesManager = new ShipmentLinesManager();
      await shipmentsLinesManager.initDB();

      const shipmentLineDetailBatchManager = new ShipmentLineDetailBatchManager();
      await shipmentLineDetailBatchManager.initDB();
    
      return await new Promise(async (resolve) => {

          if(ids_list != null && ids_list.length > 0){
              for(let x = 0; x < ids_list.length; x++){
                  let current_id = ids_list[x];

                  if(current_id == null || current_id == "null" || current_id == 'NULL'){
                    break;
                  }
      
                  setTimeout(() => {
                      this.setState({
                          ...this.state,
                          loadingNotify_2: 'Téléchargement des Expéditions...'+(x+1)+'/'+ids_list.length
                      });
                  }, 1000);
          
                  const url = `${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
                  writeLog(LOG_TYPE.URL, DownloadNew.name, this.download_orders_shipments.name, "Url => "+url+"&DOLAPIKEY="+token.token);
                  console.log(url);
                  
                  await axios.get(url, 
                      { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                  .then(async (response) => {
                      if(response.status == 200){
          
                          for(let i=0; i<response.data.length; i++){
                              const shipment_item =  response.data[i];
              
                              //check if product exist with id from server
                              const isObjetExist = await shipmentsManager.IS_SHIPMENT_EXIST_BY_REF(shipment_item.ref);
              
                              if(isObjetExist == null || Object.keys(isObjetExist).length == 0) {
                                  console.log('isObjetExist == null');

                                  console.log('Shipment Header', this.filterServerShipmentToLocalShipment(shipment_item));
                                  console.log('Shipment Lines', this.filterServerShipmentLinesTLocalShipmentLines(shipment_item.lines));

                                  await shipmentsManager.INSERT_SHIPMENTS([this.filterServerShipmentToLocalShipment(shipment_item)]);
                                  await shipmentsLinesManager.INSERT_SHIPMENT_LINES(this.filterServerShipmentLinesTLocalShipmentLines(shipment_item.lines));
                              }
                              else if(isObjetExist != null && Object.keys(isObjetExist).length > 0){
                                  console.log('Object.keys(isObjetExist).length > 0');
                                  // for now only redownload all shipments

                              //   for(let lineRowid = 0; lineRowid < shipment_item.lines.length; lineRowid++){
                              //     await shipmentLineDetailBatchManager.DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_EXPEDITIONDET(shipment_item.lines[lineRowid].rowid);
                              //   }
                              //   await shipmentsLinesManager.DELETE_SHIPMENT_LINES_BY_FK_EXPEDITION(shipment_item.fk_expedition);
                              //   await shipmentsManager.DELETE_SHIPMENT_BY_REF(shipment_item.ref);

                              //   await shipmentsManager.INSERT_SHIPMENTS([shipment_item]);
                              }
                          }

                      }else{
                          console.log('Status != 200');
                          writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_shipments.name, "An error :=:> "+JSON.stringify(response.data));
                          await resolve(false);
                      }
          
                  }).catch(async (error) => {
                      // handle error
                      console.log('Download => download_orders_shipments: ', error);
                      writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_shipments.name, "An error :=:> "+JSON.stringify(error));
                      await resolve(false);
                  });
              }
          }
          else{
            console.log('ids_list == null || ids_list.length == 0');
          }

          await resolve(true);
      });
  }

  // Mapping data
  // orders from server to local
  filterServerOrderToLocalOrder(data){
    return {
      socid: data.socid,
      ref_client: data.ref_client,
      statut: data.statut,
      brouillon: data.brouillon,
      date_creation: data.date_creation,
      date_commande: data.date_commande,
      date_livraison: data.date_livraison,
      user_author_id: data.user_author_id,
      user_valid: data.user_valid,
      id: data.id,
      ref_commande: data.ref,
      note_public: data.note_public,
      note_private: data.note_private,
      total_ht: data.total_ht,
      total_tva: data.total_tva,
      total_ttc: data.total_ttc,
      remise_absolue: data.remise_absolue,
      remise_percent: data.remise_percent,
      remise: data.remise
    };
  }

  // orders from server to local
  filterServerOrderLinesTLocalOrderLines(data){
    const ORDER_LINES = [];
      
    for(let i=0; i<data.length; i++){
      const line = data[i];

      ORDER_LINES.push({
        id: line.id,
        order_line_id: line.id,
        fk_commande: line.fk_commande,
        libelle: line.libelle,
        ref: line.ref,
        rang: line.rang,
        qty: line.qty,
        price: line.price,
        tva_tx: line.tva_tx,
        total_ht: line.total_ht,
        total_tva: line.total_tva,
        total_ttc: line.total_ttc
      });
    }

    return ORDER_LINES;
  }

  // shipment from server to local
  filterServerShipmentToLocalShipment(data){
      return {
          id: "null",
          shipment_id: data.id,
          ref: data.ref,
          project_id: "null",
          socid: data.socid,
          origin_id: data.origin_id,
          origin:"commande",
          entrepot_id: "null",
          projectid: "null",
          shipping_method_id: data.shipping_method_id,
          shipping_method: data.shipping_method, 
          user_author_id: data.user_author_id, // need current user token id
          origin_type: (data.origin_type == null ? "null" : data.origin_type),
          weight: (data.weight == null ? "0" : data.weight),
          weight_units: (data.weight_units == null ? "0" : ""+data.weight_units+""),
          size_w: (data.sizeW == null ? "0" : data.sizeW),
          width_units: (data.width_units == null ? "0" : ""+data.width_units+""),
          size_h: (data.sizeH == null ? "0" : data.sizeH),
          height_units: (data.height_units == null ? "0" : ""+data.height_units+""),
          size_s: (data.sizeS == null ? "0" : data.sizeS),
          depth_units: (data.depth_units == null ? "0" : ""+data.depth_units+""),
          true_size: data.true_size,
          date_creation: ""+data.date_creation+"", // get current timestamp in seconds
          date_delivery: (data.date_delivery == null ? "null" : ""+data.date_delivery+""),
          tracking_number: (data.tracking_number == null ? "" : data.tracking_number),
          tracking_url: (data.tracking_url == null ? "" : data.tracking_url),
          statut: data.statut, 
          is_synchro: "true", // 0 => false | 1 => true
      };
  }

// shipment lines from server to local
  async filterServerShipmentLinesTLocalShipmentLines(token, data){
      const SHIPMENT_LINES = [];
      
      for(let i=0; i<data.length; i++){
          const line = data[i];

          const newLine = {
              rang: line.rang,
              qty: line.qty, 
              entrepot_id: line.entrepot_id,
              fk_expedition: line.fk_expedition,
              origin_line_id: line.order_line_id,
              shipment_id: line.fk_expedition,
              id: line.id,
          };

          // get product Lot_DLC_DLUO_Batch on server using
          const fk_product_Lot_DLC_DLUO_Batch = await this.getLot_DLC_DLUO_Batch_by_Product_ID(token, line.fk_product).then(async (val) => {
              return val;
          });

          // detail_batch
          const newDetail_batch = [];
          if(line.detail_batch != null){
              for(let x=0; x<line.detail_batch.length; x++){
                  const detail_batch = line.detail_batch[x];

                  // get lot obj by checking fk_product_Lot_DLC_DLUO_Batch list with batch lot
                  const lot_DLC_DLUO_Batch = await fk_product_Lot_DLC_DLUO_Batch.find(element => element.batch === detail_batch.batch);
          
                  newDetail_batch.push({
                      fk_origin_stock: detail_batch.fk_origin_stock, 
                      stock: lot_DLC_DLUO_Batch.qty, 
                      fk_product: line.fk_product, 
                      qty: detail_batch.qty, 
                      batch: detail_batch.batch, 
                      sellby: detail_batch.sellby, 
                      eatby: detail_batch.eatby, 
                      entrepot_label: lot_DLC_DLUO_Batch.entrepot_label, 
                      entrepot_id: lot_DLC_DLUO_Batch.fk_entrepot, 
                      fk_expeditiondet: detail_batch.fk_expeditiondet, 
                      id: detail_batch.id 
                  });
              }
          }
          newLine.detail_batch = newDetail_batch;
          SHIPMENT_LINES.push(newLine);
      }
      
      return SHIPMENT_LINES;
  }

  async getLot_DLC_DLUO_Batch_by_Product_ID(token, productID){
      return await new Promise(async (resolve) => {
          const url = `${token.server}/api/index.php/istockapi/products?sortfield=t.ref&sortorder=ASC&limit=100&sqlfilters=(t.rowid:=:${productID})`;
          await axios.get(url, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){

                  await resolve(response.data[0].Lot_DLC_DLUO_Batch);

              }else{
                  console.log('Status != 200');
                  writeLog(LOG_TYPE.WARNING, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(response.data));
                  await resolve([]);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_products: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadNew.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(error));
              await resolve([]);
          });
      });
  }

}


export default DownloadNew;

const styles = StyleSheet.create({

  backgroundContainer: {
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  logo: {
    marginTop: 150,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    width: 450,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  text: {
    fontSize: 20,
    color: "#4A4AD4",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80
  }
});