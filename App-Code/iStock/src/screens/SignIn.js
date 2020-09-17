import React from 'react';
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

import UserServices from '../services/UserServices';

import { useTheme } from 'react-native-paper';

import Users from '../models/Users';
import Animated from 'react-native-reanimated';
import MyFooter from './footers/Footer';
const IMG_SRC = require('../../img/bg_login.png');

{/* <Button title="Login" onPress={() => this.props.navigation.navigate('dashboard')}/>*/ }


class SignIn extends React.Component {
  inputKey_length = 24;         // needs 25 digits
  inputServer_length = 3;       // needs 4 digits
  inputIdentifiant_length = 3;  // needs 4 digits

  constructor(props) {
    super(props);
    this.state = {
      identifiant: '',
      password: '',
      password_c: '',
      server: '',
      key: '',
      check_textInputChange: false,
      check_textInputChange_server: false,
      check_textInputChange_key: false,
      check_textInputChange_pwd_c: false,
      secureKeyTextEntry: true,
      secureTextEntry: true,
      secureTextEntry_c: true
    };
  }


  render() {

    const textInputChanged = (val) => {
      if (val.length > this.inputIdentifiant_length) {

        this.setState({
          ...this.state,
          identifiant: val,
          check_textInputChange: true
        });

      } else {
        this.setState({
          ...this.state,
          identifiant: val,
          check_textInputChange: false
        });
      }
    }

    const textInputChanged_server = (val) => {
      if (val.length > this.inputServer_length) {

        this.setState({
          ...this.state,
          server: val,
          check_textInputChange_server: true
        });

      } else {
        this.setState({
          ...this.state,
          server: val,
          check_textInputChange_server: false
        });
      }
    }

    const handleKeyChange = (val) => {
      if (Validate_key(val) == 'true') {

        this.setState({
          ...this.state,
          key: val,
          check_textInputChange_key: true
        });

      } else {
        this.setState({
          ...this.state,
          key: val,
          check_textInputChange_key: false
        });
      }
    };

    const updateSecureKeyTextEntry = () => {
      this.setState({
        ...this.state,
        secureKeyTextEntry: !this.state.secureKeyTextEntry
      });
    };

    const handlePasswordChange = (val) => {
      this.setState({
        ...this.state,
        password: val
      });
    };

    const updateSecureTextEntry = () => {
      this.setState({
        ...this.state,
        secureTextEntry: !this.state.secureTextEntry
      });
    };

    const handlePasswordChange_c = (val) => {
      if (Validate_password(val) == "true") {
        this.setState({
          ...this.state,
          password_c: val,
          check_textInputChange_pwd_c: true
        });
      } else {
        this.setState({
          ...this.state,
          password_c: val,
          check_textInputChange_pwd_c: false
        });
      }
    };

    const updateSecureTextEntry_c = () => {
      this.setState({
        ...this.state,
        secureTextEntry_c: !this.state.secureTextEntry_c
      });
    };

    const Validate_password = (val) => {
      let isPwd = true;
      let isPwd_c = true;
      let result = "";
      const data_ = {
        pwd: this.state.password.trim(),
        pwd_c: val.trim()
      };

      if (data_.pwd != data_.pwd_c) {
        return "* Le mot de passe ne se correspond pas!";
      }

      /*
      if(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(data_.pwd)){
        result = "* Le mot de passe '"+data_.pwd+"' n'est pas au bon format!";
        result += "    Ces charactères ne sont pas accepté";
      }

      if(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(data_.pwd_c)){
        
      }
      */
      return "true";
    }

    const Validate_IpOrUrl_address = (address) => {
      let isIp = true;
      let isUrl = true;
      let result = "";

      if (address.length <= this.inputServer_length) {
        return "* Le serveur n'est pas valide => [Error:Length] : " + address.length;
      }

      if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) {
        isIp = false;
        result = "* L'adresse ip '" + address + "' n'est pas au bon format!";
      }

      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      if (!pattern.test(address)) {
        isUrl = false;
        result += "\nOu\n* L'url '" + address + "' n'est pas au bon format!";
      }

      if (!isIp && !isUrl) {
        return result;
      } else {
        return "true";
      }
    }

    const Validate_key = (inputKey) => {
      let isInputKey = true;
      let isUrl = true;
      let result = "";

      if (inputKey.length <= this.inputKey_length) {
        return "* La clé licence n'est pas valide => [Error:Length] : " + inputKey.length;
      }

      if (!/([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})([a-zA-Z0-9]{5})/.test(inputKey)
        && inputKey.split("-").length != 5) {
        isInputKey = false;
        result = "* La licence '" + inputKey + "' n'est pas au bon format! :: " + inputKey.split("-").length;
      }

      isUrl = false;

      // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      //   '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      //   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      //   '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      //   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      // if (!pattern.test(address)) {  
      //   isUrl = false;
      //   result += "\nOu\n* L'url '"+address+"' n'est pas au bon format!";
      // }

      if (!isInputKey && !isUrl) {
        return result;
      } else {
        return "true";
      }
    }

    //check passed data before sending it to iStock auth-creation module
    const verifyData = () => {

      const data_ = {
        identifiant: this.state.identifiant.trim(),
        password: this.state.password,
        password_c: this.state.password_c,
        server: this.state.server.trim(),
        key: this.state.key
      };

      let errors = '';
      if (data_.identifiant.length < this.inputIdentifiant_length) {
        errors += "###############\n" +
          "* Le nom du 'Identifant' doit avoir plus de " + this.inputIdentifiant_length + " charactères\n";
      }

      if (Validate_password(data_.password_c) != 'true') {
        errors += "###############\n" +
          "* Le mot de passe ne se correspond pas!\n";
      }

      const result_ip_url = Validate_IpOrUrl_address(data_.server);
      if (result_ip_url != 'true') {
        errors += "###############\n" + result_ip_url + "\n";
      }

      const result_key = Validate_key(data_.key);
      if (result_key != 'true') {
        errors += "###############\n" + result_key + "\n";
      }

      if (errors.length > 1) {
        alert(errors);
        return;
      }

      const user = new UserServices();
      user.SigningIn(data__);
    };

    return (
      <View style={styles.container}>
        <Image source={IMG_SRC} resizeMode='cover' style={styles.backdrop} />

        <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Enregistrement</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={styles.body}>

          <ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.action}>
                <FontAwesome
                  name="user-o"
                  color="#4A4AD4"
                  size={20} />
                <TextInput
                  name="identifiant"
                  placeholder="Identifiant ..."
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChanged(val)} />

                {this.state.check_textInputChange ?
                  <Animatable.View animation="bounceIn">
                    <Feather
                      name="check-circle"
                      color="#4A4AD4"
                      size={20} />
                  </Animatable.View>
                  :
                  null}
              </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.action}>
                <FontAwesome
                  name="lock"
                  color="#4A4AD4"
                  size={20} />
                <TextInput
                  placeholder="Mot de passe ..."
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={this.state.secureTextEntry ? true : false}
                  onChangeText={(val) => handlePasswordChange(val)} />



                <View style={{ flexDirection: "row" }}>
                  <View style={{ paddingRight: 5 }}>
                    <TouchableOpacity style={styles.eye_style}
                      onPress={updateSecureTextEntry}>

                      {this.state.secureTextEntry ?
                        <Feather
                          name="eye-off"
                          color="#4A4AD4"
                          size={20} />
                        :
                        <Feather
                          name="eye"
                          color="#4A4AD4"
                          size={20} />
                      }

                    </TouchableOpacity>

                  </View>
                  <View style={{ paddingLeft: 5 }}>
                    {this.state.check_textInputChange_pwd_c ?
                      <Animatable.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="#4A4AD4"
                          size={20} />
                      </Animatable.View>
                      :
                      null}

                  </View>
                </View>

              </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.action}>
                <FontAwesome
                  name="lock"
                  color="#4A4AD4"
                  size={20} />
                <TextInput
                  placeholder="Retaper votre mot de passe ..."
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={this.state.secureTextEntry_c ? true : false}
                  onChangeText={(val) => handlePasswordChange_c(val)} />




                <View style={{ flexDirection: "row" }}>
                  <View style={{ paddingRight: 5 }}>
                    <TouchableOpacity style={styles.eye_style}
                      onPress={updateSecureTextEntry_c}>

                      {this.state.secureTextEntry_c ?
                        <Feather
                          name="eye-off"
                          color="#4A4AD4"
                          size={20} />
                        :
                        <Feather
                          name="eye"
                          color="#4A4AD4"
                          size={20} />
                      }

                    </TouchableOpacity>

                  </View>
                  <View style={{ paddingLeft: 5 }}>
                    {this.state.check_textInputChange_pwd_c ?
                      <Animatable.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="#00AAFF"
                          size={20} />
                      </Animatable.View>
                      :
                      null}

                  </View>
                </View>

              </View>
            </View>



            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.action}>
                <FontAwesome
                  name="server"
                  color="#4A4AD4"
                  size={20} />
                <TextInput
                  placeholder="Nom du serveur"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChanged_server(val)} />

                {this.state.check_textInputChange_server ?
                  <Animatable.View animation="bounceIn">
                    <Feather
                      name="check-circle"
                      color="#4A4AD4"
                      size={20} />
                  </Animatable.View>
                  :
                  null}

              </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.action}>
                <FontAwesome
                  name="key"
                  color="#4A4AD4"
                  size={20} />
                <TextInput
                  placeholder="Licence, Ex: xxxx-xxxx-xxxx-xxxx-xxxx"
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={this.state.secureKeyTextEntry ? true : false}
                  onChangeText={(val) => handleKeyChange(val)} />



                <View style={{ flexDirection: "row" }}>
                  <View style={{ paddingRight: 5 }}>
                    <TouchableOpacity style={styles.eye_style}
                      onPress={updateSecureKeyTextEntry}>

                      {this.state.secureKeyTextEntry ?
                        <Feather
                          name="eye"
                          color="#4A4AD4"
                          size={20} />
                        :
                        <Feather
                          name="eye-off"
                          color="#4A4AD4"
                          size={20} />
                      }
                    </TouchableOpacity>

                  </View>
                  <View style={{ paddingLeft: 5 }}>
                    {this.state.check_textInputChange_key ?
                      <Animatable.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="#4A4AD4"
                          size={20} />
                      </Animatable.View>
                      :
                      null}

                  </View>
                </View>

              </View>
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => verifyData()}>
                <LinearGradient
                  start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
                  colors={['#00AAFF', '#706FD3']}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: '#FFF' }]}>S'enregistrer</Text>

                </LinearGradient>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('login')}
                style={[styles.signIn, {
                  borderColor: "#05375a",
                  borderWidth: 1,
                  marginTop: 15
                }]}>
                <Text style={[styles.textSign, { color: '#05375a' }]}>Authentification</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </Animatable.View>
        <MyFooter />
      </View>
    );
  }
}
export default SignIn;




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
    height: '70%',
    width: '100%',
    position: "absolute",
    bottom: 60,
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
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    width: '90%'
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