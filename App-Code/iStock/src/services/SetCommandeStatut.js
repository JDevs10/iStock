//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import CheckConnections from '../services/CheckConnections';
import TokenManager from '../Database/TokenManager';

// create a component
class SetCommandeStatut extends Component {
    
    async setStatut(cmd, status){
        return new Promise(async (resolve) => {

            console.log(JSON.stringify(cmd));
            console.log(JSON.stringify(status));


            //update in db
            const om = new OrderManager();
            await om.initDB();

            cmd.statut = status.id;

            const res_db = await om.UPDATE_STATUS(cmd).then(async (val) => {
                return val;
            })

            if(res_db){

                //update on the server
                //check for internet connection
                const conn = new CheckConnections();
                if(!await conn.CheckConnectivity_noNotification()){
                    console.log('CheckConnectivity_noNotification ', 'false');

                    await resolve({
                        status: res_db,
                        msg: "ERROR[xxx] :: Pas d'Internet, mise à jour de la commande en mode hors ligne.\nVeuillez mettre à jour la commande sur votre platforme."
                    });
                }

                // Get token for api key
                const tm = new TokenManager();
                await tm.initDB();
                const token = await tm.GET_TOKEN_BY_ID(1).then(async (val) => {
                    return val;
                });

                if(token == null){
                    console.log('token is null =>', token);
                    await resolve({
                        status: false,
                        msg: "ERROR[xxx] :: unknow token"
                    });
                }

                //Internet
                // Close an order (Classify it as "Delivered")
                console.log(`POST => ${token.server}/api/index.php/orders/${cmd.commande_id}/close?DOLAPIKEY=${token.token}`);
                await axios.post(`${token.server}/api/index.php/orders/${cmd.commande_id}/close`, 
                    {
                        "notrigger": 0
                    }, 
                    { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } }
                ).then(async (response) => {
                    if(response.status == 200){

                        //update order
                        const res_server = await om.UPDATE_ORDER([response.data]).then(async (val) => {
                            return val;
                        })

                        await resolve({
                            status: res_server,
                            msg: "La commande est classer comme \"Livré\""
                        });
                    }
                    else{
                        console.log('Status != 200');
                        await resolve({
                            status: res_db,
                            msg: "La commande est classer comme \"Livré\" en mode hors ligne.\nVeuillez mettre à jour la commande sur votre platforme."
                        });
                    }

                }).catch(async (error) => {
                    console.log('error : ', error);
                    await resolve({
                        status: res_db,
                        msg: "La commande est classer comme \"Livré\" en mode hors ligne.\nVeuillez mettre à jour la commande sur votre platforme."
                    });
                });

            }
            else{
                resolve({
                    status: res_db,
                    msg: "ERROR[xxx] :: Échec de la classification de la commande en \"livrée \""
                });
            }

            
        })
    }
}

//make this component available to the app
export default SetCommandeStatut;
