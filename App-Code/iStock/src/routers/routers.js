import React, { Component } from 'react';
import { SwitchNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Welcome from '../screens/Welcome';
import Loading from '../screens/splash/Loading';
import Login from '../screens/login';
import SignIn from '../screens/SignIn';
import Download from '../screens/splash/Download';
import DownloadIntern from '../screens/splash/DownloadIntern';
import DownloadNew from '../screens/splash/DownloadNew';
import Dashboard from '../screens/dashbord-screens/Dashboard';
import Commande from '../screens/dashbord-screens/Commande';
import CommandeDetails from '../screens/dashbord-screens/CommandeDetails';
import Preparation from '../screens/dashbord-screens/Preparation';
import Picking from '../screens/dashbord-screens/Picking';
import Inventory from '../screens/dashbord-screens/Inventory';
import Settings from '../screens/dashbord-screens/Settings';
import ProductDetails from '../screens/dashbord-screens/ProductDetails'
import Expeditions from '../screens/dashbord-screens/Expeditions'
import SupportInternal from '../screens/dashbord-screens/SupportInternal';
import SupportExternal from '../screens/SupportExternal';
import OrdersSync from '../screens/splash/OrdersSync';
import UsersSync from '../screens/splash/UsersSync';
import ProductSync from '../screens/splash/ProductSync';
import ImagesSync from '../screens/splash/ImagesSync';
import ShipmentsSync from '../screens/splash/ShipmentsSync';
import WarehousesSync from '../screens/splash/WarehousesSync';
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
          <Drawer.Screen name="DownloadIntern" component={DownloadIntern} />
          <Drawer.Screen name="DownloadNew" component={DownloadNew} />
          <Drawer.Screen name="Commande" component={Commande} />
          <Drawer.Screen name="CommandeDetails" component={CommandeDetails} />
          <Drawer.Screen name="ProductDetails" component={ProductDetails} />
          <Drawer.Screen name="Preparation" component={Preparation} />
          <Drawer.Screen name="Picking" component={Picking} />
          <Drawer.Screen name="OrdersSync" component={OrdersSync} />
          <Drawer.Screen name="ProductSync" component={ProductSync} />
          <Drawer.Screen name="ImagesSync" component={ImagesSync} />
          <Drawer.Screen name="UsersSync" component={UsersSync} />
          <Drawer.Screen name="ShipmentsSync" component={ShipmentsSync} />
          <Drawer.Screen name="WarehousesSync" component={WarehousesSync} />
          <Drawer.Screen name="Inventory" component={Inventory} />
          <Drawer.Screen name="Expeditions" component={Expeditions} />
          <Drawer.Screen name="Settings" component={Settings} />
          <Drawer.Screen name="Support" component={SupportInternal} />
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
        support: SupportExternal,
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
