import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, Footer, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyFooter from './footers/Footer';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { color } from 'react-native-reanimated';

const IMG_SRC = require('../../img/bg.png');
const LOGO = require('../../img/logo_istock.png');


class Welcome extends Component {

  componentDidMount() {
    setTimeout(() => {
      //this.props.navigation.navigate('loading');
      this.props.navigation.navigate('loading');
    }, 2500);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />
        </View>
        <Image style={styles.logo} source={LOGO} />
        <MyFooter style={styles.footer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 350,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    flex: 1,
    flexDirection: 'column'
  }
});

export default Welcome;