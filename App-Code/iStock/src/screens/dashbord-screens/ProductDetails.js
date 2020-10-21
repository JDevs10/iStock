//import liraries
import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, FlatList, Image, Dimensions, Alert, ImageBackground } from 'react-native';
import { Card, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo from 'react-native-device-info';
import ProductDetailButton from './assets/ProductDetailButton';
import ProductsManager from '../../Database/ProductsManager';
import SettingsManager from '../../Database/SettingsManager';

// create a component
class ProductDetails extends Component {
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
      productId: this.props.route.params.product.ref,
      data: [],
      settings: {},
      orientation: isPortrait() ? 'portrait' : 'landscape',
      qte_cmd: 1,
      remise: 0,
      prixUnitaire: 0,
      PTTC: 0,
      PTTC_List: false,
      emplacement: "",
      emplacement_List: false,
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  async componentDidMount(){
    await this._settings();
    await this._productData();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      // Prevent default action
      await this._settings();
      await console.log('Done settings update!');
      console.log('new settings : ', this.state.settings);
      await this._productData();
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
    this.setState({settings: settings});
  }

  async _productData(){
    const pm = new ProductsManager();
    const data = await pm.GET_PRODUCT_BY_ID(this.state.productId).then(async (val) => {
      return await val;
    });
    this.setState({data: data});
  }


  pttcSelected = (value) => {
    this.setState(
      {
        ...this.state,
        PTTC: value.value,
        PTTC_List: !this.state.PTTC_List,
      }
    )
  }

  emplacementSelected = (value) => {
    this.setState(
      {
        ...this.state,
        emplacement: value.name,
        emplacement_List: !this.state.emplacement_List,
      }
    )
  }



  render() {
    const params = this.props.route.params;
    const product = params ? params.product : null;
    console.log('product : ', product);

    const pttcList = [
      { id: 1, name: "PTTC : 9.95", value: 9.95 },
      { id: 2, name: "PTTC : 1.99", value: 1.99 },
      { id: 3, name: "PTTC : 4.50", value: 4.50 },
    ];
    const emplacementList = [
      { id: 1, name: "Emplecement 1" },
      { id: 2, name: "Emplecement 2" },
      { id: 3, name: "Emplecement 3" },
      { id: 4, name: "Emplecement 4" },
      { id: 5, name: "Emplecement 5" },
    ];


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
        paddingHorizontal: 20,
        paddingVertical: 30,
        height: this.state.orientation === 'portrait' ? '84%' : '74%',
        width: '100%',
        position: "absolute",
        bottom: this.state.orientation === 'portrait' ? "10%" : "20%",
        marginBottom: 5
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
        width: '60%',
      },
      articlename: {
        color: '#00AAFF',
        fontSize: 30,
        fontWeight: "bold"
        //marginBottom: 15,
      },
      aref: {
        width: '40%',
      },
      ref: {
        fontSize: 15,
        fontWeight: "bold"
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
      subtexts: {
        //fontSize: 12,
        color: '#a8a8a8'
      },
      Buttons_actions: {
        backgroundColor: '#706FD3',
        height: 60,
        width: 60,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        textAlignVertical: 'center'
      },
      Buttons_del: {
        backgroundColor: '#dbdbdb',
        height: 60,
        width: 60,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        textAlignVertical: 'center'
      },
      button_del_text: {
        fontSize: 40,
        color: '#706FD3',
        paddingBottom: 10
      },
      buttons_text: {
        fontSize: 40,
        color: '#ffffff'
      },
      qtys_input: {
        flex: 15,
        marginLeft: 20,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "bold",

      },
      qtys_container: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "row",
        padding: 5,
        borderColor: '#706FD3',
        borderRadius: 50,
        borderWidth: 2
      },
      ttc_container: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderColor: "#706FD3",
        borderRadius: 50,
        borderWidth: 2
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
    });


    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarDashboard navigation={this.props} textTittleValue={Object.keys(this.state.data).length == 0 ? "Aucun Produit" : "Produit " + product.name} />
        <View style={styles.mainBody}>
          <ScrollView style={{ flex: 1 }}>

            {Object.keys(this.state.data).length == 0 ? 
            <View>
              <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                <View>
                  <Text style={styles.lastCard_text}>No More Data...</Text>
                </View>
              </CardView>
            </View>
            :
            <View>
              <Text>{JSON.stringify(this.state.data)}</Text>

              <CardView cardElevation={10} cornerRadius={5} style={styles.cardViewStyle}>
                <View style={styles.cardViewStyle1}>
                  <View style={[styles.article, { flexDirection: "row" }]}>
                    <View>
                      {this.state.settings.isUseImages ? 
                        <Image style={{ width: DeviceInfo.isTablet() ? 400 : 50, height: DeviceInfo.isTablet() ? 400 : 50 }} source={{uri: product.image}} />
                      : 
                        <Image style={{ width: DeviceInfo.isTablet() ? 400 : 50, height: DeviceInfo.isTablet() ? 400 : 50 }} source={require('../../../img/no_image.jpeg')} />
                      }
                      </View>
                    <View style={{ flex: 1, marginLeft: 40 }}>
                      <View style={styles.ic_and_details}>
                        <View style={styles.aname}>
                          <Text style={styles.articlename}>{product.name}</Text>
                          <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Text style={styles.subtexts}>Référence : </Text>
                            <Text style={styles.ref}>{product.ref}</Text>
                          </View>
                          <View style={{ flexDirection: "row", marginBottom: 50 }}>
                            <Text style={styles.subtexts}>Code-Barre : </Text>
                            <Text style={styles.ref}>xxxxxxxx</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.ic_and_details]}>
                        <View>
                          <Text style={styles.subtexts}>Description : </Text>
                          <Text>XXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXX XXXXXXXXXXX XX XXXXX XX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</Text>
                        </View>
                      </View>
                      <View style={[styles.ic_and_details, { marginTop: 40 }]}>
                        <Icon name="boxes" size={15} style={styles.iconDetails} />
                        <Text>XXX en stock</Text>
                      </View>
                      <View style={[styles.ic_and_details]}>
                        <Icon name="boxes" size={15} style={styles.iconDetails} />
                        <Text>N°Lot : XXXXXXXXXXX</Text>
                      </View>
                      <View style={[styles.ic_and_details]}>
                        <Icon name="boxes" size={15} style={styles.iconDetails} />
                        <Text>DLC : xx/xx/xxxx</Text>
                      </View>
                      <View style={[styles.ic_and_details]}>
                        <Icon name="boxes" size={15} style={styles.iconDetails} />
                        <Text>DLUO : xx/xx/xxxx</Text>
                      </View>
                      <View style={[styles.ic_and_details]}>
                        <Icon name="boxes" size={15} style={styles.iconDetails} />
                        <Text>Emplacement : xxxxx</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardView>
            </View>
            }

            



          </ScrollView>


          {/* Main twist button */}
          <ProductDetailButton navigation={this.props.navigation} />
          {/* END Main twist button */}

        </View>
        <MyFooter_v2 />
      </LinearGradient>
    );
  }
}

//make this component available to the app
export default ProductDetails;
