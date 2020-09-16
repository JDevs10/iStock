import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Dimensions, Alert } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter from '../footers/Footer';
import PreparationButton from '../dashbord-screens/assets/PreparationButton';

class Preparation extends Component {
  constructor(props) {
    super(props);

    /**
     * Returns true if the screen is in portrait mode
     */
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    /**
    * Returns true of the screen is in landscape mode
    */
    const isLandscape = () => {
      const dim = Dimensions.get('screen');
      return dim.width >= dim.height;
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape'
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  orderDetails = (value) => {
    alert('Obj: \n' + JSON.stringify(value));
    this.props.navigation.navigate("CommandeDetails", { order: value });
  }

  _Showcommande = (value) => {
    console.log(value);
    // alert('Obj: \n' + JSON.stringify(value));
    this.props.navigation.navigate("CommandeDetails", { order: value });
  }


  render() {
    const test_cmd_list = [
      {
        id: 1, name: "Commande 1", prixTotalTTC: 154, user: "JL", client: "Client A", ref: "PROV-00000001", creationDate: "10-05-2020", etat: 0, lines: [
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 1", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 2", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 3", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" }
        ]
      },
      {
        id: 2, name: "Commande 2", prixTotalTTC: 241, user: "Amine", client: "Client B", ref: "CMD-00000003", creationDate: "05-05-2020", etat: 1, lines: [
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 1", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 2", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 3", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 4", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" }
        ]
      },
      {
        id: 3, name: "Commande 3", prixTotalTTC: 114, user: "Ilias", client: "Client C", ref: "PROV-00009142", creationDate: "11-05-2020", etat: 0, lines: [
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 1", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
        ]
      },
      {
        id: 4, name: "Commande 4", prixTotalTTC: 325, user: "Fahd", client: "Client D", ref: "CMD-09999999", creationDate: "01-04-2020", etat: 1, lines: [
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 1", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 2", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
        ]
      },
      {
        id: 5, name: "Commande 5", prixTotalTTC: 999, user: "Admin", client: "Client E", ref: "PROV-12345678", creationDate: "9-07-2020", etat: 0, lines: [
          { img: "../../../img/no_image.jpeg", ref: "0299431", name: "Article 1", qte: 3, prixHT: 50, prixTTC: 51.3, remise: "0%" },
        ]
      }
    ];

    if (this.state.orientation === 'portrait') {
      console.log('orientation : ', this.state.orientation);
    }
    else {
      console.log('orientation : ', this.state.orientation);
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      mainBody: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingVertical: 30,
        height: this.state.orientation === 'portrait' ? '84%' : '74%',
        width: '100%',
        position: "absolute",
        bottom: this.state.orientation === 'portrait' ? "10%" : "15%",
      },
      cardViewStyle: {
        width: '95%',
        height: 220,
        margin: 20,
        // marginBottom: 20,
      },
      cardViewStyle1: {
        // paddingTop: 20,
        width: '100%',
        //height: 150,
      },
      listItemBody: {
        width: '100%',
        padding: 10,
        // margin: 20,
        // marginBottom: 10,
      },
      listItemBody_layout: {
        //flex: 1,
        marginRight: 20,
        marginLeft: 20,
        flexDirection: "row",
      },
      lastCard: {
        height: 70,
        width: '95%',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: 20,
        marginBottom: 70,
      },
      lastCard_text: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        margin: 20
      },
      cardViewStyle1: {
        paddingTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
        width: '95%',
        //height: 150,
      },
      order: {
        //alignItems: 'center',
        margin: 20,
        width: '100%'
      },
      ic_and_details: {
        flexDirection: 'row',
        margin: 3,
        //alignItems: 'center',
      },
      cname: {
        width: '80%',
      },
      entreprisename: {
        color: '#00AAFF',
        fontSize: 20,
        //marginBottom: 15,
      },
      cdate: {
        width: '20%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      },
      date: {
        backgroundColor: '#dbdbdb',
        height: 30,
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        textAlignVertical: 'center'
      },
      iconDetails: {
        marginRight: 10,
        color: '#00AAFF',
      },
      pricedetails: {
        flexDirection: 'row',
        width: '100%',
      },
      price: {
        width: '75%',
      },
      billedstate: {
        width: '25%',
      },
      billedtext_ok: {
        color: '#00BFA6',
        fontSize: 15,
        position: 'absolute',
        right: 10
      },
      billedtext_no: {
        color: '#D64541',
        fontSize: 15,
        position: 'absolute',
        right: 10
      },
      butons_commande: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
      },
    });



    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarDashboard navigation={this.props} textTittleValue={"Préparation"} />
        <View style={styles.mainBody}>
          <ScrollView style={{ flex: 1 }}>
            {
              test_cmd_list.map((item, index) => (
                <View>
                  {item.etat === 0 ?
                    <TouchableOpacity onPress={() => this.orderDetails(item)}>

                      <CardView key={index} cardElevation={10} cornerRadius={5} style={styles.cardViewStyle}>
                        <View style={styles.cardViewStyle1}>
                          <View style={styles.order}>
                            <TouchableOpacity onPress={() => this._Showcommande(item)}>
                              <View style={styles.ic_and_details}>
                                <View style={styles.cname}>
                                  <Text style={styles.entreprisename}>{item.client}</Text>
                                </View>
                                <View style={styles.cdate}>
                                  <Text style={styles.date}>18 Juin 2020</Text>
                                  {/* {item.id == 0 ? (<Text style={styles.ref_null}>Nouvelle commande</Text>) : (<Text style={styles.ref}>{item.ref}</Text>)} */}
                                </View>
                              </View>
                              <View style={styles.ic_and_details}>
                                <Icon name="boxes" size={15} style={styles.iconDetails} />
                                <Text>{item.lines.length} Produit(s)</Text>
                              </View>
                              <View style={styles.ic_and_details}>
                                <Icon name="calendar-alt" size={15} style={styles.iconDetails} />
                                <Text>Faite le : {item.creationDate}</Text>
                              </View>
                              <View style={styles.ic_and_details}>
                                <Icon name="user" size={15} style={styles.iconDetails} />
                                <Text style={{ marginBottom: 10 }}>Vendu par : {item.user}</Text>
                              </View>
                              <View style={{ borderBottomColor: '#00AAFF', borderBottomWidth: 1, marginRight: 10 }} />
                              <View style={styles.pricedetails}>
                                <View style={styles.price}>
                                  <Text>Total TTC : {item.prixTotalTTC > 0 ? (parseFloat(item.prixTotalTTC)).toFixed(2) : '0'} €</Text>
                                </View>
                                <View style={styles.billedstate}>
                                  {item.etat === 0 ? (<Text style={styles.billedtext_no}>Brouillon</Text>) : (<Text style={styles.billedtext_ok}>Validé</Text>)}
                                </View>
                              </View>
                            </TouchableOpacity>
                            <View style={styles.butons_commande}>
                              {/*(<ButtonSpinner style={styles.submit_on} positionSpinner={'centered-without-text'} onPress={() => this._relance_commande(rowData.ref_commande)} styleSpinner={{ color: '#FFFFFF' }}>
                              <Icon name="sync" size={20} style={styles.iconValiderpanier} />
                              <Text style={styles.iconPanier}>Relancer la commande</Text>
                              </ButtonSpinner> -->)*/}
                              {1 === 0 ? (<Text style={styles.notif}><Icon name="cloud-upload-alt" size={20} style={styles.notif_icon} /></Text>) : (<Text style={styles.notif}></Text>)}
                            </View>
                          </View>
                        </View>
                      </CardView>

                    </TouchableOpacity>
                    :
                    null
                  }
                </View>
              ))
            }





            <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
              <View>
                <Text style={styles.lastCard_text}>No More Data</Text>
              </View>
            </CardView>

          </ScrollView>




          {/* Main twist button */}
          <PreparationButton navigation={this.props.navigation} />
          {/* END Main twist button */}

        </View>
        <MyFooter />
      </LinearGradient>
    );
  }
}

export default Preparation;