import React from 'react';
import { 
    View, 
    Text,
    Button, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MyFooter from './footers/Footer';
import UserServices from '../tasks/UserServices';

import { useTheme } from 'react-native-paper';

import Users from '../models/Users';
import Animated from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      entreprise: '',
      identifiant: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: true
    };
  }

  render() {

    const textInputChanged_Company = (val) => {
      if(val.length > 0){
        
        this.setState({
          ...this.state,
          entreprise: val
        });
        
      }else{
        this.setState({
          ...this.state,
          entreprise: val
        });
      }
    }

    const textInputChanged = (val) => {
      if(val.length > 0){
        
        this.setState({
          ...this.state,
          identifiant: val,
          check_textInputChange: true
        });
        
      }else{
        this.setState({
          ...this.state,
          identifiant: val,
          check_textInputChange: false
        });
      }
    }

    const handlePasswordChange = (val) =>{
      this.setState({
        ...this.state,
        password: val
      });
    };

    const updateSecureTextEntry = () =>{
      this.setState({
        ...this.state,
        secureTextEntry: !this.state.secureTextEntry
      });
    };

    const verifyData = () => {
      const data_ = {
        entreprise: this.state.entreprise.trim(),
        identifiant: this.state.identifiant.trim(),
        password: this.state.password
      };

      let error_msg = "";
      if(data_.entreprise == ''){
        error_msg += "*\tLe champ 'Entreprise' est vide";
      }
      if(data_.identifiant == ''){
        error_msg += ((error_msg == "") ? "*\tLe champ 'Identifiant' est vide" : "\n*\tLe champ 'Identifiant' est vide");
      }
      if(data_.password == ''){
        error_msg += ((error_msg == "") ? "*\tLe champ 'Mot de Passe' est vide" : "\n*\tLe champ 'Mot de Passe' est vide");
      }

      if(error_msg != ''){
        alert(error_msg);
        return;
      }

      const user = new UserServices();
      user.LogginIn(data_, this.props);
    }

    return (
        <LinearGradient
          start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
          colors={['#00AAFF', '#706FD3']}
          style={styles.container}>

          <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="light-content"/>
            <View style={styles.header}>
              <Text style={[styles.text_header]}>Authentification</Text>
            </View>
            <Animatable.View 
              animation="fadeInUpBig"
              style={styles.body}>

              <ScrollView>
              <Text style={styles.text_footer}>Entreprise</Text>

              <View style={styles.action}>
                <FontAwesome 
                  name="building-o" 
                  color="#05375a" 
                  size={20}  /> 
                <TextInput 
                  placeholder="Votre Entreprise..." 
                  style={styles.textInput} 
                  autoCapitalize="none" 
                  onChangeText={(val) => textInputChanged_Company(val)}/>
              </View>

              <Text style={styles.text_footer}>Identifiant</Text>

              <View style={styles.action}>
                <FontAwesome 
                  name="user-o" 
                  color="#05375a" 
                  size={20}  />
                <TextInput 
                  placeholder="Votre Identifiant..." 
                  style={styles.textInput} 
                  autoCapitalize="none" 
                  onChangeText={(val) => textInputChanged(val)}/>

                {this.state.check_textInputChange ? 
                <Animatable.View animation="bounceIn">
                  <Feather 
                    name="check-circle" 
                    color="#00AAFF" 
                    size={20}  />
                </Animatable.View>
                : 
                null} 
              </View>

              <Text 
                style={[styles.text_footer, {marginTop: 40}]}>Mot de passe</Text>
              <View style={styles.action}>
                <FontAwesome 
                  name="lock" 
                  color="#05375a" 
                  size={20}/>
                <TextInput 
                  placeholder="Votre mot de passe..." 
                  style={styles.textInput} 
                  autoCapitalize="none" 
                  secureTextEntry={this.state.secureTextEntry ? true : false}
                  onChangeText={(val) => handlePasswordChange(val)}/>

                <TouchableOpacity
                  onPress={updateSecureTextEntry}>

                  {this.state.secureTextEntry ? 
                  <Feather 
                    name="eye-off" 
                    color="grey" 
                    size={20}/>
                  : 
                  <Feather 
                    name="eye" 
                    color="grey" 
                    size={20}/>
                  }
                  
                </TouchableOpacity>
                
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => verifyData()}
                >
                  <LinearGradient
                    start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                    colors={['#00AAFF', '#706FD3']}
                    style={styles.signIn}
                  >
                    <Text style={[styles.textSign, {color: '#FFF'}]}>Connexion</Text>
                  </LinearGradient>
                </TouchableOpacity>
                  

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('signIn')} 
                  style={[styles.signIn, {
                    borderColor: "#00AAFF",
                    borderWidth: 1,
                    marginTop: 15
                  }]}>
                  <Text style={[styles.textSign, {color: '#000'}]}>Se Connecter</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
              
            </Animatable.View>
            <MyFooter/>
        </LinearGradient>
    );
  }
}
export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
      // paddingBottom: 30,
      // paddingTop: 20,
      height: '20%',
      width: '100%',
      position: "relative"
  },
  text_header: {
      paddingHorizontal: 20,
      color: '#ABCDEF',
      fontWeight: 'bold',
      fontSize: 30,
      position: "absolute",
      bottom: 0
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
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
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