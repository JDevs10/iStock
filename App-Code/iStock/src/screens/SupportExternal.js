import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, ImageBackground, Alert, Dimensions, DrawerLayoutAndroid } from 'react-native';
import CardView from 'react-native-cardview';
import moment from 'moment';
import axios from 'axios';
const IMG1 = require('../../img/support.png');
import { creatLogDir, writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../utilities/MyLogs';


class SupportExternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state_connection: '',
      subject: '',
      srv: '',
      message: '',
      response: ''
    };
  }

  componentDidMount() {
    writeInitLog(LOG_TYPE.INFO, SupportExternal.name, this.componentDidMount.name);
    this.listener = this.props.navigation.addListener('focus', async () => {
      writeBackInitLog(LOG_TYPE.INFO, SupportExternal.name, this.componentDidMount.name);
      
      return;
    });
  }

  send_ticket() {
    if ((this.state.subject != '') && (this.state.srv != '') && (this.state.message != '')) {
      let current_date = moment().format('YYYY-MM-DD hh:mm:ss a');
      const data = { fk_project: 22, type_code: "ISSUE", category_code: "DEV", severity_code: "NORMAL", type_label: "Probléme", category_label: "Développeur", severity_label: "Normal", fk_user_assign: 32, subject: `${this.state.subject}`, message: `Client : ${this.state.srv}  - Message :  ${this.state.message}`, date_creation: current_date };
      console.log('########################################');
      console.log('Ajouter Envoie du ticket :');
      axios(
        {
          method: 'post',
          url: `https://bdc.bdcloud.fr/api/index.php/tickets`,
          headers: { 'DOLAPIKEY': '18ce2726a0357ea8da146e1024b194993bfe70ed', 'Accept': 'application/json' },
          data: data,
        }
      )
        .then(response => {
          if (response.status === 200) {
            console.log(response.status);
            Alert.alert(
              "IMPORTANT",
              "Votre demande a bien été envoyer, notre équipe va traiter votre requête dans le plus bref délai",
              [
                { text: "Retour", onPress: () => this.props.navigation.navigate('Dashboard') }
              ],
              { cancelable: false }
            );
          }
        });
    } else {
      this.setState({ response: 'Veuillez remplir les champs demandés' })
    }
  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.containerMain} >


        <View style={styles.container}>
          <View style={styles.containerResults}>
            <Image style={styles.support} source={IMG1} />

            <CardView cardElevation={10} cornerRadius={5} style={styles.cardViewStyle}>

              <View style={{ marginLeft: 20 }}>
                <Text style={styles.label}>Sujet du ticket *</Text>

                <TextInput style={styles.inputs} ref={input => { this.subject = input }}
                  returnKeyLabel={"next"} onChangeText={(text) => this.setState({ subject: text })} placeholder="Veuillez donner un titre à votre problématique"></TextInput>

                <Text style={styles.label}>Adresse du serveur *</Text>

                <TextInput style={styles.inputs} ref={input => { this.srv = input }}
                  returnKeyLabel={"next"} onChangeText={(text) => this.setState({ srv: text })} placeholder="Nom du serveur"></TextInput>

                <Text style={styles.label}>Corp du ticket *</Text>

                <TextInput style={styles.inputs_long} ref={input => { this.message = input }}
                  returnKeyLabel={"next"} onChangeText={(text) => this.setState({ message: text })} multiline={true} placeholder="Expliquer en détail, ce que vous faisait avant et quand le bug est survenu ...">
                </TextInput>


              </View>

              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={.5} onPress={() => this.send_ticket()}>
                  <Text style={styles.TextStyle}>Envoyer</Text>
                </TouchableOpacity>
                <Text style={styles.statut}>{this.state.response}</Text>

              </View>

            </CardView>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default SupportExternal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },

  containerMain: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  cardViewStyle: {
    justifyContent: 'center',
    width: '90%',
    height: 450,
    marginBottom: 20,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  support: {
    width: 250,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  label: {
    color: '#4A4AD4',
    marginLeft: 10
  },
  inputs: {
    width: '95%',
    height: 40,
    borderColor: '#4A4AD4',
    borderWidth: 1,
    borderRadius: 25,
    textAlign: 'left',
    color: '#4A4AD4',
    marginBottom: 15,
    paddingLeft: 20
  },
  inputs_long: {
    width: '95%',
    height: 100,
    borderColor: '#4A4AD4',
    borderWidth: 1,
    borderRadius: 25,
    textAlign: 'left',
    color: '#4A4AD4',
    marginBottom: 15,
    paddingLeft: 20

  },
  statut: {
    color: '#4A4AD4',
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center',
    width: '70%'
  },
  SubmitButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#4A4AD4',
    borderRadius: 25,
    width: 300,
  },
  containerResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disconnected_view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnected_img: {
    width: 350,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 50,
  },
  importantmessage: {
    color: '#d64541',
    marginBottom: 20,
  },
});