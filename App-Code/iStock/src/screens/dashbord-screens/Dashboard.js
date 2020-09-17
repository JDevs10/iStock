import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Image, Button, StatusBar, Animated, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import NavbarHome from '../../navbar/navbar-home';
import MyFooter from '../footers/Footer';
import DeviceInfo, { isLandscape } from 'react-native-device-info';
import MainButton from '../dashbord-screens/assets/MainButton';


export default class Dashboard extends Component {
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
        height: this.state.orientation === 'portrait' ? '80%' : '60%',
        width: '100%',
        position: "absolute",
        bottom: this.state.orientation === 'portrait' ? "12%" : "22%",
      }
    });


    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarHome navigation={this.props} />
        <View style={styles.mainBody}>
          <ScrollView style={{ flex: 1 }}>


          </ScrollView>


          {/* Main twist button */}
          <MainButton navigation={this.props.navigation} />
          {/* END Main twist button */}
        </View>
        <MyFooter />
      </LinearGradient>
    );
  }
}


