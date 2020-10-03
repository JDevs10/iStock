import React, { Component } from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight, Animated, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';

export default class OrderDetailButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isFilter: true
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
        this.default__();
    }
    action_3 = () => {
        console.log('action_3');
        this.props.isFilterPressed({isFilter: this.state.isFilter});
        this.setState({isFilter: !this.state.isFilter});
        this.default__();
    }
    action_4 = () => {
        console.log('action_4');
        this.default__();
    }
    action_5 = () => {
        console.log('action_5');
        //this.default__();

        Alert.alert(
            "Information sur l'ajout d'un produit",
            "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum",
            [
              {text: 'Ok', onPress: () => true},
            ],
            { cancelable: false });
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
        outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? -160 : -30]
    });
  
    const btn_2Y = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -150 : -75]
    });
  
    const btn_3X = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? -50 : 30]
    });
  
    const btn_3Y = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -150 : -75]
    });

    const btn_4X = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? 65 : 30]
    });
  
    const btn_4Y = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -150 : -75]
    });

    const btn_5X = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? -50 : -25, DeviceInfo.isTablet() ? 100 : 50]
    });
  
    const btn_5Y = this.mode.interpolate({
        inputRange: [0, 1],
        outputRange: [DeviceInfo.isTablet() ? 20 : 0, DeviceInfo.isTablet() ? -50 : -25]
    });

    return (
        <View style={{position: 'relative', alignItems: 'center'}}>

            <Animated.View style={{position: 'relative', left: btn_1X, top: btn_1Y }}>
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity onPress={this.action_1}>
                    {/* <Image style={{width: DeviceInfo.isTablet() ? 50 : 25, height: DeviceInfo.isTablet() ? 80 : 40 }} source={require('../../../../img/return-button-v1.png')}/> */}
                    <Icon name="chevron-left" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.View style={{position: 'relative', left: btn_2X, top: btn_2Y }}>
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity onPress={this.action_2}>
                        {/* <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/plus-white.png')}/> */}
                        <Icon name="plus" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.View style={{position: 'relative', left: btn_3X, top: btn_3Y }}>
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity onPress={this.action_3}>
                        {/* <FontAwesome name="key" color="#05375a" size={60} />  */}
                        {/* <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/Barre-Code.png')}/> */}
                        <Icon name="filter" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                        {/* <Text>inventory</Text> */}
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.View style={{position: 'relative', left: btn_4X, top: btn_4Y }}>
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity onPress={this.action_4}>
                        {/* <FontAwesome name="key" color="#05375a" size={60} />  */}
                        {/* <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/Barre-Code.png')}/> */}
                        <Icon name="barcode" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
                        {/* <Text>inventory</Text> */}
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.View style={{position: 'relative', left: btn_5X, top: btn_5Y }}>
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity onPress={this.action_5}>
                        {/* <FontAwesome name="key" color="#05375a" size={60} />  */}
                        {/* <Image style={{width: DeviceInfo.isTablet() ? 60 : 40, height: DeviceInfo.isTablet() ? 60 : 40 }} source={require('../../../../img/Info.png')}/> */}
                        <Icon name="info" size={DeviceInfo.isTablet() ? 60 : 40} style={{color: "#fff"}} />
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
  
  