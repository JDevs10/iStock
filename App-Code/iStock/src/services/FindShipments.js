import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import ShipmentsManager from '../Database/ShipmentsManager';
import ShipmentsLinesManager from '../Database/ShipmentLinesManager';

const LIMIT = "20"; //Limite of orders in each page

class FindShipments extends Component {
  constructor(props) {
    super(props);
  }


  async getAllShipmentsFromServer(token){
    const shipmentsManager = new ShipmentsManager();
    await shipmentsManager.initDB();
    await shipmentsManager.CREATE_SHIPMENTS_TABLE();

    const shipmentsLinesManager = new ShipmentsLinesManager();
    await shipmentsLinesManager.initDB();
    await shipmentsLinesManager.CREATE_SHIPMENT_LINES_TABLE();

    console.log('shipmentsManager', 'ShipmentsManager()');
    console.log('token', token);
    
    let i_ = 0;
    let ind = 0;

    return await new Promise(async (resolve)=> {
      while(i_ < 600){
        console.log(`${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&DOLAPIKEY=${token.token}`);
        await axios.get(`${token.server}/api/index.php/shipments?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                //console.log(response.data);

                const res_1 = await shipmentsManager.INSERT_SHIPMENTS(response.data);
                console.log('res_1 : ', res_1);

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
    });

  }

}

export default FindShipments;