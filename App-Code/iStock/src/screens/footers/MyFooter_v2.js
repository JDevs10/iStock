//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class MyFooter_v2 extends Component {
    render() {
        return (
            <View style={styles.body}>
                <Text style={styles.text}>iStock © Tous droits réservés - Développer par BDC</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    body: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: '100%',
        height: '5%',
        marginTop: 5,
        marginBottom: 5
    },
    text: {
        color: '#ffffff'
    }
});

//make this component available to the app
export default MyFooter_v2;
