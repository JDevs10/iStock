import React, { Component } from 'react';
import { StyleSheet, View, BackHandler, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper'
import OrderLinesManager from '../../Database/OrderLinesManager';
import OrderManager from '../../Database/OrderManager';
import ProductsManager from '../../Database/ProductsManager';
import ServerManager from '../../Database/ServerManager';
import ThirdPartiesManager from '../../Database/ThirdPartiesManager';
import TokenManager from '../../Database/TokenManager';
import FindImages from '../../services/FindImages';

import FindThirdParties from '../../services/FindThirdParties';
import FindCommandes from '../../services/FindCommandes';


export function DrawerContent(props) {
    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', disconnection);
    }
      
    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', disconnection);
    }

    const download_tiers = async () => {
        //find token
        const tm = new TokenManager();
        await tm.initDB();
        const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
            return await val;
        });
        console.log('token : ', token);

        const findThirdParties = new FindThirdParties();
        const res4 = await findThirdParties.getAllThirdPartiesFromServer(token).then(async (val) => {
            console.log('findThirdParties.getAllThirdPartiesFromServer : ');
            console.log(val);
            return val;
        });
    }

    const download_orders = async () => {
        //find token
        const tm = new TokenManager();
        await tm.initDB();
        const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
            return await val;
        });
        console.log('token : ', token);

        const findCommandes = new FindCommandes();
        const res4 = await findCommandes.getAllOrdersFromServer(token).then(async (val) => {
            console.log('findCommandes.getAllOrdersFromServer : ');
            console.log(val);
            return val;
        });
    }

    const disconnection = async () => {
        console.log("disconnecting....")

        const orderLinesManager = new OrderLinesManager();
        await orderLinesManager.initDB();
        const res_1 = await orderLinesManager.DROP_ORDER().then(async (val) => {
            return await val;
        });

        const orderManager = new OrderManager();
        await orderManager.initDB();
        const res_2 = await orderManager.DROP_ORDER().then(async (val) => {
            return await val;
        });

        const productsManager = new ProductsManager();
        await productsManager.initDB();
        const res_3 = await productsManager.DROP_PRODUCT().then(async (val) => {
            return await val;
        });

        const serverManager = new ServerManager();
        await serverManager.initDB();
        const res_4 = await serverManager.DROP_SERVER().then(async (val) => {
            return await val;
        });

        const thirdPartiesManager = new ThirdPartiesManager();
        await thirdPartiesManager.initDB();
        const res_5 = await thirdPartiesManager.DROP_TABLE().then(async (val) => {
            return await val;
        });

        const tokenManager = new TokenManager();
        await tokenManager.initDB();
        const res_6 = await tokenManager.DROP_TOKEN().then(async (val) => {
            return await val;
        });

        const findImages = new FindImages();
        const res_7 = findImages.deleteAll().then(async (val) => {
            return await val;
        });
        
        BackHandler.exitApp();
    }


    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                            style={{backgroundColor: "#fff"}}
                                source={require('../../../img/Logo.jpg')}
                                size={100}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>John Doe</Title>
                                <Caption style={styles.caption}>BDC</Caption>
                            </View>
                        </View>

                        {/* <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View> */}
                    </View>

                    <Drawer.Section style={{marginTop: 30}}></Drawer.Section>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            // icon={({color, size}) => (
                            //     <Icon 
                            //     name="home-outline" 
                            //     color={color}
                            //     size={size}
                            //     />
                            // )}
                            label="Dashboard"
                            onPress={() => {props.navigation.navigate('Dashboard')}}
                        />
                        <DrawerItem 
                            // icon={({color, size}) => (
                            //     <Icon 
                            //     name="settings-outline" 
                            //     color={color}
                            //     size={size}
                            //     />
                            // )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('Settings')}}
                        />
                        <DrawerItem 
                            // icon={({color, size}) => (
                            //     <Icon 
                            //     name="settings-outline" 
                            //     color={color}
                            //     size={size}
                            //     />
                            // )}
                            label="Download Thiers"
                            onPress={() => {download_tiers();}}
                        />
                        <DrawerItem 
                            // icon={({color, size}) => (
                            //     <Icon 
                            //     name="settings-outline" 
                            //     color={color}
                            //     size={size}
                            //     />
                            // )}
                            label="Download Orders"
                            onPress={() => {download_orders();}}
                        />
                        <DrawerItem 
                            // icon={({color, size}) => (
                            //     <Icon 
                            //     name="account-check-outline" 
                            //     color={color}
                            //     size={size}
                            //     />
                            // )}
                            label="Support"
                            onPress={() => {Alert.alert("Maintenance", "Les développeur travailes sur cette fonctionnalitée actuelement.");}}
                        />
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    // icon={({color, size}) => (
                    //     <Icon 
                    //     name="exit-to-app" 
                    //     color={color}
                    //     size={size}
                    //     />
                    // )}
                    label="Sign Out"
                    onPress={() => { 
                        Alert.alert(
                            'Déconnection',
                            'Voulez - vous vraiment vous déconnecter ?',
                            [
                              {text: 'No', onPress: () => {console.log("nothing....")}},
                              {text: 'Yes', onPress: () => {disconnection()}},
                            ],
                            { cancelable: false }
                        );
                    }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent:{
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
      },
    title:{
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold"
    },
    caption:{
        fontSize: 14,
        lineHeight: 14
    },
    row:{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    section:{
        marginRight: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    paragraph:{
        fontWeight: "bold",
        marginRight: 3
    },
    drawerSection:{
        marginTop: 15
    },
    bottomDrawerSection:{
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1
    },
    preference:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});