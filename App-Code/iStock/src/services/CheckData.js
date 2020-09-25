//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OrderLinesManager from '../Database/OrderLinesManager';
import OrderManager from '../Database/OrderManager';
import ProductsManager from '../Database/ProductsManager';
import ServerManager from '../Database/ServerManager';
import SettingsManager from '../Database/SettingsManager';
import ThirdPartiesManager from '../Database/ThirdPartiesManager';
import FindImages from '../services/FindImages';

// create a component
class CheckData extends Component {

    async checkData(){
        return await new Promise(async (resolve) => {
            // list of all data checks
            const isChecked = [];

            // 1
            const orderLinesManager = new OrderLinesManager();
            await orderLinesManager.initDB();
            const olm = await orderLinesManager.GET_LINES_CHECKDATA().then(async (val) => {
                return await val;
            });

            if(olm.length > 0){
                isChecked.push(true);
            }else{
                isChecked.push(false);
            }

            // 2
            const orderManager = new OrderManager();
            await orderManager.initDB();
            const om = await orderManager.GET_LIST().then(async (val) => {
                return await val;
            });

            if(om.length > 0){
                isChecked.push(true);
            }else{
                isChecked.push(false);
            }

            // 3
            const productsManager = new ProductsManager();
            await productsManager.initDB();
            const pm = await productsManager.GET_PRODUCT_LIST().then(async (val) => {
                return await val;
            });

            if(pm.length > 0){
                isChecked.push(true);
            }else{
                isChecked.push(false);
            }

            // 4
            const settingsManager = new SettingsManager();
            await settingsManager.initDB();
            let settings = null;
            const sm_ = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val) => {
                settings = val;
                return await (val == null ? false : true);
            });

            if(sm_){
                isChecked.push(true);
            }else{
                isChecked.push(false);
            }

            // 5
            const thirdPartiesManager = new ThirdPartiesManager();
            await thirdPartiesManager.initDB();
            const tpm = await thirdPartiesManager.GET_TPM_LIST().then(async (val) => {
                return await val;
            });

            if(tpm.length > 0){
                isChecked.push(true);
            }else{
                isChecked.push(false);
            }

            // 6
            if(settings != null && settings.isUseImages){
                const findImages = new FindImages();
                const fi = await findImages.getLocalImages().then(async (val) => {
                    return await val;
                });
                isChecked.push(fi);
            }


            let res = false;
            for(let x = 0; x < isChecked.length; x++){
                if(isChecked[x] == false){
                    console.log("Faild DataCheck :: "+(x+1)+" | false");
                    res = false;
                    break;
                }
                console.log("GOOD DataCheck :: "+(x+1)+" | true");
                res = true;
            }
            await resolve(res);
        });


    }
}

//make this component available to the app
export default CheckData;
