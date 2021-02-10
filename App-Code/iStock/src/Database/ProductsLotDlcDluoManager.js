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

const TABLE_NAME = "products_lot_dlc_dluo";
const COLUMN_ID = "id";
const COLUMN_ENTREPOT_ID = "entrepot";
const COLUMN_BATCH = "batch";
const COLUMN_FK_PRODUCT = "fk_product";
const COLUMN_EAT_BY = "eatby";
const COLUMN_SELL_BY = "sellby";
const COLUMN_STOCK = "stock";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_BATCH + " VARCHAR(255)," +
    COLUMN_FK_PRODUCT + " VARCHAR(255)," +
    COLUMN_EAT_BY + " VARCHAR(255)," +
    COLUMN_SELL_BY + " VARCHAR(255)," +
    COLUMN_STOCK + " VARCHAR(255)" +
")";


// create a component
class ProductsLotDlcDluoManager extends Component {
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
    async CREATE_ProductsLotDlcDluo_TABLE(){
        console.log("##### CREATE_ProductsLotDlcDluo_TABLE #########################");
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
    async INSERT_ProductsLotDlcDluo(data_){
        console.log("##### INSERT_ProductsLotDlcDluo #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_BATCH+", "+COLUMN_FK_PRODUCT+", "+COLUMN_EAT_BY+", "+COLUMN_SELL_BY+", "+COLUMN_STOCK+") VALUES (1, '"+data_[x].entrepot+"', '"+data_[x].batch+"', '"+data_[x].fk_product+"', '"+data_[x].eatby+"', '"+data_[x].sellby+"', '"+data_[x].reel+"')", []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_ProductsLotDlcDluo_BY_PRODUCT_ID(id){
        console.log("##### GET_ProductsLotDlcDluo_BY_PRODUCT_ID #########################");

        return await new Promise(async (resolve) => {
            let productsLotDlcDluo = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT s."+COLUMN_IS_USE_IMAGES+", s."+COLUMN_IS_USE_DETAILED_CMD+", s."+COLUMN_IS_USE_DETAILED_CMD_LINES+" FROM "+TABLE_NAME+" s WHERE s."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    productsLotDlcDluo = results.rows;
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(productsLotDlcDluo);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    //Delete by products
    async DELETE_ProductsLotDlcDluo_LIST(productId){
        console.log("##### DELETE_ProductsLotDlcDluo_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME + " WHERE "+COLUMN_FK_PRODUCT+" = "+productId, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DELETE_ProductsLotDlcDluo_LIST(){
        console.log("##### DELETE_ProductsLotDlcDluo_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Drop
    async DROP_ProductsLotDlcDluo(){
        console.log("##### DROP_ProductsLotDlcDluo #########################");

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
export default ProductsLotDlcDluoManager;
