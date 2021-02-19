//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import OrderLinesManager from '../Database/OrderLinesManager';
import CheckConnections from '../services/CheckConnections';


// create a component
class FindCommandesLines extends Component {
    
    async getCommandesLines(token){
        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
          console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
          console.log('CheckConnectivity_noNotification ', 'false');
          return false;
        }
        
        const orderManager = new OrderManager();
        console.log('orderManager', 'getAllOrdersFromServer()');
        console.log('token', token);
        

        const orderLinesManager = new OrderLinesManager();
        await orderManager.initDB();
        await orderLinesManager.initDB();
        await orderLinesManager.CREATE_ORDER_LINES_TABLE();

        const list_cmd_ids = await orderManager.GET_CMD_IDS_LIST().then(async (val) => {
            return await val;
        });

        return await new Promise(async (resolve) => {
            if(list_cmd_ids.length > 0){
                let i_ = 0;
                let ind = 0;
    
                while(i_ < list_cmd_ids.length){
                    console.log(`${token.server}/api/index.php/orders/${list_cmd_ids[i_].commande_id}/lines`);
                    await axios.get(`${token.server}/api/index.php/orders/${list_cmd_ids[i_].commande_id}/lines`, 
                        { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                    .then(async (response) => {
                        if(response.status == 200){
                            //console.log('Status == 200');
                            console.log(response.data);
            
                            const res_1 = await orderLinesManager.INSERT_ORDER_LINES(response.data);
                            if(res_1){
                                i_++;
                                console.log('next request....');
                            }
                        }else{
                            console.log('Status != 200');
                            console.log(response.data);
                        }
            
                    }).catch(async (error) => {
                        // handle error
                        console.log('error : ', error);
                        if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
                          console.log('zzzzz');
                          ind += 1;
                          if (ind == 1) {
                            i_ = 610; // equals higher than the loop
                            console.log('ind = ' + ind);
                            return await resolve(true);
                          }
                          console.log('ind =! 1 :: ind => '+ind);
                        }
                        console.log('error.Error+"".indexOf("404") > -1 is different');
                    });
                }

                if(i_ >= list_cmd_ids.length){
                    return await resolve(true);
                }
                else{
                    return await resolve(false);
                }
            }else{
                await resolve(false);
            }
        });
        
    }


}

//make this component available to the app
export default FindCommandesLines;
