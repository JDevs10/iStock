import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Alert, StatusBar } from 'react-native';
import TokenManager from '../../Database/TokenManager';
import FindWarehouses from '../../services/FindWarehouses';
import Strings from "../../utilities/Strings";
const STRINGS = new Strings();
const BG = require('../../../img/waiting_bg.png');


export default class WarehousesSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingNotify: "Synchronisation des Entrepots...\nVeuillez ne pas éteindre l'application."
    };
  }

  async componentDidMount(){
    await this.sync();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      await this.sync();
      return;
    });

  }

  async sync(){
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    const findWarehouses = new FindWarehouses();
    const res = await findWarehouses.getAllWarehousesFromServer(token).then(async (val) => {
      console.log('findWarehouses.getAllWarehousesFromServer : ');
      console.log(val);
      return val;
    });
    
    if(res){
      console.log("Remove loading screen!");
      this.props.navigation.navigate("Dashboard");
    }else{
      Alert.alert(
        STRINGS._SYNCHRO_WAREHOUSE_TITTLE_, 
        STRINGS._SYNCHRO_WAREHOUSE_ERROR_,
        [
          {text: "Support", onPress: () => {this.support()}},
          {text: "Ok", onPress: () => {this.props.navigation.navigate("Dashboard")}}
        ],
        { cancelable: false }
      );
    }
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