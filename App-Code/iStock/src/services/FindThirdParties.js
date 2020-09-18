//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import ThirdPartiesManager from '../Database/ThirdPartiesManager';


// create a component
class FindThirdPaties extends Component {
    constructor(props) {
        super(props);
    }

    async getAllThirdPartiesFromServer(token){
        const thirdPartiesManager = new ThirdPartiesManager();
        await thirdPartiesManager.initDB();
        await thirdPartiesManager.CREATE_TPM_TABLE();
    
        console.log('thirdPartiesManager', 'getAllThirdPartiesFromServer()');
        console.log('token', token);
        
        let i_ = 0;
        let ind = 0;
    
        return await new Promise(async (resolve)=> {
          while(i_ < 600){
            console.log(`${token.server}/api/index.php/thirdparties?sortfield=t.rowid&sortorder=DESC&limit=50&page=${i_}&DOLAPIKEY=${token.token}`);
            await axios.get(`${token.server}/api/index.php/thirdparties?sortfield=t.rowid&sortorder=DESC&limit=50&page=${i_}`, 
                { headers: { 'DOLAPIKEY': token.token, 'Accept': 'application/json' } })
            .then(async (response) => {
                if(response.status == 200){
                    console.log('Status == 200');
                    //console.log(response.data);
    
                    const res = await thirdPartiesManager.INSERT_TPM(response.data);
                    if(res){
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

//make this component available to the app
export default FindThirdPaties;
