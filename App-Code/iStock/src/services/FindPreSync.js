//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import OrderManager from '../Database/OrderManager';
import CheckConnections from '../services/CheckConnections';
import SettingsManager from '../Database/SettingsManager';
import DefaultSettings from '../utilities/DefaultSettings';
import { checkDoublesInLists } from '../utilities/Utils'
import { writeInitLog, writeLog, LOG_TYPE } from '../utilities/MyLogs';
import moment from "moment";

const LIMIT = "30"; //Limite of orders in each page
const MAX_PAGE = 600;
const DEFAULT_SETTINGS = new DefaultSettings();

// create a component
class FindPreSync extends Component {
    
    async sync(token){
        writeInitLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name);

        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
          console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
          return { status: false, res: null };
        }

        // Limit of orders downloaded
        const settingsManager = new SettingsManager();
        await settingsManager.initDB();
        const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
            return val;
        });

        if(settings == null){
            return { status: false, res: null };
        }
        const sqlfilters = DEFAULT_SETTINGS.get_Orders_Bigger_than_date_from_value(settings.limitOrdersDownload);

        if(sqlfilters == null){
            return { status: false, res: null };
        }
        // END Limit of orders downloaded
        
        const sync_info = {};
        let i_ = 0;
        let ind = 0;

        const SYNC_PROMISE = await new Promise(async (resolve) => {
            
            while(i_ < MAX_PAGE){
                const url = `${token.server}/api/index.php/istockapi/get/sync_info/v3?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&sqlfilters=${sqlfilters}`;
                writeLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name, "Url => "+url+"&DOLAPIKEY="+token.token);
                console.log(url+"&DOLAPIKEY="+token.token);
                
                await axios.get(url, { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                .then(async (response) => {
                    if(response.status == 200){

                        const Object_keys = Object.keys(response.data); 
                        // console.log(Object_keys.length);
                        // console.log(Object.keys(sync_info).length);

                        if(Object.keys(sync_info).length > 0){
                            sync_info.orders = checkDoublesInLists(sync_info.orders, response.data.orders);
                            sync_info.orders_lines = checkDoublesInLists(sync_info.orders_lines, response.data.orders_lines);
                            sync_info.orders_contacts = checkDoublesInLists(sync_info.orders_contacts, response.data.orders_contacts);
                            sync_info.clients = checkDoublesInLists(sync_info.clients, response.data.clients);
                            sync_info.users = checkDoublesInLists(sync_info.users, response.data.users);
                            sync_info.products = checkDoublesInLists(sync_info.products, response.data.products);
                            sync_info.shipments = checkDoublesInLists(sync_info.shipments, response.data.shipments);
                            sync_info.shipments_lines = checkDoublesInLists(sync_info.shipments_lines, response.data.shipments_lines);
                            sync_info.Total_objs = sync_info.orders.length+sync_info.orders_lines.length+sync_info.orders_contacts.length+sync_info.clients.length+sync_info.users.length+sync_info.products.length+sync_info.shipments.length+sync_info.shipments_lines.length;
                        }
                        else{

                            sync_info.orders = response.data.orders;
                            sync_info.orders_lines = response.data.orders_lines;
                            sync_info.orders_contacts = response.data.orders_contacts;
                            sync_info.clients = response.data.clients;
                            sync_info.users = response.data.users;
                            sync_info.products = response.data.products;
                            sync_info.shipments = response.data.shipments;
                            sync_info.shipments_lines = response.data.shipments_lines;
                            sync_info.Total_objs = response.data.Total_objs;
                        }
                        console.log(JSON.stringify(sync_info));
                        i_++;

                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                        try {
                            if(response.data.error.status == 404){
                                await resolve(true);
                            }
                        } catch (error) {
                            console.log('Status != 200', error);
                            await resolve(false);
                        }
                    }

                }).catch(async (error) => {
                    // handle error
                    console.log('error_error : ', error);
                    if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
                        ind += 1;
                        if (ind == 1) {
                            i_ = (MAX_PAGE+1); // equals higher than the loop
                            console.log('ind = ' + ind);
                            return await resolve(true);
                        }
                    }
                });
            }

        });// End promise
        
        writeLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name, "sync_info JSON => "+JSON.stringify({
            orders: sync_info.orders.length,
            orders_lines: sync_info.orders_lines.length,
            orders_contacts: sync_info.orders_contacts.length,
            clients: sync_info.clients.length,
            users: sync_info.users.length,
            products: sync_info.products.length,
            shipments: sync_info.shipments.length,
            shipments_lines: sync_info.shipments_lines.length,
            Total_objs: sync_info.Total_objs
        }));
        
        return await {
            status: SYNC_PROMISE,
            res: sync_info
        };
    }

    async newSync(token){
        writeInitLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name);

        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
          console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
          return { status: false, res: null };
        }

        // Limit of orders downloaded
        const settingsManager = new SettingsManager();
        await settingsManager.initDB();
        const settings = await settingsManager.GET_SETTINGS_BY_ID(1).then(async (val)=> {
            return val;
        });

        if(settings == null){
            return { status: false, res: null };
        }
        
        const sqlfilters = "(t.tms:>:'"+moment(Date.parse(new Date())).format('YYYYMMDD')+"')";
        // END Limit of orders downloaded
        
        const sync_info = {};
        let i_ = 0;
        let ind = 0;


        const SYNC_PROMISE = await new Promise(async (resolve) => {
            
            while(i_ < MAX_PAGE){
                const url = `${token.server}/api/index.php/istockapi/get/sync_info/v3?sortfield=t.rowid&sortorder=ASC&limit=${LIMIT}&page=${i_}&sqlfilters=${sqlfilters}`;
                writeLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name, "Url => "+url+"&DOLAPIKEY="+token.token);
                console.log(url+"&DOLAPIKEY="+token.token);
                
                await axios.get(url, { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
                .then(async (response) => {
                    if(response.status == 200){

                        const Object_keys = Object.keys(response.data); 
                        console.log(Object_keys.length);
                        console.log(Object.keys(sync_info).length);

                        if(Object.keys(sync_info).length > 0){
                            sync_info.orders = checkDoublesInLists(sync_info.orders, response.data.orders);
                            sync_info.orders_lines = checkDoublesInLists(sync_info.orders_lines, response.data.orders_lines);
                            sync_info.orders_contacts = checkDoublesInLists(sync_info.orders_contacts, response.data.orders_contacts);
                            sync_info.clients = checkDoublesInLists(sync_info.clients, response.data.clients);
                            sync_info.users = checkDoublesInLists(sync_info.users, response.data.users);
                            sync_info.products = checkDoublesInLists(sync_info.products, response.data.products);
                            sync_info.shipments = checkDoublesInLists(sync_info.shipments, response.data.shipments);
                            sync_info.shipments_lines = checkDoublesInLists(sync_info.shipments_lines, response.data.shipments_lines);
                            sync_info.Total_objs = sync_info.orders.length+sync_info.orders_lines.length+sync_info.orders_contacts.length+sync_info.clients.length+sync_info.users.length+sync_info.products.length+sync_info.shipments.length+sync_info.shipments_lines.length;
                        }
                        else{

                            sync_info.orders = response.data.orders;
                            sync_info.orders_lines = response.data.orders_lines;
                            sync_info.orders_contacts = response.data.orders_contacts;
                            sync_info.clients = response.data.clients;
                            sync_info.users = response.data.users;
                            sync_info.products = response.data.products;
                            sync_info.shipments = response.data.shipments;
                            sync_info.shipments_lines = response.data.shipments_lines;
                            sync_info.Total_objs = response.data.Total_objs;
                        }
                        console.log(JSON.stringify(sync_info));
                        i_++;

                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                        try {
                            if(response.data.error.status == 404){
                                await resolve(true);
                            }
                        } catch (error) {
                            console.log('Status != 200', error);
                            await resolve(false);
                        }
                    }

                }).catch(async (error) => {
                    // handle error
                    console.log('error_error : ', error);
                    if ((error+"".indexOf("404") > -1) || (error.response.status === 404)) {
                        ind += 1;
                        if (ind == 1) {
                            i_ = (MAX_PAGE+1); // equals higher than the loop
                            console.log('ind = ' + ind);
                            return await resolve(true);
                        }
                    }
                });
            }

        });// End promise
        
        writeLog(LOG_TYPE.INFO, FindPreSync.name, this.sync.name, "sync_info JSON => "+JSON.stringify({
            orders: sync_info.orders.length,
            orders_lines: sync_info.orders_lines.length,
            orders_contacts: sync_info.orders_contacts.length,
            clients: sync_info.clients.length,
            users: sync_info.users.length,
            products: sync_info.products.length,
            shipments: sync_info.shipments.length,
            shipments_lines: sync_info.shipments_lines.length,
            Total_objs: sync_info.Total_objs
        }));
        
        return await {
            status: SYNC_PROMISE,
            res: sync_info
        };

    }
}

//make this component available to the app
export default FindPreSync;
