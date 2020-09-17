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

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_IS_USE_IMAGES + " VARCHAR(255)," +
    COLUMN_IS_USE_DETAILED_CMD + " VARCHAR(255)," +
    COLUMN_IS_USE_DETAILED_CMD_LINES + " VARCHAR(255)" +
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
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_IS_USE_IMAGES+", "+COLUMN_IS_USE_DETAILED_CMD+", "+COLUMN_IS_USE_DETAILED_CMD_LINES+") VALUES (1, '"+(data_.isUseImages == true ? 'true' : 'false')+"', '"+(data_.isUseDetailedCMD == true ? 'true' : 'false')+"', '"+(data_.isUseDetailedCMDLines == true ? 'true' : 'false')+"')", []);
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
            let token = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT s."+COLUMN_IS_USE_IMAGES+", s."+COLUMN_IS_USE_DETAILED_CMD+", s."+COLUMN_IS_USE_DETAILED_CMD_LINES+" FROM "+TABLE_NAME+" s WHERE s."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log('token => row: ', row);
                        token = {
                            isUseImages: (row.isUseImages == 'true' ? true : false),
                            isUseDetailedCMD: (row.isUseDetailedCMD == 'true' ? true : false),
                            isUseDetailedCMDLines: (row.isUseDetailedCMDLines == 'true' ? true : false),
                        };
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(token);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    // Update image path
    async UPDATE_SETTINGS(data){
        console.log("##### UPDATE_SETTINGS #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE "+TABLE_NAME+" SET "+COLUMN_IS_USE_IMAGES+" = '"+(data.isUseImages == true ? 'true' : 'false')+"', "+COLUMN_IS_USE_DETAILED_CMD+" = '"+(data.isUseDetailedCMD == true ? 'true' : 'false')+"', "+COLUMN_IS_USE_DETAILED_CMD_LINES+" = '"+(data.isUseDetailedCMDLines == true ? 'true' : 'false')+"' WHERE "+COLUMN_ID+" = 1", []);

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
