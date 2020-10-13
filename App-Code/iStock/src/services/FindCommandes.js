import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import FindCommandeContacts from '../services/FindCommandeContacts';

const LIMIT = "50"; //Limite of orders in each page

class FindCommandes extends Component {
  constructor(props) {
    super(props);
  }


  async getAllOrdersFromServer(token){
    const orderManager = new OrderManager();
    await orderManager.initDB();
    await orderManager.CREATE_ORDER_TABLE();

    console.log('orderManager', 'getAllOrdersFromServer()');
    console.log('token', token);
    
    let i_ = 0;
    let ind = 0;

    const ORDER_PROMISE = await new Promise(async (resolve)=> {
      while(i_ < 600){
        console.log(`${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&DOLAPIKEY=${token.token}`);
        await axios.get(`${token.server}/api/index.php/orders?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`, 
            { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){

                const res_1 = await orderManager.INSERT_ORDERS(response.data);

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


    if(ORDER_PROMISE){
      const findCommandeContacts = new FindCommandeContacts();
      const res = await findCommandeContacts.getAllContactsFromServer(token).then(async (val) => {
        return val;
      });

      if(res){
        return true;
      }else{
        return false;
      }
    }
    
  }

}

export default FindCommandes;