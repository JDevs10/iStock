//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from "moment";

// create a component
class DefaultSettings extends Component {

    // All SETTINGS
    SETTINGS = {
        isUseImages: false,
        isUseDetailedCMD: true,
        isUseDetailedCMDLines: true,
        isUseDetailedShipment: true,
        limitOrdersDownload: 3,
        limitShipmentsDownload: 3,
    };

    SETTINGS_LIMIT = [
        {id: 1, name: '-\t3 jours', value: 3, realValue: "(t.date_creation:>:'"+moment(Date.parse(new Date()) - (86400000 * 4)).format('YYYYMMDD')+"')", selected: true,},
        {id: 2, name: '-\t5 jours', value: 5, realValue: "(t.date_creation:>:'"+moment(Date.parse(new Date()) - (86400000 * 6)).format('YYYYMMDD')+"')", selected: false,},
        {id: 3, name: '-\t10 jours', value: 10, realValue: "(t.date_creation:>:'"+moment(Date.parse(new Date()) - (86400000 * 11)).format('YYYYMMDD')+"')", selected: false,},
        {id: 4, name: '-\t20 jours', value: 20, realValue: "(t.date_creation:>:'"+moment(Date.parse(new Date()) - (86400000 * 21)).format('YYYYMMDD')+"')", selected: false,},
        {id: 5, name: '-\t40 jours', value: 40, realValue: "(t.date_creation:>:'"+moment(Date.parse(new Date()) - (86400000 * 41)).format('YYYYMMDD')+"')", selected: false,},
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
}


//make this component available to the app
export default DefaultSettings;