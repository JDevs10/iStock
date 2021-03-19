//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OrderLinesManager from '../Database/OrderLinesManager';
import OrderManager from '../Database/OrderManager';
import ProductsManager from '../Database/ProductsManager';
import ServerManager from '../Database/ServerManager';
import SettingsManager from '../Database/SettingsManager';
import ShipmentsManager from '../Database/ShipmentsManager';
import ShipmentLinesManager from '../Database/ShipmentLinesManager';
import ThirdPartiesManager from '../Database/ThirdPartiesManager';
import UserManager from '../Database/UserManager';
import WarehouseManager from '../Database/WarehouseManager';
import FindImages from '../services/FindImages';

// create a component
class CheckData extends Component {

    async checkData(){
        // return true;
        
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
                isChecked.push({task: "OrderLinesManager", status: true});
            }else{
                isChecked.push({task: "OrderLinesManager", status: false});
            }

            // 2
            const orderManager = new OrderManager();
            await orderManager.initDB();
            const om = await orderManager.GET_LIST().then(async (val) => {
                return await val;
            });

            if(om.length > 0){
                isChecked.push({task: "OrderManager", status: true});
            }else{
                isChecked.push({task: "OrderManager", status: false});
            }

            // 3
            const productsManager = new ProductsManager();
            await productsManager.initDB();
            const pm = await productsManager.GET_PRODUCT_LIST().then(async (val) => {
                return await val;
            });

            if(pm.length > 0){
                isChecked.push({task: "ProductsManager", status: true});
            }else{
                isChecked.push({task: "ProductsManager", status: false});
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
                isChecked.push({task: "SettingsManager", status: true});
            }else{
                isChecked.push({task: "SettingsManager", status: false});
            }

            // 5
            const thirdPartiesManager = new ThirdPartiesManager();
            await thirdPartiesManager.initDB();
            const tpm = await thirdPartiesManager.GET_TPM_LIST().then(async (val) => {
                return await val;
            });

            if(tpm.length > 0){
                isChecked.push({task: "ThirdPartiesManager", status: true});
            }else{
                isChecked.push({task: "ThirdPartiesManager", status: false});
            }

            // 6
            if(settings != null && settings.isUseImages){
                const findImages = new FindImages();
                const fi = await findImages.getLocalImages().then(async (val) => {
                    return await val;
                });
                
                if(fi > 0){
                    isChecked.push({task: "FindImages", status: true});
                }else{
                    isChecked.push({task: "FindImages", status: false});
                }
            }

            // 7
            const userManager = new UserManager();
            await userManager.initDB();
            const um = await userManager.GET_USER_LIST().then(async (val) => {
                return val;
            });

            if(um.length > 0){
                isChecked.push({task: "UserManager", status: true});
            }else{
                isChecked.push({task: "UserManager", status: false});
            }

            // 8
            const shipmentsManager = new ShipmentsManager();
            await shipmentsManager.initDB();
            const sm = await shipmentsManager.GET_SHIPMENTS_LIST().then(async (val) => {
                return val;
            });
            
            if(sm.length > 0){
                isChecked.push({task: "ShipmentLinesManager", status: true});
            }else{
                isChecked.push({task: "ShipmentLinesManager", status: false});
            }

            // 9
            const shipmentLinesManager = new ShipmentLinesManager();
            await shipmentLinesManager.initDB();
            const sml = await shipmentLinesManager.GET_SHIPMENT_LINES().then(async (val) => {
                return val;
            });
            
            if(sml.length > 0){
                isChecked.push({task: "ShipmentLinesManager", status: true});
            }else{
                isChecked.push({task: "ShipmentLinesManager", status: false});
            }

            // 10
            const warehouseManager = new WarehouseManager();
            await warehouseManager.initDB();
            const wm = await warehouseManager.GET_WAREHOUSE_LIST().then(async (val) => {
                return val;
            });
            
            if(wm.length > 0){
                isChecked.push({task: "WarehousesManager", status: true});
            }else{
                isChecked.push({task: "WarehousesManager", status: false});
            }


            let res = false;
            for(let x = 0; x < isChecked.length; x++){
                if(isChecked[x].status == false){
                    console.log("Faild DataCheck :: "+isChecked[x].task+" | " + isChecked[x].status);
                    res = false;
                    break;
                }
                console.log("GOOD DataCheck :: "+isChecked[x].task+" | " + isChecked[x].status);
                res = true;
            }
            await resolve(res);
        });


    }
}

//make this component available to the app
export default CheckData;
