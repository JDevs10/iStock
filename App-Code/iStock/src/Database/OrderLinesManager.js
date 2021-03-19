//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DatabaseInfo from './DatabaseInfo';
import ProductsManager from './ProductsManager';
import WarehouseManager from './WarehouseManager';
import ProductsLotDlcDluoManager from './ProductsLotDlcDluoManager';
import ShipmentLinesManager from './ShipmentLinesManager';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;


const TABLE_NAME = "orders_lines";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_ORDER_LINE_ID = "order_line_id"; //VARCHAR(255)
const COLUMN_ORDER_ID = "fk_commande"; //VARCHAR(255)
const COLUMN_LABEL = "libelle"; //VARCHAR(255)
const COLUMN_REF = "ref"; //VARCHAR(255)
const COLUMN_RANG = "rang"; //VARCHAR(255)
const COLUMN_QTE = "qty"; //VARCHAR(255)
const COLUMN_PRICE = "price"; //VARCHAR(255)
const COLUMN_TVA_TX = "tva_tx"; //VARCHAR(255)
const COLUMN_TOTAL_HT = "total_ht"; //VARCHAR(255)
const COLUMN_TOTAL_TVA = "total_tva"; //VARCHAR(50)
const COLUMN_TOTAL_TTC = "total_ttc"; //VARCHAR(255)


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_ORDER_LINE_ID + " VARCHAR(255)," +
    COLUMN_ORDER_ID + " VARCHAR(255)," +
    COLUMN_LABEL + " VARCHAR(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_RANG + " VARCHAR(255)," +
    COLUMN_QTE + " VARCHAR(255)," +
    COLUMN_PRICE + " VARCHAR(255)," +
    COLUMN_TVA_TX + " VARCHAR(255)," +
    COLUMN_TOTAL_HT + " VARCHAR(255)," +
    COLUMN_TOTAL_TVA + " VARCHAR(255)," +
    COLUMN_TOTAL_TTC + " VARCHAR(255)" +
")";


// create a component
class OrderLinesManager extends Component {
    _TABLE_NAME_ = "orders_lines";
    _COLUMN_ORDER_ID_ = "fk_commande";
    _COLUMN_ORDER_LINE_ID_ = COLUMN_ORDER_LINE_ID;

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
                    await db.transaction(async (tx) => {
                        const insert = "INSERT INTO " + TABLE_NAME + " (" + COLUMN_ID + ", " + COLUMN_ORDER_LINE_ID + ", " + COLUMN_ORDER_ID + ", " + COLUMN_LABEL + ", " + COLUMN_REF + ", " + COLUMN_RANG + ", " + COLUMN_QTE + ", " +COLUMN_PRICE + ", " +COLUMN_TVA_TX + ", " +COLUMN_TOTAL_HT + ", " +COLUMN_TOTAL_TVA + ", " +COLUMN_TOTAL_TTC + ") VALUES (null, '"+data_[x].rowid+"', '"+data_[x].fk_commande+"', '"+(data_[x].libelle != null ? data_[x].libelle.replace(/'/g, "''") : "null")+"', '"+data_[x].ref+"', '" + data_[x].rang + "', '"+data_[x].qty+"', '"+data_[x].price+"', '"+data_[x].tva_tx+"', '"+data_[x].total_ht+"', '"+data_[x].total_tva+"', '"+data_[x].total_ttc+"')";
                        await tx.executeSql(insert, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                console.log("error: ", error);
                return await resolve(false);
            }
        });
    }

    async GET_LINES(){
        console.log("##### GET_LINES #########################");

        return await new Promise(async (resolve) => {
            try{
                const lines = [];
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + " FROM " + TABLE_NAME + " as l", [], async (tx, results) => {
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

    async GET_LINES_CHECKDATA(){
        console.log("##### GET_LINES #########################");

        return await new Promise(async (resolve) => {
            try{
                const lines = [];
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + " FROM " + TABLE_NAME + " as l", [], async (tx, results) => {
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
                return resolve([]);
            }
        });
    }

    async GET_LINES_BY_ORDER_ID(id){
        console.log("##### GET_LINES_BY_ORDER_ID #########################");
        const pm = new ProductsManager();
        const wm = new WarehouseManager();

        console.log("Order id Lines SQL => : SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_ORDER_LINE_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + ", (SELECT "+wm._COLUMN_LABEL_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement, p."+pm._COLUMN_STOCK_+", p."+pm._COLUMN_CODEBARRE_+", p."+pm._COLUMN_REF_+" FROM " + TABLE_NAME + " as l, "+pm._TABLE_NAME_+" as p WHERE l." + COLUMN_ORDER_ID + " = " + id + " AND l."+COLUMN_REF+" = p."+pm._COLUMN_REF_);

        return await new Promise(async (resolve) => {
            try{
                const lines = [];
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_ORDER_LINE_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + ", (SELECT "+wm._COLUMN_LABEL_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement, p."+pm._COLUMN_STOCK_+", p."+pm._COLUMN_CODEBARRE_+", p."+pm._COLUMN_REF_+" FROM " + TABLE_NAME + " as l, "+pm._TABLE_NAME_+" as p WHERE l." + COLUMN_ORDER_ID + " = " + id + " AND l."+COLUMN_REF+" = p."+pm._COLUMN_REF_, [], async (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            row.prepare_shipping_qty = 0;
                            lines.push(row);
                        }
                        console.log(lines);
                        await resolve(lines);
                    });
                });
            } catch(error){
                console.log("error: ", error);
                return resolve(null);
            }
        });
    }

    async GET_LINES_BY_ORDER_ID_v2(id){
        console.log("##### GET_LINES_BY_ORDER_ID-v2 #########################");
        const pm = new ProductsManager();
        const wm = new WarehouseManager();
        const sml = new ShipmentLinesManager();

        console.log("Order id Lines SQL => : SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_ORDER_LINE_ID + ", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + ", (SELECT "+wm._COLUMN_ID_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement_id, (SELECT "+wm._COLUMN_LABEL_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement, p."+pm._COLUMN_STOCK_+", p."+pm._COLUMN_CODEBARRE_+", p."+pm._COLUMN_REF_+", p."+pm._COLUMN_IMAGE_+" FROM " + TABLE_NAME + " as l, "+pm._TABLE_NAME_+" as p WHERE l." + COLUMN_ORDER_ID + " = " + id + " AND l."+COLUMN_REF+" = p."+pm._COLUMN_REF_);

        return await new Promise(async (resolve) => {
            try{
                const lines = [];
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT l." + COLUMN_ID + ", l." + COLUMN_ORDER_ID + ", l." + COLUMN_ORDER_LINE_ID + ", p."+pm._COLUMN_PRODUCT_ID_+", l." + COLUMN_LABEL + ", l." + COLUMN_REF + ", l." + COLUMN_RANG + ", l." +COLUMN_QTE + ", l." +COLUMN_PRICE + ", l." +COLUMN_TVA_TX + ", l." +COLUMN_TOTAL_HT + ", l." +COLUMN_TOTAL_TVA + ", l." +COLUMN_TOTAL_TTC + ", (SELECT "+wm._COLUMN_ID_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement_id, (SELECT "+wm._COLUMN_LABEL_+" from "+wm._TABLE_NAME_+" as w where p."+pm._COLUMN_EMPLACEMENT_+" = w."+wm._COLUMN_ID_+") as emplacement, p."+pm._COLUMN_STOCK_+", p."+pm._COLUMN_CODEBARRE_+", p."+pm._COLUMN_REF_+", p."+pm._COLUMN_DESCRIPTION_+", (SELECT sum(sml."+sml._COLUMN_QTY_+") FROM "+sml._TABLE_NAME_+" as sml WHERE sml."+sml._COLUMN_ORIGIN_LINE_ID_+" = l."+COLUMN_ORDER_LINE_ID+" AND sml."+sml._COLUMN_RANG_+" = l."+COLUMN_RANG+") as prepare_shipping_qty, p."+pm._COLUMN_IMAGE_+" FROM " + TABLE_NAME + " as l, "+pm._TABLE_NAME_+" as p WHERE l." + COLUMN_ORDER_ID + " = " + id + " AND l."+COLUMN_REF+" = p."+pm._COLUMN_REF_, [], async (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {

                            let row = await results.rows.item(i);
                            const pldd = new ProductsLotDlcDluoManager();
                            await pldd.initDB();
                            const data = await pldd.GET_ProductsLotDlcDluo_BY_PRODUCT_ID(row.product_id).then(async (val) => {
                                return await val;
                            });
                            row.productLotDlcDluoData = data;
                            row.prepare_shipping_qty = (row.prepare_shipping_qty == null ? 0 : row.prepare_shipping_qty);
                            lines.push(row);
                        }
                        console.log(lines);
                        await resolve(lines);
                    });
                });
            } catch(error){
                console.log("error: ", error);
                return resolve([]);
            }
        });
    }

    //Delete
    async DROP_ORDER_LINES(){
        console.log("##### DROP_ORDER #########################");

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
