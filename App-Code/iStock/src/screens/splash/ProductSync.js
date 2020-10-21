import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
import TokenManager from '../../Database/TokenManager';
import FindProduits from '../../services/FindProduits';

const BG = require('../../../img/waiting_bg.png');


export default class ProductSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingNotify: "Synchronisation des Produits...\nVeuillez ne pas éteindre l'application."
    };
  }

  async componentDidMount(){
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    const findProduits = new FindProduits();
    const res = await findProduits.getAllProductsFromServer(token).then(async (val) => {
      console.log('findProduits.getAllProductsFromServer : ');
      console.log(val);
      return val;
    });
    
    if(res){
      console.log("Remove loading screen!");
      this.props.navigation.navigate("Dashboard");
    }else{
      Alert.alert(
        "Synchronisation des Produits", 
        "Une erreur s'est produite l'hors de la synchronisation des produits!\nSi le problème persiste veuillez envoyer un ticket à notre support technique.",
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