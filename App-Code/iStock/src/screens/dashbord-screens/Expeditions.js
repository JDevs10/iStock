import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NavbarShipment from '../../navbar/navbar-shipment';
import MyFooter_v2 from '../footers/MyFooter_v2';
import ShipmentsButton from '../dashbord-screens/assets/ShipmentsButton';
import SettingsManager from '../../Database/SettingsManager';
import OrderManager from '../../Database/OrderManager';
import ShipmentsManager from '../../Database/ShipmentsManager';
import Statut from '../../utilities/Statut';
import moment from "moment";
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../../utilities/MyLogs';
import ShipmentLinesManager from '../../Database/ShipmentLinesManager';
import ShipmentLineDetailBatchManager from '../../Database/ShipmentLineDetailBatchManager';


const _statut_ = new Statut();
const isAtToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 0.5;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};


export default class Expeditions extends Component {
    scrollRef = React.createRef();

    constructor(props) {
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
        isLoading: true,
        isLoadingMoreData: false,
        filterConfig: {},
        data: [],
        settings: {isUseDetailedShipment: true},
        limit: {from: 0, to: 10},
        orientation: isPortrait() ? 'portrait' : 'landscape'
      };
  
      // Event Listener for orientation changes
      Dimensions.addEventListener('change', () => {
        this.setState({
          orientation: isPortrait() ? 'portrait' : 'landscape'
        });
      });
    }


    async  componentDidMount(){
      writeInitLog(LOG_TYPE.INFO, Expeditions.name, this.componentDidMount.name);
      await this._settings();
      await this._getShipmentData();
  
      this.listener = await this.props.navigation.addListener('focus', async () => {
        // Prevent default action
        writeBackInitLog(LOG_TYPE.INFO, Expeditions.name, this.componentDidMount.name);
        await this._settings();
        await this._getShipmentData();
        return;
      });
    }

    async _settings(){
        const sm = new SettingsManager();
        await sm.initDB();
        const settings = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
          return await val;
        });
        console.log('settings: ', settings);
        writeLog(LOG_TYPE.INFO, Expeditions.name, this._settings.name, JSON.stringify(settings));
        this.setState({settings: settings});
    }
    
    async _getShipmentData(){
      await this.setState({isLoading: true});
      let data_ = [];

      console.log("filterConfig : ", await Object.keys(this.state.filterConfig).length);
      if(await Object.keys(this.state.filterConfig).length == 0){
        const sm = new ShipmentsManager();
        await sm.initDB();
        data_ = await sm.GET_SHIPMENT_LIST_BETWEEN(this.state.limit.from, this.state.limit.to).then(async (val) => {
          //console.log("Order data : ", val);
          return await val;
        });
 
      }else{
        const sm = new ShipmentsManager();
        await sm.initDB();
        data_ = await sm.GET_SHIPMENT_LIST_BETWEEN_FILTER(this.state.limit.from, this.state.limit.to, this.state.filterConfig).then(async (val) => {
          //console.log("Order data filtered : ", val);
          return await val;
        });
      }
      
      writeLog(LOG_TYPE.INFO, Expeditions.name, this._getShipmentData.name, "Data size => "+data_.length);
      await this.setState({ data: data_, isLoading: false});
    }

    
    async loadMoreData(){
        this.setState({isLoadingMoreData: true});
        const newData = this.state.data;
        console.log("before : ", this.state.data.length);
        let data_ = [];
    
        const newFrom = this.state.limit.from + this.state.limit.to;
        const newTo = newFrom + this.state.limit.to;
    
        this.setState({
          limit: {
            from: newFrom,
            to: newTo
          }
        });
    
        if(await Object.keys(this.state.filterConfig).length == 0){
          const om = new OrderManager();
          await om.initDB();
          data_ = await om.GET_ORDER_LIST_BETWEEN_v2(this.state.limit.from, this.state.limit.to).then(async (val) => {
            //console.log("Order data : ", val);
            return await val;
          });
    
        }else{
          const om = new OrderManager();
          await om.initDB();
          data_ = await om.GET_ORDER_LIST_BETWEEN_FILTER_v2(this.state.limit.from, this.state.limit.to, this.state.filterConfig).then(async (val) => {
            //console.log("Order data filtered : ", val);
            return await val;
          });
        }
    
        for(let x = 0; x < data_.length; x++){
          newData.push(data_[x]);
        }
        console.log("after : ", newData.length);
        writeLog(LOG_TYPE.INFO, Expeditions.name, this.loadMoreData.name, "Old data size => "+data_.length+" | new data size => "+newData.length);
    
        await this.setState({isLoadingMoreData: false, data: newData});
    }

    async _ShowShipment(value) {
        console.log(value);
        // alert('Obj: \n' + JSON.stringify(value));
        //this.props.navigation.navigate("CommandeDetails", { order: value });
        // const sm = new ShipmentsManager();
        // const slm = new ShipmentLinesManager();
        // sm.initDB();
        // slm.initDB();
        // const m = await sm.DELETE_SHIPMENTS_LIST().then(async (val) => {
        //   return val;
        // });
        // const l = await slm.DELETE_SHIPMENTS_LINES_LIST().then(async (val) => {
        //   return val;
        // });
    }

    async _LongPressShipment(){
      
      // const sm = new ShipmentsManager();
      // const slm = new ShipmentLinesManager();
      // const sldbm = new ShipmentLineDetailBatchManager()

      // sm.initDB();
      // slm.initDB();
      // sldbm.initDB();

      // const m = await sm.DROP_SHIPMENTS().then(async (val) => {
      //   return val;
      // });
      // const mm = await sm.CREATE_SHIPMENTS_TABLE().then(async (val) => {
      //   return val;
      // });
      // const l = await slm.DROP_SHIPMENTS_LINES().then(async (val) => {
      //   return val;
      // });
      // const ll = await slm.CREATE_SHIPMENT_LINES_TABLE().then(async (val) => {
      //   return val;
      // });
      // const k = await sldbm.DROP_SHIPMENT_LINE_DETAIL_BATCH().then(async (val) => {
      //   return val;
      // });
      // const kk = await sldbm.CREATE_SHIPMENT_LINE_DETAIL_BATCH_TABLE().then(async (val) => {
      //   return val;
      // });
    }

    render() {
        const styles = StyleSheet.create({
            container: {
              flex: 1,
            },
            mainBody: {
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              paddingVertical: 30,
              height: this.state.orientation === 'portrait' ? '80%' : '75%',
              width: '100%',
              position: "absolute",
              bottom: this.state.orientation === 'portrait' ? "10%" : "10%",
            },
            cardViewStyle: {
              width: '95%',
              height: 240,
              margin: 10,
              // marginBottom: 20,
            },
            cardViewStyle1: {
              // paddingTop: 20,
              width: '100%',
              // height: 150,
            },
            listItemBody: {
              width: '100%',
              padding: 10,
              // margin: 20,
              // marginBottom: 10,
            },
            listItemBody_layout: {
              //flex: 1,
              marginRight: 20,
              marginLeft: 20,
              flexDirection: "row",
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
            cardViewStyle1: {
              //paddingTop: 10,
              alignItems: 'center',
              flexDirection: 'row',
              width: '95%',
              //height: 150,
            },
            shipment: {
              //alignItems: 'center',
              margin: 20,
              width: '100%'
            },
            ic_and_details: {
              flexDirection: 'row',
              margin: 3,
              //alignItems: 'center',
            },
            cname: {
              width: '80%',
            },
            entreprisename: {
              color: '#00AAFF',
              fontSize: 20,
              //marginBottom: 15,
            },
            cref: {
              width: 190,
              marginLeft: 'auto'
            },
            cdate: {
              width: 150,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto'
            },
            sdate: {
              width: '45%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            date: {
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
            refDetails: {
              flexDirection: "row-reverse",
              width: '95%',
            },
            ref: {
              fontWeight: "bold",
              width: '100%',
            },
            price: {
              width: '75%',
            },
            billedstate: {
              width: 60,
              alignItems: "center", 
              alignContent: "center", 
              justifyContent: "center",
              padding: 2
            },
            billedtext_ok: {
              color: '#00BFA6',
              fontSize: 15,
              position: 'absolute',
              right: 10
            },
            billedtext_no: {
              color: '#D64541',
              fontSize: 15,
              position: 'absolute',
              right: 10
            },
            butons_commande: {
              flexDirection: 'row',
              // alignItems: 'center',
              justifyContent: "flex-end",
              width: '100%',
              // marginTop: 30,
            },
            notif_icon: {
              color: '#E1B12C',
              borderRadius: 5,
              padding: 5,
            },
            notif: {
              position: 'absolute',
              right: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
            },
          });
      
      
      
        return (
            <LinearGradient
            start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
            colors={['#00AAFF', '#706FD3']}
            style={styles.container}>
    
            <NavbarShipment _navigation={this.props} textTittleValue={"Expéditions"} />
            <View style={styles.mainBody}>
              
              {/* <OrderFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/> */}
    
              <ScrollView 
                ref={this.scrollRef} 
                onScroll={({nativeEvent}) => {
                  if (isAtToBottom(nativeEvent)) {
                    console.log("Reach at the end!");
                  }
                }}
                scrollEventThrottle={400}
                style={{ flex: 1 }}>
                {
                  this.state.data.map((item, index) => (
                    <View key={index}>
                      {/* {item.statut === 1 ? */}
                        {!this.state.isLoading ? 
                          <View>
                            {this.state.settings.isUseDetailedShipment ? 

                            <CardView cardElevation={10} cornerRadius={5} style={[styles.cardViewStyle, {height: 200}]}>
                              <View style={styles.cardViewStyle1}>
                                <View style={styles.shipment}>
                                  <TouchableOpacity onPress={() => this._ShowShipment(item)} onLongPress={() => this._LongPressShipment(item)}>
                                    <View style={styles.ic_and_details}>
                                      <View style={styles.cname}>
                                        <Text style={styles.entreprisename}>{item.client_name}</Text>
                                      </View>
                                      {/* <View style={styles.cref}>
                                        {item.id == 0 ? (<Text>Nouvelle expédition</Text>) : (<Text style={styles.ref}>{item.ref}</Text>)}
                                      </View> */}
                                    </View>
                                    <View style={styles.ic_and_details}>
                                      <View style={styles.cref, {margin: 0, flexDirection: "row"}}>
                                        <Icon name="tag" size={15} style={styles.iconDetails} />
                                        {item.id == 0 ? (<Text>Nouvelle expédition</Text>) : (<Text style={styles.ref}>{item.ref}</Text>)}
                                      </View>
                                      <View style={[{flexDirection: "row", width: 170, textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginLeft: 'auto'}]}>
                                        <Icon name="clipboard-list" size={15} style={styles.iconDetails} />
                                        <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>{item.from_order_ref}</Text>
                                      </View>
                                    </View>
                                    <View style={styles.ic_and_details}>
                                      <Icon name="user" size={15} style={styles.iconDetails}/>
                                      <Text>Créé par : <Text style={{fontWeight: "bold"}}>{item.user_author_id}</Text></Text>
                                    </View>
                                    <View style={styles.ic_and_details}>
                                      <Icon name="boxes" size={15} style={styles.iconDetails}/>
                                      <Text>{item.lines} Produit(s)</Text>
                                    </View>
                                    <View style={styles.ic_and_details}>
                                      <View style={{flexDirection: "row", width: "50%"}}>
                                        <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                        <Text>Faite le : <Text style={{fontWeight: "bold"}}>{moment(new Date(new Number(item.date_creation+"000"))).format('DD-MM-YYYY')}</Text></Text>
                                      </View>
                                      <View style={styles.cdate}>
                                        <Text style={styles.date}>Livré pour {moment(new Date(new Number(item.date_delivery+"000"))).format('DD-MM-YYYY')}</Text>
                                      </View>
                                    </View>
                                    <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                                    <View style={styles.pricedetails}>
                                      {/* <View style={styles.price}>
                                        <Text>Total TTC : {item.total_ttc > 0 ? (parseFloat(item.total_ttc)).toFixed(2) : '0'} €</Text>
                                      </View> */}
                                      <View style={[styles.billedstate, {backgroundColor: _statut_.getOrderStatutBackgroundColorStyles(item.statut)}]}>
                                        <Text style={{color: _statut_.getOrderStatutLabelColorStyles(item.statut)}}>{_statut_.getOrderStatut(item.statut)}</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                  <View style={styles.butons_commande}>
                                    {/* <ButtonSpinner style={styles.submit_on} positionSpinner={'right'} onPress={() => this._relance_commande(item.ref_commande)} styleSpinner={{ color: '#FFFFFF' }}>
                                      <Icon name="sync" size={20} style={styles.iconValiderpanier} />
                                      <Text style={styles.iconPanier}> Relancer la commande</Text>
                                    </ButtonSpinner> */}
                                    {/* {0 === 0 ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)} */}
                                    {item.is_synchro === 'false' ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)}
                                  </View>
                                </View>
                              </View>
                            </CardView>
                            : 
                            <CardView cardElevation={5} cornerRadius={5} style={[styles.cardViewStyle, {height: 140}]}>
                              <View style={[styles.cardViewStyle1, {paddingTop: 0}]}>
                                  <View style={styles.shipment}>
                                      <TouchableOpacity onPress={() => this._Showcommande(item)}>
                                      <View style={styles.ic_and_details}>
                                          <View style={styles.cname}>
                                            <Text style={styles.entreprisename}>{item.client_name}</Text>
                                          </View>
                                          {/* <View style={styles.cdate}>
                                            {item.id == 0 ? (<Text>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref_commande}</Text>)}
                                          </View> */}
                                          {/* <View style={styles.cdate}>
                                            <Text style={styles.date}>Livré pour {moment(new Date(new Number(item.date_delivery+"000"))).format('DD-MM-YYYY')}</Text>
                                          </View> */}
                                      </View>
                                      <View style={styles.ic_and_details}>
                                        <View style={{width: '54%', flexDirection: "row"}}>
                                          <Icon name="boxes" size={15} style={styles.iconDetails} />
                                          <Text>{item.lines} Produit(s)</Text>
                                        </View>
                                        <View style={styles.sdate}>
                                          <Text style={styles.date}>Livré pour {moment(new Date(new Number(item.date_delivery+"000"))).format('DD-MM-YYYY')}</Text>
                                        </View>
                                      </View>
                                      <View style={styles.refDetails}>
                                        {/* <View style={styles.cdate}> */}
                                          {item.id == null || item.id == 0 ? (<Text style={styles.ref}>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref}</Text>)}
                                        {/* </View> */}
                                      </View>
                                        <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                                      </TouchableOpacity>
                                      <View style={styles.butons_commande}>
                                        {item.is_synchro === 'false' ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)}
                                      </View>
                                  </View>
                              </View>
                            </CardView>
                            }
                          </View>
                        : 
                           null
                         }
                        
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
                  null
                }
    
                {this.state.isLoadingMoreData ? 
                  <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                    <View>
                      <Text style={styles.lastCard_text}>Loading More Data...</Text>
                    </View>
                  </CardView>
                : 
                  null
                }
    
                {!this.state.isLoading && !this.state.isLoadingMoreData ? 
                  <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                    <View>
                      <Text style={styles.lastCard_text}>No More Data...</Text>
                    </View>
                  </CardView>
                : 
                  null
                }
    
                {/* {this.state.isLoading && !this.state.isLoadingMoreData ? 
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
                } */}
    
    
              </ScrollView>
    
    
    
    
              {/* Main twist button */}
              <ShipmentsButton navigation={this.props.navigation}/>
              {/* <ShipmentsButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)}/> */}
              {/* END Main twist button */}
    
            </View>
            <MyFooter_v2 />
        </LinearGradient>
        );
    }
}
