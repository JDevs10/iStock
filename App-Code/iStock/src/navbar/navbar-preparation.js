import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, Alert} from  'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Strings from "../utilities/Strings";
const STRINGS = new Strings();
const IMG_SRC = require('../../img/banner.png');


export default class NavbarPreparation extends Component {
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
  async syncOrders(){
    Alert.alert(
      STRINGS._SYNCHRO_COMMANDE_TITTLE_, 
      STRINGS._SYNCHRO_COMMANDE_TEXT_,
      [
        {text: "Oui", onPress: () => {
          this.props._navigation.navigation.navigate('OrdersSync');
        }},
        {text: "Non"}
      ],
      { cancelable: false }
    );
  }

  async support(){
    this.props._navigation.navigation.navigate('Support');
  }

  async shipments(){
    this.props._navigation.navigation.navigate('Expeditions');
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
              <Icon name="cloud" size={25} style={{color: "#fff"}} onPress={() => this.syncOrders()}/>
              <Icon name="truck" size={25} style={{color: "#fff"}} onPress={() => this.shipments()}/>
            </View>

            <View style={styles.text_layout}>
              <Text style={styles.text}>{this.props.textTittleValue}</Text>
            </View>

            <View style={[styles.icon2]}>
              <Icon name="headset" size={25} style={{color: "#fff"}} onPress={() => this.support()}/>
            </View>
            

        </ImageBackground>

      </View>
    );
  }
}


