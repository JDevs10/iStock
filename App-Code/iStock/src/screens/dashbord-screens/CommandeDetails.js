//import liraries
import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Image, Dimensions, Linking, TouchableHighlight, PermissionsAndroid, Platform, Modal, Alert } from 'react-native';
import { Card, Button, Slider } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import NavbarOrdersLines from '../../navbar/navbar-orders-lines';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo from 'react-native-device-info';
import OrderDetailButton from './assets/OrderDetailButton';
import SettingsManager from '../../Database/SettingsManager';
import OrderLinesManager from '../../Database/OrderLinesManager';
import ShipmentsManager from '../../Database/ShipmentsManager';
import ShipmentLinesManager from '../../Database/ShipmentLinesManager';
import ShipmentLineDetailBatchManager from '../../Database/ShipmentLineDetailBatchManager';
import TokenManager from '../../Database/TokenManager';
import OrderLinesFilter from './assets/OrderLinesFilter';
import moment from "moment";
import Scanner from '../../utilities/Scanner';


// create a component
class CommandeDetails extends React.Component{
  
    constructor(props){
        super(props);
    
        /**
         * Returns true if the screen is in portrait mode
         */
        const isPortrait = () => {
          const dim = Dimensions.get('screen');
          return dim.height >= dim.width;
        };
    
        /**
        * Returns true of the screen is in landscape mode
        */
        const isLandscape = () => {
          const dim = Dimensions.get('screen');
          return dim.width >= dim.height;
        };
    
        this.state = {
          prepareMode: {saisi: true, barecode: false},
          isLoading: true,
          orderId: this.props.route.params.order.commande_id,
          data: [],
          settings: {},
          filterConfig: {},
          pickingDataSelected: {
            _opacity_: 1,
            pickingPickOption: 1,
            pickingMaxLimit: 0,
            pickingMimLimit: 0,
          },
          orientation: isPortrait() ? 'portrait' : 'landscape',
        };
        
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
          this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
          });
        });
    }

    async componentDidMount(){

      // this.setState({addRemoveNothing: 0});

      this.setState({data: []});
      await this._settings();
      await this._orderLinesData();

      this.listener = await this.props.navigation.addListener('focus', async () => {
        // Prevent default action
        this.setState({data: []});
        await this.setState({orderId: this.props.route.params.order.commande_id});

        await this._settings();
        await console.log('Done settings update!');
        console.log('new settings : ', this.state.settings);
        await this._orderLinesData();

        return;
      });
    }

    productDetails(value){
      this.props.navigation.navigate("ProductDetails", {product: value});
    }

    async prepareProduct(product){
      const cmd_header = this.props.route.params.order;
      
      console.log('prepareProduct :: ', JSON.stringify(product));

      if(product.qty == null){
        return;
      }

      const product_qty = parseInt(product.qty);

      console.log('prepareProduct product_qty :: ', JSON.stringify(product_qty));

      console.log('prepareProduct :: ', product_qty, product.prepare_shipping_qty);

      if(product_qty > 0 && product_qty != product.prepare_shipping_qty && product.stock != null && product.stock != "null" && product.stock > 0){

        const sldbm = new ShipmentLineDetailBatchManager();
        await sldbm.initDB();
        const selectedProductWarehouse = await sldbm.GET_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT(product.product_id).then(async (val) => {
          return val;
        });

        if(selectedProductWarehouse == null){
          //toast
          return;
        }

        product.selectedProductWarehouse = selectedProductWarehouse;

        console.log('prepareProduct Done: ', JSON.stringify(product));

        // return; 
        this.props.navigation.navigate("Picking", {
          isAlreadyShipmentSync: false, 
          cmd_header: {
            commande_id: cmd_header.commande_id, 
            socId: cmd_header.socId, 
            date_livraison: cmd_header.date_livraison
          }, 
          pickingDataSelected: {
            product: product, 
            _opacity_: 0, 
            pickingMaxLimit: product.qty, 
            pickingMimLimit: 0
          }
        });
        
      }
    }
    

    async _onPickingOk(product){
      // console.log("cmd : ", this.props.route.params.order);
      console.log("product : ", product);
      const cmd_header = this.props.route.params.order;

      // check if shipment obj exist in db
      const sm = new ShipmentsManager();
      await sm.initDB();
      const isShipment = await sm.GET_SHIPMENTS_BY_ORIGIN(cmd_header.commande_id).then(async (val) => {
        return val;
      });

      if(isShipment == null){
        // create shipment obj & array lines
        const SHIPMENT = {
          id: "null",
          shipment_id: "null",
          ref: "SH-PROV-"+moment(),
          project_id: "null",
          socid: cmd_header.socId,
          origin_id: cmd_header.commande_id,
          origin:"commande",
          entrepot_id: "null",
          projectid: "null",
          shipping_method_id: 2,
          shipping_method: "Génerict Transport", 
          user_author_id: 1, // need current user token id
          origin_type: (product.origin_type == null ? "null" : product.origin_type),
          weight: (product.weight == null ? "0" : product.weight),
          weight_units: (product.weight_units == null ? "0" : product.weight_units),
          size_w: (product.sizeW == null ? "0" : product.sizeW),
          width_units: (product.width_units == null ? "0" : product.width_units),
          size_h: (product.sizeH == null ? "0" : product.sizeH),
          height_units: (product.height_units == null ? "0" : product.height_units),
          size_s: (product.sizeS == null ? "0" : product.sizeS),
          depth_units: (product.depth_units == null ? "0" : product.depth_units),
          true_size: "xx",
          date_creation: parseInt(new Date().getTime()/1000), // get current timestamp in seconds
          date_delivery: (cmd_header.date_livraison == null ? "null" : cmd_header.date_livraison),
          tracking_number: (product.tracking_number == null ? "null" : product.tracking_number),
          tracking_url: (product.tracking_url == null ? "null" : product.tracking_url),
          statut: 0, //brouillion / draft
          is_synchro: "false", // 0 => false | 1 => true
        };

        console.log('SHIPMENT', SHIPMENT);

        //insert to db header
        await sm.initDB();
        const isShipment_ = await sm.INSERT_SHIPMENTS([SHIPMENT]).then(async (val) => {
            return val;
        });

        const insertedShipment = await sm.GET_SHIPMENTS_BY_ORIGIN(cmd_header.commande_id).then(async (val) => {
          return val;
        });
        SHIPMENT.lines = {
          id: "null",
          detail_batch: product.detail_batch,
          shipment_id: insertedShipment.id,
          fk_expedition: product.fk_expedition,
          entrepot_id: product.entrepot_id,
          origin_line_id: product.origin_line_id,
          qty: product.qty,
          rang: product.rang,
          array_options: []
        };

         //insert to db lines
         const sml = new ShipmentLinesManager();
         await sml.initDB();
         const isShipmentLines_ = await sml.INSERT_SHIPMENT_LINES([SHIPMENT.lines]).then(async (val) => {
             return val;
         });

        if(isShipment_ && isShipmentLines_){
          alert("Expédition créé !");
        }else{
          alert("Expédition non créé !");
        }

      } 
      else {
        //shipment existe so check picked line
        const slm = new ShipmentLinesManager();
        await slm.initDB();
        const isShipmentLine = await slm.GET_SHIPMENT_LINE_BY_ORIGIN_LINE_ID(product.origin_line_id).then(async (val) => {
            return val;
        });

        const SHIPMENT_LINE = {
          id: "null",
          detail_batch: product.detail_batch,
          shipment_id: isShipment.id,
          fk_expedition: product.fk_expedition,
          entrepot_id: product.entrepot_id,
          origin_line_id: product.origin_line_id,
          qty: product.qty,
          rang: product.rang,
          array_options: []
        };
        await slm.initDB();

        if(isShipmentLine == null){
          
          const isShipmentLine_ = await slm.INSERT_SHIPMENT_LINES([SHIPMENT_LINE]).then(async (val) => {
              return val;
          });

          if(isShipmentLine_){
            alert("Produit ajouté dans l'expédition !");
          }else{
            alert("Produit non ajouté dans l'expédition !");
          }

        }else{

          const isShipmentLine_ = await slm.UPDATE_SHIPMENT_LINE([SHIPMENT_LINE]).then(async (val) => {
            return val;
          });

          if(isShipmentLine_){
            alert("Produit mit à jour dans l'expédition !");
          }else{
            alert("Produit non à jour dans l'expédition !");
          }

        }

      }
      

      //  If true: update db obj line
      //  Else true: create it

    }

    async _settings(){
      const sm = new SettingsManager();
      await sm.initDB();
      const settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
        return await val;
      });
      console.log('settings: ', settings);
      this.setState({settings: settings});
    }

    async _orderLinesData(){
      await this.setState({isLoading: true});

      const olm = new OrderLinesManager();
      await olm.initDB();
      const data = await olm.GET_LINES_BY_ORDER_ID_v2(this.state.orderId).then(async (val) => {
        return await val;
      });
      // console.log("res data", data);
      this.setState({data: data, isLoading: false});
    }

    _onFilterPressed(data){
      console.log("_onFilterPressed : ", data);
      this.setState({isFilter: data.isFilter});
    }

    async _onDataToFilter(data){
      console.log("Filter config data : ", data);
  
      await this.setState({filterConfig: data});
      //await this._getPickingData();
    }

    //called after te successful scanning of Barcode
    async _onScannerDone(data){
      console.log("_onScannerDone => ", data);

      if(data.barcode != null){
        let isFound = false;
        let product = null;
        const data_ = this.state.data;
        for(let x=0; x<data_.length; x++){
          //console.log('barcode : '+data_[x].barcode+' || qrvalue : '+qrvalue);

          if(data_[x].barcode == data.barcode){
            console.log('barcode found !: ', data_[x].barcode);
            console.log('produit : ', data_[x]);
            isFound = true;
            product = data_[x];
            break;
          }
        }

        if(isFound){
          this.prepareProduct(product);
        }
        else{
          Alert.alert(
            "Scanner",
            "Le scanner n'a pas pu trouver le code-barres \""+data.barcode+"\" du produit dans la commande à préparer.",
            [
              {text: 'Ok', onPress: () => true},
            ],
            { cancelable: false });
        }
      }
    }


    render() {

      // console.log("Scanner res => ", this.getScannerResult());
      
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            // for popup when active
          },
          mainBody: {
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingHorizontal: 5,
            paddingVertical: 30,
            height: this.state.orientation === 'portrait' ? '80%' : '75%',
            width: '100%',
            position: "absolute",
            bottom: this.state.orientation === 'portrait' ? "10%" : "10%",
            opacity: this.state._opacity_,
          },
          cardViewStyle: {
            width: '97%',
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 20,
          },
          cardViewStyle1: {
            paddingTop: 10,
            alignItems: 'center',
            flexDirection: 'row',
            width: '95%',
            //height: 150,
          },
          article: {
            //alignItems: 'center',
            margin: 20,
            width: '100%'
          },
          ic_and_details: {
            flexDirection: 'row',
            margin: 3,
            //alignItems: 'center',
          },
          aname: {
            width: '100%',
          },
          articlename: {
            color: '#00AAFF',
            fontSize: 20,
            //marginBottom: 15,
          },
          aref: {
            width: '20%',
          },
          ref: {
            backgroundColor: '#dbdbdb',
            height: 30,
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            textAlignVertical: 'center'
          },
          iconDetails: {
            marginRight: 10,
            color: '#00AAFF',
          },
          pricedetails: {
            flexDirection: 'row',
            width: '100%',
          },
          price: {
            width: '75%',
          },
          addPopUpCard : {
            // height: 600,
            width: '95%',
            // justifyContent: "center",
            // alignContent: "center",
            // alignItems: "center",
            // padding: 20,
            margin: 20,
            marginBottom: 70,
            // position: 'absolute',
          },
          addPopUpCard_body : {
            // height: 600,
            width: '100%',
          },
          addPopUpCard_title : {
            color: "#00AAFF",
            fontSize: 30,
            fontWeight: "bold",
            margin: 20
          },
          prepareModeStyleSaisi: {
            backgroundColor: (this.state.prepareMode.saisi ? "#dbdbdb" : null)
          },
          prepareModeStyleBarecode: {
            backgroundColor: (this.state.prepareMode.barecode ? "#dbdbdb" : null)
          },
          lastCard: {
            height: 70,
            width: '97%',
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 30,
            marginBottom: 70,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          },
          lastCard_text: {
            flex: 1,
            fontSize: 20,
            fontWeight: "bold",
            margin: 20
          },
          backButton: {
            height: 50,
            width: "50%",
            backgroundColor: "#00AAFF",
            // justifyContent: "center",
            // alignItems: "center",
            // alignContent: "center",
          }
        });
      

        return (
          <View style={styles.container}>

            <LinearGradient
                start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                colors={['#00AAFF', '#706FD3']}
                style={styles.container}>

                <NavbarOrdersLines navigation={ this.props } textTittleValue={"" + this.props.route.params.order.ref_commande}/>
                <View style={styles.mainBody}>

                <Scanner onScan={this._onScannerDone.bind(this)}/>
                <OrderLinesFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

                    <View style={{flex: 1}}>
                      <ScrollView>
                        {
                          this.state.data.map((item, index) => (
                            <View key={index} >

                              <TouchableOpacity onPress={() => this.prepareProduct(item)} onLongPress={() => this.productDetails(item)}>

                                {this.state.settings.isUseDetailedCMDLines ? 
                                  <CardView cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle, {backgroundColor: (item.qty == null || item.qty <=0 || item.qty == item.prepare_shipping_qty || item.stock == null || item.stock == "null" || item.stock <=0 ? "#dbdbdb" : "#FFFFFF")}]}>
                                    <View style={styles.cardViewStyle1}>
                                      <View style={styles.article}>
                                        <View style={[{ flexDirection: "row" }]}>
                                          {this.state.settings.isUseImages ? 
                                            <View>
                                              <Image style={{ width: DeviceInfo.isTablet() ? 125 : 50, height: DeviceInfo.isTablet() ? 125 : 50 }} source={{uri: `file://${item.image}`}} />
                                            </View>
                                          :
                                            <View>
                                              <Image style={{ width: DeviceInfo.isTablet() ? 125 : 50, height: DeviceInfo.isTablet() ? 125 : 50 }} source={require('../../../img/no_image.jpeg')} />
                                            </View>
                                          }
                                          <View style={{ flex: 1, marginLeft: 10 }}>
                                            <View style={styles.ic_and_details}>
                                              <View style={styles.aname}>
                                                <Text style={styles.articlename}>{item.libelle}</Text>
                                              </View>
                                            </View>
                                            
                                          </View>
                                          
                                        </View>
                                        <View>

                                          <View style={styles.ic_and_details}>
                                            <Icon name="tag" size={15} style={styles.iconDetails} />
                                            <Text>Ref : <Text style={{fontWeight: "bold"}}>{item.ref}</Text></Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="tag" size={15} style={styles.iconDetails} />
                                            <Text>CodeBarre : <Text style={{fontWeight: "bold"}}>{item.barcode}</Text></Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="boxes" size={15} style={styles.iconDetails} />
                                            <Text>{item.stock} en Stock</Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="map-marker-alt" size={15} style={styles.iconDetails} />
                                            <Text>Emplacement : <Text style={{fontWeight: "bold"}}>{item.emplacement}</Text></Text>
                                          </View>
                                          <View style={{flexDirection: "row"}}>
                                            <View style={styles.ic_and_details}>
                                              <Icon name="boxes" size={15} style={styles.iconDetails} />
                                              <Text>{item.qty} Unité</Text>
                                            </View>
                                            <Text style={{margin: 3,}}>| {Math.round((item.qty / item.colis_qty)*100) / 100} Colis</Text>
                                            <Text style={{margin: 3,}}>| {Math.round(((item.qty / item.colis_qty) / item.palette_qty)*100) / 100} Palette</Text>
                                          </View>
                                          <View style={{flexDirection: "row"}}>
                                            <View style={styles.ic_and_details}>
                                              <Icon name="truck-loading" size={15} style={styles.iconDetails} />
                                              <Text>{item.prepare_shipping_qty == null ? "0 Préparée": item.prepare_shipping_qty+" Préparée"}</Text>
                                            </View>
                                            <Text style={{margin: 3,}}>| {Math.round((item.prepare_shipping_qty / item.colis_qty)*100) / 100} Colis</Text>
                                            <Text style={{margin: 3,}}>| {Math.round(((item.prepare_shipping_qty / item.colis_qty) / item.palette_qty)*100) / 100} Palette</Text>
                                          </View>
                                          

                                          {/* <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />

                                          <View style={styles.pricedetails}>
                                            <View style={styles.price}>
                                              <Text>Total TTC : {item.total_ttc > 0 ? (parseFloat(item.total_ttc)).toFixed(2) : '0'} €</Text>
                                            </View>
                                          </View> */}

                                        </View>
                                      </View>
                                      

                                    </View>
                                  </CardView>
                                : 
                                  <CardView cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle, {backgroundColor: (item.qty == null || item.qty <=0 || item.qty == item.prepare_shipping_qty || item.stock == null || item.stock == "null" || item.stock <=0 ? "#dbdbdb" : "#FFFFFF")}]}>
                                    <View style={styles.cardViewStyle1}>
                                      <View style={[styles.article, {flexDirection: "row"}]}>
                                        <View style={{flex: 1, marginLeft: 10}}>
                                        <View style={styles.ic_and_details}>
                                          <View style={styles.aname}>
                                          <Text style={styles.articlename}>{item.libelle}</Text>
                                          </View>
                                          <View style={styles.aref}>
                                            <Text style={styles.ref}>{item.ref}</Text>
                                          </View>
                                        </View>
                                        <View style={[styles.ic_and_details, {width: "100%", justifyContent: "space-between"}]}>
                                            <View style={{width: "30%", flexDirection: "row", justifyContent: "flex-start"}}>
                                              <Icon name="boxes" size={15} style={styles.iconDetails} />
                                              <Text>{item.stock} en Stock</Text>
                                            </View>
                                            <View style={{width: "30%", flexDirection: "row", justifyContent: "center", marginRight: 20}}>
                                              <Icon name="boxes" size={15} style={styles.iconDetails} />
                                              <Text>{item.qty} Unité</Text>
                                            </View>
                                            <View style={{width: "30%", flexDirection: "row", justifyContent: "flex-end", marginRight: 20}}>
                                              <Icon name="truck-loading" size={15} style={styles.iconDetails} />
                                              <Text>{item.prepare_shipping_qty == null ? "0 Préparé": item.prepare_shipping_qty+" Préparé"}</Text>
                                            </View>
                                          </View>

                                        <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                                        </View>
                                        
                                      </View>
                                    </View>
                                  </CardView>
                                }

                              </TouchableOpacity>
                            </View>
                          ))
                        }

                        {this.state.isLoading ? 
                          <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                            <View>
                              <Text style={styles.lastCard_text}>Loading Data...</Text>
                            </View>
                          </CardView>
                        : 
                          <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                            <View>
                              <Text style={styles.lastCard_text}>No More Data...</Text>
                            </View>
                          </CardView>
                        }

                      </ScrollView>

                      {/* Main twist button */}
                      <OrderDetailButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)} />
                      {/* END Main twist button */}
                    </View>
                  

        </View>
        <MyFooter_v2 />
      </LinearGradient>
    </View>
    );
  }
}

// define your styles


//make this component available to the app
export default CommandeDetails;