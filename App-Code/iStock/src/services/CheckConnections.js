//import liraries
import React, { Component } from "react";
import NetInfo from '@react-native-community/netinfo'
import { AppState, Alert, Platform, ToastAndroid, AlertIOS, } from "react-native";

// create a component
class CheckConnections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    CheckConnectivity(){
        NetInfo.addEventListener(state => {
            // console.log("Connection state : ", state);
            console.log("CheckConnectivity appState : ", this.state.appState);
            if(this.state.appState == "active"){
                if (state.isConnected === false) {
                    this.notifyMessage("Internet indisponible!");
                } else {
                    this.notifyMessage("Internet disponible");
                }
            }
        });
    };

    async CheckConnectivity_noNotification(){
        return await new Promise(async (resolve) => {
            await NetInfo.fetch().then(async (state) => {
                console.log('state ', state);
                await resolve(state.isConnected);
            });
        });
        
    };

    notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            AlertIOS.alert(msg);
        }
    }

    _handleAppStateChange = (nextAppState) => {
        console.log('nextAppState 1 => ', nextAppState);

        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
        }
        this.setState({appState: nextAppState});
        this.CheckConnectivity();
    }

    render() {
        return (
            null
        );
    }
}

//make this component available to the app
export default CheckConnections;
