import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, Dimensions, Alert } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ButtonSpinner from 'react-native-button-spinner';
import LinearGradient from 'react-native-linear-gradient';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter_v2 from '../footers/MyFooter_v2';
import PreparationButton from '../dashbord-screens/assets/PreparationButton';
import SettingsManager from '../../Database/SettingsManager';
import OrderManager from '../../Database/OrderManager';
import Statut from '../../utilities/Statut';
import moment from "moment";
import OrderFilter from './assets/OrderFilter';

const _statut_ = new Statut();

class Preparation extends Component {
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
      isFilter: false,
      data: [],
      settings: {},
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
    await this._settings();
    await this._getPickingData();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      // Prevent default action
      await this._settings();
      await console.log('Done settings update!');
      console.log('new settings : ', this.state.settings);
      await this._getPickingData();
      return;
    });
  }

  _Showcommande = (value) => {
    console.log(value);
    alert('Obj: \n' + JSON.stringify(value));
    this.props.navigation.navigate("CommandeDetails", { order: value });
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

  async _getPickingData(){
    this.setState({isLoading: true});

    const om = new OrderManager();
    await om.initDB();
    const data = await om.GET_ORDER_LIST_BETWEEN_v2(0, 20).then(async (val) => {
      console.log("Order data : ", val);
      return await val;
    });

    this.setState({ data: data, isLoading: false});
  }

  _onFilterPressed(data){
    console.log("_onFilterPressed : ", data);
    this.setState({isFilter: data.isFilter});
  }

  _onUpdateFilterData(data){
    console.log("_onUpdateFilterData : ", data);
  }

  _onDataToFilter(data){
    console.log("Filter config data : ", data); 
  }


  render() {

    if (this.state.orientation === 'portrait') {
      console.log('orientation : ', this.state.orientation);
    }
    else {
      console.log('orientation : ', this.state.orientation);
    }

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
        height: this.state.orientation === 'portrait' ? '84%' : '74%',
        width: '100%',
        position: "absolute",
        bottom: this.state.orientation === 'portrait' ? "10%" : "15%",
      },
      cardViewStyle: {
        width: '95%',
        // height: 320,
        margin: 10,
        // marginBottom: 20,
      },
      cardViewStyle1: {
        // paddingTop: 20,
        width: '100%',
        //height: 150,
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
      order: {
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
      cdate: {
        width: '20%',
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
        width: '100%',
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
    });



    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarDashboard navigation={this.props} textTittleValue={"Préparation"} />
        <View style={styles.mainBody}>
          
          <OrderFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

          <ScrollView style={{ flex: 1 }}>
            {
              this.state.data.map((item, index) => (
                <View>
                  {/* {item.statut === 1 ? */}
    
                    {this.state.settings.isUseDetailedCMD ? 
                     
                      <CardView key={index} cardElevation={10} cornerRadius={5} style={styles.cardViewStyle}>
                        <View style={styles.cardViewStyle1}>
                          <View style={styles.order}>
                            <TouchableOpacity onPress={() => this._Showcommande(item)}>
                              <View style={styles.ic_and_details}>
                                <View style={styles.cname}>
                                  <Text style={styles.entreprisename}>{item.client_name}</Text>
                                </View>
                                <View style={styles.cdate}>
                                  {item.id == 0 ? (<Text>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref_commande}</Text>)}
                                </View>
                              </View>
                              <View style={styles.ic_and_details}>
                                <Icon name="boxes" size={15} style={styles.iconDetails} />
                                <Text>{item.lines_nb} Produit(s)</Text>
                              </View>
                              <View style={styles.ic_and_details}>
                                <View style={{flexDirection: "row", width: "80%"}}>
                                  <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                  <Text>Faite le : {moment(new Date(new Number(item.date_commande+"000"))).format('DD-MM-YYYY')}</Text>
                                </View>
                                <View style={styles.cdate}>
                                  <Text style={styles.date}>Livré Le {moment(new Date(new Number(item.date_livraison+"000"))).format('DD-MM-YYYY')}</Text>
                                </View>
                              </View>
                              <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                              <View style={styles.pricedetails}>
                                <View style={styles.price}>
                                  <Text>Total TTC : {item.total_ttc > 0 ? (parseFloat(item.total_ttc)).toFixed(2) : '0'} €</Text>
                                </View>
                                <View style={[styles.billedstate, {backgroundColor: _statut_.getOrderStatutColorStyles(item.statut)}]}>
                                  <Text style={{color: "#000"}}>{_statut_.getOrderStatut(item.statut)}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                            <View style={styles.butons_commande}>
                              {/* <ButtonSpinner style={styles.submit_on} positionSpinner={'right'} onPress={() => this._relance_commande(item.ref_commande)} styleSpinner={{ color: '#FFFFFF' }}>
                                <Icon name="sync" size={20} style={styles.iconValiderpanier} />
                                <Text style={styles.iconPanier}> Relancer la commande</Text>
                              </ButtonSpinner> */}
                              {/* {0 === 0 ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)} */}
                            </View>
                          </View>
                        </View>
                      </CardView>
                    : 
                      <CardView key={index} cardElevation={5} cornerRadius={5} style={[styles.cardViewStyle, {height: 120}]}>
                        <View style={[styles.cardViewStyle1, {paddingTop: 0}]}>
                            <View style={styles.order}>
                                <TouchableOpacity onPress={() => this._Showcommande(item)}>
                                <View style={styles.ic_and_details}>
                                    <View style={styles.cname}>
                                      <Text style={styles.entreprisename}>{item.client_name}</Text>
                                    </View>
                                    {/* <View style={styles.cdate}>
                                      {item.id == 0 ? (<Text>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref_commande}</Text>)}
                                    </View> */}
                                    <View style={styles.cdate}>
                                      <Text style={styles.date}>Livré Le {moment(new Date(new Number(item.date_livraison+"000"))).format('DD-MM-YYYY')}</Text>
                                    </View>
                                </View>
                                <View style={styles.ic_and_details}>
                                  <Icon name="boxes" size={15} style={styles.iconDetails} />
                                  <Text>{item.lines_nb} Produit(s)</Text>
                                </View>
                                <View style={styles.refDetails}>
                                  {/* <View style={styles.cdate}> */}
                                    {item.id == 0 ? (<Text>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref_commande}</Text>)}
                                  {/* </View> */}
                                </View>
                                  <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                                </TouchableOpacity>
                                <View style={styles.butons_commande}>
                                  {/* {1 === 0 ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)} */}
                                </View>
                            </View>
                        </View>
                      </CardView>
                    }

                {/* : 
                  null
                } */}
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
          <PreparationButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)}/>
          {/* END Main twist button */}

        </View>
        <MyFooter_v2 />
      </LinearGradient>
    );
  }
}

export default Preparation;