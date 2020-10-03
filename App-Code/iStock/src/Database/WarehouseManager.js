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

const TABLE_NAME = "warehouses";
const COLUMN_ID = "id";
const COLUMN_REF = "ref";
const COLUMN_LABEL = "label";
const COLUMN_LIEU = "lieu";
const COLUMN_FK_PARENT = "fk_parent";
const COLUMN_COUNTRY = "country";
const COLUMN_COUNTRY_ID = "country_id";
const COLUMN_COUNTRY_CODE = "country_code";
const COLUMN_STATUT = "statut";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_LABEL + " VARCHAR(255)," +
    COLUMN_LIEU + " VARCHAR(255)," +
    COLUMN_FK_PARENT + " VARCHAR(255)," +
    COLUMN_COUNTRY + " VARCHAR(255)," +
    COLUMN_COUNTRY_ID + " VARCHAR(255)," +
    COLUMN_COUNTRY_CODE + " VARCHAR(255)," +
    COLUMN_STATUT + " VARCHAR(255)" +
")";


// create a component
class WarehouseManager extends Component {
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
    async CREATE_WAREHOUSE_TABLE(){
        console.log("##### CREATE_WAREHOUSE_TABLE #########################");
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
    async INSERT_WAREHOUSE(data_){
        console.log("##### INSERT_WAREHOUSE #########################");
        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_REF+", "+COLUMN_LABEL+", "+COLUMN_LIEU+", "+COLUMN_FK_PARENT+", "+COLUMN_COUNTRY+", "+COLUMN_COUNTRY_ID+", "+COLUMN_COUNTRY_CODE+", "+COLUMN_STATUT+") VALUES (null, '"+data_[x].ref+"', '"+data_[x].label.replace(/'/g, "''")+"', '"+data_[x].lieu.replace(/'/g, "''")+"', "+(data_[x].fk_parent == null ? null : "'"+data_[x].fk_parent+"'")+", '"+data_[x].country+"', '"+data_[x].country_id+"', '"+data_[x].country_code+"', '"+data_[x].statut+"')", []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by ref
    async GET_WAREHOUSE_BY_REF(ref){
        console.log("##### GET_WAREHOUSE_BY_REF #########################");

        return await new Promise(async (resolve) => {
            let user = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT w."+COLUMN_ID+", w."+COLUMN_REF+", w."+COLUMN_LABEL+", w."+COLUMN_LIEU+", w."+COLUMN_FK_PARENT+", w."+COLUMN_COUNTRY+", w."+COLUMN_COUNTRY_ID+", w."+COLUMN_COUNTRY_CODE+", w."+COLUMN_STATUT+" FROM "+TABLE_NAME+" w WHERE w."+COLUMN_REF+" = "+ref, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        user = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(user);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Get list
    async GET_WAREHOUSE_LIST(ref){
        console.log("##### GET_WAREHOUSE_LIST #########################");

        return await new Promise(async (resolve) => {
            let user = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT w."+COLUMN_ID+", w."+COLUMN_REF+", w."+COLUMN_LABEL+", w."+COLUMN_LIEU+", w."+COLUMN_FK_PARENT+", w."+COLUMN_COUNTRY+", w."+COLUMN_COUNTRY_ID+", w."+COLUMN_COUNTRY_CODE+", w."+COLUMN_STATUT+" FROM "+TABLE_NAME+" w", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        user.push(row);
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(user);
            }).catch(async (err) => {
                console.log(err);
                await resolve([]);
            });
        });
    }

    //Delete
    async DELETE_WAREHOUSE_LIST(){
        console.log("##### DELETE_WAREHOUSE_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_WAREHOUSE(){
        console.log("##### DROP_WAREHOUSE #########################");

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
export default WarehouseManager;
