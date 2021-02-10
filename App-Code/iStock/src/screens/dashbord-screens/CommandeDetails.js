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
import TokenManager from '../../Database/TokenManager';
import OrderLinesFilter from './assets/OrderLinesFilter';
import PickingPopUp from './assets/PickingPopUp';
import moment from "moment";
import Scanner from '../../utilities/Scanner';


let PICKING_ACTION = 1;

// create a component
class CommandeDetails extends Scanner{
  
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
          isPopUpVisible: false,
          prepareMode: {saisi: true, barecode: false},
          isLoading: true,
          orderId: this.props.route.params.order.commande_id,
          data: [{"barcode": "5000112554359P", "emplacement": null, "fk_commande": "385", "id": 58, "libelle": "COCA ZERO 33CL DEN PALETTE", "prepare_shipping_qty": 0, "price": "950.4", "qty": "1", "ref": "00000002P", "stock": "1", "total_ht": "950.40000000", "total_ttc": "1002.67000000", "total_tva": "52.27000000", "tva_tx": "5.500"}],
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

    async  componentDidMount(){

      this.setState({opneScanner: false});
      this.setState({addRemoveNothing: 0});

      await this._settings();
      await this._orderLinesData();
      //await this._shipmentData();

      this.scannerEnable();

      this.listener = await this.props.navigation.addListener('focus', async () => {
        // Prevent default action
        await this._settings();
        await console.log('Done settings update!');
        console.log('new settings : ', this.state.settings);
        await this.setState({orderId: this.props.route.params.order.commande_id});
        this.setState({data: []});
        await this._orderLinesData();

        this.scannerEnable();
        return;
      });
    }

    productDetails(value){
      this.props.navigation.navigate("ProductDetails", {product: value});
    }

    prepareProduct(product){
      console.log('prepareProduct: ', product);
      this.setState({
        isPopUpVisible: true,
        pickingDataSelected: {product: product, _opacity_: 0, pickingMaxLimit: product.qty, pickingMimLimit: 0}
      });
      //this.setState({isPopUpVisible: true, _opacity_: 0, pickingMaxLimit: product.qty, pickingMimLimit: 0});
    }

    _onPickingClose(product){
      this.setState({
        isPopUpVisible: false,
        // pickingDataSelected: {product: product, _opacity_: 1, pickingMaxLimit: product.qty, pickingMimLimit: 0}
      });
    }

    async _onPickingOk(product){

      console.log("cmd : ", this.props.route.params.order);
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
          id: null,
          ref: "SH-PROV-"+moment(),
          project_id: null,
          socid: cmd_header.socId,
          origin_id: cmd_header.commande_id,
          origin:"commande",
          entrepot_id: null,
          projectid: null,
          shipping_method_id: 2,
          shipping_method: "Génerict Transport", 
          user_author_id: 1, // need current user token id
          origin_type: (product.origin_type == null ? "" : product.origin_type),
          weight: (product.weight == null ? "0" : product.weight),
          weight_units: (product.weight_units == null ? "0" : product.weight_units),
          size_w: (product.sizeW == null ? "0" : product.sizeW),
          width_units: (product.width_units == null ? "0" : product.width_units),
          size_h: (product.sizeH == null ? "0" : product.sizeH),
          height_units: (product.height_units == null ? "0" : product.height_units),
          size_s: (product.sizeS == null ? "0" : product.sizeS),
          depth_units: (product.depth_units == null ? "0" : product.depth_units),
          true_size: "xx",
          date_delivery: (cmd_header.date_livraison == null ? "null" : cmd_header.date_livraison),
          tracking_number: (product.tracking_number == null ? "" : product.tracking_number),
          tracking_url: (product.tracking_url == null ? "" : product.tracking_url),
          statut: 0, //brouillion / draft
          lines: [
            {
              id: null,
              fk_expedition: product.fk_expedition,
              entrepot_id: product.entrepot_id,
              origin_line_id: product.origin_line_id,
              qty: product.qty,
              rang: product.rang,
              array_options: []
            }
          ]
        };

        console.log('SHIPMENT', SHIPMENT);

        //insert to db header + lines
        await sm.initDB();
        const isShipment_ = await sm.INSERT_SHIPMENTS([SHIPMENT]).then(async (val) => {
            return val;
        });

        if(isShipment_){
          alert("Expédition créé !");
        }else{
          alert("Expédition non créé !");
        }

      } else{
        //shipment existe so check picked line
        const slm = new ShipmentLinesManager();
        await slm.initDB();
        const isShipmentLine = await slm.GET_SHIPMENT_LINE_BY_ORIGIN_LINE_ID(product.origin_line_id).then(async (val) => {
            return val;
        });

        const SHIPMENT_LINE = {
          id: null,
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


      // {"brouillon": "null", "client_name": "Développeur @JL", "commande_id": 672, "date_commande": "1603929600", "date_creation": "1603929600", "date_livraison": 1604448000, "id": 45, "is_sync": 1, "lines_nb": 4, "note_privee": "", "note_public": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.", "ref_client": undefined, "ref_commande": "CMD201029-000414", "remise": "0", "remise_absolue": "null", "remise_percent": "0", "socId": 2254, "statut": 3, "total_ht": "56.20000000", "total_ttc": "56.20000000", "total_tva": "0.00000000", "user": " SuperAdmin", "user_author_id": 1}

      this.setState({
        isPopUpVisible: false,
        // pickingDataSelected: {product: product, _opacity_: 1, pickingMaxLimit: product.qty, pickingMimLimit: 0}
      });
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
      const data = await olm.GET_LINES_BY_ORDER_ID_v2(this.state.orderId).then(async (val) => {
        return await val;
      });
      console.log("res data", data);
      this.setState({data: data, isLoading: false});
    }

    async _shipmentData(){
      const tm = new TokenManager();
      await tm.initDB();

      const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
        return val;
      });

      const sm = new ShipmentsManager();
      await sm.initDB();

      const data = await sm.GET_SHIPMENTS_BY_ORIGIN(this.state.orderId).then(async (val) => {
        return val;
      });

      if(data == null){
        
        const shipmentHeader = {
          id: null,
          origin: "commande",
          origin_id: ""+this.state.orderId,
          ref: "SHxxxx-xxxx", // idont know yet
          socid: this.props.route.params.order.socid,
          brouillon: null,
          entrepot_id: null,
          tracking_number: "",
          tracking_url: "",
          date_creation: moment(),
          date_shipping: "",
          date_expedition: "",
          date_delivery: "",
          statut: "",
          shipping_method_id: null,
          total_ht: 0.0,
          total_tva: 0.0,
          total_ttc: 0.0,
          user_author_id: ""+token.userId+"",
          shipping_method: null,
          multicurrency_code: "EUR",
          multicurrency_total_ht: "",
          multicurrency_total_tva: "",
          multicurrency_total_ttc: ""
        };

        const newShipment = await sm.INSERT_SHIPMENTS([shipmentHeader]).then(async (val) => {
          return val;
        });

        return await sm.GET_SHIPMENTS_BY_ORIGIN(this.state.orderId).then(async (val) => {
          return val;
        });
      }
      //this.setState({isSavedShipment: (data == null ? false : true)});
    }

    _onFilterPressed(data){
      console.log("_onFilterPressed : ", data);
      this.setState({isFilter: data.isFilter});
    }

    _onScannerPressed(data){
      console.log("_onScannerPressed : ", data);
      this.onOpneScanner();
      //this.setState({opneScanner: true});
    }

    async _onDataToFilter(data){
      console.log("Filter config data : ", data);
  
      await this.setState({filterConfig: data});
      //await this._getPickingData();
    }

    


    render() {

      console.log("Scanner res => ", this.getScannerResult());
      
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
            paddingHorizontal: 20,
            paddingVertical: 30,
            height: this.state.orientation === 'portrait' ? '80%' : '75%',
            width: '100%',
            position: "absolute",
            bottom: this.state.orientation === 'portrait' ? "10%" : "10%",
            opacity: this.state._opacity_,
          },
          cardViewStyle: {
            width: '95%',
            margin: 10,
            // marginBottom: 20,
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
            width: '95%',
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            margin: 10,
            marginBottom: 70,
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

                <OrderLinesFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

                  {this.state.isPopUpVisible ? 
                    <PickingPopUp settings={ {isPopUpVisible: this.state.isPopUpVisible, pickingDataSelected: this.state.pickingDataSelected} } onPickingClose={this._onPickingClose.bind(this)} onPickingOk={this._onPickingOk.bind(this)} />
                    : 
                    <View style={{flex: 1}}>
                      <ScrollView>
                        {
                          this.state.data.map((item, index) => (
                              <View key={index} >

                              <TouchableOpacity onPress={() => this.prepareProduct(item)} onLongPress={() => this.productDetails(item)}>

                                {this.state.settings.isUseDetailedCMDLines ? 
                                  <CardView cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle,]}>
                                    <View style={styles.cardViewStyle1}>
                                      <View style={[styles.article, { flexDirection: "row" }]}>
                                        <View>
                                          <Image style={{ width: DeviceInfo.isTablet() ? 125 : 50, height: DeviceInfo.isTablet() ? 125 : 50 }} source={require('../../../img/no_image.jpeg')} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                          <View style={styles.ic_and_details}>
                                            <View style={styles.aname}>
                                              <Text style={styles.articlename}>{item.libelle}</Text>
                                            </View>
                                          </View>
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
                                            <Icon name="boxes" size={15} style={styles.iconDetails} />
                                            <Text>{item.qty} Commandé</Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                          <Icon name="truck-loading" size={15} style={styles.iconDetails} />
                                              <Text>{item.prepare_shipping_qty == null ? "0 Préparé": item.prepare_shipping_qty+" Préparé"}</Text>
                                          </View>

                                          <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />

                                          <View style={styles.pricedetails}>
                                            <View style={styles.price}>
                                              <Text>Total TTC : {item.total_ttc > 0 ? (parseFloat(item.total_ttc)).toFixed(2) : '0'} €</Text>
                                            </View>
                                          </View>
                                        </View>
                                        
                                      </View>
                                    </View>
                                  </CardView>
                                : 
                                  <CardView cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle,]}>
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
                                              <Text>{item.qty} Commandé</Text>
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
                      <OrderDetailButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)} isScannerPressed={this._onScannerPressed.bind(this)}/>
                      {/* END Main twist button */}
                    </View>
                  }

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