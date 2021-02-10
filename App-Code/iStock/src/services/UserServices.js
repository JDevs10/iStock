//import liraries
import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ServerManager from '../Database/ServerManager';
import TokenManager from '../Database/TokenManager';
import { Value } from 'react-native-reanimated';

// create a component
class UserServices extends Component {
    constructor(props){
        super(props);
    }

    async LogginIn(account, props){
        this.props = props;
        console.log('LogginIn');
        console.log(account);

        //find the selected company
        const sm = new ServerManager();
        await sm.initDB();
        const servers = await sm.GET_SERVER_LIST().then(async (val) => {
            return await val;
        });
        console.log('server_list : ', servers);

        let isServerActive = false;
        for(let i = 0; i < servers.length; i++){
            if(account.entreprise == servers[i].name){
                account.serverUrl = servers[i].url;
                account.serverStatus = servers[i].status;
                isServerActive = true;
                break;
            }
        }

        // Check if the server exist and avaiable
        if(!isServerActive){
            if(account.serverUrl == null || account.serverUrl == ""){
                console.log("Le server " + account.entreprise + " n'est pas joignable ou configuré dans iApps");
                alert("Le server " + account.entreprise + " n'est pas joignable ou configuré dans iApps");
                return;
            }
            if(account.serverStatus == null || account.serverStatus != 1){
                console.log("Le server " + account.entreprise + " est inactive !");
                alert("Le server " + account.entreprise + " est inactive !");
                return;
            }
        }
        // console.log('end: ', account);

        //login
        const result = await new Promise(async (resolve) => {
            await axios.post(`${account.serverUrl}/api/index.php/login`, 
            {
                login: account.identifiant,
                password: account.password
            }, 
            { headers: { 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');
                console.log(response.data);
                account.key = response.data.success.token;
                
                await axios.post(`${account.serverUrl}/api/index.php/istockapi/login`, 
                    {
                        login: account.identifiant,
                        password: account.password
                    }, 
                    { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
                .then(async (response) => {
                    if(response.status == 200){
                        console.log('Status == 200');
                        console.log(response.data);

                        //navigate to download
                        const token_ = {
                            userId: response.data.success.id,
                            name: response.data.success.identifiant,
                            server: account.serverUrl,
                            token: account.key,
                            company: account.entreprise
                        };

                        const tm = new TokenManager();
                        await tm.initDB();
                        const res = await tm.CREATE_TOKEN_TABLE();
                        const res_ = await tm.INSERT_TOKEN(token_);

                        await resolve(true);
                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                    }
                }).catch(async (error) => {
                    // handle error
                    console.log('error 1 : ');
                    console.log(error);
                    console.log( error.response.request._response);
                });
                
            }else{
                console.log('Status != 200');
                console.log(response.data);
            }
        }).catch(async (error) => {
            // handle error
            console.log('error 1 : ');
            console.log(error);
            console.log( error.response.request._response);
        });
        });

        if(result){
            this.props.navigation.navigate('download');
        }
        
    }

    SigningIn(account){

        let isUser = false;
        console.log('SigningIn');
        console.log(account);

        console.log(`${account.server}/api/index.php/istockapi/login`);
        axios.post(`${account.server}/api/index.php/istockapi/login`,
            {
                login: account.identifiant,
                password: account.password
            },
            { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
        .then(function (response) {

            if(response.status){

                let deviceOS = "";
                if (Platform.OS === 'android') {
                    deviceOS = "Android";
                }
                if (Platform.OS === 'ios') {
                    deviceOS = "IOS";
                }

                console.log('user_data :');
                const user_data = {
                    rowid: "NULL",
                    date_creation: Math.floor(Date.now() / 1000),
                    identifiant: account.identifiant,
                    last_connexion: Math.floor(Date.now() / 1000),
                    device_platform: deviceOS,
                    device_type: (DeviceInfo.isTablet() ? "Tablette" : "Téléphone"),
                    fk_user: parseInt("" + response.data.success.id)
                };
                console.log(user_data);

                console.log(`${account.server}/api/index.php/istockapi/authentifications/create?DOLAPIKEY${account.key}`);
                axios.post(`${account.server}/api/index.php/istockapi/authentifications/create`, 
                    user_data, 
                    { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
                .then(function (response) {
                    if(response.status == 200){
                        console.log('Status == 200');
                        console.log(response.data);

                        //navigate to connexion screen
                        this.props.navigation.navigate('login')
                    }else{
                        console.log('Status != 200');
                        console.log(response.data);
                    }
                }).catch(function (error) {
                    // handle error
                    console.log('error 2 : ');
                    console.log(error);
                    console.log( error.response.request._response);
                });
            }
        })
        .catch(function (error) {
            // handle error
            isUser = false;
            console.log('error 1 : ');
            console.log( error);
            console.log( error.response.code);
            console.log( error.response.request._response);
            alert("Vous n'avez pas de compte sur " + account.server);
        });
    }

}


//make this component available to the app
export default UserServices;
