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

const TABLE_NAME = "orders";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_IS_SYNC = "is_sync"; //INT(2)
const COLUMN_STATUT = "statut"; //INT(2)
const COLUMN_REF_CLIENT = "ref_client"; //INT(10)
const COLUMN_SOCID = "socId"; //INT(10)
const COLUMN_USER_AUTHOR_ID = "user_author_id"; //INT(10)
const COLUMN_REF_COMMANDE = "ref_commande"; //VARCHAR(255)
const COLUMN_DATE_CREATION = "date_creation"; //VARCHAR(255)
const COLUMN_DATE_COMMANDE = "date_commande"; //VARCHAR(255)
const COLUMN_DATE_LIVRAISON = "date_livraison"; //VARCHAR(255)
const COLUMN_NOTE_PUBLIC = "note_public"; //VARCHAR(255)
const COLUMN_NOTE_PRIVEE = "note_privee"; //VARCHAR(255)
const COLUMN_TOTAL_HT = "total_ht"; //VARCHAR(255)
const COLUMN_TOTAL_TVA = "total_tva"; //VARCHAR(50)
const COLUMN_TOTAL_TTC = "total_ttc"; //VARCHAR(255)
const COLUMN_BROUILLION = "brouillon";  //VARCHAR(255)
const COLUMN_REMISE_ABSOLUE = "remise_absolue"; //VARCHAR(255)
const COLUMN_REMISE_PERCENT = "remise_percent"; //VARCHAR(255)
const COLUMN_REMISE = "remise"; //VARCHAR(255)


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_IS_SYNC + " INT(2)," +
    COLUMN_STATUT + " INT(2)," +
    COLUMN_REF_CLIENT + " INT(10)," +
    COLUMN_SOCID + " INT(10)," +
    COLUMN_USER_AUTHOR_ID + " INT(10)," +
    COLUMN_REF_COMMANDE + " VARCHAR(255)," +
    COLUMN_DATE_CREATION + " VARCHAR(255)," +
    COLUMN_DATE_COMMANDE + " VARCHAR(255)," +
    COLUMN_DATE_LIVRAISON + " VARCHAR(255)," +
    COLUMN_NOTE_PUBLIC + " VARCHAR(255)," +
    COLUMN_NOTE_PRIVEE + " VARCHAR(255)," +
    COLUMN_TOTAL_HT + " VARCHAR(255)," +
    COLUMN_TOTAL_TVA + " VARCHAR(255)," +
    COLUMN_TOTAL_TTC + " VARCHAR(255)," +
    COLUMN_BROUILLION + " VARCHAR(255)," +
    COLUMN_REMISE_ABSOLUE + " VARCHAR(255)," +
    COLUMN_REMISE_PERCENT + " VARCHAR(255)," +
    COLUMN_REMISE + " VARCHAR(255)" +
")";


// create a component
class OrderManager extends Component {
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
    async CREATE_ORDER_TABLE(){
        console.log("##### CREATE_ORDER_TABLE #########################");
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
    async INSERT_ORDERS(data_){
        console.log("##### INSERT_ORDERS #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    data_[x].isSync = 1;
                    await db.transaction(async (tx) => {
                        const insert = "INSERT INTO " + TABLE_NAME + " (" + COLUMN_ID + ", " + COLUMN_IS_SYNC + ", " + COLUMN_STATUT + ", " + COLUMN_REF_CLIENT + ", " +COLUMN_SOCID + ", " +COLUMN_USER_AUTHOR_ID + ", " +COLUMN_REF_COMMANDE + ", " +COLUMN_DATE_CREATION + ", " +COLUMN_DATE_COMMANDE + ", " +COLUMN_DATE_LIVRAISON + ", " +COLUMN_NOTE_PUBLIC + ", " +COLUMN_NOTE_PRIVEE + ", " +COLUMN_TOTAL_HT + ", " +COLUMN_TOTAL_TVA + ", " +COLUMN_TOTAL_TTC + ", " +COLUMN_BROUILLION + ", " +COLUMN_REMISE_ABSOLUE + ", " +COLUMN_REMISE_PERCENT + ", " +COLUMN_REMISE +") VALUES (null, "+data_[x].isSync+", "+data_[x].statut+", '"+data_[x].ref_client+"', "+data_[x].socid+", "+data_[x].user_author_id+", '"+data_[x].ref+"', '"+data_[x].date+"', '"+data_[x].date_commande+"', '"+data_[x].date_livraison+"', '"+data_[x].note_public.replace(/'/g, "''")+"', '"+data_[x].note_private.replace(/'/g, "''")+"', '"+data_[x].total_ht+"', '"+data_[x].total_tva+"', '"+data_[x].total_ttc+"', '"+data_[x].brouillon+"', '"+data_[x].remise_absolue+"', '"+data_[x].remise_percent+"', '"+data_[x].remise+"')";
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

    async GET_ORDER_BY_ID(id){
        console.log("##### GET_ORDER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT p." + COLUMN_ID + ", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p WHERE p." + COLUMN_ID + " = " + id, [], async (tx, results) => {
                        var temp = {};
                        temp = results.rows.item(0);
                        return resolve(temp);                           
                    });
                });
            } catch(error){
                return resolve({});
            }
        });
    }

    async GET_ORDER_LIST_BETWEEN(from, to){
        console.log("##### GET_ORDER_LIST_BETWEEN #########################");

        return await new Promise(async (resolve) => {
            const products = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT p." + COLUMN_ID + ", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p WHERE p."+COLUMN_ID+" BETWEEN " + from + " AND " + to, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise } = row;
                        products.push({ id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise });
                    }
                    // console.log(products);
                    await resolve(products);
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
export default OrderManager;
