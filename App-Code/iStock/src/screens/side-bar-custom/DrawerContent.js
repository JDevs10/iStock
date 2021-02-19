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
import Icon from 'react-native-vector-icons/FontAwesome5';
import OrderLinesManager from '../../Database/OrderLinesManager';
import OrderManager from '../../Database/OrderManager';
import ProductsManager from '../../Database/ProductsManager';
import ServerManager from '../../Database/ServerManager';
import ThirdPartiesManager from '../../Database/ThirdPartiesManager';
import TokenManager from '../../Database/TokenManager';
import FindImages from '../../services/FindImages';
import UserManager from '../../Database/UserManager';
import FindThirdParties from '../../services/FindThirdParties';
import FindCommandes from '../../services/FindCommandes';
import ShipmentsManager from '../../Database/ShipmentsManager';
import ShipmentLinesManager from '../../Database/ShipmentLinesManager';

import Strings from "../../utilities/Strings";
const STRINGS = new Strings();


const iconStyle = {
    color: "#706FD3",
    size: 25
};

export function DrawerContent(props) {
    
    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', disconnection);
        getCurrentUserInfo();
    }
      
    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', disconnection);
    }

    const getCurrentUserInfo = async () => {
        //find token
        const tm = new TokenManager();
        await tm.initDB();
        const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
            return await val;
        });

        const userManager = new UserManager();
        const res = await userManager.GET_USER_BY_ID(token.userId).then(async (val) => {
            return val;
        });

        this._CURRENT_USER_NAME_ = res.lastname + " " + res.firstname;
        this._CURRENT_USER_COMPANY_ = token.company;
    }

    const disconnection = async () => {
        console.log("disconnecting....")

        const orderLinesManager = new OrderLinesManager();
        await orderLinesManager.initDB();
        const res_1 = await orderLinesManager.DROP_ORDER_LINES().then(async (val) => {
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

        const shipmentLinesManager = new ShipmentLinesManager();
        await shipmentLinesManager.initDB();
        const res_6 = await shipmentLinesManager.DROP_SHIPMENTS().then(async (val) => {
            return await val;
        });

        const shipmentsManager = new ShipmentsManager();
        await shipmentsManager.initDB();
        const res_7 = await shipmentsManager.DROP_SHIPMENTS().then(async (val) => {
            return await val;
        });

        const tokenManager = new TokenManager();
        await tokenManager.initDB();
        const res_8 = await tokenManager.DROP_TOKEN().then(async (val) => {
            return await val;
        });

        const findImages = new FindImages();
        const res_9 = findImages.deleteAll().then(async (val) => {
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
                                <Title style={styles.title}>iStock</Title>
                                {/* <Caption style={styles.caption}>iStock © Tous droits réservés - Développer par BDC</Caption> */}
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

                        <View style={styles.row}>
                            <Caption style={styles.caption}>iStock © Tous droits réservés - Développer par BDC</Caption>
                        </View>
                    </View>

                    <Drawer.Section style={{marginTop: 30}}></Drawer.Section>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="home" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._HOME_SIDEBAR_TITTLE_}
                            onPress={() => {props.navigation.navigate('Dashboard')}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="cogs" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._CONFIGURATION_SIDEBAR_TITTLE_}
                            onPress={() => {props.navigation.navigate('Settings')}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_USER_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_USER_TITTLE_, 
                                    STRINGS._SYNCHRO_USER_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('UsersSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_COMMANDE_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_COMMANDE_TITTLE_, 
                                    STRINGS._SYNCHRO_COMMANDE_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('OrdersSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_PRODUIT_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_PRODUIT_TITTLE_, 
                                    STRINGS._SYNCHRO_PRODUIT_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('ProductSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_IMAGE_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_IMAGE_TITTLE_, 
                                    STRINGS._SYNCHRO_IMAGE_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('ImagesSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_SHIPMENT_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_SHIPMENT_TITTLE_, 
                                    STRINGS._SYNCHRO_SHIPMENT_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('ShipmentsSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="sync" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label={STRINGS._SYNCHRO_WAREHOUSE_SIDEBAR_TITTLE_}
                            onPress={() => {
                                Alert.alert(
                                    STRINGS._SYNCHRO_WAREHOUSE_TITTLE_, 
                                    STRINGS._SYNCHRO_WAREHOUSE_TEXT_,
                                    [
                                      {text: "Oui", onPress: () => {
                                        props.navigation.navigate('WarehousesSync');
                                      }},
                                      {text: "Non"}
                                    ],
                                    { cancelable: false }
                                );
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Icon 
                                name="headset" 
                                color={iconStyle.color}
                                size={iconStyle.size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('Support')}}
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
                    icon={() => (
                        <Icon 
                        name="power-off" 
                        color={iconStyle.color}
                        size={iconStyle.size}
                        />
                    )}
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