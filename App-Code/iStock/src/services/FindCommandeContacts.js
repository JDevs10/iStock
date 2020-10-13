//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import OrderContactManager from '../Database/OrderContactManager';

const LIMIT = "50"; //Limite of orders in each page

// create a component
class FindCommandeContacts extends Component {
    constructor(props) {
        super(props);
    }

    async getAllContactsFromServer(token){
        const orderContactManager = new OrderContactManager();
        await orderContactManager.initDB();
        await orderContactManager.CREATE_ORDER_CONTACT_TABLE();

        console.log('orderContactManager', 'getAllContactsFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;

        return await new Promise(async (resolve)=> {
            while(i_ < 600){
                console.log(`${token.server}/api/index.php/istockapi/order/contacts/list?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&DOLAPIKEY=${token.token}`);
                await axios.get(`${token.server}/api/index.php/istockapi/order/contacts/list?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}`, 
                    { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                .then(async (response) => {
                    if(response.status == 200){
                        //console.log('Status == 200');
                        console.log(response.data);

                        const res_1 = await orderContactManager.INSERT_ORDER_CONTACT(response.data.success.data);

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
                    }
                });
            }
        });
    }
}


//make this component available to the app
export default FindCommandeContacts;
