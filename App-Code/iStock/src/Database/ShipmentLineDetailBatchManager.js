//import liraries
import React, { Component } from 'react';
import SQLite from 'react-native-sqlite-storage';
import DatabaseInfo from './DatabaseInfo';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;

const TABLE_NAME = "Shipment_Line_Detail_Batch";
const COLUMN_ID = "id";
const COLUMN_FK_ORIGIN_STOCK = "fk_origin_stock";
const COLUMN_STOCK = "stock";
const COLUMN_FK_PRODUCT = "fk_product";
const COLUMN_QTY = "qty";
const COLUMN_BATCH = "batch";
const COLUMN_SELLBY = "sellby";
const COLUMN_EATBY = "eatby";
const COLUMN_ENTREPOT_LABEL = "entrepot_label";
const COLUMN_ENTREPOT_ID = "entrepot_id";
const COLUMN_FK_EXPEDITIONDET = "fk_expeditiondet";



const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_FK_ORIGIN_STOCK + " VARCHAR(255)," +
    COLUMN_STOCK + " VARCHAR(255)," +
    COLUMN_FK_PRODUCT + " VARCHAR(255)," +
    COLUMN_QTY + " INTEGER(255)," +
    COLUMN_BATCH + " VARCHAR(255)," +
    COLUMN_SELLBY + " VARCHAR(255)," +
    COLUMN_EATBY + " VARCHAR(255)," +
    COLUMN_ENTREPOT_LABEL + " VARCHAR(255)," +
    COLUMN_ENTREPOT_ID + " VARCHAR(255)," +
    COLUMN_FK_EXPEDITIONDET + " VARCHAR(255)" +
")";


// create a component
class ShipmentLineDetailBatchManager extends Component {
    _COLUMN_ID_ = COLUMN_ID;
    _TABLE_NAME_ = TABLE_NAME;
    _COLUMN_FK_ORIGIN_STOCK_ = COLUMN_FK_ORIGIN_STOCK;
    _COLUMN_STOCK = COLUMN_STOCK;
    _COLUMN_FK_PRODUCT = COLUMN_FK_PRODUCT;
    _COLUMN_ENTREPOT_ID_ = COLUMN_ENTREPOT_ID;
    _COLUMN_QTY_ = COLUMN_QTY;
    _COLUMN_FK_EXPEDITIONDET_ = COLUMN_FK_EXPEDITIONDET;

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
    async CREATE_SHIPMENT_LINE_DETAIL_BATCH_TABLE(){
        console.log("##### CREATE_SHIPMENT_LINE_DETAIL_BATCH_TABLE #########################");
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

//     const COLUMN_ID = "id";
// const COLUMN_FK_ORIGIN_STOCK = "fk_origin_stock";
// const COLUMN_STOCK = "stock";
// const COLUMN_FK_PRODUCT = "fk_product";
// const COLUMN_QTY = "qty";
// const COLUMN_BATCH = "batch";
// const COLUMN_SELLBY = "sellby";
// const COLUMN_EATBY = "eatby";
// const COLUMN_ENTREPOT_LABEL = "entrepot_label";
// const COLUMN_ENTREPOT_ID = "entrepot_id";
// const COLUMN_FK_EXPEDITIONDET = "fk_expeditiondet";


    //Insert
    async INSERT_SHIPMENT_LINE_DETAIL_BATCH(inserted_shipment_line_id, data_){
        console.log("##### INSERT_SHIPMENT_LINE_DETAIL_BATCH #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    data_[x].fk_expeditiondet = inserted_shipment_line_id;
                    const SQL_INSERT = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_FK_ORIGIN_STOCK+", "+COLUMN_STOCK+", "+COLUMN_FK_PRODUCT+", "+COLUMN_QTY+", "+COLUMN_BATCH+", "+COLUMN_SELLBY+", "+COLUMN_EATBY+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_FK_EXPEDITIONDET+") "+
                        "VALUES ("+data_[x].id+", '"+data_[x].fk_origin_stock+"', '"+data_[x].stock+"', '"+data_[x].fk_product+"', "+data_[x].qty+", '"+data_[x].batch+"', '"+data_[x].sellby+"', '"+data_[x].eatby+"', '"+data_[x].entrepot_label+"', '"+data_[x].entrepot_id+"', '"+data_[x].fk_expeditiondet+"')";

                    await db.transaction(async (tx) => {
                        await tx.executeSql(SQL_INSERT, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                console.log("error: ", error);
                return await resolve(false);
            }
        });
    }


    async GET_SHIPMENT_LINE_DETAIL_BATCH_BY_ENTREPOT_ID(id){ 
        console.log("##### GET_SHIPMENT_LINE_DETAIL_BATCH_BY_ENTREPOT_ID #########################");

        return await new Promise(async (resolve) => {
            let shipment_line = [];
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_FK_ORIGIN_STOCK+", "+COLUMN_STOCK+", "+COLUMN_FK_PRODUCT+", "+COLUMN_QTY+", "+COLUMN_BATCH+", "+COLUMN_SELLBY+", "+COLUMN_EATBY+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_FK_EXPEDITIONDET+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_EXPEDITIONDET+" = '"+id+"'";

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

    async GET_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT(id){
        console.log("##### GET_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT #########################");

        return await new Promise(async (resolve) => {
            let shipment_line = [];
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_FK_ORIGIN_STOCK+", "+COLUMN_STOCK+", "+COLUMN_FK_PRODUCT+", "+COLUMN_QTY+", "+COLUMN_BATCH+", "+COLUMN_SELLBY+", "+COLUMN_EATBY+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_FK_EXPEDITIONDET+" "+
                        "FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_PRODUCT+" = '"+id+"'";

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipment_line.push(row);
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

    async GET_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_EXPEDITIONDET(id){
        console.log("##### GET_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_EXPEDITIONDET #########################");

        return await new Promise(async (resolve) => {
            let shipment_line = [];
            await db.transaction(async (tx) => {
                const SQL_GET_ = "SELECT "+COLUMN_ID+", "+COLUMN_FK_ORIGIN_STOCK+", "+COLUMN_STOCK+", "+COLUMN_FK_PRODUCT+", "+COLUMN_QTY+", "+COLUMN_BATCH+", "+COLUMN_SELLBY+", "+COLUMN_EATBY+", "+COLUMN_ENTREPOT_LABEL+", "+COLUMN_ENTREPOT_ID+", "+COLUMN_FK_EXPEDITIONDET+" "+
                    "FROM "+TABLE_NAME+" WHERE "+COLUMN_FK_EXPEDITIONDET+" = '"+id+"'";

                await tx.executeSql(SQL_GET_, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        shipment_line.push(row);
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
    
    // Delete
    async DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_EXPEDITIONDET(id){
        console.log("##### DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_EXPEDITIONDET #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME + " WHERE "+COLUMN_FK_EXPEDITIONDET+" = "+id, []);
            });
            return await resolve(true);
        });
    }

    // Delete
    async DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT(id){
        console.log("##### DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME + " WHERE "+COLUMN_FK_PRODUCT+" = "+id, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DELETE_SHIPMENT_LINE_DETAIL_BATCH(){
        console.log("##### DELETE_SHIPMENT_LINE_DETAIL_BATCH #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_SHIPMENT_LINE_DETAIL_BATCH(){
        console.log("##### DROP_SHIPMENT_LINE_DETAIL_BATCH #########################");

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
export default ShipmentLineDetailBatchManager;
