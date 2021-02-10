//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import axios from 'axios';
import ServerManager from '../Database/ServerManager';

// Find all servers from bdc.bdcloud.fr in iApps module
const HOME_URL = "https://bdc.bdcloud.fr";
const HOME_KEY = "B12345-D67891-C23456-J78912-L34567";

// create a component
class FindServers extends Component {

    constructor(props){
        super(props);
        this.state = {
            loadingNotify: 'loading...',
        };
    }

    async getAllServerUrls(){
        console.log(`${HOME_URL}/api/index.php/iappsapi/istock_auth/get`);
        return await axios.get(`${HOME_URL}/api/index.php/iappsapi/istock_auth/get`, 
            { headers: { 'DOLAPIKEY': HOME_KEY, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');

                const filtered_data = [];
                //console.log("Data : ", response.data);
                
                for(let x=0; x < response.data.length; x++){
                    filtered_data[x] = {name: response.data[x].server_name, url: response.data[x].server_url, status: response.data[x].status};
                }

                console.log('data : ', filtered_data);

                //Sava data in db
                const sm = new ServerManager();
                await sm.initDB();
                const res_1 = await sm.CREATE_SERVER_TABLE();
                const res_2 = await sm.INSERT_SERVER_L(filtered_data);

                return true;
            }else{
                console.log('Status != 200');
                console.log(response.data);
                return false;
            }
        }).catch(async (error) => {
            // handle error
            console.log('error : ', error);
            return false;
        });
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default FindServers;
