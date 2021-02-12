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

const TABLE_NAME = "Shipment_lines";
const COLUMN_ID = "id";
const COLUMN_ORIGIN_LINE_ID = "origin_line_id";
const COLUMN_FK_EXPEDITION = "fk_expedition";
const COLUMN_ENTREPOT_ID = "entrepot_id";
const COLUMN_QTY = "qty";
const COLUMN_RANG = "rang";


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER(255)," +
    COLUMN_ORIGIN_LINE_ID + " VARCHAR(255)," +
    COLUMN_FK_EXPEDITION + " VARCHAR(255)," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_QTY + " VARCHAR(255)," +
    COLUMN_RANG + " VARCHAR(255)" +
")";


// create a component
class ShipmentLinesManager extends Component {
    _TABLE_NAME_ = TABLE_NAME;
    _COLUMN_ORIGIN_LINE_ID_ = COLUMN_ORIGIN_LINE_ID;
    _COLUMN_FK_EXPEDITION_ = COLUMN_FK_EXPEDITION;
    _COLUMN_ENTREPOT_ID_ = COLUMN_ENTREPOT_ID;
    _COLUMN_QTY_ = COLUMN_QTY;
    _COLUMN_RANG_ = COLUMN_RANG;

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
    async CREATE_SHIPMENT_LINES_TABLE(){
        console.log("##### CREATE_SHIPMENT_LINES_TABLE #########################");
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
                console.log("error: ", error);
                return await resolve(false);
            }
        });
    }

    //Insert
    async INSERT_SHIPMENT_LINES(data_){
        console.log("##### INSERT_SHIPMENT_LINES #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const SQL_INSERT = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ORIGIN_LINE_ID+", "+COLUMN_FK_EXPEDITION+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_QTY+", "+COLUMN_RANG+") "+
                        "VALUES ("+data_[x].id+", '"+data_[x].origin_line_id+"', '"+data_[x].fk_expedition+"', '"+data_[x].entrepot_id+"', '"+data_[x].qty+"', '"+data_[x].rang+"')";

                    await db.transaction(async (tx) => {
                        await tx.executeSql(SQL_INSERT, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by ref
    async GET_SHIPMENT_LINES_BY_ID(fk_expedition){
        console.log("##### GET_SHIPMENT_LINES_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let shipment_line = null;
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN_LINE_ID+", "+COLUMN_FK_EXPEDITION+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_QTY+", "+COLUMN_RANG+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_EXPEDITION+" = '"+fk_expedition+"'";

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipment_line = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(shipment_line);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    async GET_SHIPMENT_LINE_BY_ORIGIN_LINE_ID(origin_line_id){
        console.log("##### GET_SHIPMENT_LINE_BY_ORIGIN_LINE_ID #########################");

        return await new Promise(async (resolve) => {
            let shipment_line = null;
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ORIGIN_LINE_ID+", "+COLUMN_FK_EXPEDITION+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_QTY+", "+COLUMN_RANG+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_ORIGIN_LINE_ID+" = '"+origin_line_id+"'";

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipment_line = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(shipment_line);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Update
    async UPDATE_SHIPMENT_LINE(data_){
        console.log("##### UPDATE_SHIPMENT_LINE #########################");
        console.log("updating.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const SQL_UPDATE = "UPDATE " + TABLE_NAME + " SET " +
                    ""+COLUMN_ENTREPOT_ID+" = '"+data_[x].entrepot_id+"', " +
                    ""+COLUMN_QTY+" = '"+data_[x].qty+"', " +
                    ""+COLUMN_RANG+" = '"+data_[x].rang+"' " +
                    "WHERE "+COLUMN_FK_EXPEDITION+" = '"+data_[x].fk_expedition+"'";

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
    async DELETE_SHIPMENT_LINES_BY_ID(fk_expedition){
        console.log("##### DELETE_SHIPMENT_LINES_BY_ORIGIN #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME +" WHERE "+COLUMN_FK_EXPEDITION+" = '"+fk_expedition+"'", []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DELETE_SHIPMENTS_LINES_LIST(){
        console.log("##### DELETE_SHIPMENTS_LINES_LIST #########################");

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
export default ShipmentLinesManager;
