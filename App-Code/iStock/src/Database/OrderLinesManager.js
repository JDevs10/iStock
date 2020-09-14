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


const TABLE_NAME = "orders_lines";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_ORDER_ID = "fk_commande"; //VARCHAR(255)
const COLUMN_LABEL = "label"; //VARCHAR(255)
const COLUMN_REF = "ref"; //VARCHAR(255)
const COLUMN_QTE = "qty"; //VARCHAR(255)
const COLUMN_PRICE = "price"; //VARCHAR(255)
const COLUMN_TVA_TX = "tva_tx"; //VARCHAR(255)
const COLUMN_TOTAL_HT = "total_ht"; //VARCHAR(255)
const COLUMN_TOTAL_TVA = "total_tva"; //VARCHAR(50)
const COLUMN_TOTAL_TTC = "total_ttc"; //VARCHAR(255)


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_ORDER_ID + " VARCHAR(255)," +
    COLUMN_LABEL + " VARCHAR(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_QTE + " VARCHAR(255)," +
    COLUMN_PRICE + " VARCHAR(255)," +
    COLUMN_TVA_TX + " VARCHAR(255)," +
    COLUMN_TOTAL_HT + " VARCHAR(255)," +
    COLUMN_TOTAL_TVA + " VARCHAR(255)," +
    COLUMN_TOTAL_TTC + " VARCHAR(255)" +
")";


// create a component
class OrderLinesManager extends Component {
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
    async CREATE_ORDER_LINES_TABLE(){
        console.log("##### CREATE_ORDER_LINES_TABLE #########################");
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
    async INSERT_ORDER_LINES(data_){
        console.log("##### INSERT_ORDERS_LINES #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    for(let y = 0; y < data_[x].lines.length; y++){
                        await db.transaction(async (tx) => {
                            const insert = "INSERT INTO " + TABLE_NAME + " (" + COLUMN_ID + ", " + COLUMN_ORDER_ID + ", " + COLUMN_LABEL + ", " + COLUMN_REF + ", " +COLUMN_QTE + ", " +COLUMN_PRICE + ", " +COLUMN_TVA_TX + ", " +COLUMN_TOTAL_HT + ", " +COLUMN_TOTAL_TVA + ", " +COLUMN_TOTAL_TTC + ") VALUES (null, '"+data_[x].lines[y].fk_commande+"', '"+data_[x].lines[y].label.replace(/'/g, "''")+"', '"+data_[x].lines[y].ref+"', '"+data_[x].lines[y].qty+"', '"+data_[x].lines[y].price+"', '"+data_[x].lines[y].tva_tx+"', '"+data_[x].lines[y].total_ht+"', '"+data_[x].lines[y].total_tva+"', '"+data_[x].lines[y].total_ttc+"')";
                            await tx.executeSql(insert, []);
                        });
                    }
                }
                return await resolve(true);
            } catch(error){
                console.log("error: ", error);
                return await resolve(false);
            }
        });
    }

    async GET_LINES_BY_ORDER_ID(id){
        console.log("##### GET_LINES_BY_ORDER_ID #########################");

        return await new Promise(async (resolve) => {
            try{
                const lines = [];
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + " FROM " + TABLE_NAME + " as l WHERE l." + COLUMN_ORDER_ID + " = " + id, [], async (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            lines.push(row);
                        }
                        // console.log(products);
                        await resolve(lines);
                    });
                });
            } catch(error){
                console.log("error: ", error);
                return resolve(null);
            }
        });
    }

    //Delete
    async DELETE_ORDER_LIST(){
        console.log("##### DELETE_ORDER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
                resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                resolve(false);
            });
        });
    }

    //Delete
    async DROP_ORDER(){
        console.log("##### DELETE_ORDER_LIST #########################");

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
export default OrderLinesManager;
