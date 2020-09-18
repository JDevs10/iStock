//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// All Statuts
const ORDER_STATUTS = [{id: -1, name: "Annulée"}, {id: 0, name: "Brouillon"}, {id: 1, name: "Validée"}, {id: 2, name: "En cours"}, {id: 3, name: "Livré"}];

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
}


//make this component available to the app
export default Statut;
