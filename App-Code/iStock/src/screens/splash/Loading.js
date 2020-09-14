import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, ImageBackground, Image, AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyFooter from '../footers/Footer';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FindServers from '../../services/FindServers';
import TokenManager from '../../Database/TokenManager';
const BG = require('../../../img/waiting_bg.png');


class Loading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingNotify: 'Veuillez attendre un instant ...',
      isServers: false
    };
  }

  async componentDidMount() {
    // setTimeout(() => {
    //   this.props.navigation.navigate('login');
    // }, 2500);

    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des configs du serveur...'
      });
    }, 3000);

    //find token
    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    //check if tocken exist already
    if (token != null) {
      this.props.navigation.navigate('download');
      return;
    }

    const server = new FindServers();
    const res = await server.getAllServerUrls().then(async (val) => {
      return val;
    });


    if (res == true) {
      setTimeout(() => {
        this.props.navigation.navigate('login');
      }, 2500);
    } else {
      //alert("Le serveur Big Data Consulting n'est pas joignable...\n");
      this.props.navigation.navigate('dashboard');
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

export default Loading;

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