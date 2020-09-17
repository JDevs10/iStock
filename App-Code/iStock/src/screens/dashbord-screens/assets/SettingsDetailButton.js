//import liraries
import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, Animated, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import SettingsManager from '../../../Database/SettingsManager';

// create a component
class SettingsDetailButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }
    
        buttonSize = new Animated.Value(1);
        mode = new Animated.Value(0);
    
        handlePress = () => {
            Animated.sequence([
            Animated.timing(this.buttonSize, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.buttonSize, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false
            }),
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 350,
                useNativeDriver: false
            })
            ]).start();
        }
    
        default__ = () => {
            Animated.sequence([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 350,
                useNativeDriver: false
            })
            ]).start();
        }
    
        action_1 = () => {
            console.log('action_1');
            this.props.navigation.goBack();
            this.default__();
        }
        action_2 = () => {
            console.log('action_2');
            Alert.alert(
                "Information",
                "Les configurations ci-dessous affectent le fonctionnement de l'application ...",
                [
                  {text: 'Ok', onPress: () => true},
                ],
                { cancelable: false }
            );
            this.default__();
        }
        action_3 = async() => {
            console.log('action_3');
            await this.save();
            await this.default__();
        }

        async save(){
            console.log('this.props.parentData : ', this.props.parentData);
            const data = {
                isUseImages: this.props.parentData.isUseImages,
                isUseDetailedCMD: this.props.parentData.isUseDetailedCMD,
                isUseDetailedCMDLines: this.props.parentData.isUseDetailedCMDLines
            };

            const sm = new SettingsManager();
            await sm.initDB();
            const res = await sm.UPDATE_SETTINGS(data).then(async (val) => {
                return await val;
            });

            if(res){
                this.props.navigation.goBack();
            }
        }
    
      render() {
        const sizeStyle = {
            transform: [{scale: this.buttonSize}]
        };
      
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "720deg"]
        });
      
        const btn_1X = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? -200 : -100]
        });
      
        const btn_1Y = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -50 : -25]
        });
      
        const btn_2X = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? -50 : -25]
        });
      
        const btn_2Y = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -150 : -75]
        });
      
        const btn_3X = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? 100 : 50]
        });
      
        const btn_3Y = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -50 : -25]
        });
    
        return (
            <View style={{position: 'relative', alignItems: 'center'}}>
    
                <Animated.View style={{position: 'relative', left: btn_1X, top: btn_1Y }}>
                    <View style={styles.secondaryButtons}>
                        <TouchableOpacity onPress={this.action_1}>
                        <Image style={{width: DeviceInfo.isTablet() ? 50 : 25, height: DeviceInfo.isTablet() ? 80 : 40 }} source={require('../../../../img/return-button-v1.png')}/>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
    
                <Animated.View style={{position: 'relative', left: btn_2X, top: btn_2Y }}>
                    <View style={styles.secondaryButtons}>
                        <TouchableOpacity onPress={this.action_2}>
                            <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/Info.png')}/>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position: 'relative', left: btn_3X, top: btn_3Y }}>
                    <View style={styles.secondaryButtons}>
                        <TouchableOpacity onPress={this.action_3}>
                            {/* <FontAwesome name="key" color="#05375a" size={60} />  */}
                            <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/save-white.png')}/>
                            {/* <Text>inventory</Text> */}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
    
                <Animated.View style={[styles.mainBtn, sizeStyle]}>
                    <TouchableOpacity onPress={this.handlePress} underlayColor="#ABCDEF">
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        {/* <FontAwesome name="plus" color="#05375a" size={75} />  */}
                        <Image style={{width: DeviceInfo.isTablet() ? 100 : 60 , height: DeviceInfo.isTablet() ? 100 : 60 }} source={require('../../../../img/Logo.png')}/>
                    </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
      }
}


const styles = StyleSheet.create({
    mainBtn:{
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        height: DeviceInfo.isTablet() ? 125 : 62, 
        width: DeviceInfo.isTablet() ? 125 : 62,
        borderRadius: DeviceInfo.isTablet() ? 60 : 30,
        position: "absolute",
        bottom: DeviceInfo.isTablet() ? -100 : 0,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOffset: {height: 10},
        shadowOpacity: 0.3,
        borderWidth: 2,
        borderColor: "#00AAFF"
    },
    secondaryButtons: {
        width: 10, height: 10,
        position: "absolute",
        bottom: DeviceInfo.isTablet() ? -80 : 0,
        alignItems: "center",
        justifyContent: "center",
        width: DeviceInfo.isTablet() ? 100 : 50,
        height: DeviceInfo.isTablet() ? 100 : 50,
        borderRadius: DeviceInfo.isTablet() ? 50 : 25,
        backgroundColor: "#ABCDEF"
    }
});
  
  
//make this component available to the app
export default SettingsDetailButton;
