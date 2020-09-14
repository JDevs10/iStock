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

const TABLE_NAME = "token";
const COLUMN_ID = "id";
const COLUMN_NAME = "name";
const COLUMN_SERVER = "server";
const COLUMN_TOKEN = "token";
const COLUMN_COMPANY = "company";

const create = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + "(" +
    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
    COLUMN_NAME + " VARCHAR(255)," +
    COLUMN_SERVER + " VARCHAR(255)," +
    COLUMN_TOKEN + " VARCHAR(255)," +
    COLUMN_COMPANY + " VARCHAR(255)" +
")";

// create a component
class TokenManager extends Component {
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
    async CREATE_TOKEN_TABLE(){
        console.log("##### CREATE_TOKEN_TABLE #########################");
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
    async INSERT_TOKEN(data_){
        console.log("##### INSERT_TOKEN #########################");
        console.log("inserting.... ", data_);
        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("INSERT INTO " + TABLE_NAME + " ("+COLUMN_ID+", "+COLUMN_NAME+", "+COLUMN_SERVER+", "+COLUMN_TOKEN+", "+COLUMN_COMPANY+") VALUES (1, '"+data_.name.replace(/'/g, "''")+"', '"+data_.server.replace(/'/g, "''")+"', '"+data_.token.replace(/'/g, "''")+"', '"+data_.company.replace(/'/g, "''")+"')", []);
                });
                return await resolve(true);
            } catch(error){
                return await resolve(false);
            }
        });
    }

    //Get by id
    async GET_TOKEN_BY_ID(id){
        console.log("##### GET_TOKEN_BY_ID #########################");

        return await new Promise(async (resolve) => {
            let token = null;
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT t."+COLUMN_ID+", t."+COLUMN_NAME+", t."+COLUMN_SERVER+", t."+COLUMN_TOKEN+", t."+COLUMN_COMPANY+ " FROM "+TABLE_NAME+" t WHERE t."+COLUMN_ID+" = "+id, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log('token => row: ', row);
                        token = {
                            name: row.name, 
                            server: row.server, 
                            token: row.token, 
                            company: row.company
                        };
                    }
                });
            }).then(async (result) => {
                // await this.closeDatabase(db);
                // console.log('token: ', token);
                await resolve(token);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    //Delete
    async DELETE_TOKEN_LIST(){
        console.log("##### DELETE_TOKEN_LIST #########################");

        return await new Promise(async (resolve) => {
            await db.transaction(async (tx) => {
                await tx.executeSql("DELETE FROM " + TABLE_NAME, []);
            });
            return await resolve(true);
        });
    }

    //Delete
    async DROP_TOKEN(){
        console.log("##### DELETE_TOKEN_LIST #########################");

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
export default TokenManager;
