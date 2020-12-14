//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DatabaseInfo from './DatabaseInfo';
import ShipmentsLinesManager from '../Database/ShipmentLinesManager';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;

const TABLE_NAME = "Shipments";
const COLUMN_ID = "id";
const COLUMN_ORIGIN = "origin";
const COLUMN_ORIGIN_ID = "origin_id";
const COLUMN_REF = "ref";
const COLUMN_SOCID = "socid";
const COLUMN_BROUILLON = "brouillon";
const COLUMN_ENTREPOT_ID = "entrepot_id";
const COLUMN_TRACKING_NUMBER = "tracking_number";
const COLUMN_TRACKING_URL = "tracking_url";
const COLUMN_DATE_CREATION = "date_creation";
const COLUMN_DATE_VALID = "date_valid";
const COLUMN_DATE_SHIPPING = "date_shipping";
const COLUMN_DATE_EXPEDITION = "date_expedition";
const COLUMN_DATE_DELIVERY = "date_delivery";
const COLUMN_STATUT = "statut";
const COLUMN_SHIPPING_METHOD_ID = "shipping_method_id";
const COLUMN_TOTAL_HT = "total_ht";
const COLUMN_TOTAL_TVA = "total_tva";
const COLUMN_TOTAL_TTC = "total_ttc";
const COLUMN_USER_AUTHOR_ID = "user_author_id";
const COLUMN_SHIPPING_METHOD = "shipping_method"; //Generic transporter
const COLUMN_MULTICURRENCY_CODE = "multicurrency_code"; //EUR
const COLUMN_MULTICURRENCY_TOTAL_HT = "multicurrency_total_ht";
const COLUMN_MULTICURRENCY_TOTAL_TVA = "multicurrency_total_tva";
const COLUMN_MULTICURRENCY_TOTAL_TTC = "multicurrency_total_ttc";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER(255)," +
    COLUMN_ORIGIN + " VARCHAR(255)," +
    COLUMN_ORIGIN_ID + " VARCHAR(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_SOCID + " VARCHAR(255)," +
    COLUMN_BROUILLON + " VARCHAR(255)," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_TRACKING_NUMBER + " VARCHAR(255)," +
    COLUMN_TRACKING_URL + " VARCHAR(255)," +
    COLUMN_DATE_CREATION + " INTEGER(255)," +
    COLUMN_DATE_VALID + " INTEGER(255)," +
    COLUMN_DATE_SHIPPING + " INTEGER(255)," +
    COLUMN_DATE_EXPEDITION + " INTEGER(255)," +
    COLUMN_DATE_DELIVERY + " INTEGER(255)," +
    COLUMN_STATUT + " VARCHAR(255)," +
    COLUMN_SHIPPING_METHOD_ID + " VARCHAR(255)," +
    COLUMN_TOTAL_HT + " VARCHAR(255)," +
    COLUMN_TOTAL_TVA + " VARCHAR(255)," +
    COLUMN_TOTAL_TTC + " VARCHAR(255)," +
    COLUMN_USER_AUTHOR_ID + " VARCHAR(255)," +
    COLUMN_SHIPPING_METHOD + " VARCHAR(255)," +
    COLUMN_MULTICURRENCY_CODE + " VARCHAR(255)," +
    COLUMN_MULTICURRENCY_TOTAL_HT + " VARCHAR(255)," +
    COLUMN_MULTICURRENCY_TOTAL_TVA + " VARCHAR(255)," +
    COLUMN_MULTICURRENCY_TOTAL_TTC + " VARCHAR(255)" +
")";


// create a component
class ShipmentsManager extends Component {
    _TABLE_NAME_ = "Shipments";
    _COLUMN_ORIGIN_ID_ = "origin_id";
    _COLUMN_REF_ = "ref";

    //Init database
    async initDB() {
        return await new Promise(async (resolve) => {
          console.log("Plugin integrity check ...");
          await SQLite.echoTest()
            .then(async() => {
                console.log("Integrity check passed ...");
                console.log("Opening database ...");
                await SQLite.openDatabase(
                    DATABASE_NAME,
                    DATABASE_VERSION,
                    DATABASE_DISPLAY_NAME,
                    DATABASE_SIZE
                )
                .then(async DB => {
                    db = DB;
                    console.log("Database OPEN");
                    await resolve(db);
                })
                .catch(async error => {
                    console.log(error);
                });
            })
            .catch(async error => {
              console.log("echoTest failed - plugin not functional");
            });
        });
    };

    async closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            await db.close()
            .then(async status => {
              console.log("Database CLOSED");
            })
            .catch(async error => {
              await this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
    };


    //Create
    async CREATE_SHIPMENTS_TABLE(){
        console.log("##### CREATE_SHIPMENTS_TABLE #########################");
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async function (txn) {
                    await txn.executeSql('DROP TABLE IF EXISTS ' + TABLE_NAME, []);
                    console.log("table '"+TABLE_NAME+"' Dropped!");
                });
                await db.transaction(async function (txn) {
                    await txn.executeSql(create, []);
                    console.log("table '"+TABLE_NAME+"' Created!");
                });
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }


    //Insert
    async INSERT_SHIPMENTS(data_){
        console.log("##### INSERT_SHIPMENTS #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const SQL_INSERT = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_BROUILLON+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                        ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                        ""+COLUMN_TOTAL_HT+", "+COLUMN_TOTAL_TVA+", "+COLUMN_TOTAL_TTC+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_SHIPPING_METHOD+", "+COLUMN_MULTICURRENCY_CODE+", "+COLUMN_MULTICURRENCY_TOTAL_HT+", "+COLUMN_MULTICURRENCY_TOTAL_TVA+", "+COLUMN_MULTICURRENCY_TOTAL_TTC+") "+
                        "VALUES ("+data_[x].id+", '"+data_[x].origin+"', '"+data_[x].origin_id+"', '"+data_[x].ref+"', '"+data_[x].socid+"', '"+data_[x].brouillon+"', '"+data_[x].entrepot_id+"', '"+data_[x].tracking_number+"', '"+data_[x].tracking_url+"', "+
                        ""+(data_[x].date_creation != null ? (data_[x].date_creation != "" ? data_[x].date_creation : null) : null)+", "+(data_[x].date_valid != null ? (data_[x].date_valid != "" ? data_[x].date_valid : null) : null)+", "+(data_[x].date_shipping != null ? (data_[x].date_shipping != "" ? data_[x].date_shipping : null) : null)+", "+(data_[x].date_expedition != null ? (data_[x].date_expedition != "" ? data_[x].date_expedition : null) : null)+", "+(data_[x].date_delivery != null ? (data_[x].date_delivery != "" ? data_[x].date_delivery : null) : null)+", '"+data_[x].statut+"', '"+data_[x].shipping_method_id+"', '"+data_[x].total_ht+"', '"+data_[x].total_tva+"', '"+data_[x].total_ttc+"', "+
                        "'"+data_[x].user_author_id+"', '"+data_[x].shipping_method+"', '"+data_[x].multicurrency_code+"', '"+data_[x].multicurrency_total_ht+"', '"+data_[x].multicurrency_total_tva+"', '"+data_[x].multicurrency_total_ttc+"')";

                    await db.transaction(async (tx) => {
                        await tx.executeSql(SQL_INSERT, []);
                    });

                    if(data_[x].lines != null){
                        const shipmentsLinesManager = new ShipmentsLinesManager();
                        await shipmentsLinesManager.initDB();
                        await shipmentsLinesManager.INSERT_SHIPMENT_LINES(data_[x].lines);
                    }
                    
                }
                return await resolve(true);
            } catch(error){
                console.log("error : ", error);
                return await resolve(false);
            }
        });
    }

    //Get by ref
    async GET_SHIPMENTS_BY_ORIGIN(origin_id){
        console.log("##### GET_SHIPMENTS_BY_ORIGIN #########################");

        return await new Promise(async (resolve) => {
            let shipment = null;
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_BROUILLON+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                        ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                        ""+COLUMN_TOTAL_HT+", "+COLUMN_TOTAL_TVA+", "+COLUMN_TOTAL_TTC+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_SHIPPING_METHOD+", "+COLUMN_MULTICURRENCY_CODE+", "+COLUMN_MULTICURRENCY_TOTAL_HT+", "+COLUMN_MULTICURRENCY_TOTAL_TVA+", "+COLUMN_MULTICURRENCY_TOTAL_TTC+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_ORIGIN_ID+" = "+origin_id;

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipment = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(shipment);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Get list
    async GET_SHIPMENTS_LIST(){
        console.log("##### GET_SHIPMENTS_LIST #########################");

        return await new Promise(async (resolve) => {
            let shipments = [];
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_BROUILLON+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                        ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                        ""+COLUMN_TOTAL_HT+", "+COLUMN_TOTAL_TVA+", "+COLUMN_TOTAL_TTC+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_SHIPPING_METHOD+", "+COLUMN_MULTICURRENCY_CODE+", "+COLUMN_MULTICURRENCY_TOTAL_HT+", "+COLUMN_MULTICURRENCY_TOTAL_TVA+", "+COLUMN_MULTICURRENCY_TOTAL_TTC+" "+
                        "FROM "+TABLE_NAME;

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipments.push(row);
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(shipments);
            }).catch(async (err) => {
                console.log(err);
                await resolve([]);
            });
        });
    }

    async GET_SPM_IDS_LIST(){
        console.log("##### GET_SPM_IDS_LIST #########################");

        return await new Promise(async (resolve) => {
            const orders = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT p." + COLUMN_ID + ", p."+COLUMN_ORIGIN_ID+" FROM " + TABLE_NAME + " as p", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id } = row;
                        orders.push({ id, commande_id });
                    }
                    // console.log(products);
                    await resolve(orders);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    //Update
    async UPDATE_SHIPMENTS(data_){
        console.log("##### UPDATE_SHIPMENTS #########################");
        console.log("updating.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const SQL_UPDATE = "UPDATE " + TABLE_NAME + " SET " +
                    COLUMN_BROUILLON + " = "+data_.brouillon+", " +
                    COLUMN_TRACKING_NUMBER + " = "+data_.tracking_number+", " +
                    COLUMN_TRACKING_URL + " = "+data_.tracking_url+", " +
                    COLUMN_DATE_CREATION + " = "+data_.date_creation+", " +
                    COLUMN_DATE_VALID + " = "+data_.date_valid+", " +
                    COLUMN_DATE_SHIPPING + " = "+data_.date_shipping+", " +
                    COLUMN_DATE_EXPEDITION + " = "+data_.date_expedition+", " +
                    COLUMN_DATE_DELIVERY + " = "+data_.date_delivery+", " +
                    COLUMN_STATUT + " = "+data_.statut+", " +
                    COLUMN_SHIPPING_METHOD_ID + " = "+data_.shipping_method_id+", " +
                    COLUMN_TOTAL_HT + " = "+data_.total_ht+", " +
                    COLUMN_TOTAL_TVA + " = "+data_.total_tva+", " +
                    COLUMN_TOTAL_TTC + " = "+data_.total_ttc+", " +
                    COLUMN_USER_AUTHOR_ID + " = "+data_.user_author_id+", " +
                    COLUMN_SHIPPING_METHOD + " = "+data_.shipping_method+", " +
                    COLUMN_MULTICURRENCY_CODE + " = "+data_.multicurrency_code+", " +
                    COLUMN_MULTICURRENCY_TOTAL_HT + " = "+data_.multicurrency_total_ht+", " +
                    COLUMN_MULTICURRENCY_TOTAL_TVA + " = "+data_.multicurrency_total_tva+", " +
                    COLUMN_MULTICURRENCY_TOTAL_TTC + " = "+data_.multicurrency_total_ttc+" " +
                    "WHERE "+COLUMN_ORIGIN_ID+" = "+data_[x].origin_id;

                    await db.transaction(async (tx) => {
                        await tx.executeSql(SQL_UPDATE, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Delete
    async DELETE_SHIPMENT_ORIGIN_LIST(origin_id){
        console.log("##### DELETE_SHIPMENT_ORIGIN_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME +" WHERE "+COLUMN_ORIGIN_ID+" = "+origin_id, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DELETE_SHIPMENTS_LIST(){
        console.log("##### DELETE_SHIPMENTS_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_SHIPMENTS(){
        console.log("##### DROP_SHIPMENTS #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async function (txn) {
                await txn.executeSql('DROP TABLE IF EXISTS ' + TABLE_NAME, []);
                console.log("table '"+TABLE_NAME+"' Dropped!");
            });
            return await resolve(true);
        });
    }


}


//make this component available to the app
export default ShipmentsManager;
