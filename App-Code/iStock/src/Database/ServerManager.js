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

const TABLE_NAME = "servers";
const COLUMN_ID = "id";
const COLUMN_NAME = "name";
const COLUMN_URL = "url";
const COLUMN_STATUS = "status";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_NAME + " VARCHAR(255)," +
    COLUMN_URL + " VARCHAR(255)," +
    COLUMN_STATUS + " VARCHAR(255)" +
")";


// create a component
class ServerManager extends Component {
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
    async CREATE_SERVER_TABLE(){
        console.log("##### CREATE_SERVER_TABLE #########################");
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
    async INSERT_SERVER_L(data_){
        console.log("##### INSERT_SERVER - List #########################");

        console.log("inserting.... ", data_.length);
        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < data_.length; x++){
                    console.log("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_NAME+", "+COLUMN_URL+", "+COLUMN_STATUS+") VALUES (NULL, '"+data_[x].name+"', '"+data_[x].url+"', '"+data_[x].status+"')");
                    await db.transaction(async (tx) => {
                        await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_NAME+", "+COLUMN_URL+", "+COLUMN_STATUS+") VALUES (NULL, '"+data_[x].name+"', '"+data_[x].url+"', '"+data_[x].status+"')", []);
                    });
                }
                return await resolve(true);
            } catch(error){
                return resolve(false);
            }
        });
    }

    //Get by id
    async GET_SERVER_BY_ID(id){
        console.log("##### GET_SERVER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let server = {};
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT s.id, s.name, s.url FROM '+TABLE_NAME+' s WHERE s.id = '+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`ID: ${row.id}, name: ${row.name}`)
                        server = row;
                    }
                    console.log(server);
                    await resolve(server);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });
    }

    // get all
    async GET_SERVER_LIST(){
        console.log("##### GET_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            const categories = [];
            await db.transaction(async (tx) => {
                await tx.executeSql('SELECT s.id, s.name, s.url FROM '+TABLE_NAME+' s', []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`ID: ${row.id}, name: ${row.name}`)
                        const { id, name, url, status } = row;
                        categories.push({
                            id,
                            name,
                            url,
                            status
                        });
                    }
                    console.log(categories);
                    await resolve(categories);
                });
            }).then(async (result) => {
                await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log(err);
            });
        });

    }

    //Update
    async UPDATE_SERVER_BY_ID(data_){
        console.log("##### UPDATE_SERVER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("UPDATE " + TABLE_NAME + " SET " + COLUMN_NAME + " = '"+data_.name+"', "+COLUMN_URL+" = '"+data_.url+"', "+COLUMN_STATUS+" = '"+data_.status+"' WHERE " + COLUMN_ID + " = " + data_.id, []);
                resolve(true);

            }).then(async (result) => {
                resolve(false);
            });
        });
    }

    //Delete
    async DELETE_SERVER_LIST(){
        console.log("##### DELETE_SERVER_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
                resolve(true);

            }).then(async (result) => {
                resolve(false);
            });
        });
    }

    //Delete
    async DROP_SERVER(){
        console.log("##### DROP_SERVER #########################");

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
export default ServerManager;
