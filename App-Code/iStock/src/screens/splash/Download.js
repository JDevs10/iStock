import React, { Component } from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, StatusBar, AsyncStorage} from  'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyFooter from '../footers/Footer';
import FindProduits from '../../services/FindProduits';
import FindImages from '../../services/FindImages';
import FindThirdParties from '../../services/FindThirdParties';
import FindCommandes from '../../services/FindCommandes';
import TokenManager from '../../Database/TokenManager';
  

class Download extends Component {

  constructor(props){
    super(props);
    this.state = {
      loadingNotify: 'Initialiser les Téléchargements...',
    };
  }
  
  async componentDidMount() {

    //find token
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });
    console.log('token : ', token);

    if(token == null){
      this.setState({
        ...this.state,
        loadingNotify: 'Token Error.'
      });
      return;
    }
    let currentStep = 1;
    let allSteps = 4;
    const res = [];


    // // Get all client info from server
    // setTimeout(() => {
    //   this.setState({
    //     ...this.state,
    //     loadingNotify: 'Téléchargement des Clients...'+currentStep+'/'+allSteps
    //   });
    // }, 3000);

    // const findThirdParties = new FindThirdParties();
    // const res1 = await findThirdParties.getAllThirdPartiesFromServer(token).then(async (val) => {
    //   console.log('findThirdParties.getAllThirdPartiesFromServer : ');
    //   console.log(val);
    //   return val;
    // });
    // res.push(res1);
    // currentStep++;

    // // Get all products from server
    // setTimeout(() => {
    //   this.setState({
    //     ...this.state,
    //     loadingNotify: 'Téléchargement des Produits...'+currentStep+'/'+allSteps
    //   });
    // }, 3000);

    // const findProduits = new FindProduits();
    // const res2 = await findProduits.getAllProductsFromServer(token).then(async (val) => {
    //   console.log('findProduits.getAllProductsFromServer : ');
    //   console.log(val);
    //   return val;
    // });
    // res.push(res2);
    // currentStep++;

    // // Get all product images from server
    // setTimeout(() => {
    //   this.setState({
    //     ...this.state,
    //     loadingNotify: 'Téléchargement des Produits...'+currentStep+'/'+allSteps
    //   });
    // }, 3000);

    // const findImages = new FindImages();
    // const res3 = await findImages.getAllProduitsImagesFromServer(token).then(async (val) => {
    //   console.log('findImages.getAllProduitsImagesFromServer : ');
    //   console.log(val);
    //   return val;
    // });
    // res.push(res3);
    // currentStep++;

    // // Get all orders from server
    // setTimeout(() => {
    //   this.setState({
    //     ...this.state,
    //     loadingNotify: 'Téléchargement des Commandes associer à ' + token.name + '...'+currentStep+'/'+allSteps
    //   });
    // }, 3000);

    // const findCommandes = new FindCommandes();
    // const res4 = await findCommandes.getAllOrdersFromServer(token).then(async (val) => {
    //   console.log('findCommandes.getAllOrdersFromServer : ');
    //   console.log(val);
    //   return val;
    // });
    // res.push(res4);
    

    let res_ = true;
    // for(let x = 0; x<res.length; x++){
    //   if(res[x] == false){ 
    //     res_ = false;
    //     break;
    //   }
    // }

   if(res_ == true){
      setTimeout(() => {
        this.props.navigation.navigate('dashboard');
        return;
      }, 2500);
    }else{
      alert("Le serveur Big Data Consulting n'est pas joignable...\n");
    }
  }

  render() {

    return (
      <LinearGradient
        start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
        colors={['#00AAFF', '#706FD3']}
        style={styles.body}>

        <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>

        <Image style={{width: 150, height: 150 }} source={require('../../../img/Loading-white.gif')}/>

        <Text style={styles.text}>{this.state.loadingNotify}</Text>

        <MyFooter/>

      </LinearGradient>
    );
  }
}

export default Download;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#00AAFF",
    padding: 10
  },
  body:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: '100%', 
    height: '100%'
  },
  text:{
    fontSize: 20,
    color: "#ABCDEF",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  }
});