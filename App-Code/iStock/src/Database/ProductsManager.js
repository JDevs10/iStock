//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DatabaseInfo from './DatabaseInfo';
import ProductsLotDlcDluoManager from './ProductsLotDlcDluoManager';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;


const TABLE_NAME = "products";
const COLUMN_ID = "id";
const COLUMN_PRODUCT_ID = "product_id";
const COLUMN_REF = "ref";
const COLUMN_LABEL = "label";
const COLUMN_CODEBARRE = "barcode";
const COLUMN_DESCRIPTION = "description";
const COLUMN_EMPLACEMENT = "emplacement";
const COLUMN_STOCK = "stock";
const COLUMN_IMAGE = "image";
const COLUMN_COLIS_QTY = "colis_qty";
const COLUMN_PALETTE_QTY = "palette_qty";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_PRODUCT_ID + " INTEGER(255)," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_LABEL + " VARCHAR(255)," +
    COLUMN_CODEBARRE + " VARCHAR(255)," +
    COLUMN_DESCRIPTION + " VARCHAR(255)," +
    COLUMN_EMPLACEMENT + " VARCHAR(255)," +
    COLUMN_STOCK + " VARCHAR(255)," +
    COLUMN_IMAGE + " VARCHAR(255)," +
    COLUMN_COLIS_QTY + " INTEGER(255)," +
    COLUMN_PALETTE_QTY + " INTEGER(255)" +
")";


// create a component
class ProductsManager extends Component {
    _TABLE_NAME_ = TABLE_NAME;
    _COLUMN_ID_ = COLUMN_ID;
    _COLUMN_PRODUCT_ID_ = COLUMN_PRODUCT_ID;
    _COLUMN_REF_ = COLUMN_REF;
    _COLUMN_DESCRIPTION_ = COLUMN_DESCRIPTION;
    _COLUMN_CODEBARRE_ = COLUMN_CODEBARRE;
    _COLUMN_EMPLACEMENT_ = COLUMN_EMPLACEMENT;
    _COLUMN_STOCK_ = COLUMN_STOCK;
    _COLUMN_IMAGE_ = COLUMN_IMAGE;
    _COLUMN_COLIS_QTY_ = COLUMN_COLIS_QTY;
    _COLUMN_PALETTE_QTY_ = COLUMN_PALETTE_QTY;

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
    async CREATE_PRODUCT_TABLE(){
        console.log("##### CREATE_PRODUCT_TABLE #########################");
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

    //Insert a list
    async INSERT_PRODUCT_L(data_){
        console.log("##### INSERT_PRODUCT - List #########################");

        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    data_[x].image = "";
                    // console.log("data_ : ", data_[x]);

                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_PRODUCT_ID+", "+COLUMN_REF+", "+COLUMN_LABEL+", "+COLUMN_CODEBARRE+", "+COLUMN_DESCRIPTION+", "+COLUMN_EMPLACEMENT+", "+COLUMN_STOCK+", "+COLUMN_IMAGE+", "+COLUMN_COLIS_QTY+", "+COLUMN_PALETTE_QTY+") VALUES (NULL, "+data_[x].id+", '"+data_[x].ref+"', '"+data_[x].label.replace(/'/g, "''")+"', '"+(data_[x].barcode == null ? "" : data_[x].barcode)+"', "+(data_[x].description == null ? null : "'"+data_[x].description.replace(/'/g, "''")+"'" )+", '"+(data_[x].fk_default_warehouse == null ? "" : data_[x].fk_default_warehouse)+"', '"+data_[x].stock_reel+"', '"+data_[x].image+"', "+(data_[x].array_options.options_colis_qty != null ? data_[x].array_options.options_colis_qty : 0)+", "+(data_[x].array_options.options_palette_qty != null ? data_[x].array_options.options_palette_qty : 0)+")", []);
                    });

                    if(data_[x].Lot_DLC_DLUO_Batch != null && data_[x].Lot_DLC_DLUO_Batch.length > 0){
                        const res = new ProductsLotDlcDluoManager();
                        await res.initDB();
                        await res.INSERT_ProductsLotDlcDluo(data_[x].Lot_DLC_DLUO_Batch);
                    }
                }
                return await resolve(true);
            } catch(error){
                return resolve(false);
            }
        });
    }


    //Get by id
    async GET_PRODUCT_BY_ID(ref){
        console.log("##### GET_PRODUCT_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let product = {};
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT p."+COLUMN_ID+", p."+COLUMN_REF+", p."+COLUMN_LABEL+", p."+COLUMN_CODEBARRE+", p."+COLUMN_DESCRIPTION+", p."+COLUMN_IMAGE+" FROM "+TABLE_NAME+" p WHERE p."+COLUMN_REF+" = '"+ref+"'", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`ID: ${row.id}, name: ${row.name}`)
                        product = row;
                    }
                    console.log(product);
                    await resolve(product);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }

    // get all
    async GET_PRODUCT_LIST(){
        console.log("##### GET_PRODUCT_LIST #########################");

        return await new Promise(async (resolve) => {
            const products = [];
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT p.'+COLUMN_ID+', p.'+COLUMN_REF+', p.'+COLUMN_LABEL+', p.'+COLUMN_CODEBARRE+', p.'+COLUMN_DESCRIPTION+', p.'+COLUMN_IMAGE+' FROM '+TABLE_NAME+' p', []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, ref, label, codebarre, description, image } = row;
                        products.push({
                            id, ref, label, codebarre, description, image
                        });
                    }
                    //console.log(products);
                    await resolve(products);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
                await resolve([]);
            });
        });
    }


    //Update
    async UPDATE_PRODUCT_BY_ID(data_){
        console.log("##### UPDATE_PRODUCT_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET " + COLUMN_REF + " = "+data_.ref+", "+COLUMN_LABEL+" = "+data_.label.replace(/'/g, "''")+", "+COLUMN_CODEBARRE+" = "+data_.codebarre+", "+COLUMN_DESCRIPTION+" = "+data_.description.replace(/'/g, "''")+", "+COLUMN_EMPLACEMENT+" = "+data_.emplacement+", "+COLUMN_IMAGE+" = "+data_.image+" WHERE " + COLUMN_ID + " = " + data_.id, []);
                resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                resolve(false);
            });
        });
    }

    // Update image path
    async UPDATE_IMAGE(data){
        console.log("##### UPDATE_IMAGE #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                console.log("UPDATE "+TABLE_NAME+" SET "+COLUMN_IMAGE+" = '"+data.image+"' WHERE "+COLUMN_REF+" = '" +data.ref +"'")
                await tx.executeSql("UPDATE "+TABLE_NAME+" SET "+COLUMN_IMAGE+" = '"+data.image+"' WHERE "+COLUMN_REF+" = '" +data.ref +"'", []);

            }).then(async (result) => {
                await resolve(true);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve(false);
            });
        });
    }

    //Delete
    async DELETE_PRODUCT_LIST(){
        console.log("##### DELETE_PRODUCT_LIST #########################");

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
    async DROP_PRODUCT(){
        console.log("##### DROP_PRODUCT #########################");

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
export default ProductsManager;
