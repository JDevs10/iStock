import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
import TokenManager from '../../Database/TokenManager';
import FindCommandes from '../../services/FindCommandes';
import FindCommandesLines from '../../services/FindCommandesLines';

const BG = require('../../../img/waiting_bg.png');


export default class OrdersSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingNotify: "Synchronisation des Commandes...\nVeuillez ne pas éteindre l'application."
    };
  }

  async componentDidMount(){
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    const findCommandes = new FindCommandes();
    const res5 = await findCommandes.getAllOrdersFromServer(token).then(async (val) => {
      console.log('findCommandes.getAllOrdersFromServer : ');
      console.log(val);
      return val;
    });
    
    const findCommandesLines = new FindCommandesLines();
    const res6 = await findCommandesLines.getCommandesLines(token).then(async (val) => {
      console.log('findCommandesLines.getCommandesLines : ');
      console.log(val);
      return val;
    });

    

    if(res5 && res6){
      console.log("Remove loading screen!");
      this.props.navigation.navigate("Preparation");
    }else{
      Alert.alert(
        "Synchronisation des Commandes", 
        "Une erreur s'est produite l'hors de la synchronisation des commandes!\nSi le problème persiste veuillez envoyer un ticket à notre support technique.",
        [
          {text: "Support", onPress: () => {this.support()}},
          {text: "Ok"}
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