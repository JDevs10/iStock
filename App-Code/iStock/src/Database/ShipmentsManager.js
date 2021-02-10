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
const COLUMN_ORIGIN_TYPE = "origin_type";
const COLUMN_REF = "ref";
const COLUMN_SOCID = "socid";
const COLUMN_ENTREPOT_ID = "entrepot_id";
const COLUMN_PROJECT_ID = "project_id";
const COLUMN_TRACKING_NUMBER = "tracking_number";
const COLUMN_TRACKING_URL = "tracking_url";
const COLUMN_DATE_CREATION = "date_creation";
const COLUMN_DATE_VALID = "date_valid";
const COLUMN_DATE_SHIPPING = "date_shipping";
const COLUMN_DATE_EXPEDITION = "date_expedition";
const COLUMN_DATE_DELIVERY = "date_delivery";
const COLUMN_STATUT = "statut";
const COLUMN_SHIPPING_METHOD_ID = "shipping_method_id";
const COLUMN_SHIPPING_METHOD = "shipping_method"; //Generic transporter
const COLUMN_USER_AUTHOR_ID = "user_author_id";
const COLUMN_WEIGHT = "weight";
const COLUMN_WEIGHT_UNITS = "weight_units";
const COLUMN_SIZEW = "size_w";
const COLUMN_WIDTH_UNITS = "width_units";
const COLUMN_SIZEH = "size_h";
const COLUMN_HEIGHT_UNITS = "height_units";
const COLUMN_SIZES = "size_s";
const COLUMN_DEPTH_UNITS = "depth_units";
const COLUMN_TRUE_SIZE = "true_size";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER(255)," +
    COLUMN_ORIGIN + " VARCHAR(255)," +
    COLUMN_ORIGIN_ID + " VARCHAR(255)," +
    COLUMN_ORIGIN_TYPE + " VARCHAR(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_SOCID + " VARCHAR(255)," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_PROJECT_ID + " VARCHAR(255)," +
    COLUMN_TRACKING_NUMBER + " VARCHAR(255)," +
    COLUMN_TRACKING_URL + " VARCHAR(255)," +
    COLUMN_DATE_CREATION + " INTEGER(255)," +
    COLUMN_DATE_VALID + " INTEGER(255)," +
    COLUMN_DATE_SHIPPING + " INTEGER(255)," +
    COLUMN_DATE_EXPEDITION + " INTEGER(255)," +
    COLUMN_DATE_DELIVERY + " INTEGER(255)," +
    COLUMN_STATUT + " VARCHAR(255)," +
    COLUMN_SHIPPING_METHOD_ID + " VARCHAR(255)," +
    COLUMN_SHIPPING_METHOD + " VARCHAR(255)," +
    COLUMN_USER_AUTHOR_ID + " VARCHAR(255)," +
    COLUMN_WEIGHT + " VARCHAR(255)," +
    COLUMN_WEIGHT_UNITS + " VARCHAR(255)," +
    COLUMN_SIZEW + " VARCHAR(255)," +
    COLUMN_WIDTH_UNITS + " VARCHAR(255)," +
    COLUMN_SIZEH + " VARCHAR(255)," +
    COLUMN_HEIGHT_UNITS + " VARCHAR(255)," +
    COLUMN_SIZES + " VARCHAR(255)," +
    COLUMN_DEPTH_UNITS + " VARCHAR(255)," +
    COLUMN_TRUE_SIZE + " VARCHAR(255)" +
")"; 


// create a component
class ShipmentsManager extends Component {
    _TABLE_NAME_ = TABLE_NAME;
    _COLUMN_ORIGIN_ID_ = COLUMN_ORIGIN_ID;
    _COLUMN_REF_ = COLUMN_REF;

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
                    const SQL_INSERT = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_ORIGIN_TYPE+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_PROJECT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                    ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                    ""+COLUMN_SHIPPING_METHOD+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_WEIGHT+", "+COLUMN_WEIGHT_UNITS+", "+COLUMN_SIZEW+", "+COLUMN_WIDTH_UNITS+", "+COLUMN_SIZEH+", "+COLUMN_HEIGHT_UNITS+", "+COLUMN_SIZES+", "+COLUMN_DEPTH_UNITS+", "+COLUMN_TRUE_SIZE+") "+
                    "VALUES ("+data_[x].id+", '"+data_[x].origin+"', '"+data_[x].origin_id+"', '"+data_[x].origin_type+"', '"+data_[x].ref+"', '"+data_[x].socid+"', '"+data_[x].entrepot_id+"', '"+data_[x].project_id+"', '"+data_[x].tracking_number+"', '"+data_[x].tracking_url+"', "+
                    ""+(data_[x].date_creation != null ? (data_[x].date_creation != "" ? data_[x].date_creation : null) : null)+", "+(data_[x].date_valid != null ? (data_[x].date_valid != "" ? data_[x].date_valid : null) : null)+", "+(data_[x].date_shipping != null ? (data_[x].date_shipping != "" ? data_[x].date_shipping : null) : null)+", "+(data_[x].date_expedition != null ? (data_[x].date_expedition != "" ? data_[x].date_expedition : null) : null)+", "+(data_[x].date_delivery != null ? (data_[x].date_delivery != "" ? data_[x].date_delivery : null) : null)+", '"+data_[x].statut+"', '"+data_[x].shipping_method_id+"', '"+data_[x].shipping_method+"', '"+data_[x].user_author_id+"', '"+data_[x].weight+"', '"+data_[x].weight_units+"', '"+data_[x].size_w+"', "+
                    "'"+data_[x].width_units+"', '"+data_[x].size_h+"', '"+data_[x].height_units+"', '"+data_[x].size_s+"', '"+data_[x].depth_units+"', '"+data_[x].true_size+"')";

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

    //Get by origin id
    async GET_SHIPMENTS_BY_ORIGIN(origin_id){
        console.log("##### GET_SHIPMENTS_BY_ORIGIN #########################");

        return await new Promise(async (resolve) => {
            let shipment = null;
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_ORIGIN_TYPE+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_PROJECT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                ""+COLUMN_SHIPPING_METHOD+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_WEIGHT+", "+COLUMN_WEIGHT_UNITS+", "+COLUMN_SIZEW+", "+COLUMN_WIDTH_UNITS+", "+COLUMN_SIZEH+", "+COLUMN_HEIGHT_UNITS+", "+COLUMN_SIZES+", "+COLUMN_DEPTH_UNITS+", "+COLUMN_TRUE_SIZE+" "+
                "FROM "+TABLE_NAME+" WHERE "+COLUMN_ORIGIN_ID+" = "+origin_id;

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log('shipment => row '+(i+1)+' : ', row);
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
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN+", "+COLUMN_ORIGIN_ID+", "+COLUMN_ORIGIN_TYPE+", "+COLUMN_REF+", "+COLUMN_SOCID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_PROJECT_ID+", "+COLUMN_TRACKING_NUMBER+", "+ 
                ""+COLUMN_TRACKING_URL+", "+COLUMN_DATE_CREATION+", "+COLUMN_DATE_VALID+", "+COLUMN_DATE_SHIPPING+", "+COLUMN_DATE_EXPEDITION+", "+COLUMN_DATE_DELIVERY+", "+COLUMN_STATUT+", "+COLUMN_SHIPPING_METHOD_ID+", "+
                ""+COLUMN_SHIPPING_METHOD+", "+COLUMN_USER_AUTHOR_ID+", "+COLUMN_WEIGHT+", "+COLUMN_WEIGHT_UNITS+", "+COLUMN_SIZEW+", "+COLUMN_WIDTH_UNITS+", "+COLUMN_SIZEH+", "+COLUMN_HEIGHT_UNITS+", "+COLUMN_SIZES+", "+COLUMN_DEPTH_UNITS+", "+COLUMN_TRUE_SIZE+" "+
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

    async GET_SPM_IDS_LIST__(){
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
                    COLUMN_ORIGIN + " = '"+data_.origin+"', " +
                    COLUMN_ORIGIN_TYPE + " = '"+data_.origin_type+"', " +
                    COLUMN_REF + " = '"+data_.ref+"', " +
                    COLUMN_SOCID + " = '"+data_.socid+"', " +
                    COLUMN_ENTREPOT_ID + " = '"+data_.entrepot_id+"', " +
                    COLUMN_PROJECT_ID + " = '"+data_.project_id+"', " +
                    COLUMN_TRACKING_NUMBER + " = '"+tracking_number+"', " +
                    COLUMN_TRACKING_URL + " = '"+tracking_url+"', " +
                    COLUMN_DATE_CREATION + " = '"+date_creation+"', " +
                    COLUMN_DATE_VALID + " = '"+date_valid+"', " +
                    COLUMN_DATE_SHIPPING + " = '"+date_shipping+"', " +
                    COLUMN_DATE_EXPEDITION + " = '"+date_expedition+"', " +
                    COLUMN_DATE_DELIVERY + " = '"+date_delivery+"', " +
                    COLUMN_STATUT + " = '"+data_.statut+"', " +
                    COLUMN_SHIPPING_METHOD_ID + " = '"+data_.shipping_method_id+"', " +
                    COLUMN_SHIPPING_METHOD + " = '"+data_.shipping_method+"', " +
                    COLUMN_USER_AUTHOR_ID + " = '"+data_.user_author_id+"', " +
                    COLUMN_WEIGHT + " = '"+data_.weight+"', " +
                    COLUMN_WEIGHT_UNITS + " = '"+data_.weight_units+"', " +
                    COLUMN_SIZEW + " = '"+data_.size_w+"', " +
                    COLUMN_WIDTH_UNITS + " = '"+data_.width_units+"', " +
                    COLUMN_SIZEH + " = '"+data_.size_h+"', " +
                    COLUMN_HEIGHT_UNITS + " = '"+data_.height_units+"', " +
                    COLUMN_SIZES + " = '"+data_.size_s+"', " +
                    COLUMN_DEPTH_UNITS + " = '"+data_.depth_units+"', " +
                    COLUMN_TRUE_SIZE + " = '"+data_.true_size+"' " +
                    "WHERE "+COLUMN_ORIGIN_ID+" = '"+data_[x].origin_id +"'";

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
                await tx.executeSql("DELETE FROM " + TABLE_NAME +" WHERE "+COLUMN_ORIGIN_ID+" = '"+origin_id+"'", []);
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
