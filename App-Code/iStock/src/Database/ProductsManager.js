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


const TABLE_NAME = "products";
const COLUMN_ID = "id";
const COLUMN_REF = "ref";
const COLUMN_LABEL = "label";
const COLUMN_CODEBARRE = "codebarre";
const COLUMN_DESCRIPTION = "description";
const COLUMN_LOT = "lot";
const COLUMN_DLC = "dlc";
const COLUMN_DLUO = "dluo";
const COLUMN_EMPLACEMENT = "emplacement";
const COLUMN_IMAGE = "image";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_LABEL + " VARCHAR(255)," +
    COLUMN_CODEBARRE + " VARCHAR(255)," +
    COLUMN_DESCRIPTION + " VARCHAR(255)," +
    COLUMN_LOT + " VARCHAR(255)," +
    COLUMN_DLC + " VARCHAR(255)," +
    COLUMN_DLUO + " VARCHAR(255)," +
    COLUMN_EMPLACEMENT + " VARCHAR(255)," +
    COLUMN_IMAGE + " VARCHAR(255)" +
")";


// create a component
class ProductsManager extends Component {
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
                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_REF+", "+COLUMN_LABEL+", "+COLUMN_CODEBARRE+", "+COLUMN_DESCRIPTION+", "+COLUMN_LOT+", "+COLUMN_DLC+", "+COLUMN_DLUO+", "+COLUMN_IMAGE+") VALUES (NULL, '"+data_[x].ref+"', '"+data_[x].label.replace(/'/g, "''")+"', '"+data_[x].codebarre+"', '"+data_[x].description.replace(/'/g, "''")+"', '"+data_[x].lot+"', '"+data_[x].dlc+"', '"+data_[x].dluo+"', '"+data_[x].image+"')", []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return resolve(false);
            }
        });
    }


    //Get by id
    async GET_PRODUCT_BY_ID(id){
        console.log("##### GET_PRODUCT_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let product = {};
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT p.'+COLUMN_ID+', p.'+COLUMN_REF+', p.'+COLUMN_LABEL+', p.'+COLUMN_CODEBARRE+', p.'+COLUMN_DESCRIPTION+', p.'+COLUMN_LOT+', p.'+COLUMN_DLC+', p.'+COLUMN_DLUO+', p.'+COLUMN_IMAGE+' FROM '+TABLE_NAME+' p WHERE p.'+COLUMN_ID+' = '+id, []).then(async ([tx,results]) => {
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
                await tx.executeSql('SELECT p.'+COLUMN_ID+', p.'+COLUMN_REF+', p.'+COLUMN_LABEL+', p.'+COLUMN_CODEBARRE+', p.'+COLUMN_DESCRIPTION+', p.'+COLUMN_LOT+', p.'+COLUMN_DLC+', p.'+COLUMN_DLUO+', p.'+COLUMN_IMAGE+' FROM '+TABLE_NAME+' p', []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        //console.log(`ID: ${row.id}, label: ${row.label}`)
                        const { id, ref, label, codebarre, description, lot, dlc, dluo, image } = row;
                        products.push({
                            id, ref, label, codebarre, description, lot, dlc, dluo, image
                        });
                    }
                    console.log(products);
                    await resolve(products);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }


    //Update
    async UPDATE_PRODUCT_BY_ID(data_){
        console.log("##### UPDATE_PRODUCT_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET " + COLUMN_REF + " = "+data_.ref+", "+COLUMN_LABEL+" = "+data_.label.replace(/'/g, "''")+", "+COLUMN_CODEBARRE+" = "+data_.codebarre+", "+COLUMN_DESCRIPTION+" = "+data_.description.replace(/'/g, "''")+", "+COLUMN_LOT+" = "+data_.lot+", "+COLUMN_DLC+" = "+data_.dlc+", "+COLUMN_DLUO+" = "+data_.dluo+", "+COLUMN_EMPLACEMENT+" = "+data_.emplacement+", "+COLUMN_IMAGE+" = "+data_.image+" WHERE " + COLUMN_ID + " = " + data_.id, []);
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
        console.log("##### DELETE_PRODUCT_LIST #########################");

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
