//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from "moment";
import DeviceInfo from 'react-native-device-info';

// create a component
class DefaultSettings extends Component {

    VERSION = "1.0";

    LOG_HEADER  = "##################################################################################################\n"
                + "############################################ iStock ####################################################\n"
                + "##### "+DeviceInfo.getVersion()+" ######################################################################################## @Développeur JL #####";


    // All SETTINGS
    SETTINGS = {
        isUseImages: false,
        isUseDetailedCMD: true,
        isUseDetailedCMDLines: true,
        isUseDetailedShipment: true,
        limitOrdersDownload: 1,
        limitShipmentsDownload: 1,
        limitUsersUpdate: 10,
        limitClientsUpdate: 10,
        limitProductsUpdate: 10,
        limitImagesUpdate: 10,
        limitWarehousesUpdate: 10,
        limitShipmentsUpdate: 1
    };

    // try this ===> (t.date_creation > 20210215 AND t.fk_statut = 3)

    SETTINGS_LIMIT = [
        {id: 1, name: '-\t1 jours', value: 1, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 1)).format('YYYYMMDD')+"')", selected: true,},
        {id: 2, name: '-\t3 jours', value: 3, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 4)).format('YYYYMMDD')+"')", selected: true,},
        {id: 3, name: '-\t5 jours', value: 5, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 6)).format('YYYYMMDD')+"')", selected: false,},
        {id: 4, name: '-\t10 jours', value: 10, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 11)).format('YYYYMMDD')+"')", selected: false,},
        {id: 5, name: '-\t20 jours', value: 20, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 21)).format('YYYYMMDD')+"')", selected: false,},
        {id: 6, name: '-\t40 jours', value: 40, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 41)).format('YYYYMMDD')+"')", selected: false,},
    ];

    SETTINGS_SHIPMENT_LIMIT = [
        {id: 1, name: '-\t1 jours', value: 1, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 1)).format('YYYYMMDD')+"')", selected: true,},
        {id: 2, name: '-\t3 jours', value: 3, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 4)).format('YYYYMMDD')+"')", selected: true,},
        {id: 3, name: '-\t5 jours', value: 5, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 6)).format('YYYYMMDD')+"')", selected: false,},
        {id: 4, name: '-\t10 jours', value: 10, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 11)).format('YYYYMMDD')+"')", selected: false,},
        {id: 5, name: '-\t20 jours', value: 20, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 21)).format('YYYYMMDD')+"')", selected: false,},
        {id: 6, name: '-\t40 jours', value: 40, realValue: "(t.date_creation > '"+moment(Date.parse(new Date()) - (86400000 * 41)).format('YYYYMMDD')+"')", selected: false,},
    ];

    SETTINGS_UPDATE_LIMIT = [
        {id: 1, name: '-\t10 objets', value: 10, realValue: "(t.tms < '"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')", selected: true,},
        {id: 2, name: '-\t20 objets', value: 20, realValue: "(t.tms < '"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')", selected: true,},
        {id: 3, name: '-\t30 objets', value: 30, realValue: "(t.tms < '"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')", selected: false,},
        {id: 4, name: '-\t40 objets', value: 40, realValue: "(t.tms < '"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')", selected: false,},
        {id: 5, name: '-\t50 objets', value: 50, realValue: "(t.tms < '"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')", selected: false,},
    ];

    get_Orders_Bigger_than_date_from_value(value){
        let res = null;
        this.SETTINGS_LIMIT.forEach((item, index) => {
            if(item.value == value){
                res = item.realValue;
            }
        });
        return res;
    }

    get_Shipments_Bigger_than_date_from_value(value){
        let res = null;
        this.SETTINGS_LIMIT.forEach((item, index) => {
            if(item.value == value){
                res = item.realValue;
            }
        });
        return res;
    }

    get_objet_update_limit_by_days(value){
        let res = null;
        this.SETTINGS_UPDATE_LIMIT.forEach((item, index) => {
            if(item.value == value){
                res = {limit: item.value, sqlfilters: item.realValue};
            }
        });
        return res;
    }

    get_product_update_limit_by_days(value){
        let res = null;
        this.SETTINGS_UPDATE_LIMIT.forEach((item, index) => {
            if(item.value == value){
                res = {limit: item.value, sqlfilters: item.realValue};
            }
        });
        return res;
    }
}


//make this component available to the app
export default DefaultSettings;