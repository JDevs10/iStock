import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import OrderLinesManager from '../Database/OrderLinesManager';


class FindCommandes extends Component {
  constructor(props) {
    super(props);
  }


  async getAllOrdersFromServer(token){
    const orderManager = new OrderManager();
    const orderLinesManager = new OrderLinesManager();
    await orderManager.initDB();
    await orderManager.CREATE_ORDER_TABLE();
    await orderLinesManager.initDB();
    await orderLinesManager.CREATE_ORDER_LINES_TABLE();

    console.log('orderManager', 'getAllOrdersFromServer()');
    console.log('token', token);
    
    let i_ = 0;
    let ind = 0;

    return await new Promise(async (resolve)=> {
      while(i_ < 600){
        console.log(`${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}&DOLAPIKEY=${token.token}`);
        await axios.get(`${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=50&page=${i_}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');
                //console.log(response.data);

                const res_1 = await orderManager.INSERT_ORDERS(response.data);
                const res_2 = await orderLinesManager.INSERT_ORDER_LINES(response.data);
                if(res_1 && res_2){
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

export default FindCommandes;