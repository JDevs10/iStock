import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
  findNodeHandle
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo, { isLandscape } from 'react-native-device-info';
import { Switch } from 'react-native-paper';
import SettingsManager from '../../Database/SettingsManager';
import TokenManager from '../../Database/TokenManager';
import SettingsDetailButton from './assets/SettingsDetailButton';
import moment from 'moment';
import DefaultSettings from '../../utilities/DefaultSettings';
const DEFAULT_SETTINGS = new DefaultSettings();
const IMG_SRC = require('../../../img/bg_login.png');


class Settings extends Component {
  scrollRef_order = React.createRef();

  constructor(props){
    super(props);
    this.state = {
      settings: {
        server: "",
        key: "",
        isUseImages: false,
        isUseDetailedCMD: false,
        isUseDetailedCMDLines: false,
        isUseDetailedShipment: false,
        appVersion: "",
        dataList_limitDownloadOrders_selected: {id: 1, name: '-\t3 jours', value: 3, selected: true,},
        dataList_limitDownloadShipments_selected: {id: 1, name: '-\t3 jours', value: 3, selected: true,},
      },
      dataList_limitDownloadOrders: DEFAULT_SETTINGS.SETTINGS_LIMIT,
      dataList_limitDownloadShipments: DEFAULT_SETTINGS.SETTINGS_SHIPMENT_LIMIT
    }
  }

  async componentDidMount(){
    await this._updateData();
    await this._scrollTo_order();
    await this._scrollTo_shipment();
  }

  async _updateData(){
    const sm = new SettingsManager();
    await sm.initDB();
    const config = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
      return await val;
    });
    console.log('config: ', config);

    const tm = await new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    if(config == null){
      config.limitOrdersDownload = 40;
      config.limitShipmentsDownload = 5;
    }

    let limitDownloadOrders_selected_obj = null;
    let limitDownloadShipments_selected_obj = null;

    const _data_orders = this.state.dataList_limitDownloadOrders;
    const _data_shipments = this.state.dataList_limitDownloadShipments;

    _data_orders.forEach((item, _index_) => {
      // orders
      if(item.value == config.limitOrdersDownload){
        limitDownloadOrders_selected_obj = item;
        limitDownloadOrders_selected_obj.selected = true;
      }else{
        item.selected = false;
      }
    });

    _data_shipments.forEach((item, _index_) => {
      //shipments
      if(item.value == 5){
        limitDownloadShipments_selected_obj = item;
        limitDownloadShipments_selected_obj.selected = true;
      }else{
        item.selected = false;
      }
    });

    const _settings_ = {
      server: (token == null ? "" : token.server),
      key: (token == null ? "" : token.token),
      isUseImages: (config == null ? false : config.isUseImages),
      isUseDetailedCMD: (config == null ? false : config.isUseDetailedCMD),
      isUseDetailedCMDLines: (config == null ? false : config.isUseDetailedCMDLines),
      isUseDetailedShipment: (config == null ? false : config.isUseDetailedShipment),
      dataList_limitDownloadOrders_selected: limitDownloadOrders_selected_obj,
      dataList_limitDownloadShipments_selected: limitDownloadShipments_selected_obj,
      appVersion: "0.9.6",
    }

    this.setState({
      settings: _settings_
    });
  }

  _SelectedDownloadLimitOrders(item, index){
    const newData = this.state.dataList_limitDownloadOrders;
    newData.forEach((item, _index_) => {
        if(index != _index_){
          item.selected = false;
        }else{
          item.selected = true;
        }
    });
    const state = this.state;
    state.settings.dataList_limitDownloadOrders_selected = item;
    this.setState({
        state
    });
  }

  _setScrollViewRef_orders = (element) => {
    this.scrollRef_order = element;
  };

  _SelectedDownloadLimitShipments(item, index){
    const newData = this.state.dataList_limitDownloadShipments;
    newData.forEach((item, _index_) => {
        if(index != _index_){
          item.selected = false;
        }else{
          item.selected = true;
        }
    });
    const state = this.state;
    state.settings.dataList_limitDownloadShipments_selected = item;
    this.setState({
        state
    });
  }

  _setScrollViewRef_shipments = (element) => {
    this.scrollRef_shipment = element;
  };

  async _scrollTo_order(){
    if(this.state.settings != null){

      if (this.state.dataList_limitDownloadOrders.length >= this.state.settings.dataList_limitDownloadOrders_selected.id) {
        await this.scrollRef_order.scrollTo({
          x: 0,
          y: (50 * (this.state.settings.dataList_limitDownloadOrders_selected.id - 1)),   // (ScrollView_Height * selected_Index)
          animated: true,
        });
      } else {
        alert('Out of Max Index');
      }
    }
  };

  async _scrollTo_shipment(){
    if(this.state.settings != null){

      if (this.state.dataList_limitDownloadShipments.length >= this.state.settings.dataList_limitDownloadShipments_selected.id) {
        await this.scrollRef_shipment.scrollTo({
          x: 0,
          y: (50 * (this.state.settings.dataList_limitDownloadShipments_selected.id - 1)),   // (ScrollView_Height * selected_Index)
          animated: true,
        });
      } else {
        alert('Out of Max Index');
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />

        <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Enregistrement des configurations</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.body}>

          <ScrollView
            nestedScrollEnabled = {true}>

            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="server"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Serveur</Text>
              </View>
              <Text style={styles.textInput}>{this.state.settings.server}</Text>
            </View>


            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="key"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>License </Text>
              </View>
              <TextInput style={styles.textInput} value={this.state.settings.key} secureTextEntry={true}/>
            </View>


            <View style={styles.action}>
              <View style={styles.action_}>
                <FontAwesome
                  name="download"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Téléchargement des images</Text>
                <Switch
                  trackColor={{ false: "#D3D3D3", true: "#4A4AD4" }}
                  thumbColor={true ? "#00AAFF" : "#4A4AD4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    const data = this.state;
                    data.settings.isUseImages = !this.state.settings.isUseImages;
                    this.setState({data});
                   }}
                  value={this.state.settings.isUseImages}
                />
              </View>
            </View>


            <View style={styles.action}>
              <View style={styles.action_}>
                <FontAwesome
                  name="columns"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Affichage des CMDs détaillé</Text>
                <Switch
                  trackColor={{ false: "#D3D3D3", true: "#4A4AD4" }}
                  thumbColor={true ? "#00AAFF" : "#4A4AD4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => { 
                    const data = this.state;
                    data.settings.isUseDetailedCMD = !this.state.settings.isUseDetailedCMD;
                    this.setState({data});
                  }}
                  value={this.state.settings.isUseDetailedCMD}
                />
              </View>
            </View>


            <View style={styles.action}>
              <View style={styles.action_}>
                <FontAwesome
                  name="columns"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Affichage des lignes CMD détaillé</Text>
                <Switch
                  trackColor={{ false: "#D3D3D3", true: "#4A4AD4" }}
                  thumbColor={true ? "#00AAFF" : "#4A4AD4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => { 
                    const data = this.state;
                    data.settings.isUseDetailedCMDLines = !this.state.settings.isUseDetailedCMDLines;
                    this.setState({data});
                  }}
                  value={this.state.settings.isUseDetailedCMDLines}
                />
              </View>
            </View>


            <View style={styles.action}>
              <View style={styles.action_}>
                <FontAwesome
                  name="columns"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Affichage des d'expédition détaillé</Text>
                <Switch
                  trackColor={{ false: "#D3D3D3", true: "#4A4AD4" }}
                  thumbColor={true ? "#00AAFF" : "#4A4AD4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => { 
                    const data = this.state;
                    data.settings.isUseDetailedShipment = !this.state.settings.isUseDetailedShipment;
                    this.setState({data}); }}
                  value={this.state.settings.isUseDetailedShipment}
                />
              </View>
            </View>


            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="cloud-download"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Limit de téléchargement des commandes :</Text>
              </View>
              <ScrollView 
                ref={this._setScrollViewRef_orders}
                nestedScrollEnabled = {true}
                style={{height: 100}}
                scrollEventThrottle={400}>
                {this.state.dataList_limitDownloadOrders.map((item, index) => (
                  <View key={index} style={{height: 50}}>
                    <TouchableOpacity
                        onPress={() => this._SelectedDownloadLimitOrders(item, index)}>
                        <Text style={{backgroundColor: (item.selected ? "#f9c2ff" : "#FFFFFF"), padding: 10, paddingLeft: 20, marginVertical: 10}}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>


            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="cloud-download"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Limit de téléchargement des expéditions :</Text>
              </View>
              <ScrollView 
                ref={this._setScrollViewRef_shipments}
                nestedScrollEnabled = {true}
                style={{height: 100}}
                scrollEventThrottle={400}>
                {this.state.dataList_limitDownloadShipments.map((item, index) => (
                  <View key={index} style={{height: 50}}>
                    <TouchableOpacity
                        onPress={() => this._SelectedDownloadLimitShipments(item, index)}>
                        <Text style={{backgroundColor: (item.selected ? "#f9c2ff" : "#FFFFFF"), padding: 10, paddingLeft: 20, marginVertical: 10}}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            

            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="mobile"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Version App</Text>
              </View>
              <Text style={styles.textInput}>{this.state.settings.appVersion}</Text>
            </View>
            
          </ScrollView>

          {/* Main twist button */}
          <SettingsDetailButton 
            navigation={this.props.navigation} 
            parentData={{settings: this.state.settings}}/>
            {/* END Main twist button */}

        </Animatable.View>
        <MyFooter_v2 />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    // paddingHorizontal: 20,
    // paddingTop: 20,
    // paddingBottom: 30,
    height: '25%',
    width: '100%',
    position: "absolute"
  },
  eye_style: {
    paddingTop: 30,
  },
  body: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: '65%',
    width: '100%',
    position: "absolute",
    bottom: "10%",
  },
  text_header: {
    padding: 20,
    color: '#05375a',
    fontWeight: 'bold',
    fontSize: 30,
    position: "absolute",
    bottom: 0
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  action_:{
    flexDirection: 'row',
    width: '100%',
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 10,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default Settings