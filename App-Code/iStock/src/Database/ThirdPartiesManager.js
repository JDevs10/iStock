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

const TABLE_NAME = "thirdparties";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_REF = "ref"; //VARCHAR(255)
const COLUMN_NAME = "mane"; //VARCHAR(255)
const COLUMN_ADDRESS = "address"; //VARCHAR(255)
const COLUMN_TOWN = "town"; //VARCHAR(255)
const COLUMN_ZIP = "zip"; //VARCHAR(255)
const COLUMN_COUNTRY = "country"; //VARCHAR(255)
const COLUMN_COUNTRY_ID = "country_id"; //VARCHAR(255)
const COLUMN_COUNTRY_CODE = "country_code"; //VARCHAR(255)
const COLUMN_STATUT = "statut"; //VARCHAR(255)
const COLUMN_PHONE = "phone"; //VARCHAR(255)
const COLUMN_CLIENT = "client"; //VARCHAR(255)
const COLUMN_FOURNISSEUR = "fournisseur"; //VARCHAR(255)
const COLUMN_CODE_CLIENT = "note_public"; //VARCHAR(255)
const COLUMN_CODE_FOURNISSEUR = "note_privee"; //VARCHAR(255)


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_NAME + " VARCHAR(255)," +
    COLUMN_ADDRESS + " VARCHAR(255)," +
    COLUMN_TOWN + " VARCHAR(255)," +
    COLUMN_ZIP + " VARCHAR(255)," +
    COLUMN_COUNTRY + " VARCHAR(255)," +
    COLUMN_COUNTRY_ID + " VARCHAR(255)," +
    COLUMN_COUNTRY_CODE + " VARCHAR(255)," +
    COLUMN_STATUT + " VARCHAR(255)," +
    COLUMN_PHONE + " VARCHAR(255)," +
    COLUMN_CLIENT + " VARCHAR(255)," +
    COLUMN_FOURNISSEUR + " VARCHAR(255)," +
    COLUMN_CODE_CLIENT + " VARCHAR(255)," +
    COLUMN_CODE_FOURNISSEUR + " VARCHAR(255)" +
")";


// create a component
class ThirdPartiesManager extends Component {
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
    async CREATE_TPM_TABLE(){
        console.log("##### CREATE_TPM_TABLE #########################");

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

    async INSERT_TPM(data_){
        console.log("##### INSERT_TPM #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        const insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_REF+", "+COLUMN_NAME+", "+COLUMN_ADDRESS+", "+COLUMN_TOWN+", "+COLUMN_ZIP+", "+COLUMN_COUNTRY+", "+COLUMN_COUNTRY_ID+", "+COLUMN_COUNTRY_CODE+", "+COLUMN_STATUT+", "+COLUMN_PHONE+", "+COLUMN_CLIENT+", "+COLUMN_FOURNISSEUR+", "+COLUMN_CODE_CLIENT+", "+COLUMN_CODE_FOURNISSEUR+") VALUES (NULL, '"+data_[x].ref+"', '"+data_[x].name.replace(/'/g, "''")+"', '"+data_[x].address.replace(/'/g, "''")+"', '"+data_[x].town.replace(/'/g, "''")+"', '"+data_[x].zip+"', '"+data_[x].country+"', '"+data_[x].country_id+"', '"+data_[x].country_code+"', '"+data_[x].statut+"', '"+data_[x].phone+"', '"+data_[x].client+"', '"+data_[x].date_livraison+"', '"+data_[x].note_public+"', '"+data_[x].note_privee+"')";
                        await tx.executeSql(insert, []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_TPM_BY_ID(id){
        console.log("##### GET_TPM_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let client = {};
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT c."+COLUMN_ID+", c."+COLUMN_REF+", c."+COLUMN_NAME+", c."+COLUMN_ADDRESS+", c."+COLUMN_TOWN+", c."+COLUMN_ZIP+", c."+COLUMN_COUNTRY+", c."+COLUMN_COUNTRY_ID+", c."+COLUMN_COUNTRY_CODE+", c."+COLUMN_STATUT+", c."+COLUMN_PHONE+", c."+COLUMN_CLIENT+", c."+COLUMN_FOURNISSEUR+", c."+COLUMN_CODE_CLIENT+", c."+COLUMN_CODE_FOURNISSEUR+" FROM " + TABLE_NAME + " as c where c."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    client = results.rows.item(i);
                    console.log(client);
                    await resolve(client);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }

    // get all
    async GET_TPM_LIST(){
        console.log("##### GET_TPM_LIST #########################");

        return await new Promise(async (resolve) => {
            const client = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT c."+COLUMN_ID+", c."+COLUMN_REF+", c."+COLUMN_NAME+", c."+COLUMN_ADDRESS+", c."+COLUMN_TOWN+", c."+COLUMN_ZIP+", c."+COLUMN_COUNTRY+", c."+COLUMN_COUNTRY_ID+", c."+COLUMN_COUNTRY_CODE+", c."+COLUMN_STATUT+", c."+COLUMN_PHONE+", c."+COLUMN_CLIENT+", c."+COLUMN_FOURNISSEUR+", c."+COLUMN_CODE_CLIENT+", c."+COLUMN_CODE_FOURNISSEUR+" FROM " + TABLE_NAME + " c", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        client.push(row);
                    }
                    await resolve(client);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }


    // get all
    async GET_CLIENT_LIST(){
        console.log("##### GET_CLIENT_LIST #########################");

        return await new Promise(async (resolve) => {
            const client = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT c."+COLUMN_ID+", c."+COLUMN_REF+", c."+COLUMN_NAME+", c."+COLUMN_ADDRESS+", c."+COLUMN_TOWN+", c."+COLUMN_ZIP+", c."+COLUMN_COUNTRY+", c."+COLUMN_COUNTRY_ID+", c."+COLUMN_COUNTRY_CODE+", c."+COLUMN_STATUT+", c."+COLUMN_PHONE+", c."+COLUMN_CLIENT+", c."+COLUMN_FOURNISSEUR+", c."+COLUMN_CODE_CLIENT+", c."+COLUMN_CODE_FOURNISSEUR+" FROM " + TABLE_NAME + " c WHERE c."+COLUMN_CLIENT+" = 1", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        client.push(row);
                    }
                    await resolve(client);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    // get all
    async GET_SUPPLIER_LIST(){
        console.log("##### GET_SUPPLIER_LIST #########################");

        return await new Promise(async (resolve) => {
            const client = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT c."+COLUMN_ID+", c."+COLUMN_REF+", c."+COLUMN_NAME+", c."+COLUMN_ADDRESS+", c."+COLUMN_TOWN+", c."+COLUMN_ZIP+", c."+COLUMN_COUNTRY+", c."+COLUMN_COUNTRY_ID+", c."+COLUMN_COUNTRY_CODE+", c."+COLUMN_STATUT+", c."+COLUMN_PHONE+", c."+COLUMN_CLIENT+", c."+COLUMN_FOURNISSEUR+", c."+COLUMN_CODE_CLIENT+", c."+COLUMN_CODE_FOURNISSEUR+" FROM " + TABLE_NAME + " c WHERE c."+COLUMN_FOURNISSEUR+" = 1", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        client.push(row);
                    }
                    await resolve(client);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    //Delete
    async DELETE_LIST(){
        console.log("##### DELETE_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
                return await resolve(true);

            }).then(async (result) => {
                console.error('result : ', result);
                return await resolve(false);
            });
        });
    }

    //Delete
    async DROP_TABLE(){
        console.log("##### DROP_TABLE #########################");

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
export default ThirdPartiesManager;
