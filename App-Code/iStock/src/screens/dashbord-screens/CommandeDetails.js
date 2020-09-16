//import liraries
import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, FlatList, Image, Dimensions, Alert, ImageBackground } from 'react-native';
import { Card, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter from '../footers/Footer';
import DeviceInfo from 'react-native-device-info';
import OrderDetailButton from './assets/OrderDetailButton';

// create a component
class CommandeDetails extends Component {
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
      orientation: isPortrait() ? 'portrait' : 'landscape'
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  productDetails = (value) => {
    // alert('Obj: \n' + JSON.stringify(value));
    this.props.navigation.navigate("ProductDetails", { product: value });
  }


  render() {
    // console.log('this.props.navigation : ', this.props.route.params);

    const params = this.props.route.params;
    const order = params ? params.order : null;
    console.log('order : ', order);


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
        bottom: this.state.orientation === 'portrait' ? "10%" : "15%",
      },
      cardViewStyle: {
        width: '95%',
        height: 150,
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
    });


    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarDashboard navigation={this.props} textTittleValue={"Commande " + order.ref} />
        <View style={styles.mainBody}>

          <ScrollView style={{ flex: 1 }}>
            {
              order.lines.map((item, index) => (
                <TouchableOpacity onPress={() => this.productDetails(item)}>

                  <CardView key={index} cardElevation={10} cornerRadius={5} style={styles.cardViewStyle}>
                    <View style={styles.cardViewStyle1}>
                      <View style={[styles.article, { flexDirection: "row" }]}>
                        <View>
                          <Image style={{ width: DeviceInfo.isTablet() ? 100 : 50, height: DeviceInfo.isTablet() ? 100 : 50 }} source={require('../../../img/no_image.jpeg')} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <View style={styles.ic_and_details}>
                            <View style={styles.aname}>
                              <Text style={styles.articlename}>{item.name}</Text>
                            </View>
                            <View style={styles.aref}>
                              <Text style={styles.ref}>{item.ref}</Text>
                            </View>
                          </View>
                          <View style={styles.ic_and_details}>
                            <Icon name="boxes" size={15} style={styles.iconDetails} />
                            <Text> XXX Produit(s)</Text>
                          </View>

                          <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />

                          <View style={styles.pricedetails}>
                            <View style={styles.price}>
                              <Text>Total TTC : {item.prixTotalTTC > 0 ? (parseFloat(item.prixTotalTTC)).toFixed(2) : '0'} €</Text>
                            </View>
                            {/* <View style={styles.billedstate}>
                                  {item.etat === 0 ? (<Text style={styles.billedtext_no}>Non Validé</Text>) : (<Text style={styles.billedtext_ok}>Validé</Text>)}
                                </View> */}
                          </View>
                        </View>

                      </View>
                    </View>
                  </CardView>

                </TouchableOpacity>
              ))
            }

          </ScrollView>




          {/* Main twist button */}
          <OrderDetailButton navigation={this.props.navigation} />
          {/* END Main twist button */}

        </View>
        <MyFooter />
      </LinearGradient>
    );
  }
}

// define your styles


//make this component available to the app
export default CommandeDetails;
