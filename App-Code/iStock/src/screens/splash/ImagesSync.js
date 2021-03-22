import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Alert, StatusBar } from 'react-native';
import TokenManager from '../../Database/TokenManager';
import FindImages from '../../services/FindImages';
import SettingsManager from '../../Database/SettingsManager';
import Strings from "../../utilities/Strings";
const STRINGS = new Strings();
const BG = require('../../../img/waiting_bg.png');
import { writeLog, LOG_TYPE } from '../../utilities/MyLogs';


export default class ImagesSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingNotify: "Synchronisation des Images...\nVeuillez ne pas éteindre l'application."
    };
  }

  async componentDidMount(){
    writeLog(LOG_TYPE.INFO, ImagesSync.name, this.componentDidMount.name, "Init...");
    await this.sync();

    this.listener = await this.props.navigation.addListener('focus', async () => {
      writeLog(LOG_TYPE.INFO, ImagesSync.name, this.componentDidMount.name, "Back Init...");

      await this.sync();
      return;
    });
  }

  async sync(){
    writeLog(LOG_TYPE.INFO, ImagesSync.name, this.sync.name, "Init, sync...");

    const settingsManager = new SettingsManager();
    await settingsManager.initDB();
    const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
      return val;
    });

    if(settings.isUseImages){
      const tm = new TokenManager();
      await tm.initDB();
      const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
        return await val;
      });

      const findImages = new FindImages();
      const res = await findImages.getAllProduitsImagesFromServer(token).then(async (val) => {
          console.log('findImages.getAllProduitsImagesFromServer : ');
          console.log(val);
          return val;
      });
      
      if(res){
        console.log("Remove loading screen!");
        this.props.navigation.navigate("Dashboard");
      }else{
        Alert.alert(
          STRINGS._SYNCHRO_IMAGE_TITTLE_, 
          STRINGS._SYNCHRO_IMAGE_ERROR_,
          [
            {text: "Support", onPress: () => {this.support()}},
            {text: "Ok", onPress: () => {this.props.navigation.navigate("Dashboard")}}
          ],
          { cancelable: false }
        );
      }

    }else{
      Alert.alert(
        STRINGS._SETTINGS_IMAGE_TITTLE_, 
        STRINGS._SETTINGS_IMAGE_DISABLE_,
        [
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