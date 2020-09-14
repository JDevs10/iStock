import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter from '../footers/Footer';
import DeviceInfo, { isLandscape } from 'react-native-device-info';
import { Switch } from 'react-native-paper';
import SettingsManager from '../../Database/SettingsManager';
import TokenManager from '../../Database/TokenManager';
import SettingsDetailButton from './assets/SettingsDetailButton';
const IMG_SRC = require('../../../img/bg_login.png');


class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      server: "",
      key: "",
      isUseImages: false,
      appVersion: "",
    }
  }

  async componentDidMount(){
    await this._updateData();
  }

  async _updateData(){
    const sm = new SettingsManager();
    await sm.initDB();
    const list = await sm.GET_SETTINGS_BY_ID(1).then(async (val) => {
      return await val;
    });
    console.log('list: ', list);

    const tm = await new TokenManager();
    await tm.initDB();
    const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
      return await val;
    })

    this.setState({
      server: (token == null ? "" : token.server),
      key: (token == null ? "" : token.key),
      isUseImages: (list == null ? false : list.isUseImages),
      appVersion: "1.0",
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />

        <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Enregistrement des configurations</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.body}>

          <ScrollView>

            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="server"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Serveur</Text>
              </View>
              <Text style={styles.textInput}>{this.state.server}</Text>
            </View>


            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="key"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>License </Text>
              </View>
              <Text style={styles.textInput}>{this.state.key}</Text>
            </View>


            <View style={styles.action}>
              <View style={styles.action_}>
                <FontAwesome
                  name="download"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Téléchargement des images</Text>
                <Switch
                  trackColor={{ false: "#D3D3D3", true: "#4A4AD4" }}
                  thumbColor={true ? "#00AAFF" : "#4A4AD4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => { this.setState({isUseImages: !this.state.isUseImages}) }}
                  value={this.state.isUseImages}
                />
              </View>
            </View>

            <View style={[styles.action]}>
              <View style={styles.action_}>
                <FontAwesome
                  name="mobile"
                  color="#4A4AD4"
                  size={30} />
                <Text style={styles.textInput}>Version App</Text>
              </View>
              <Text style={styles.textInput}>{this.state.appVersion}</Text>
            </View>
            
          </ScrollView>

          {/* Main twist button */}
          <SettingsDetailButton navigation={this.props.navigation} parentData={{isUseImages: this.state.isUseImages}}/>
          {/* END Main twist button */}

        </Animatable.View>
        <MyFooter />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    // paddingHorizontal: 20,
    // paddingTop: 20,
    // paddingBottom: 30,
    height: '25%',
    width: '100%',
    position: "absolute"
  },
  eye_style: {
    paddingTop: 30,
  },
  body: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: '60%',
    width: '100%',
    position: "absolute",
    bottom: 120,
  },
  text_header: {
    padding: 20,
    color: '#05375a',
    fontWeight: 'bold',
    fontSize: 30,
    position: "absolute",
    bottom: 0
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  action_:{
    flexDirection: 'row',
    width: 300,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default Settings