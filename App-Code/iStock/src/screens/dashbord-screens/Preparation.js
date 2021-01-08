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
import NavbarPreparation from '../../navbar/navbar-preparation';
import MyFooter_v2 from '../footers/MyFooter_v2';
import PreparationButton from '../dashbord-screens/assets/PreparationButton';
import SettingsManager from '../../Database/SettingsManager';
import OrderManager from '../../Database/OrderManager';
import Statut from '../../utilities/Statut';
import moment from "moment";
import OrderFilter from './assets/OrderFilter';

const _statut_ = new Statut();
const isAtToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 0.5;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

class Preparation extends Component {
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
      isFilter: false,
      filterConfig: {},
      data: [],
      settings: {},
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
    await this._settings();
    await this._getPickingData();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      // Prevent default action
      await this._settings();
      await console.log('Done settings update!');
      console.log('new settings : ', this.state.settings);
      console.log('listener filterConfig : ', this.state.filterConfig);
      await this._getPickingData();
      return;
    });
  }

  _Showcommande = (value) => {
    console.log(value);
    //alert('Obj: \n' + JSON.stringify(value));
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
    await this.setState({isLoading: true});
    let data_ = [];

    console.log("this.state.filterConfig : ", await Object.keys(this.state.filterConfig).length);
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

    await this.setState({ data: data_, isLoading: false});
  }

  _onFilterPressed(data){
    console.log("_onFilterPressed : ", data);
    this.setState({isFilter: data.isFilter});
  }

  // _onUpdateFilterData(data){
  //   console.log("_onUpdateFilterData : ", data);
  // }

  async _onDataToFilter(data){
    console.log("Filter config data : ", data);

    await this.setState({filterConfig: data});
    await this._getPickingData();
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

    this.setState({isLoadingMoreData: false});
    await this.setState({data: newData});
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

        <NavbarPreparation _navigation={this.props} textTittleValue={"Préparation"} />
        <View style={styles.mainBody}>
          
          <OrderFilter onDataToFilter={this._onDataToFilter.bind(this)} settings={{isFilter: this.state.isFilter}}/>

          <ScrollView 
            ref={this.scrollRef} 
            onScroll={({nativeEvent}) => {
              if (isAtToBottom(nativeEvent)) {
                console.log("Reach at the end!");
                //this.loadMoreData();
              }
            }}
            scrollEventThrottle={400}
            style={{ flex: 1 }}>
            {
              this.state.data.map((item, index) => (
                <View>
                  {/* {item.statut === 1 ? */}
                    {!this.state.isLoading ? 
                      <View>
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
                                    <Icon name="user" size={15} style={styles.iconDetails}/>
                                    <Text>Créé par : <Text style={{fontWeight: "bold"}}>{item.user}</Text></Text>
                                  </View>
                                  <View style={styles.ic_and_details}>
                                    <Icon name="boxes" size={15} style={styles.iconDetails}/>
                                    <Text>{item.lines_nb} Produit(s)</Text>
                                  </View>
                                  <View style={styles.ic_and_details}>
                                    <View style={{flexDirection: "row", width: "80%"}}>
                                      <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                      <Text>Faite le : <Text style={{fontWeight: "bold"}}>{moment(new Date(new Number(item.date_commande+"000"))).format('DD-MM-YYYY')}</Text></Text>
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
          <PreparationButton navigation={this.props.navigation} isFilterPressed={this._onFilterPressed.bind(this)}/>
          {/* END Main twist button */}

        </View>
        <MyFooter_v2 />
      </LinearGradient>
    );
  }
}

export default Preparation;