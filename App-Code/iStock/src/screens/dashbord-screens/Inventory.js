import React, { Component } from 'react';
import {StyleSheet, View, Text} from  'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import NavbarDashboard from '../../navbar/navbar-dashboard';
import MyFooter_v2 from '../footers/MyFooter_v2';
import InventoryButton from '../dashbord-screens/assets/InventoryButton';

class Inventory extends Component {
  render() {
    return (
      <LinearGradient
        start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
        colors={['#00AAFF', '#706FD3']}
        style={styles.container}>

        <NavbarDashboard navigation={ this.props }/>
        <View style={styles.mainBody}>

          {/* Main twist button */}
          <InventoryButton navigation={this.props.navigation}/>
          {/* END Main twist button */}

          <Text>
              Inventory !
          </Text>
          <Text>
              Inventory !
          </Text>
          <Text>
              Inventory !
          </Text>
        </View>
        <MyFooter_v2/>
      </LinearGradient>
    );
  }
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: '60%',
    width: '100%',
    position: "absolute",
    bottom: 60,
  }
});

export default Inventory;