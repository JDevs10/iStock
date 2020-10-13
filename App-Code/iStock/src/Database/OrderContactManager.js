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


const TABLE_NAME = "orders_contact";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_DATECREATE = "datecreate"; //VARCHAR(255)
const COLUMN_STATUT = "statut"; //VARCHAR(255)
const COLUMN_ELEMENT_ID = "element_id"; //VARCHAR(255)
const COLUMN_FK_C_TYPE_CONTACT = "fk_c_tyoe_contact"; //VARCHAR(255)
const COLUMN_FK_SOPEOPLE = "fk_socpeople"; //VARCHAR(255)


const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_DATECREATE + " VARCHAR(255)," +
    COLUMN_STATUT + " VARCHAR(255)," +
    COLUMN_ELEMENT_ID + " VARCHAR(255)," +
    COLUMN_FK_C_TYPE_CONTACT + " VARCHAR(255)," +
    COLUMN_FK_SOPEOPLE + " VARCHAR(255)" +
")";

// create a component
class OrderContactManager extends Component {
    _TABLE_NAME_ = "orders_contact";
    _COLUMN_FK_SOPEOPLE_ = "fk_socpeople";

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
    async CREATE_ORDER_CONTACT_TABLE(){
        console.log("##### CREATE_ORDER_CONTACT_TABLE #########################");
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
    async INSERT_ORDER_CONTACT(data_){
        console.log("##### INSERT_OORDER_CONTACT #########################");
        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        const insert = "INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_DATECREATE+", "+COLUMN_STATUT+", "+COLUMN_ELEMENT_ID+", "+COLUMN_FK_C_TYPE_CONTACT+", "+COLUMN_FK_SOPEOPLE+") VALUES (null, '"+data_[x].datecreate+"', '"+data_[x].statut +"', '"+data_[x].element_id+"', '"+data_[x].fk_c_type_contact+"', '"+data_[x].fk_socpeople+"')";
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


    //Delete
    async DELETE_ORDER_CONTACT(){
        console.log("##### DELETE_ORDER_CONTACT #########################");

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
export default OrderContactManager;
