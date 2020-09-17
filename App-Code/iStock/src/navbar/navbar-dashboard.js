import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Dimensions} from  'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class NavbarDashboard extends Component {
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

  render() {
    if (this.state.orientation === 'portrait') {
      console.log('orientation : ', this.state.orientation);
    }
    else {
      console.log('orientation : ', this.state.orientation);
    }


    const styles = StyleSheet.create({
      body: {
        //padding: 10,
        height: "10%",
        width: "100%",
        flexDirection: 'row',
        // backgroundColor: 'black'
      },

      text: {
        flex: 1,
        marginTop: 10,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 25,
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


        <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", }}>
          <Text style={styles.text}>{this.props.textTittleValue}</Text>
        </View>

        <View style={[styles.layout, {justifyContent: "flex-end", alignItems: "flex-end", width: "10%"}]}>
          {/* <TouchableOpacity
            onPress={() => disconnect()}>
            <Image style={styles.power_image} source={require('../../img/power-off.png')}/>                  
          </TouchableOpacity> */}
          <Text style={styles.text}></Text>
        </View>

      </View>
    );
  }
}


