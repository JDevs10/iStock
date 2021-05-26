//import liraries
import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ServerManager from '../Database/ServerManager';
import TokenManager from '../Database/TokenManager';
import CheckConnections from '../services/CheckConnections';
import { STRINGS } from "../utilities/STRINGS";
import { MyErrors } from "../utilities/Error";
import { writeInitLog, writeBackInitLog, writeLog, LOG_TYPE } from '../utilities/MyLogs';


// create a component
class UserServices extends Component {
    constructor(props){
        super(props);
    }

    async LogginIn(account, props){
        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
            console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
            console.log('CheckConnectivity_noNotification  ', 'false');
            Alert.alert(
                STRINGS._NO_INTERNET_TITTLE,
                STRINGS._NO_INTERNET_TEXT,
                [
                    { text: 'Ok', onPress: () => {return;} },
                ],
                { cancelable: false }
            );
            return;
        }
        
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
        writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, "BDC servers => "+servers.length);

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
            if(account.serverUrl == null || account.serverUrl == "") {
                console.log("Le server " + account.entreprise + " n'est pas joignable ou configuré dans iApps");
                alert("Le server " + account.entreprise + " n'est pas joignable ou configuré dans iApps");
                writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, "The server \""+JSON.stringify(account.serverUrl)+"\" is not reachable");
                return;
            }
            if(account.serverStatus == null || account.serverStatus != 1) {
                console.log("Le server " + account.entreprise + " est inactive !");
                alert("Le server " + account.entreprise + " est inactive !");
                writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, "The server \""+JSON.stringify(account.serverUrl)+"\" is inactive");
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
                .then(async (response_istockapi) => {
                    if(response_istockapi.status == 200){
                        console.log('Status == 200');
                        console.log(response_istockapi.data);

                        //navigate to download
                        const token_ = {
                            userId: response_istockapi.data.success.id,
                            name: response_istockapi.data.success.identifiant,
                            server: account.serverUrl,
                            token: account.key,
                            company: account.entreprise,
                            channel: response_istockapi.data.success.iStock_channel
                        };

                        console.log("token_ => ", token_);

                        const tm = new TokenManager();
                        await tm.initDB();
                        const res = await tm.CREATE_TOKEN_TABLE();
                        const res_ = await tm.INSERT_TOKEN(token_);

                        await resolve(true);
                    }else{
                        console.log('Status != 200');
                        console.log(response_istockapi.data);
                    }
                }).catch(async (error) => {
                    // handle error
                    console.log('error 1 : ');
                    console.log(error);
                    writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, JSON.stringify(error));
                });
                
            }else{
                console.log('Status != 200');
                console.log(response.data);
            }
        }).catch(async (error) => {
            // handle error
            console.log('error 1 : ');
            console.log(error);
            writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, JSON.stringify(error));
        });
        });

        if(result){
            this.props.navigation.navigate('download');
            writeLog(LOG_TYPE.INFO, UserServices.name, this.LogginIn.name, "Loggin successful && token saved");
        }
        
    }

    async SigningIn(account, props){
        //check for internet connection
        const conn = new CheckConnections();
        if(await conn.CheckConnectivity_noNotification()){
            console.log('CheckConnectivity_noNotification ', 'true');
        }
        else{
            console.log('CheckConnectivity_noNotification  ', 'false');
            Alert.alert(
                STRINGS._NO_INTERNET_TITTLE,
                STRINGS._NO_INTERNET_TEXT,
                [
                    { text: 'Ok', onPress: () => {return;} },
                ],
                { cancelable: false }
            );
            return;
        }

        this.props = props;
        let isUser = false;
        console.log('SigningIn');
        console.log(account);

        const result = await new Promise(async (resolve) => {
            console.log(`${account.server}/api/index.php/istockapi/login`);
            axios.post(`${account.server}/api/index.php/istockapi/login`,
                {
                    login: account.identifiant,
                    password: account.password
                },
                { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
            .then(async (response) => {

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
                        fk_user: parseInt("" + response.data.success.id),
                        iStock_channel: response.data.success.iStock_channel
                    };
                    //console.log(user_data);

                    
                    writeLog(LOG_TYPE.INFO, UserServices.name, this.SigningIn.name, `${account.server}/api/index.php/istockapi/authentifications/create?DOLAPIKEY${account.key}`);
                    writeLog(LOG_TYPE.INFO, UserServices.name, this.SigningIn.name, JSON.stringify(user_data));
                    
                    console.log(`${account.server}/api/index.php/istockapi/authentifications/create?DOLAPIKEY${account.key}`);

                    axios.post(`${account.server}/api/index.php/istockapi/authentifications/create`, 
                        user_data, 
                        { headers: { 'DOLAPIKEY': account.key, 'Accept': 'application/json' } })
                    .then(async (response) => {
                        if(response.status == 200){
                            console.log('Status == 200');
                            console.log(response.data);

                            //save token
                            const token_ = {
                                userId: response.data,
                                name: user_data.identifiant,
                                server: account.server,
                                token: account.key,
                                company: account.server.split('/')[2].split('.')[0],
                                channel: user_data.iStock_channel
                            };
                            writeLog(LOG_TYPE.INFO, UserServices.name, this.SigningIn.name, "Token: "+JSON.stringify(token_));

                            const tm = new TokenManager();
                            await tm.initDB();
                            const res = await tm.CREATE_TOKEN_TABLE();
                            const res_ = await tm.INSERT_TOKEN(token_);

                            //navigate to connexion screen
                            if(res_ != null && res_){
                                writeLog(LOG_TYPE.INFO, UserServices.name, this.SigningIn.name, "Bienvenu sur iStock!");
                                await resolve({status: true, tittle: "Succès", message: "Bienvenu sur iStock!"});
                            }else{
                                writeLog(LOG_TYPE.WARNING, UserServices.name, this.SigningIn.name, JSON.stringify(MyErrors.getErrorMsgObj(100)));
                                await resolve({status: false, tittle: "Erreur", message: "Problème d'enregistrement du token!"});
                            }
                        }else{
                            console.log('Status != 200');
                            console.log(response.data);
                            writeLog(LOG_TYPE.WARNING, UserServices.name, this.SigningIn.name, JSON.stringify(response));
                            await resolve({status: false, tittle: "Erreur", message: JSON.stringify(response)});
                        }
                    }).catch(async (error) => {
                        // handle error
                        console.log('error 2 : ');
                        console.log(error);
                        writeLog(LOG_TYPE.ERROR, UserServices.name, this.SigningIn.name, JSON.stringify(error));
                        await resolve({status: false, tittle: "Erreur", message: JSON.stringify(error)});
                    });
                }else{
                    await resolve({status: false, tittle: "Erreur", message: JSON.stringify(response)});
                }
            })
            .catch(async (error) => {
                // handle error
                isUser = false;
                console.log('error 1 : ');
                console.log( error);
                writeLog(LOG_TYPE.ERROR, UserServices.name, this.SigningIn.name, JSON.stringify(error));
                writeLog(LOG_TYPE.ERROR, UserServices.name, this.SigningIn.name, JSON.stringify(MyErrors.getErrorMsgObj(101)));
                await resolve({status: false, tittle: "Erreur", message: "Vous n'avez pas de compte sur " + account.server});
            });
        });

        if(result.status){
            Alert.alert(
                result.tittle,
                result.message,
                [
                    { text: 'Ok', onPress: () => {this.props.navigation.navigate('download');}},
                ],
                { cancelable: false }
            );
        }else{
            Alert.alert(
                result.tittle,
                result.message,
                [
                    { text: 'Ok', onPress: () => { return; }},
                ],
                { cancelable: false }
            );
        }
    }

}


//make this component available to the app
export default UserServices;
