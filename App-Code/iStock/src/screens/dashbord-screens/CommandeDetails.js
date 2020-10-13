//import liraries
import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, FlatList, Image, Dimensions, Alert, ImageBackground, Modal } from 'react-native';
import { Card, Button, Slider } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import NavbarOrdersLines from '../../navbar/navbar-orders-lines';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo from 'react-native-device-info';
import OrderDetailButton from './assets/OrderDetailButton';
import SettingsManager from '../../Database/SettingsManager';
import OrderLinesManager from '../../Database/OrderLinesManager';
import OrderLinesFilter from './assets/OrderLinesFilter';
import moment from "moment";
// import Modal from 'react-native-modal';



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
          _opacity_: 1,
          isPopUpVisible: true,
          prepareMode: {saisi: true, barecode: false},
          isLoading: true,
          orderId: this.props.route.params.order.commande_id,
          data: [],
          settings: {},
          filterConfig: {},
          pickingDataOptions: [{label: "Ajouter", value: 1}, {label: "Retour", value: 0}, {label: "Annuler", value: -1}],
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
      this.setState({addRemoveNothing: 1});

      await this._settings();
      await this._orderLinesData();

      this.listener = await this.props.navigation.addListener('focus', async () => {
        // Prevent default action
        await this._settings();
        await console.log('Done settings update!');
        console.log('new settings : ', this.state.settings);
        await this.setState({orderId: this.props.route.params.order.commande_id});
        await this._orderLinesData();
        return;
      });
    }

    productDetails = (value) => {
      this.props.navigation.navigate("ProductDetails", {product: value});
    }

    prepareProduct(product){
      console.log('prepareProduct: ', product);
      this.setState({isPopUpVisible: true, _opacity_: 0});
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

    _onFilterPressed(data){
      console.log("_onFilterPressed : ", data);
      this.setState({isFilter: data.isFilter});
    }

    async _onDataToFilter(data){
      console.log("Filter config data : ", data);
  
      await this.setState({filterConfig: data});
      //await this._getPickingData();
    }

    render() {
        // console.log('this.props.navigation : ', this.props.route.params);
        
        // const orderId = this.state.orderId;
        // const order = params ? params.order : null;
        // console.log('order : ', this.props.route.params.order);
        // console.log('orderId : ', orderId);


        // if (this.state.orientation === 'portrait') {
        //     console.log('orientation : ', this.state.orientation);
        // }
        // else {
        //     console.log('orientation : ', this.state.orientation);
        // }

        const add_1_ToTextInput = () => {
          this.setState({
            addRemoveNothing: this.state.addRemoveNothing + 1,
          });
          console.log("add :=> "+this.state.addRemoveNothing);
        }
        const remove_1_ToTextInput = () => {
          this.setState({
            addRemoveNothing: this.state.addRemoveNothing - 1,
          });
        }
        const remove_10_ToTextInput = () => {
          this.setState({
            addRemoveNothing: this.state.addRemoveNothing - 10,
          });
        }
      
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
        });
      

        return (
            <LinearGradient
                start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                colors={['#00AAFF', '#706FD3']}
                style={styles.container}>

                <NavbarOrdersLines navigation={ this.props } textTittleValue={"" + this.props.route.params.order.ref_commande}/>
                <View style={styles.mainBody}>

                  <OrderLinesFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

                  <Modal 
                    visible={this.state.isPopUpVisible} 
                    transparent={true} >
                      <View style={{height: "100%", width: "100%", justifyContent: "center"}}>
                        <CardView cardElevation={25} cornerRadius={5} style={[styles.addPopUpCard, {}]}>
                          <View style={styles.addPopUpCard_body}>
                          <LinearGradient
                            start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                            colors={['#00AAFF', '#706FD3']}
                            style={{width: "100%", flexDirection: "row", justifyContent: "flex-end", }}>

                                <TouchableOpacity
                                  style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                                  onPress={() => {this.setState({isPopUpVisible: false, _opacity_: 1})}}>
                                  <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                                  onPress={() => remove_10_ToTextInput()}>
                                  <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Ok</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={{padding: 20,}}>
                              <Text style={styles.addPopUpCard_title}>Préparation</Text>
                              <View style={{width: "100%", alignItems: "center"}}>
                                <View style={{height: 50, width: 300, flexDirection: "row", margin: 20,}}>
                                  <TouchableOpacity
                                    style={[styles.prepareModeStyleSaisi, {flexDirection: "row", justifyContent: "center", alignItems: "center",  borderWidth: 1, borderColor: "#00AAFF", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, width: "50%", height: "100%",}]}
                                    onPress={() => this.setState({prepareMode: {saisi: true, barecode: false}})}>
                                    <Text style={{fontSize: 20, fontWeight: "bold", color: "#00AAFF"}}>Saisi</Text>
                                    <Icon name="edit" size={20} style={{color: "#00AAFF", marginLeft: 10}}/>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    style={[styles.prepareModeStyleBarecode, {flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#00AAFF", borderTopRightRadius: 10, borderBottomRightRadius: 10, width: "50%", height: "100%",}]}
                                    onPress={() => this.setState({prepareMode: {saisi: false, barecode: true}})}>
                                    <Text style={{fontSize: 20, fontWeight: "bold", color: "#00AAFF"}}>Code Bare</Text>
                                    <Icon name="barcode" size={20} style={{color: "#00AAFF", marginLeft: 10}}/>
                                  </TouchableOpacity>
                                </View>
                                
                              </View>
                              <View style={{width: "100%", alignItems: "center"}}>
                                <View style={{backgroundColor: "#dbdbdb", borderRadius: 5, height: 80, width: 150}}>
                                  <ScrollView 
                                    style={{flex: 1}} 
                                    horizontal= {true}
                                    decelerationRate={0}
                                    snapToInterval={150} //your element width
                                    snapToAlignment={"center"}>
                                      {this.state.pickingDataOptions.map((item, index) => (
                                        <View style={{width: 150, alignItems: "center"}}>
                                          <Text style={{color: "#00AAFF", fontSize: 25, fontWeight: "bold", margin: 20}}>{item.label}</Text>
                                        </View>
                                      ))}
                                  </ScrollView>
                                </View>
                                
                                <View style={{width: "100%", marginTop: "10%"}}>
                                  <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                    <TouchableOpacity
                                      style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                      onPress={() => remove_1_ToTextInput()}>
                                      <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                      <Text style={{fontSize: 20}}>1</Text>
                                    </TouchableOpacity>

                                    <Text style={{color: "#000", fontSize: 20, width: 50, marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing}</Text>

                                    <TouchableOpacity
                                      style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                      onPress={() => add_1_ToTextInput()}>
                                      <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                      <Text style={{fontSize: 20}}>1</Text>
                                    </TouchableOpacity>

                                  </View>

                                  <Slider
                                    step = { 10 } 
                                    minimumValue = { 0 } 
                                    maximumValue = { 1000 } 
                                    minimumTrackTintColor = "#00AAFF" 
                                    maximumTrackTintColor = "#dbdbdb"
                                    thumbTintColor = "#706FD3"
                                    onValueChange={(ChangedValue) => this.setState({ addRemoveNothing: ChangedValue })}
                                    style = {{ width: '100%' }} 
                                    />

                                </View>
                              </View>
                            </View>
                          </View>
                        </CardView>
                      </View>
                  </Modal>

                  {/* <CardView cardElevation={25} cornerRadius={5} style={[styles.addPopUpCard, {}]}>
                    <View style={styles.addPopUpCard_body}>
                    <LinearGradient
                      start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                      colors={['#00AAFF', '#706FD3']}
                      style={{width: "100%", flexDirection: "row", justifyContent: "flex-end", }}>

                          <TouchableOpacity
                            style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                            onPress={() => remove_10_ToTextInput()}>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Annuler</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                            onPress={() => remove_10_ToTextInput()}>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Ok</Text>
                          </TouchableOpacity>
                      </LinearGradient>

                      <View style={{padding: 20,}}>
                        <Text style={styles.addPopUpCard_title}>Préparation</Text>
                        <View style={{width: "100%", alignItems: "center"}}>
                          <View style={{backgroundColor: "#dbdbdb", borderRadius: 5, height: 80, width: 150}}>
                            <ScrollView 
                              style={{flex: 1}} 
                              horizontal= {true}
                              decelerationRate={0}
                              snapToInterval={150} //your element width
                              snapToAlignment={"center"}>
                                {this.state.pickingDataOptions.map((item, index) => (
                                  <View style={{width: 150, alignItems: "center"}}>
                                    <Text style={{color: "#00AAFF", fontSize: 25, fontWeight: "bold", margin: 20}}>{item.label}</Text>
                                  </View>
                                ))}
                            </ScrollView>
                          </View>
                          
                          <View style={{width: "100%", marginTop: "10%"}}>
                            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                              <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                onPress={() => remove_1_ToTextInput()}>
                                <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                <Text style={{fontSize: 20}}>1</Text>
                              </TouchableOpacity>

                              <Text style={{color: "#000", fontSize: 20, width: 50, marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing}</Text>

                              <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                onPress={() => add_1_ToTextInput()}>
                                <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                <Text style={{fontSize: 20}}>1</Text>
                              </TouchableOpacity>

                            </View>

                            <Slider
                              step = { 10 } 
                              minimumValue = { 0 } 
                              maximumValue = { 1000 } 
                              minimumTrackTintColor = "#00AAFF" 
                              maximumTrackTintColor = "#dbdbdb"
                              thumbTintColor = "#706FD3"
                              onValueChange={(ChangedValue) => this.setState({ addRemoveNothing: ChangedValue })}
                              style = {{ width: '100%' }} 
                              />

                          </View>
                        </View>
                      </View>
                    </View>
                  </CardView> */}

                <ScrollView style={{flex: 1}}>
                {
                    this.state.data.map((item, index) => (
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
                                    <Text>Lot : xxxxxxxxxx</Text>
                                  </View>
                                  <View style={styles.ic_and_details}>
                                    <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                    <Text>DLC : {moment(new Date(new Number("1601892911000"))).format('DD-MM-YYYY')}</Text>
                                  </View>
                                  <View style={styles.ic_and_details}>
                                    <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                    <Text>DLUO : {moment(new Date(new Number("1601892911000"))).format('DD-MM-YYYY')}</Text>
                                  </View>
                                  <View style={styles.ic_and_details}>
                                    <Icon name="warehouse" size={15} style={styles.iconDetails} />
                                    <Text>Enplacement : xxxxxxxxxx</Text>
                                  </View>
                                  <View style={[styles.ic_and_details, {width: "100%", justifyContent: "space-between"}]}>
                                    <View style={{width: "30%", flexDirection: "row", justifyContent: "flex-start"}}>
                                      <Icon name="boxes" size={15} style={styles.iconDetails} />
                                      <Text>{item.qty} en Stock</Text>
                                    </View>
                                    <View style={{width: "30%", flexDirection: "row", justifyContent: "center", marginRight: 20}}>
                                      <Icon name="boxes" size={15} style={styles.iconDetails} />
                                      <Text>{item.qty} Commandé</Text>
                                    </View>
                                    <View style={{width: "30%", flexDirection: "row", justifyContent: "flex-end", marginRight: 20}}>
                                      <Icon name="truck-loading" size={15} style={styles.iconDetails} />
                                      <Text>{item.qty} Préparé</Text>
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
                                      <Text>{item.qty} en Stock</Text>
                                    </View>
                                    <View style={{width: "30%", flexDirection: "row", justifyContent: "center", marginRight: 20}}>
                                      <Icon name="boxes" size={15} style={styles.iconDetails} />
                                      <Text>{item.qty} Commandé</Text>
                                    </View>
                                    <View style={{width: "30%", flexDirection: "row", justifyContent: "flex-end", marginRight: 20}}>
                                      <Icon name="truck-loading" size={15} style={styles.iconDetails} />
                                      <Text>{item.qty} Préparé</Text>
                                    </View>
                                  </View>

                                <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                                </View>
                                
                              </View>
                            </View>
                          </CardView>
                        }

                      </TouchableOpacity>
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
          <OrderDetailButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)}/>
          {/* END Main twist button */}

        </View>
        <MyFooter_v2 />
      </LinearGradient>
    );
  }
}

// define your styles


//make this component available to the app
export default CommandeDetails;