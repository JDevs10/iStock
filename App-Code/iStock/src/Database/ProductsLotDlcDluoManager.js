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
const COLUMN_ENTREPOT_LABEL = "entrepot_label";
const COLUMN_BATCH = "batch";
const COLUMN_FK_PRODUCT = "fk_product";
const COLUMN_EAT_BY = "eatby";
const COLUMN_SELL_BY = "sellby";
const COLUMN_STOCK = "stock";
const COLUMN_FK_ORIGIN_STOCK = "fk_origin_stock";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_ENTREPOT_LABEL + " VARCHAR(255)," +
    COLUMN_BATCH + " VARCHAR(255)," +
    COLUMN_FK_PRODUCT + " VARCHAR(255)," +
    COLUMN_EAT_BY + " VARCHAR(255)," +
    COLUMN_SELL_BY + " VARCHAR(255)," +
    COLUMN_STOCK + " INTEGER(255)," +
    COLUMN_FK_ORIGIN_STOCK + " VARCHAR(255)" +
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
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_BATCH+", "+COLUMN_FK_PRODUCT+", "+COLUMN_EAT_BY+", "+COLUMN_SELL_BY+", "+COLUMN_STOCK+", "+COLUMN_FK_ORIGIN_STOCK+") VALUES (null, '"+data_[x].fk_entrepot+"', '"+data_[x].entrepot_label+"', '"+data_[x].batch+"', '"+data_[x].fk_product+"', '"+data_[x].eatby+"', '"+data_[x].sellby+"', "+data_[x].qty+", '"+data_[x].fk_origin_stock+"')", []);
                    });
                }
                await resolve(true);
            } catch(error){
                await resolve(false);
            }
        });
    }

    //Get by id
    async GET_ProductsLotDlcDluo_BY_PRODUCT_ID(id){
        console.log("##### GET_ProductsLotDlcDluo_BY_PRODUCT_ID #########################");

        return await new Promise(async (resolve) => {
            let productsLotDlcDluo = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT "+COLUMN_ID+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_BATCH+", "+COLUMN_FK_PRODUCT+", "+COLUMN_EAT_BY+", "+COLUMN_SELL_BY+", "+COLUMN_STOCK+", "+COLUMN_FK_ORIGIN_STOCK+" FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_PRODUCT+" = "+id, []).then(async ([tx,results]) => {
                    // console.log("Query completed");

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        row.prepare = 0;
                        productsLotDlcDluo.push(row);
                    }
                    // console.log(productsLotDlcDluo);
                });
            }).then(async (result) => {
                await resolve(productsLotDlcDluo);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    //Get by id
    async GET_Warehouse_Ids_ProductsLotDlcDluo(){
        console.log("##### GET_Warehouse_Ids_ProductsLotDlcDluo #########################");

        return await new Promise(async (resolve) => {
            let productsLotDlcDluo = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT DISTINCT("+COLUMN_ENTREPOT_ID+") FROM "+TABLE_NAME, []).then(async ([tx,results]) => {
                    console.log("Query completed");

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        productsLotDlcDluo.push(row.entrepot);
                    }
                });
            }).then(async (result) => {
                await resolve(productsLotDlcDluo);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    async GET_Warehouse_Ids_ProductsLotDlcDluo_by_fkProduct(fk_product){
        console.log("##### GET_Warehouse_Ids_ProductsLotDlcDluo_by_fkProduct #########################");

        return await new Promise(async (resolve) => {
            let productsLotDlcDluo = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT DISTINCT("+COLUMN_ENTREPOT_ID+") FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_PRODUCT+" = "+fk_product, []).then(async ([tx,results]) => {
                    console.log("Query completed");

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        productsLotDlcDluo.push(row.entrepot);
                    }
                });
            }).then(async (result) => {
                await resolve(productsLotDlcDluo);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    async IS_ORIGIN_STOCK_EXIST(id){
        console.log("##### IS_ORIGIN_STOCK_EXIST #########################");

        return await new Promise(async (resolve) => {
            let fk_origin_stock = {};
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT * FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_ORIGIN_STOCK+" = "+id+"", []).then(async ([tx,results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        fk_origin_stock = row;
                    }
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
                await resolve(fk_origin_stock);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Update
    async UPDATE_ProductsLotDlcDluo_BY_ORIGIN_STOCK(data_){
        console.log("##### UPDATE_ProductsLotDlcDluo_BY_ORIGIN_STOCK #########################");
        console.log("updating.... ", data_.length);

        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const sql = "UPDATE " + TABLE_NAME + " SET " + 
                    ""+COLUMN_ENTREPOT_ID + " = '"+data_[x].fk_entrepot+"', "+
                    ""+COLUMN_ENTREPOT_LABEL+" = '"+data_[x].entrepot_label.replace(/'/g, "''")+"', "+
                    ""+COLUMN_BATCH+" = '"+data_[x].batch+"', "+
                    ""+COLUMN_EAT_BY+" = '"+data_[x].eatby+"', "+
                    ""+COLUMN_SELL_BY+" = '"+data_[x].sellby+"', "+
                    ""+COLUMN_STOCK+" = "+(data_[x].stock != null ? data_[x].stock : 0)+" "+
                    "WHERE " + COLUMN_FK_ORIGIN_STOCK + " = " + data_[x].fk_origin_stock;

                    await db.transaction(async (tx) => {
                        await tx.executeSql(sql, []);
                    });

                }
                await resolve(true);
            } catch(error){
                console.error('error : ', error);
                await resolve(false);
            }
        });
    }

    //Delete by products
    async DELETE_ProductsLotDlcDluo_FK_PRODUCT(productId){
        console.log("##### DELETE_ProductsLotDlcDluo_FK_PRODUCT #########################");

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
