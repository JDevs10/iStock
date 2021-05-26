import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, ImageBackground, Image, AsyncStorage, Alert, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyFooter from '../footers/MyFooter';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FindServers from '../../services/FindServers';
import TokenManager from '../../Database/TokenManager';
import CheckConnections from '../../services/CheckConnections';
import { STRINGS } from "../../utilities/STRINGS";
const BG = require('../../../img/waiting_bg.png');
import { MyErrors } from "../../utilities/Error";
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../../utilities/MyLogs';


class Loading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingNotify: 'Veuillez attendre un instant ...',
      isServers: false
    };
  }


  async componentDidMount() {
    writeInitLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name);

    setTimeout(() => {
      this.setState({
        ...this.state,
        loadingNotify: 'Téléchargement des configs du serveur...'
      });
    }, 500);


    //find token
    writeLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name, "Get token from database...");

    const tm = new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    });

    //check if tocken exist already
    if (token != null) {
      writeLog(LOG_TYPE.ERROR, Loading.name, this.componentDidMount.name, JSON.stringify(MyErrors.getErrorMsgObj(0)) );
      
      writeLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name, "Token found, so go to download screen...");
      this.props.navigation.navigate('download');
      return;
    }
    writeLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name, "No token register...");

    //check for internet connection
    const conn = new CheckConnections();
    if(await conn.CheckConnectivity_noNotification()){
      console.log('CheckConnectivity_noNotification ', 'true');
    }
    else{
      console.log('CheckConnectivity_noNotification ', 'false');
      Alert.alert(
        STRINGS._NO_INTERNET_TITTLE,
        STRINGS._NO_INTERNET_TEXT,
        [
          { text: 'Ok', onPress: () => {
            this.setState({loadingNotify: "Fermeture...."});
            writeLog(LOG_TYPE.WARNING, Loading.name, this.componentDidMount.name, "No internet...");
            setTimeout(() => { 
              BackHandler.exitApp(); 
            }, 3000);
            } 
          },
        ],
        { cancelable: false }
      );
      return;
    }

    writeLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name, "Get all registered servers for iStock...");

    const server = new FindServers();
    const res = await server.getAllServerUrls().then(async (val) => {
      return val;
    });


    if (res == true) {
      writeLog(LOG_TYPE.INFO, Loading.name, this.componentDidMount.name, "Navigate to login...");

      setTimeout(() => {
        this.props.navigation.navigate('login');
      }, 2500);
    } else {
      
      writeLog(LOG_TYPE.ERROR, Loading.name, this.componentDidMount.name, JSON.stringify(MyErrors.getErrorMsgObj(0)) );

      Alert.alert(
        "Fermeture iStock",
        "Le serveur Big Data Consulting n'est pas joignable...",
        [
          { text: 'Ok', onPress: () => {
            this.setState({loadingNotify: "Fermeture...."});
            setTimeout(() => { 
              BackHandler.exitApp(); 
            }, 3000);
            } 
          },
        ],
        { cancelable: false }
      );

    }
  }

  render() {

    return (
      <View style={styles.container}>
        <CheckConnections/>

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