//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DatabaseInfo from './DatabaseInfo';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;

const TABLE_NAME = "settings";
const COLUMN_ID = "id";
const COLUMN_IS_USE_IMAGES = "isUseImages";
const COLUMN_IS_USE_DETAILED_CMD = "isUseDetailedCMD";
const COLUMN_IS_USE_DETAILED_CMD_LINES = "isUseDetailedCMDLines";
const COLUMN_IS_USE_DETAILED_SHIPMENTS = "isUseDetailedShipment";
const COLUMN_LIMIT_ORDER_DOWNLOAD = "limitOrdersDownload";
const COLUMN_LIMIT_SHIPMENT_DOWNLOAD = "limitShipmentsDownload";
const COLUMN_LIMIT_USERS_UPDATE = "limitUsersUpdate";
const COLUMN_LIMIT_CLIENTS_UPDATE = "limitClientsUpdate";
const COLUMN_LIMIT_PRODUCTS_UPDATE = "limitProductsUpdate";
const COLUMN_LIMIT_IMAGES_UPDATE = "limitImagesUpdate";
const COLUMN_LIMIT_WAREHOUSE_UPDATE = "limitWarehousesUpdate";
const COLUMN_LIMIT_SHIPMENTS_UPDATE = "limitShipmentsUpdate";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_IS_USE_IMAGES + " VARCHAR(255)," +
    COLUMN_IS_USE_DETAILED_CMD + " VARCHAR(255)," +
    COLUMN_IS_USE_DETAILED_CMD_LINES + " VARCHAR(255)," +
    COLUMN_IS_USE_DETAILED_SHIPMENTS + " VARCHAR(255)," +
    COLUMN_LIMIT_ORDER_DOWNLOAD + " VARCHAR(255)," +
    COLUMN_LIMIT_SHIPMENT_DOWNLOAD + " VARCHAR(255)," +
    COLUMN_LIMIT_USERS_UPDATE + " VARCHAR(255)," +
    COLUMN_LIMIT_CLIENTS_UPDATE + " VARCHAR(255)," +
    COLUMN_LIMIT_PRODUCTS_UPDATE + " VARCHAR(255)," +
    COLUMN_LIMIT_IMAGES_UPDATE + " VARCHAR(255)," +
    COLUMN_LIMIT_WAREHOUSE_UPDATE + " VARCHAR(255)," +
    COLUMN_LIMIT_SHIPMENTS_UPDATE + " VARCHAR(255)" +
")";


// create a component
class SettingsManager extends Component {
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
    async CREATE_SETTINGS_TABLE(){
        console.log("##### CREATE_SETTINGS_TABLE #########################");
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
    async INSERT_SETTINGS(data_){
        console.log("##### INSERT_SETTINGS #########################");
        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_IS_USE_IMAGES+", "+COLUMN_IS_USE_DETAILED_CMD+", "+COLUMN_IS_USE_DETAILED_CMD_LINES+", "+COLUMN_IS_USE_DETAILED_SHIPMENTS+", "+COLUMN_LIMIT_ORDER_DOWNLOAD+", "+COLUMN_LIMIT_SHIPMENT_DOWNLOAD+", "+COLUMN_LIMIT_USERS_UPDATE+", "+COLUMN_LIMIT_CLIENTS_UPDATE+", "+COLUMN_LIMIT_PRODUCTS_UPDATE+", "+COLUMN_LIMIT_IMAGES_UPDATE+", "+COLUMN_LIMIT_WAREHOUSE_UPDATE+", "+COLUMN_LIMIT_SHIPMENTS_UPDATE+") VALUES (1, '"+(data_.isUseImages == true ? 'true' : 'false')+"', '"+(data_.isUseDetailedCMD == true ? 'true' : 'false')+"', '"+(data_.isUseDetailedCMDLines == true ? 'true' : 'false')+"', '"+(data_.isUseDetailedShipment == true ? 'true' : 'false')+"', '"+data_.limitOrdersDownload+"', '"+data_.limitShipmentsDownload+"', '"+data_.limitUsersUpdate+"', '"+data_.limitClientsUpdate+"', '"+data_.limitProductsUpdate+"', '"+data_.limitImagesUpdate+"', '"+data_.limitWarehousesUpdate+"', '"+data_.limitShipmentsUpdate+"')", []);
                });
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_SETTINGS_BY_ID(id){
        console.log("##### GET_SETTINGS_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let settings = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT "+COLUMN_IS_USE_IMAGES+", "+COLUMN_IS_USE_DETAILED_CMD+", "+COLUMN_IS_USE_DETAILED_CMD_LINES+", "+COLUMN_IS_USE_DETAILED_SHIPMENTS+", "+COLUMN_LIMIT_ORDER_DOWNLOAD+", "+COLUMN_LIMIT_SHIPMENT_DOWNLOAD+", "+COLUMN_LIMIT_USERS_UPDATE+", "+COLUMN_LIMIT_CLIENTS_UPDATE+", "+COLUMN_LIMIT_PRODUCTS_UPDATE+", "+COLUMN_LIMIT_IMAGES_UPDATE+", "+COLUMN_LIMIT_WAREHOUSE_UPDATE+", "+COLUMN_LIMIT_SHIPMENTS_UPDATE+" FROM "+TABLE_NAME+" WHERE "+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log('settings => row: ', row);
                        settings = {
                            isUseImages: (row.isUseImages == 'true' ? true : false),
                            isUseDetailedCMD: (row.isUseDetailedCMD == 'true' ? true : false),
                            isUseDetailedCMDLines: (row.isUseDetailedCMDLines == 'true' ? true : false),
                            isUseDetailedShipment: (row.isUseDetailedShipment == 'true' ? true : false),
                            limitOrdersDownload: row.limitOrdersDownload,
                            limitShipmentsDownload: row.limitShipmentsDownload,
                            limitUsersUpdate: row.limitUsersUpdate,
                            limitClientsUpdate: row.limitClientsUpdate,
                            limitProductsUpdate: row.limitProductsUpdate,
                            limitImagesUpdate: row.limitImagesUpdate,
                            limitWarehousesUpdate: row.limitWarehousesUpdate,
                            limitShipmentsUpdate: row.limitShipmentsUpdate
                        };
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(settings);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    // Update
    async UPDATE_SETTINGS_CONFIG(data){
        console.log("##### UPDATE_SETTINGS_CONFIG #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                const sql = "UPDATE "+TABLE_NAME+" SET "+
                ""+COLUMN_IS_USE_IMAGES+" = '"+(data.isUseImages == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_CMD+" = '"+(data.isUseDetailedCMD == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_CMD_LINES+" = '"+(data.isUseDetailedCMDLines == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_SHIPMENTS+" = '"+(data.isUseDetailedShipment == true ? 'true' : 'false')+"', "+
                ""+COLUMN_LIMIT_ORDER_DOWNLOAD+" = '"+data.limitOrdersDownload+"', "+
                ""+COLUMN_LIMIT_SHIPMENT_DOWNLOAD+" = '"+data.limitShipmentsDownload+"' WHERE "+COLUMN_ID+" = 1";
                await tx.executeSql(sql, []);

            }).then(async (result) => {
                await resolve(true);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve(false);
            });
        });
    }

    // Update
    async UPDATE_SETTINGS(data){
        console.log("##### UPDATE_SETTINGS #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                const sql = "UPDATE "+TABLE_NAME+" SET "+
                ""+COLUMN_IS_USE_IMAGES+" = '"+(data.isUseImages == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_CMD+" = '"+(data.isUseDetailedCMD == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_CMD_LINES+" = '"+(data.isUseDetailedCMDLines == true ? 'true' : 'false')+"', "+
                ""+COLUMN_IS_USE_DETAILED_SHIPMENTS+" = '"+(data.isUseDetailedShipment == true ? 'true' : 'false')+"', "+
                ""+COLUMN_LIMIT_ORDER_DOWNLOAD+" = '"+data.limitOrdersDownload+"', "+
                ""+COLUMN_LIMIT_SHIPMENT_DOWNLOAD+" = '"+data.limitShipmentsDownload+"', "+
                ""+COLUMN_LIMIT_USERS_UPDATE+" = '"+data.limitUsersUpdate+"', "+
                ""+COLUMN_LIMIT_CLIENTS_UPDATE+" = '"+data.limitClientsUpdate+"', "+
                ""+COLUMN_LIMIT_PRODUCTS_UPDATE+" = '"+data.limitProductsUpdate+"', "+
                ""+COLUMN_LIMIT_IMAGES_UPDATE+" = '"+data.limitImagesUpdate+"', "+
                ""+COLUMN_LIMIT_WAREHOUSE_UPDATE+" = '"+data.limitWarehousesUpdate+"', "+
                ""+COLUMN_LIMIT_SHIPMENTS_UPDATE+" = '"+data.limitShipmentsUpdate+"' WHERE "+COLUMN_ID+" = 1";
                await tx.executeSql(sql, []);

            }).then(async (result) => {
                await resolve(true);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve(false);
            });
        });
    }

    //Delete
    async DELETE_SETTINGS_LIST(){
        console.log("##### DELETE_SETTINGS_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_SETTINGS(){
        console.log("##### DROP_SETTINGS #########################");

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
export default SettingsManager;
