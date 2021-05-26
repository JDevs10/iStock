import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, Alert} from  'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { STRINGS } from "../utilities/STRINGS";
const IMG_SRC = require('../../img/banner.png');

// create a component
class NavbarShipment extends Component {
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

      // sync all orders from server
    async syncShipments(){
        Alert.alert(
            STRINGS._SYNCHRO_SHIPMENT_TITTLE_, 
            STRINGS._SYNCHRO_SHIPMENT_TEXT_,
            [
              {text: "Oui", onPress: () => {
                this.props._navigation.navigation.navigate('ShipmentsSync');
              }},
              {text: "Non"}
            ],
            { cancelable: false }
          );
    }

    async goToSupport(){
        this.props._navigation.navigation.navigate('Support');
    }

    async goToOrders(){
        this.props._navigation.navigation.navigate('Preparation');
    }


    render() {
        const styles = StyleSheet.create({
            body: {
              height: 250,
              width: '100%',
              flexDirection: 'row',
            },
            backdrop: {
              flex: 1,
              width: '100%'
            },
            layout: {
              // flex: 1,
              padding: 10,
              height: this.state.orientation === "portrait" ? "40%" : "50%",
              // width: "30%",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: 'black'
            },
            text_layout:{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            },
            text: {
              // flex: 1,
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              textAlign: "center"
            },
            icon1: {
              color: '#ffffff',
              alignItems: 'flex-end',
              position: 'absolute',
              right: 20,
              top: 20,
            },
            icon2: {
              color: '#ffffff',
              alignItems: 'flex-end',
              position: 'absolute',
              left: 20,
              top: 20,

            },
        });

        return (
            <View style={styles.body}>
                <ImageBackground source={IMG_SRC} resizeMode='cover' style={styles.backdrop}>

                    <View style={[styles.icon1, {width: 100, flexDirection: "row", justifyContent: "space-between"}]}>
                        <Icon name="cloud" size={25} style={{color: "#fff"}} onPress={() => this.syncShipments()}/>
                        <Icon name="clipboard-list" size={25} style={{color: "#fff"}} onPress={() => this.goToOrders()}/>
                    </View>

                    <View style={styles.text_layout}>
                        <Text style={styles.text}>{this.props.textTittleValue}</Text>
                    </View>

                    <View style={[styles.icon2]}>
                        <Icon name="headset" size={25} style={{color: "#fff"}} onPress={() => this.goToSupport()}/>
                    </View>


                </ImageBackground>

            </View>
        );
    }
}

//make this component available to the app
export default NavbarShipment;