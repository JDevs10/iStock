//import liraries
import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, Animated, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import SettingsManager from '../../../Database/SettingsManager';
import Strings from "../../../utilities/Strings";
const STRINGS = new Strings();

// Main bouton
const MAIN_BTN_HEIGHT_TABLETTE = 125;
const MAIN_BTN_WIDTH_TABLETTE = 125;
const MAIN_BTN_POSITION_B_TABLETTE = -100;
const MAIN_BTN_BORDER_RADIUS_TABLETTE = 60;

const MAIN_BTN_HEIGHT_PHONE = 75;
const MAIN_BTN_WIDTH_PHONE = 75;
const MAIN_BTN_POSITION_B_PHONE = -60;
const MAIN_BTN_BORDER_RADIUS_PHONE = 40;

// Main bouton
const SECONDARY_BTN_HEIGHT_TABLETTE = 100;
const SECONDARY_BTN_WIDTH_TABLETTE = 100;
const SECONDARY_BTN_POSITION_B_TABLETTE = -80;
const SECONDARY_BTN_BORDER_RADIUS_TABLETTE = 50;

const SECONDARY_BTN_HEIGHT_PHONE = 70;
const SECONDARY_BTN_WIDTH_PHONE = 70;
const SECONDARY_BTN_POSITION_B_PHONE = -60;
const SECONDARY_BTN_BORDER_RADIUS_PHONE = 40;


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
                STRINGS._INFORMATION_SETTINGS_HEADER_INFO_,
                STRINGS._INFORMATION_SETTINGS_TEXT_INFO_,
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
            const settings = this.props.parentData.settings;
            const data = {
                isUseImages: settings.isUseImages,
                isUseDetailedCMD: settings.isUseDetailedCMD,
                isUseDetailedCMDLines: settings.isUseDetailedCMDLines,
                isUseDetailedShipment: settings.isUseDetailedShipment,
                limitOrdersDownload: settings.dataList_limitDownloadOrders_selected.value,
                limitShipmentsDownload: settings.dataList_limitDownloadShipments_selected.value
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
            outputRange: [DeviceInfo.isTablet() ? -50 : -35, DeviceInfo.isTablet() ? -200 : -120]
        });
      
        const btn_1Y = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -50 : -25]
        });
      
        const btn_2X = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? -50 : -35, DeviceInfo.isTablet() ? -50 : -35]
        });
      
        const btn_2Y = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -150 : -90]
        });
      
        const btn_3X = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [DeviceInfo.isTablet() ? -50 : -35, DeviceInfo.isTablet() ? 100 : 50]
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
                            <Icon name="chevron-left" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
    
                <Animated.View style={{position: 'relative', left: btn_2X, top: btn_2Y }}>
                    <View style={styles.secondaryButtons}>
                        <TouchableOpacity onPress={this.action_2}>
                            <Icon name="info" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position: 'relative', left: btn_3X, top: btn_3Y }}>
                    <View style={styles.secondaryButtons}>
                        <TouchableOpacity onPress={this.action_3}>
                            <Icon name="save" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
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
        height: DeviceInfo.isTablet() ? MAIN_BTN_HEIGHT_TABLETTE : MAIN_BTN_HEIGHT_PHONE, 
        width: DeviceInfo.isTablet() ? MAIN_BTN_WIDTH_TABLETTE : MAIN_BTN_WIDTH_PHONE,
        borderRadius: DeviceInfo.isTablet() ? MAIN_BTN_BORDER_RADIUS_TABLETTE : MAIN_BTN_BORDER_RADIUS_PHONE,
        position: "absolute",
        bottom: DeviceInfo.isTablet() ? MAIN_BTN_POSITION_B_TABLETTE : MAIN_BTN_POSITION_B_PHONE,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOffset: {height: 10},
        shadowOpacity: 0.3,
        borderWidth: 2,
        borderColor: "#00AAFF"
    },
    secondaryButtons: {
        alignItems: "center",
        justifyContent: "center",
        height: DeviceInfo.isTablet() ? SECONDARY_BTN_HEIGHT_TABLETTE : SECONDARY_BTN_HEIGHT_PHONE, 
        width: DeviceInfo.isTablet() ? SECONDARY_BTN_WIDTH_TABLETTE : SECONDARY_BTN_WIDTH_PHONE,
        borderRadius: DeviceInfo.isTablet() ? SECONDARY_BTN_BORDER_RADIUS_TABLETTE : SECONDARY_BTN_BORDER_RADIUS_PHONE,
        position: "absolute",
        bottom: DeviceInfo.isTablet() ? SECONDARY_BTN_POSITION_B_TABLETTE : SECONDARY_BTN_POSITION_B_PHONE,
        backgroundColor: "#ABCDEF"
    }
});
  
//make this component available to the app
export default SettingsDetailButton;
