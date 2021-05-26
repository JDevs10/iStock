import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Alert, BackHandler } from 'react-native';
import TokenManager from '../../Database/TokenManager';
import FindCommandes from '../../services/FindCommandes';
import FindCommandesLines from '../../services/FindCommandesLines';
import { STRINGS } from "../../utilities/STRINGS";
import { changeKeepAwake } from '../../utilities/Utils';
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../../utilities/MyLogs';
import FindPreSync from '../../services/FindPreSync';
import OrderManager from '../../Database/OrderManager';
import OrderLinesManager from '../../Database/OrderLinesManager';
import OrderContactManager from '../../Database/OrderContactManager';
import axios from 'axios';
const BG = require('../../../img/waiting_bg.png');


export default class OrdersSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingNotify: "Synchronisation des Commandes...\nVeuillez ne pas éteindre l'application."
    };
  }

  async componentDidMount(){
    writeInitLog(LOG_TYPE.INFO, OrdersSync.name, this.componentDidMount.name);
    await this.sync();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      writeBackInitLog(LOG_TYPE.INFO, OrdersSync.name, this.componentDidMount.name);
      await this.sync();
      return;
    });
  }

  async sync(){
    writeLog(LOG_TYPE.INFO, OrdersSync.name, this.sync.name, "Show sync options...");

    Alert.alert(
      STRINGS._SYNCHRO_COMMANDE_TITTLE_, 
      STRINGS._SYNCHRO_COMMANDE_TEXT_OPTIONS_,
      [
        {text: "Option 1", onPress: async () => {await this.sync_all()}},
        {text: "Option 2", onPress: async () => {await this.sync_new()}},
        {text: "Annuler", onPress: async () => {await this.props.navigation.goBack()}}
      ],
      { cancelable: false }
    );
  }

  async sync_all(){
    this.props.navigation.navigate('DownloadIntern');
  }


  async sync_new(){
    this.props.navigation.navigate('DownloadNew');
  }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                <Image source={BG} style={styles.backdrop} />
            </View>
                <Image style={styles.logo} source={require('../../../img/Loading.gif')} />
            <Text style={styles.text}>{this.state.loadingNotify}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({

    backgroundContainer: {
      position: 'absolute',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff'
    },
    logo: {
      marginTop: 150,
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdrop: {
      width: 450,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'column'
    },
    text: {
      fontSize: 20,
      color: "#4A4AD4",
      fontWeight: "bold",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80
    }
  });