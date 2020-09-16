import React, { Component } from 'react';
import { SwitchNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Welcome from '../screens/Welcome';
import Loading from '../screens/splash/Loading';
import Login from '../screens/Login';
import SignIn from '../screens/SignIn';
import Download from '../screens/splash/Download';
import Dashboard from '../screens/dashbord-screens/Dashboard';
import Commande from '../screens/dashbord-screens/Commande';
import CommandeDetails from '../screens/dashbord-screens/CommandeDetails';
import Preparation from '../screens/dashbord-screens/Preparation';
import Inventory from '../screens/dashbord-screens/Inventory';
import Settings from '../screens/dashbord-screens/Settings';
import ProductDetails from '../screens/dashbord-screens/ProductDetails'

import {DrawerContent} from '../screens/side-bar-custom/DrawerContent';


class RouterNavigation extends Component {
  render() {

    // when user is logged in
    //DrawerContent={props => new DrawerContent(props)}
    const Drawer = createDrawerNavigator();

    function DrawerNavigation() {
      return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName="Dashboard">
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Commande" component={Commande} />
          <Drawer.Screen name="CommandeDetails" component={CommandeDetails} />
          <Drawer.Screen name="ProductDetails" component={ProductDetails} />
          <Drawer.Screen name="Preparation" component={Preparation} />
          <Drawer.Screen name="Inventory" component={Inventory} />
          <Drawer.Screen name="Configuration" component={Settings} />
        </Drawer.Navigator>
      );
    }

    // when user is logged out
    const Navigation = createAppContainer(createSwitchNavigator(
      {
        welcome: Welcome,
        loading: Loading,
        login: Login,
        signIn: SignIn,
        download: Download,
        dashboard: DrawerNavigation
      },
      {
        initialRouteName: 'welcome',
      }
    ));
    return (
      <Navigation />
    );
  }
}
export default RouterNavigation;
