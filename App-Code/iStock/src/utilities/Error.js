// import { STRINGS } from "STRINGS";

/**
 * This file stores all potential errors
 */

const MyErrors = {
    ERRORS: [
        {code: 0, title: "Erreur BDC", message: "Le serveur Big Data Consulting n'est pas joignable..."},
        {code: 100, title: "Erreur Token", message: "Problème d'enregistrement du token!"},
        {code: 101, title: "Erreur Identifiant", message: "Vous n'avez pas de compte enregistré!"},
        {code: 102, title: "Erreur Identifiant", message: "Votre compte n'est pas activé!"},
        {code: 103, title: "Erreur Identifiant", message: "Votre compte n'est pas activé!"},
    ],
    // return error message
    getErrorMsg(code) {
        let msg = "";
        this.ERRORS.filter((error) => {
            if(error.code == code){
                msg = error.message;
                return;
            }
        });
        return msg;
    },
    // return error objet {code, title, message}
    getErrorMsgObj(code) {
        return this.ERRORS.filter((error) => {
            return error.code == code;
        });
    }
}
module.exports = {
	MyErrors
}