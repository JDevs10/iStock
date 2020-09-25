//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// All Statuts
const ORDER_STATUTS = [
	{id: -1, name: "Annulée", color: "#FF0000"}, 
	{id: 0, name: "Brouillon", color: "#00AAFF"}, 
	{id: 1, name: "Validée", color: "#7DFF7D"}, 
	{id: 2, name: "En cours", color: "#FF7D00"}, 
	{id: 3, name: "Livré", color: "#00FF00"}
];

// create a component
class Statut extends Component {
    
    getOrderStatut(statutId){
        let res = "";
        for(let x = 0; x < ORDER_STATUTS.length; x++){
            if(ORDER_STATUTS[x].id == statutId){
                res = ORDER_STATUTS[x].name;
                break;
            }
        }
        return res;
    }

    getOrderStatutColorStyles(statutId){
        let res = "";
        for(let x = 0; x < ORDER_STATUTS.length; x++){
            if(ORDER_STATUTS[x].id == statutId){
                res = ORDER_STATUTS[x].color;
                break;
            }
        }
        return res;
    }
}


//make this component available to the app
export default Statut;
