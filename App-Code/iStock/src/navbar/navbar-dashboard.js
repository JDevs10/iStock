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

export default class NavbarDashboard extends Component {
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
          padding: 10,
          height: "20%",
          width: "100%",
          flexDirection: 'row',
          // backgroundColor: 'black'
      },
      layout:{
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
      power_image: {
        width: DeviceInfo.isTablet() ? 40 : 20, 
        height: DeviceInfo.isTablet() ? 40 : 20,
        // margin: 10,
        // position: "relative",
        // left: 0
      }
  });

    return (
      <View style={styles.body}> 

        <View style={[styles.layout, {justifyContent: "flex-start", alignItems: "flex-start", width: "10%"}]}>
          <Text style={styles.text}></Text>
        </View>

        <View style={[styles.layout, {flex: 1, width: "50%"}]}>
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


