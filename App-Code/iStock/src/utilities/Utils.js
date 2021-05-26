import KeepAwake from 'react-native-keep-awake';
import DatabaseInfo from '../Database/DatabaseInfo';
import RNSmtpMailer from "react-native-smtp-mailer";
const RNFS = require('react-native-fs');

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}

function checkObjExistInDetailBatchList(obj, list) {
    for (var index = 0; index < list.length; index++) {
        if (list[index].batch === obj.batch && list[index].entrepot_id === obj.entrepot && list[index].fk_origin_stock === obj.fk_origin_stock) {
            return true;
        }
    }
    return false;
}

function checkObjExistInSelectedProductWarehouse(obj, list) {
    for (var index = 0; index < list.length; index++) {

        console.log("checkObjExistInSelectedProductWarehouse :=> ",list[index].batch, obj.batch, "|", list[index].entrepot_id, obj.entrepot_id,"|", list[index].fk_origin_stock, obj.fk_origin_stock);

        if (list[index].batch === obj.batch && list[index].entrepot_id === obj.entrepot_id && list[index].fk_origin_stock === obj.fk_origin_stock) {
            return true;
        }
    }
    return false;
}

// Return new list of no doubles
function checkDoublesInLists(origin_list, new_list){
    const list = origin_list;

    for (var z = 0; z < new_list.length; z++){
        if(!list.includes(new_list[z])){

            console.log("push ", new_list[z], "in origin list");
            list.push(new_list[z]);
        }
    }
    
    return list;
}

function changeKeepAwake(shouldBeAwake) {
    if (shouldBeAwake) {
        KeepAwake.activate();
    } else {
        KeepAwake.deactivate();
    }
}

function exportDatabase(){
    RNFS.readFile(DatabaseInfo.DATABASE_LOCATION + "/" + DatabaseInfo.DATABASE_NAME, "base64").then((val) => {
        RNFS.writeFile(DatabaseInfo.DATABASE_BACKUP_LOCATION, value, "base64").then((val) => {
            console.log("Successful backup db");
        }).catch((error) => {
            console.log("Error can't backup db", error);
        })
    }).catch((error) => {
        console.log("Error can't find db", error);
    }); 
}

function exportDatabase_e(){
    console.log(RNFS);

    RNFS.readFile(DatabaseInfo.DATABASE_NAME, "base64").then((value) => {

        RNFS.writeFile(DatabaseInfo.DATABASE_BACKUP_LOCATION, value, "base64").then((val) => {
            console.log("Successful backup db");
        }).catch((error) => {
            console.log("Error can't backup db", error);
        });

        RNFS.exists(DatabaseInfo.DATABASE_BACKUP_LOCATION).then((val) => {
            RNSmtpMailer.sendMail({
                mailhost: "smtp.gmail.com",
                port: "465",
                ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
                username: "jl@anexys.fr",
                password: "anexys1,",
                fromName: "iStock-Mail", // optional
                replyTo: "usernameEmail", // optional
                recipients: "jl@anexys.fr", //"toEmail1,toEmail2",
                // bcc: ["bccEmail1", "bccEmail2"], // optional
                subject: "iStock Database Export",
                htmlBody: "<h1>Database</h1><p>iStock db</p>",
                attachmentPaths: [
                    DatabaseInfo.DATABASE_BACKUP_LOCATION,
                ], // optional
                attachmentNames: [
                    DatabaseInfo.DATABASE_DISPLAY_NAME+"_copy.db"
                ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
              }).then((val) => {
                console.log("Send email Successful", val);
              }).catch((error) => {
                console.log("Send email faild", error);
            });
        });
    }).catch((error) => {
        console.log("Error can't find db", error);
    });
    
    
}


module.exports = {
    containsObject,
    checkObjExistInDetailBatchList,
    checkObjExistInSelectedProductWarehouse,
    checkDoublesInLists,
    changeKeepAwake,
    exportDatabase,
    exportDatabase_e
}