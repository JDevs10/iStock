//import liraries
import React, { Component } from 'react';

// All Statuts
const ORDER_STATUTS = [
	{id: -1, name: "Annulée", color: "#FFFFFF", bg_color: "#FF0000"}, 
	{id: 0, name: "Brouillon", color: "#000000", bg_color: "#00AAFF"}, 
	{id: 1, name: "Validée", color: "#000000", bg_color: "#7DFF7D"}, 
	{id: 2, name: "En cours", color: "#000000", bg_color: "#FF7D00"}, 
	{id: 3, name: "Livré", color: "#FFFFFF", bg_color: "#706FD3"} 
];

// create a component
class Statut extends Component {

    _ORDER_STATUTS_ = ORDER_STATUTS;
    
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

    getOrderStatutBackgroundColorStyles(statutId){
        let res = "";
        for(let x = 0; x < ORDER_STATUTS.length; x++){
            if(ORDER_STATUTS[x].id == statutId){
                res = ORDER_STATUTS[x].bg_color;
                break;
            }
        }
        return res;
    }

    getOrderStatutLabelColorStyles(statutId){
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
