import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, BackHandler, Alert, Dimensions, AsyncStorage } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
const IMG_SRC = require('../../img/banner.png');

export default class NavbarHome extends Component {
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.existPressed);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.existPressed);
  }

  existPressed = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        { text: 'No', onPress: () => this.leaving(false) },
        { text: 'Yes', onPress: () => this.leaving(true) },
      ],
      { cancelable: false });
    return true;
  }

  async leaving(isLeaving) {
    if (isLeaving == true) {
      await AsyncStorage.removeItem('token');
      BackHandler.exitApp();
    } else {
      console.log('Cancel Pressed');
    }
  }

  render() {
    if (this.state.orientation === 'portrait') {
      console.log('orientation : ', this.state.orientation);
    }
    else {
      console.log('orientation : ', this.state.orientation);
    }

    const disconnect = () => {
      this.existPressed();
    }


    const styles = StyleSheet.create({
      body: {

        // backgroundColor: 'black'

        height: 250,
        width: '100%',
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

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
      text: {
        flex: 1,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20
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
        <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />

        <Icon name="power-off" size={25} style={styles.icon1} onPress={() => disconnect()} />
        <Icon name="headset" size={25} style={styles.icon2} />



      </View>
    );
  }
}


