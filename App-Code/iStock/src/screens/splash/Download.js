import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, StatusBar, AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyFooter from '../footers/Footer';
import FindProduits from '../../services/FindProduits';
import FindImages from '../../services/FindImages';
import FindThirdParties from '../../services/FindThirdParties';
import FindCommandes from '../../services/FindCommandes';
import SettingsManager from '../../Database/SettingsManager';
import TokenManager from '../../Database/TokenManager';
import CheckData from '../../services/CheckData';

const BG = require('../../../img/waiting_bg.png');


class Download extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingNotify: 'Initialiser les Téléchargements...',
    };
  }

  async componentDidMount() {

    // check all data
    await setTimeout(async () => {
      this.setState({
        ...this.state,
        loadingNotify: 'Vérification des données...'
      });
    }, 3000);

    
    const checkData = new CheckData();
    console.log('#######################################################');
    console.log('########## CheckData');
    const data_check = await checkData.checkData().then(async (val) => {
      return await val;
    });

    console.log('data_check : ', data_check);
    console.log('#######################################################');
    console.log('#######################################################');

    //skipe download to home screen if data existe
    if(data_check){
      this.props.navigation.navigate('dashboard');
      return;
    }

    // set default settings
    const sm = new SettingsManager();
    await sm.initDB();
    await sm.CREATE_SETTINGS_TABLE();
    const settings = {
      isUseImages: false,
      isUseDetailedCMD: true,
      isUseDetailedCMDLines: true
    };
    const res_sm = await sm.INSERT_SETTINGS(settings).then(async (val) => {
      console.log('INSERT_SETTINGS => val: ', val);
      return await val;
    });


    //find token
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });
    console.log('token : ', token);

    if(token == null){
      setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'ERREUR TOKEN unknown....'
        });
      }, 5000);
      this.props.navigation.navigate('login');
      return;
    }

    /*
    let currentStep = 1;
    let allSteps = 4;
    const res = [];

    // // Get all client info from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des Clients...'+currentStep+'/'+allSteps
      });
    }, 3000);

    const findThirdParties = new FindThirdParties();
    const res1 = await findThirdParties.getAllThirdPartiesFromServer(token).then(async (val) => {
      console.log('findThirdParties.getAllThirdPartiesFromServer : ');
      console.log(val);
      return val;
    });
    res.push(res1);
    currentStep++;


    // Get all products from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des Produits...'+currentStep+'/'+allSteps
      });
    }, 3000);

    const findProduits = new FindProduits();
    const res2 = await findProduits.getAllProductsFromServer(token).then(async (val) => {
      console.log('findProduits.getAllProductsFromServer : ');
      console.log(val);
      return val;
    });
    res.push(res2);
    currentStep++;


    // Get all product images from server
    if(settings.isUseImages){
      setTimeout(() => {
        this.setState({
          ...this.state,
          loadingNotify: 'Téléchargement des Produits...'+currentStep+'/'+allSteps
        });
      }, 3000);
  
      const findImages = new FindImages();
      const res3 = await findImages.getAllProduitsImagesFromServer(token).then(async (val) => {
        console.log('findImages.getAllProduitsImagesFromServer : ');
        console.log(val);
        return val;
      });
      res.push(res3);
    }else{
      console.log('findImages.getAllProduitsImagesFromServer : no images downloaded.');
    }
    currentStep++;


    // Get all orders from server
    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des Commandes associer à ' + token.name + '...'+currentStep+'/'+allSteps
      });
    }, 3000);

    const findCommandes = new FindCommandes();
    const res4 = await findCommandes.getAllOrdersFromServer(token).then(async (val) => {
      console.log('findCommandes.getAllOrdersFromServer : ');
      console.log(val);
      return val;
    });
    res.push(res4);
    

    let res_ = true;
    for(let x = 0; x<res.length; x++){
      if(res[x] == false){ 
        res_ = false;
        break;
      }
    }

   if(res_ == true){

      setTimeout(() => {
        this.props.navigation.navigate('dashboard');
        return;
      }, 2500);
    } else {
      alert("Le serveur Big Data Consulting n'est pas joignable...\n");
    }
    */
   setTimeout(() => {
      this.props.navigation.navigate('dashboard');
      return;
    }, 2500);
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

export default Download;

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