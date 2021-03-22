//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import FindShipments from '../services/FindShipments';
import ShipmentsManager from '../Database/ShipmentsManager';
import ShipmentLinesManager from '../Database/ShipmentLinesManager';
import TokenManager from '../Database/TokenManager';


// create a component
export default  class SendShipments extends Component {
    constructor(props) {
        super(props);
    }

    async send_Unsync_Shipments_To_Server(){
        const shipmentsManager = new ShipmentsManager();
        await shipmentsManager.initDB();
        const SHIPMENTS = await shipmentsManager.GET_UNSYC_SHIPMENTS_LIST().then(async (val) => {
            return await val;
        });
        console.log("SHIPMENTS :", SHIPMENTS);

        if(SHIPMENTS == null || SHIPMENTS.length == null){
            console.log("Invalid shipments obj");
            return false;
        }

        // Get token for api key
        const tm = new TokenManager();
        await tm.initDB();
        const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
            return val;
        });

        if(token == null){
            console.log('token is null =>', token);
            return false;
        }

        if(SHIPMENTS.length == 0){
            console.log("No shipments to sync to the server");
            console.log("Retrieve shipments from the server");

            const findShipments = new FindShipments();
            const res = await findShipments.getAllShipmentsFromServer(token).then(async (val) => {
                return val;
            });
            return res; // need to remove when downloading new shipments in later version
        }

        
        const isSyncShipments = await new Promise(async (resolve)=> {
            for(let index=0; index<SHIPMENTS.length; index++){
                console.log(`POST => ${token.server}/api/index.php/istockapi/shipment/create`);
                console.log("SHIPMENTS["+index+"] ======================================> ", JSON.stringify(SHIPMENTS[index]));

                await axios.post(`${token.server}/api/index.php/istockapi/shipment/create`, 
                    SHIPMENTS[index], 
                    { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } }
                ).then(async (response) => {
                    if(response.status == 200){
                        // console.log(response.data);
                        const insertedShipmentId = response.data;
                        
                        // validate shipment
                        console.log(`POST => ${token.server}/api/index.php/istockapi/shipment/${insertedShipmentId}/validate`);
                        await axios.post(`${token.server}/api/index.php/istockapi/shipment/${insertedShipmentId}/validate`, 
                            {
                                "notrigger": 0
                            }, 
                            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } }
                        ).then(async (response) => {
                            console.log("response : ", response);
                            if(response.status == 200){
                                // console.log(response.data);
                                
                                // update shipment
                                const res_1 = await shipmentsManager.UPDATE_SHIPMENTS_ID_AND_SYNC([{id: SHIPMENTS[index].id, shipment_id: insertedShipmentId, status: 1, is_synchro: "true"}]).then(async (val) => {
                                    return val;
                                });
                                console.log('shipmentsManager.UPDATE_SHIPMENTS_ID_AND_SYNC : ', res_1);
                
                                if(((index+1) == SHIPMENTS.length) && res_1){
                                    await resolve(true);
                                }
                            }else{
                                console.log('Status != 200');
                                console.log(response.data);
                                await resolve(false);
                            }

                        }).catch(async (error) => {
                            console.log('error : ', error);
                            await resolve(false);
                        });
                        

                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                        await resolve(false);
                    }
                    await resolve(false);

                }).catch(async (error) => {
                    console.log('error : ', error);
                    await resolve(false);
                });
            }
        });

        console.log("isSyncShipments : ", isSyncShipments);
        if(isSyncShipments){
            console.log("Retrieve shipments from the server");

            const findShipments = new FindShipments();
            const res = await findShipments.getAllShipmentsFromServer(token).then(async (val) => {
                return val;
            });
            return res; // need to remove when downloading new shipments in later version
        }

    }
}
