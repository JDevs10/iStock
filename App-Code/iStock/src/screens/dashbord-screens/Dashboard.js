import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Image, Button, StatusBar, Animated, Dimensions, ImageBackground } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import NavbarHome from '../../navbar/navbar-home';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo, { isLandscape } from 'react-native-device-info';
import MainButton from '../dashbord-screens/assets/MainButton';
import CheckConnections from '../../services/CheckConnections';
import Toast from 'react-native-simple-toast';
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../../utilities/MyLogs';
import FindImages from '../../services/FindImages';
import TokenManager from '../../Database/TokenManager';


export default class Dashboard extends Component {
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

  componentDidMount(){
    writeInitLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name);
    
    this.listener = this.props.navigation.addListener('focus', () => {
      writeBackInitLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name);
      return;
    });

  }

  _picking() {
    writeLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name, "Go to Preparations");
    this.props.navigation.navigate('Preparation');
  }
  _shipment() {
    writeLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name, "Go to Shipments");
    this.props.navigation.navigate('Expeditions');
  }
  async _inventory() {
    writeLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name, "Go to Inventory");
    writeLog(LOG_TYPE.INFO, Dashboard.name, this.componentDidMount.name, "Inventory is unavailable ");
    Toast.showWithGravity("Cette fonctionnalité n'est pas accessible", Toast.SHORT, Toast.BOTTOM);
    // this.props.navigation.navigate('Inventory');
  }

  render() {

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
        height: this.state.orientation === 'portrait' ? '80%' : '75%',
        width: '100%',
        position: "absolute",
        bottom: this.state.orientation === 'portrait' ? "10%" : "10%",
      }
    });


    return (
      <LinearGradient
        start={{ x: 0.0, y: 1 }} end={{ x: 0.5, y: 1 }}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarHome _navigation={this.props} />
        
        <View style={styles.mainBody}>


          <ScrollView style={{ flex: 1}}>

            <View>
              
              <View style={{ margin: 'auto' }}>
                <View style={{ marginBottom: -20, marginLeft: 'auto', marginRight: 'auto' }}>
                  <TouchableOpacity onPress={this._picking.bind(this)}>
                    <ImageBackground style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }} source={require('../../../img/iStock_button_picking.png')}>
                      <Text style={{ paddingTop: 90, fontWeight: 'bold', fontSize: 14 }}>Préparation</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
                  <TouchableOpacity onPress={this._shipment.bind(this)}>
                    <ImageBackground style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }} source={require('../../../img/iStock_button_shipment.png')}>
                      <Text style={{ paddingTop: 90, fontWeight: 'bold', fontSize: 14 }}>Expéditions</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._inventory.bind(this)}>
                    <ImageBackground style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }} source={require('../../../img/iStock_button_inventory_disable.png')}>
                      <Text style={{ paddingTop: 90, fontWeight: 'bold', fontSize: 14 }}>Inventaire</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          </ScrollView>


          {/* Main twist button */}
          <MainButton navigation={this.props.navigation} />
          {/* END Main twist button */}
        </View>
        <MyFooter_v2 />
      </LinearGradient>
    );
  }
}


