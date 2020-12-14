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
const COLUMN_ROWID = "rowid";
const COLUMN_ORIGIN_ID = "origin_id";
const COLUMN_LINE_ID = "line_id";
const COLUMN_FK_ORIGIN = "fk_origin";
const COLUMN_FK_EXPEDITION = "fk_expedition";
const COLUMN_ORIGIN_LINE_ID = "origin_line_id";
const COLUMN_FK_ORIGIN_LINE = "fk_origin_line";
const COLUMN_FK_PRODUCT = "fk_product";
const COLUMN_ENTREPOT_ID = "entrepot_id";
const COLUMN_QTY = "qty";
const COLUMN_QTY_ASK = "qty_ask";
const COLUMN_QTY_SHIPPED = "qty_shipped";
const COLUMN_REF = "ref";
const COLUMN_PRODUCT_REF = "product_ref";
const COLUMN_LIBELLE = "libelle";
const COLUMN_PRODUCT_LABEL = "product_label";
const COLUMN_DESC = "desc";
const COLUMN_DESCRIPTION = "description";
const COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID = "details_entrepot__entrepot_id";
const COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED = "details_entrepot__qty_shipped";
const COLUMN_DETAILS_ENTREPOT__LINE_ID = "details_entrepot__line_id";
const COLUMN_PRICE = "price";   // total ht


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER(255)," +
    COLUMN_ROWID + " INTEGER(255)," +
    COLUMN_ORIGIN_ID + " INTEGER(255)," +
    COLUMN_LINE_ID + " INTEGER(255)," +
    COLUMN_FK_ORIGIN + " VARCHAR(255)," +
    COLUMN_FK_EXPEDITION + " VARCHAR(255)," +
    COLUMN_ORIGIN_LINE_ID + " VARCHAR(255)," +
    COLUMN_FK_ORIGIN_LINE + " VARCHAR(255)," +
    COLUMN_FK_PRODUCT + " VARCHAR(255)," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_QTY + " VARCHAR(255)," +
    COLUMN_QTY_ASK + " VARCHAR(255)," +
    COLUMN_QTY_SHIPPED + " VARCHAR(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_PRODUCT_REF + " VARCHAR(255)," +
    COLUMN_LIBELLE + " VARCHAR(255)," +
    COLUMN_PRODUCT_LABEL + " VARCHAR(255)," +
    COLUMN_DESC + " VARCHAR(255)," +
    COLUMN_DESCRIPTION + " VARCHAR(255)," +
    COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED + " VARCHAR(255)," +
    COLUMN_DETAILS_ENTREPOT__LINE_ID + " VARCHAR(255)," +
    COLUMN_PRICE + " VARCHAR(255)" +
")";


// create a component
class ShipmentLinesManager extends Component {
    _TABLE_NAME_ = "Shipment_lines";
    _COLUMN_LINE_ID_ = "line_id";
    _COLUMN_REF_ = "ref";
    _COLUMN_FK_EXPEDITION_ = "fk_expedition";
    _COLUMN_FK_ORIGIN_LINE_ = "fk_origin_line";
    _COLUMN_FK_EXPEDITION_ = "fk_expedition";
    _COLUMN_FK_PRODUCT_ = "fk_product";
    _COLUMN_ENTREPOT_ID_ = "entrepot_id";

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
                    const SQL_INSERT = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_ROWID+", "+COLUMN_ORIGIN_ID+", "+COLUMN_LINE_ID+", "+COLUMN_FK_ORIGIN+", "+COLUMN_FK_EXPEDITION+", "+COLUMN_ORIGIN_LINE_ID+", "+COLUMN_FK_ORIGIN_LINE+", "+ 
                        ""+COLUMN_FK_PRODUCT+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_QTY+", "+COLUMN_QTY_ASK+", "+COLUMN_QTY_SHIPPED+", "+COLUMN_REF+", "+COLUMN_PRODUCT_REF+", "+
                        ""+COLUMN_LIBELLE+", "+COLUMN_PRODUCT_LABEL+", "+COLUMN_DESC+", "+COLUMN_DESCRIPTION+", "+COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID+", "+COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED+", "+COLUMN_DETAILS_ENTREPOT__LINE_ID+", "+COLUMN_PRICE+") "+
                        "VALUES ("+data_[x].id+", "+data_[x].rowid+", "+data_[x].origin_id+", "+data_[x].line_id+", '"+data_[x].fk_origin+"', '"+data_[x].fk_expedition+"', '"+data_[x].origin_line_id+"', '"+data_[x].fk_origin_line+"', "+
                        ""+data_[x].fk_product+", "+data_[x].entrepot_id+", '"+data_[x].qty+"', '"+data_[x].qty_ask+"', "+data_[x].qty_shipped+", '"+data_[x].ref+"', '"+data_[x].product_ref+"', '"+data_[x].libelle+"', '"+data_[x].product_label+"', '"+data_[x].desc+"', "+
                        "'"+data_[x].description+"', '"+data_[x].details_entrepot__entrepot_id+"', '"+data_[x].details_entrepot__qty_shipped+"', '"+data_[x].details_entrepot__line_id+"', '"+data_[x].price+"')";

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
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_ROWID+", "+COLUMN_ORIGIN_ID+", "+COLUMN_LINE_ID+", "+COLUMN_FK_ORIGIN+", "+COLUMN_FK_EXPEDITION+", "+COLUMN_ORIGIN_LINE_ID+", "+COLUMN_FK_ORIGIN_LINE+", "+ 
                        ""+COLUMN_FK_PRODUCT+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_QTY+", "+COLUMN_QTY_ASK+", "+COLUMN_QTY_SHIPPED+", "+COLUMN_REF+", "+COLUMN_PRODUCT_REF+", "+
                        ""+COLUMN_LIBELLE+", "+COLUMN_PRODUCT_LABEL+", "+COLUMN_DESC+", "+COLUMN_DESCRIPTION+", "+COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID+", "+COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED+", "+COLUMN_DETAILS_ENTREPOT__LINE_ID+", "+COLUMN_PRICE+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_EXPEDITION+" = "+fk_expedition;

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
        console.log("updating.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    const SQL_UPDATE = "UPDATE " + TABLE_NAME + " SET " +
                    ""+COLUMN_ID+" = "+data_[x].id+", " +
                    ""+COLUMN_ROWID+" = "+data_[x].rowid+", " +
                    ""+COLUMN_ORIGIN_ID+" = "+data_[x].origin_id+", " +
                    ""+COLUMN_LINE_ID+" = "+data_[x].line_id+", " +
                    ""+COLUMN_FK_ORIGIN+" = '"+data_[x].fk_origin+"', " +
                    ""+COLUMN_FK_EXPEDITION+" = '"+data_[x].fk_expedition+"', " +
                    ""+COLUMN_ORIGIN_LINE_ID+" = '"+data_[x].origin_line_id+"', " +
                    ""+COLUMN_FK_ORIGIN_LINE+" = '"+data_[x].fk_origin_line+"', " +
                    ""+COLUMN_FK_PRODUCT+" = '"+data_[x].fk_product+"', " +
                    ""+COLUMN_ENTREPOT_ID+" = '"+data_[x].entrepot_id+"', " +
                    ""+COLUMN_QTY+" = '"+data_[x].qty+"', " +
                    ""+COLUMN_QTY_ASK+" = '"+data_[x].qty_ask+"', " +
                    ""+COLUMN_QTY_SHIPPED+" = '"+data_[x].qty_shipped+"', " +
                    ""+COLUMN_REF+" = '"+data_[x].ref+"', " +
                    ""+COLUMN_PRODUCT_REF+" = '"+data_[x].product_ref+"', " +
                    ""+COLUMN_LIBELLE+" = '"+data_[x].libelle+"', " +
                    ""+COLUMN_PRODUCT_LABEL+" = '"+data_[x].product_ref+"', " +
                    ""+COLUMN_DESC+" = '"+data_[x].desc+"', " +
                    ""+COLUMN_DESCRIPTION+" = '"+data_[x].description+"', " +
                    ""+COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID+" = '"+data_[x].details_entrepot__entrepot_id+"', " +
                    ""+COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED+" = '"+data_[x].details_entrepot__qty_shipped+"', " +
                    ""+COLUMN_DETAILS_ENTREPOT__LINE_ID+" = '"+data_[x].details_entrepot__line_id+"', " +
                    ""+COLUMN_PRICE+" = '"+data_[x].price+"' " +
                    "WHERE "+COLUMN_FK_EXPEDITION+" = "+data_[x].fk_expedition;

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
                await tx.executeSql("DELETE FROM " + TABLE_NAME +" WHERE "+COLUMN_FK_EXPEDITION+" = "+fk_expedition, []);
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
export default ShipmentLinesManager;
