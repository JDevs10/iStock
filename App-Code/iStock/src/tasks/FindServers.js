//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import axios from 'axios';

const HOME_URL = "http://82.253.71.109/prod/anexys_v11";
const HOME_KEY = "Pervk-GTMQw-5qaPR-qMpxx-XfgjQ";

// create a component
class FindServers extends Component {

    constructor(props){
        super(props);
        this.state = {
            loadingNotify: 'loading...',
        };
    }

    async getAllServerUrls(){
        return await axios.get(`${HOME_URL}/api/index.php/connecteurappapi/urlss`, 
            { headers: { 'DOLAPIKEY': HOME_KEY, 'Accept': 'application/json' } })
        .then(async (response) => {
            if(response.status == 200){
                console.log('Status == 200');

                const filtered_data = [];
                
                for(let x=0; x < response.data.length; x++){
                    filtered_data[x] = {name: response.data[x].name, url: response.data[x].url};
                }

                console.log('data :');
                console.log(filtered_data);

                AsyncStorage.setItem('server_list', JSON.stringify(filtered_data));
                const servers = await AsyncStorage.getItem('server_list');
                console.log('server_list : ', servers);

                return true;
            }else{
                console.log('Status != 200');
                console.log(response.data);
                return false;
            }
        }).catch(async (error) => {
            // handle error
            console.log('error 1 : ');
            console.log(error);
            //console.log(error.response.request._response);
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
