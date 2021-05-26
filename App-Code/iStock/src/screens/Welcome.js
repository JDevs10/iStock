import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
import MyFooter from './footers/MyFooter';
const IMG_SRC = require('../../img/bg.png');
const LOGO = require('../../img/logo_istock.png');
import { creatLogDir, writeInitLog, writeLog, LOG_TYPE } from '../utilities/MyLogs';


class Welcome extends Component {

  componentDidMount() {
    creatLogDir();
    writeInitLog(LOG_TYPE.INFO, Welcome.name, this.componentDidMount.name);
    
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