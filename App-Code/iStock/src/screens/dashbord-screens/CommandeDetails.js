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
import { CameraKitCameraScreen, } from 'react-native-camera-kit';


let PICKING_ACTION = 1;

// create a component
class CommandeDetails extends Component {
  
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
          //variable to hold the QR / Barecode value
          qrvalue: '',
          opneScanner: false,
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

      this.listener = await this.props.navigation.addListener('focus', async () => {
        // Prevent default action
        await this._settings();
        await console.log('Done settings update!');
        console.log('new settings : ', this.state.settings);
        await this.setState({orderId: this.props.route.params.order.commande_id});
        this.setState({data: []});
        await this._orderLinesData();
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

    _onPickingOk(product){
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
      const data = await olm.GET_LINES_BY_ORDER_ID(this.state.orderId).then(async (val) => {
        return await val;
      });
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

    
    (){
      this.setState({prepareMode: {saisi: false, barecode: true}})
      this.props.navigation.navigate("Scanner");
    }

    onBarcodeScan(qrvalue) {
      //called after te successful scanning of QRCode/Barcode
      this.setState({ qrvalue: qrvalue });
      this.setState({ opneScanner: false });
      console.log('qrvalue : ', qrvalue);
      console.log('opneScanner : ', false);

      let isFound = false;
      let product = null;
      const data_ = this.state.data;
      for(let x=0; x<data_.length; x++){
        //console.log('barcode : '+data_[x].barcode+' || qrvalue : '+qrvalue);

        if(data_[x].barcode == qrvalue){
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
          "Le scanner n'a pas pu trouver le code-barres \""+qrvalue+"\" du produit dans la commande à préparer.",
          [
            {text: 'Ok', onPress: () => true},
          ],
          { cancelable: false });
      }

    }

    onOpneScanner() {
      var that = this;
      //To Start Scanning
      if(Platform.OS === 'android'){
        async function requestCameraPermission() {
          try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'Permission Caméra',
              'message': 'Permettre à iStock de utiliser la caméra, pour scanner les QR Code ou Barecode'//'CameraExample App needs access to your camera '
              }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //If CAMERA Permission is granted
              that.setState({ qrvalue: '' });
              that.setState({ opneScanner: true });
              console.log('opneScanner : ', true);
          } else {
              alert("CAMERA permission denied");
          }
          } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
          }
        }
        //Calling the camera permission function
        requestCameraPermission();
      }
      else{
        that.setState({ qrvalue: '' });
        that.setState({ opneScanner: true });
        console.log('opneScanner : ', true);
      }
    }



    render() {
      
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
            height: this.state.orientation === 'portrait' ? '84%' : '74%',
            width: '100%',
            position: "absolute",
            bottom: this.state.orientation === 'portrait' ? "10%" : "15%",
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
            width: '80%',
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
            margin: 20,
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
            {!this.state.opneScanner ? 
            <LinearGradient
                start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                colors={['#00AAFF', '#706FD3']}
                style={styles.container}>

                <NavbarOrdersLines navigation={ this.props } textTittleValue={"" + this.props.route.params.order.ref_commande}/>
                <View style={styles.mainBody}>

                  {this.state.isPopUpVisible ? 
                    <PickingPopUp settings={ {isPopUpVisible: this.state.isPopUpVisible} } onPickingClose={this._onPickingClose.bind(this)} onPickingOk={this._onPickingOk.bind(this)} />
                  : 
                    <View>
                      <ScrollView style={{flex: 1}}>
                        {
                          this.state.data.map((item, index) => (
                              <View>

                              <TouchableOpacity onPress={() => this.prepareProduct(item)} onLongPress={() => this.productDetails(item)}>

                                {this.state.settings.isUseDetailedCMDLines ? 
                                  <CardView key={index} cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle, {height: 230}]}>
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
                                            <View style={styles.aref}>
                                              <Text style={styles.ref}>{item.ref}</Text>
                                            </View>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="tag" size={15} style={styles.iconDetails} />
                                            <Text>Lot : <Text style={{fontWeight: "bold"}}>xxxxxxxxxx</Text></Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                            <Text>DLC : <Text style={{fontWeight: "bold"}}>{moment(new Date(new Number("1601892911000"))).format('DD-MM-YYYY')}</Text></Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                            <Text>DLUO : <Text style={{fontWeight: "bold"}}>{moment(new Date(new Number("1601892911000"))).format('DD-MM-YYYY')}</Text></Text>
                                          </View>
                                          <View style={styles.ic_and_details}>
                                            <Icon name="warehouse" size={15} style={styles.iconDetails} />
                                            <Text>Enplacement : <Text style={{fontWeight: "bold"}}>{item.emplacement == null || item.emplacement == '' ? "Pas emplacement assigné" : item.emplacement}</Text></Text>
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
                                  <CardView key={index} cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle, {height: 120}]}>
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

                  <OrderLinesFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

                

        </View>
        <MyFooter_v2 />
      </LinearGradient>

      :

      <View style={{ flex: 1, width: "100%", height: "100%"}}>
        <CameraKitCameraScreen
          showFrame={true}
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={'#00AAFF'}
          //Color can be of your choice
          frameColor={'#706FD3'}
          //If frame is visible then frame color
          colorForScannerFrame={'black'}
          //Scanner Frame color
          onReadCode={event =>
              this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
          cameraOptions={{
              flashMode: 'auto',                // on/off/auto(default)
              focusMode: 'on',                  // off/on(default)
              zoomMode: 'on',                   // off/on(default)
              ratioOverlay:'1:1',               // optional
              ratioOverlayColor: '#00000077'    // optional
          }}
          resetFocusTimeout={0}               // optional
          resetFocusWhenMotionDetected={true} // optional
          />

        <View style={{height: 50, width: "100%", alignItems: "center", marginBottom: 200}}>
          <TouchableHighlight
            onPress={() => {this.setState({opneScanner: false}); }}
            style={{backgroundColor: "#00AAFF", justifyContent: "center", alignItems: "center", height:"100%", width: 200, }}>
            <Text style={{color: '#FFFFFF', fontSize: 20 }}>Back</Text>
          </TouchableHighlight>
        </View>
      </View>
      }

    </View>
    );
  }
}

// define your styles


//make this component available to the app
export default CommandeDetails;