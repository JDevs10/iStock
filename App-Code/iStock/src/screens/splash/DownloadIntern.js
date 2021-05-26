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


class DownloadIntern extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingNotify: '...',
      loadingNotify_2: '',
    };
  }

  async componentDidMount() {
    writeInitLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name);

    changeKeepAwake(true);

    // check all data
    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Initialisation...'
      });
    }, 3000);

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Get token from db...");
    
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
      writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Unknown token...");

      setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'ERREUR TOKEN unknown....\nFermeture....'
        });
      }, 5000);
      changeKeepAwake(false);
      
      writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.componentDidMount.name, "ERREUR TOKEN unknown.... Closing iStock....");
      
      BackHandler.exitApp(); 
      return;
    }


    const findPreSync = new FindPreSync();
    const sync_info = await findPreSync.sync(token).then(async (val) => {
      return await val;
    });

    if(!sync_info.status){
      changeKeepAwake(false);
      writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.componentDidMount.name, "Pre Sync data faild...");

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Start downloads...");

    
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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Orders..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Clients..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Products..."+currentStep+"/"+allSteps);

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
  
      writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Product image..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Orders..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Orders..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Warehouses..."+currentStep+"/"+allSteps);

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

    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Download Expeditions..."+currentStep+"/"+allSteps);

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
      writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.componentDidMount.name, "Navigate to dashbord");

      setTimeout(() => {
        this.props.navigation.navigate('Dashboard');
        return;
      }, 2500);
    } else {
      writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.componentDidMount.name, "BDC server is not reachable, so exist app...");

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
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders.name, "Download Orders...");

    const orderManager = new OrderManager();
    const orderLinesManager = new OrderLinesManager();
    await orderManager.initDB();
    await orderManager.CREATE_ORDER_TABLE();
    await orderLinesManager.initDB();
    await orderLinesManager.CREATE_ORDER_LINES_TABLE();
  
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
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders.name, "Url => "+url+"&DOLAPIKEY="+token.token);
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
  
                // if(res_header && res_line){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_contacts(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_contacts.name, "Download Orders Contacts...");

    const orderContactManager = new OrderContactManager();
    await orderContactManager.initDB();
    await orderContactManager.CREATE_ORDER_CONTACT_TABLE();
  
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
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_contacts.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await orderContactManager.INSERT_ORDER_CONTACT(response.data.success.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_contacts.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_contacts: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_contacts.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }

  
  async download_orders_clients(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_clients.name, "Download Orders Clients...");

    const thirdPartiesManager = new ThirdPartiesManager();
    await thirdPartiesManager.initDB();
    await thirdPartiesManager.CREATE_TPM_TABLE();
  
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
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_clients.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await thirdPartiesManager.INSERT_TPM(response.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_clients.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_clients: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_clients.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }

      await resolve(true);
    });
  }


  async download_orders_users(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_users.name, "Download Orders Users...");

    const userManager = new UserManager();
    await userManager.initDB();
    await userManager.CREATE_USER_TABLE();
  
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
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_users.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await userManager.INSERT_USER(response.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_users.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_users: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_users.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_products(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_products.name, "Download Orders Products...");

    const productsManager = new ProductsManager();
    const productsLotDlcDluoManager = new ProductsLotDlcDluoManager();
    await productsManager.initDB();
    await productsLotDlcDluoManager.initDB();
    await productsManager.CREATE_PRODUCT_TABLE();
    await productsLotDlcDluoManager.CREATE_ProductsLotDlcDluo_TABLE();
  
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
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_products.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await productsManager.INSERT_PRODUCT_L(response.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_products: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_products.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_warehouse(token, ids_list, isListFull = false) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_warehouse.name, "Download Orders Warehouses...");

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
    await warehouseManager.CREATE_WAREHOUSE_TABLE();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des Entrepots...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/warehouses?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_warehouse.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await warehouseManager.INSERT_WAREHOUSE(response.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_warehouse: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_warehouse.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }
      
      await resolve(true);
    });
  }


  async download_orders_shipments(token, ids_list) {
    writeLog(LOG_TYPE.INFO, DownloadIntern.name, this.download_orders_shipments.name, "Download Orders Shipments...");

    const shipmentsManager = new ShipmentsManager();
    await shipmentsManager.initDB();
    await shipmentsManager.CREATE_SHIPMENTS_TABLE();
    
    const shipmentsLinesManager = new ShipmentLinesManager();
    await shipmentsLinesManager.initDB();
    await shipmentsLinesManager.CREATE_SHIPMENT_LINES_TABLE();

    const shipmentLineDetailBatchManager = new ShipmentLineDetailBatchManager();
    await shipmentLineDetailBatchManager.initDB();
    await shipmentLineDetailBatchManager.CREATE_SHIPMENT_LINE_DETAIL_BATCH_TABLE();
  
    return await new Promise(async (resolve) => {

      if(ids_list != null && ids_list.length > 0){
        for(let x = 0; x < ids_list.length; x++){
          let current_id = ids_list[x];
  
          setTimeout(() => {
            this.setState({
              ...this.state,
              loadingNotify_2: 'Téléchargement des Expéditions...'+(x+1)+'/'+ids_list.length
            });
          }, 1000);
  
          const url = `${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=1&page=0&sqlfilters=(t.rowid:=:'${current_id}')`;
          writeLog(LOG_TYPE.URL, DownloadIntern.name, this.download_orders_shipments.name, "Url => "+url+"&DOLAPIKEY="+token.token);
          console.log(url);
          
          await axios.get(url, 
              { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
          .then(async (response) => {
              if(response.status == 200){
  
                const result = await shipmentsManager.INSERT_SHIPMENTS(response.data);
  
                // if(result){
                //   await resolve(true);
                // }else{
                //   await resolve(false);
                // }
  
              }else{
                console.log('Status != 200');
                writeLog(LOG_TYPE.WARNING, DownloadIntern.name, this.download_orders_shipments.name, "An error :=:> "+JSON.stringify(response.data));
                await resolve(false);
              }
  
          }).catch(async (error) => {
              // handle error
              console.log('Download => download_orders_shipments: ', error);
              writeLog(LOG_TYPE.ERROR, DownloadIntern.name, this.download_orders_shipments.name, "An error :=:> "+JSON.stringify(error));
              await resolve(false);
          });
        }
      }

      await resolve(true);
    });
  }

}


export default DownloadIntern;

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