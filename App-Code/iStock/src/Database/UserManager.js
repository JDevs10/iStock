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

const TABLE_NAME = "user";
const COLUMN_ID = "id";
const COLUMN_REF = "ref";
const COLUMN_FIRSTNAME = "firstname";
const COLUMN_LASTNAME = "lastname";
const COLUMN_ADMIN = "admin";
const COLUMN_EMAIL = "email";
const COLUMN_JOB = "job";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_REF + " VARCHAR(255)," +
    COLUMN_FIRSTNAME + " VARCHAR(255)," +
    COLUMN_LASTNAME + " VARCHAR(255)," +
    COLUMN_ADMIN + " VARCHAR(255)," +
    COLUMN_EMAIL + " VARCHAR(255)," +
    COLUMN_JOB + " VARCHAR(255)" +
")";


// create a component
class UserManager extends Component {
    //public variables
    _TABLE_NAME_ = "user";
    _COLUMN_REF_ = "ref";
    _COLUMN_FIRSTNAME_ = "firstname";
    _COLUMN_LASTNAME_ = "lastname";
    _COLUMN_ADMIN_ = "admin";


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
    async CREATE_USER_TABLE(){
        console.log("##### CREATE_USER_TABLE #########################");
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
    async INSERT_USER(data_){
        console.log("##### INSERT_USER #########################");
        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_REF+", "+COLUMN_FIRSTNAME+", "+COLUMN_LASTNAME+", "+COLUMN_ADMIN+", "+COLUMN_EMAIL+", "+COLUMN_JOB+") VALUES (null, '"+data_[x].ref+"', "+(data_[x].firstname == null ? null : "'"+data_[x].firstname.replace(/'/g, "''")+"'")+", "+(data_[x].lastname == null ? "" : "'"+data_[x].lastname.replace(/'/g, "''")+"'")+", '"+data_[x].admin+"', '"+data_[x].email+"', '"+data_[x].job+"')", []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }


    //Get by ref
    async GET_USER_BY_REF(ref){
        console.log("##### GET_USER_BY_REF #########################");

        return await new Promise(async (resolve) => {
            let user = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT u."+COLUMN_ID+", u."+COLUMN_REF+", u."+COLUMN_FIRSTNAME+", u."+COLUMN_LASTNAME+", u."+COLUMN_ADMIN+ ", u."+COLUMN_EMAIL+ ", u."+COLUMN_JOB+ " FROM "+TABLE_NAME+" u WHERE u."+COLUMN_REF+" = "+ref, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        user = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(user);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Get by id
    async GET_USER_BY_ID(id){
        console.log("##### GET_USER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let user = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT u."+COLUMN_ID+", u."+COLUMN_REF+", u."+COLUMN_FIRSTNAME+", u."+COLUMN_LASTNAME+", u."+COLUMN_ADMIN+ ", u."+COLUMN_EMAIL+ ", u."+COLUMN_JOB+ " FROM "+TABLE_NAME+" u WHERE u."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        user = row;
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(user);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }


    //Get list
    async GET_USER_LIST(){
        console.log("##### GET_USER_LIST #########################");

        return await new Promise(async (resolve) => {
            let user = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT u."+COLUMN_ID+", u."+COLUMN_REF+", u."+COLUMN_FIRSTNAME+", u."+COLUMN_LASTNAME+", u."+COLUMN_ADMIN+ ", u."+COLUMN_EMAIL+ ", u."+COLUMN_JOB+ " FROM "+TABLE_NAME+" u", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        user.push(row);
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(user);
            }).catch(async (err) => {
                console.log(err);
                await resolve([]);
            });
        });
    }

    // get all
    async GET_REPRESENTANT_BY_LASTNAME(lastname){
        console.log("##### GET_REPRESENTANT_BY_LASTNAME #########################");

        return await new Promise(async (resolve) => {
            const client = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT u."+COLUMN_ID+", u."+COLUMN_REF+", u."+COLUMN_FIRSTNAME+", u."+COLUMN_LASTNAME+", u."+COLUMN_ADMIN+ ", u."+COLUMN_EMAIL+ ", u."+COLUMN_JOB+ " FROM "+TABLE_NAME+" u WHERE u."+COLUMN_LASTNAME+" LIKE '%"+lastname+"%'", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        client.push(row);
                    }
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
                await resolve(client);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    //Delete
    async DELETE_USER_LIST(){
        console.log("##### DELETE_USER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_USER(){
        console.log("##### DROP_USER #########################");

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
export default UserManager;
