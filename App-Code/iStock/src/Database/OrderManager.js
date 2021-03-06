//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

import DatabaseInfo from './DatabaseInfo';
import ThirdPartiesManager from './ThirdPartiesManager';
import OrderLinesManager from './OrderLinesManager';
import UserManager from './UserManager';
import OrderContactManager from './OrderContactManager';
import TokenManager from './TokenManager';
import moment from "moment";

let db;

const DATABASE_NAME = DatabaseInfo.DATABASE_NAME;
const DATABASE_VERSION = DatabaseInfo.DATABASE_VERSION;
const DATABASE_DISPLAY_NAME = DatabaseInfo.DATABASE_DISPLAY_NAME;
const DATABASE_SIZE = DatabaseInfo.DATABASE_SIZE;

const TABLE_NAME = "orders";
const COLUMN_ID = "id"; //INTEGER PRIMARY KEY AUTOINCREMENT
const COLUMN_COMMANDE_ID = "commande_id"; //INT(255)
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
    COLUMN_COMMANDE_ID + " INT(255)," +
    COLUMN_IS_SYNC + " INT(2)," +
    COLUMN_STATUT + " INT(2)," +
    COLUMN_REF_CLIENT + " INT(10)," +
    COLUMN_SOCID + " INT(10)," +
    COLUMN_USER_AUTHOR_ID + " INT(10)," +
    COLUMN_REF_COMMANDE + " VARCHAR(255)," +
    COLUMN_DATE_CREATION + " VARCHAR(255)," +
    COLUMN_DATE_COMMANDE + " VARCHAR(255)," +
    COLUMN_DATE_LIVRAISON + " INT(255)," +
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
    _TABLE_NAME_ = TABLE_NAME;
    _COLUMN_COMMANDE_ID_ = COLUMN_COMMANDE_ID;
    _COLUMN_REF_COMMANDE_ = COLUMN_REF_COMMANDE;

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
                        const insert = "INSERT INTO " + TABLE_NAME + " (" + COLUMN_ID + ", "+COLUMN_COMMANDE_ID+", " + COLUMN_IS_SYNC + ", " + COLUMN_STATUT + ", " + COLUMN_REF_CLIENT + ", " +COLUMN_SOCID + ", " +COLUMN_USER_AUTHOR_ID + ", " +COLUMN_REF_COMMANDE + ", " +COLUMN_DATE_CREATION + ", " +COLUMN_DATE_COMMANDE + ", " +COLUMN_DATE_LIVRAISON + ", " +COLUMN_NOTE_PUBLIC + ", " +COLUMN_NOTE_PRIVEE + ", " +COLUMN_TOTAL_HT + ", " +COLUMN_TOTAL_TVA + ", " +COLUMN_TOTAL_TTC + ", " +COLUMN_BROUILLION + ", " +COLUMN_REMISE_ABSOLUE + ", " +COLUMN_REMISE_PERCENT + ", " +COLUMN_REMISE +") VALUES (null, "+data_[x].id+", "+data_[x].isSync+", "+data_[x].statut+", '"+data_[x].ref_client+"', "+data_[x].socid+", "+data_[x].user_author_id+", '"+data_[x].ref+"', '"+data_[x].date+"', '"+data_[x].date_commande+"', "+(data_[x].date_livraison == "" ? "0000000001" : data_[x].date_livraison)+", '"+(data_[x].note_public != null ? data_[x].note_public.replace(/'/g, "''") : "")+"', '"+(data_[x].note_private != null ? data_[x].note_private.replace(/'/g, "''") : "")+"', '"+data_[x].total_ht+"', '"+data_[x].total_tva+"', '"+data_[x].total_ttc+"', '"+data_[x].brouillon+"', '"+data_[x].remise_absolue+"', '"+data_[x].remise_percent+"', '"+data_[x].remise+"')";
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

    async IS_ORDER_EXIST_BY_REF(ref){
        console.log("##### IS_ORDER_EXIST_BY_REF #########################");

        return await new Promise(async (resolve) => {
            let order = {};
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT * FROM "+TABLE_NAME+" WHERE "+COLUMN_REF_COMMANDE+" = '"+ref+"' LIMIT 1", []).then(async ([tx,results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        order = row;
                    }
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
                await resolve(order);
            }).catch(async (err) => {
                console.log(err);
                await resolve(null);
            });
        });
    }

    async GET_LIST(){
        console.log("##### GET_LIST #########################");
        const thirdPartiesManager = new ThirdPartiesManager();

        return await new Promise(async (resolve) => {
            const orders = [];
            await db.transaction(async (tx) => {
                const sql1 = "SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p";
                const sql2 = "SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +", t."+thirdPartiesManager._COLUMN_NAME_+" as client_name FROM " + TABLE_NAME + " as p, "+thirdPartiesManager._TABLE_NAME_+" as t WHERE p."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_;
                await tx.executeSql(sql1, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, client_name } = row;
                        orders.push({ id, commande_id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, client_name });
                    }
                    // console.log(orders);
                    await resolve(orders);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    async GET_CMD_IDS_LIST(){
        console.log("##### GET_CMD_IDS_LIST #########################");

        return await new Promise(async (resolve) => {
            const orders = [];
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+" FROM " + TABLE_NAME + " as p", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id } = row;
                        orders.push({ id, commande_id });
                    }
                    // console.log(products);
                    await resolve(orders);
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    async GET_ORDER_BY_ID(id){
        console.log("##### GET_ORDER_BY_ID #########################");

        return await new Promise(async (resolve) => {
            try{
                await db.transaction(async (tx) => {
                    await tx.executeSql("SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p WHERE p." + COLUMN_ID + " = " + id, [], async (tx, results) => {
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
                await tx.executeSql("SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p WHERE p."+COLUMN_STATUT+" = 1 AND p."+COLUMN_ID+" BETWEEN " + from + " AND " + to, []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise } = row;
                        products.push({ id, commande_id, is_sync, statut, ref_client, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise });
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

    async GET_ORDER_LIST_BETWEEN_v2(from, to){
        console.log("##### GET_ORDER_LIST_BETWEEN_v2 #########################");
        console.log("Fom => "+from+" | To => "+to);
        const olm = new OrderLinesManager();
        const thirdPartiesManager = new ThirdPartiesManager();
        const userManager = new UserManager();
        const orderContactManager = new OrderContactManager();

        return await new Promise(async (resolve) => {
            const orders = [];
            // const sql = "SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p." + COLUMN_IS_SYNC + ", p." + COLUMN_STATUT + ", p." + COLUMN_REF_CLIENT + ", p." +COLUMN_SOCID + ", p." +COLUMN_USER_AUTHOR_ID + ", p." +COLUMN_REF_COMMANDE + ", p." +COLUMN_DATE_CREATION + ", p." +COLUMN_DATE_COMMANDE + ", p." +COLUMN_DATE_LIVRAISON + ", p." +COLUMN_NOTE_PUBLIC + ", p." +COLUMN_NOTE_PRIVEE + ", p." +COLUMN_TOTAL_HT + ", p." +COLUMN_TOTAL_TVA + ", p." +COLUMN_TOTAL_TTC + ", p." +COLUMN_BROUILLION + ", p." +COLUMN_REMISE_ABSOLUE + ", p." +COLUMN_REMISE_PERCENT + ", p." +COLUMN_REMISE +" FROM " + TABLE_NAME + " as p WHERE p."+COLUMN_STATUT+" = 1 AND p."+COLUMN_ID+" BETWEEN " + from + " AND " + to;
            const sql = "SELECT c." + COLUMN_ID + ", c."+COLUMN_COMMANDE_ID+", c." + COLUMN_IS_SYNC + ", c." + COLUMN_STATUT + ", c." +COLUMN_SOCID + ", c." +COLUMN_USER_AUTHOR_ID + ", c." +COLUMN_REF_COMMANDE + ", c." +COLUMN_DATE_CREATION + ", c." +COLUMN_DATE_COMMANDE + ", c." +COLUMN_DATE_LIVRAISON + ", c." +COLUMN_NOTE_PUBLIC + ", c." +COLUMN_NOTE_PRIVEE + ", c." +COLUMN_TOTAL_HT + ", c." +COLUMN_TOTAL_TVA + ", c." +COLUMN_TOTAL_TTC + ", c." +COLUMN_BROUILLION + ", c." +COLUMN_REMISE_ABSOLUE + ", c." +COLUMN_REMISE_PERCENT + ", c." +COLUMN_REMISE +", t."+thirdPartiesManager._COLUMN_NAME_+" as client_name, (Select u_."+userManager._COLUMN_FIRSTNAME_+" || ' ' || u_."+userManager._COLUMN_LASTNAME_+" FROM user as u_ WHERE u_."+userManager._COLUMN_REF_+" = c."+COLUMN_USER_AUTHOR_ID+") as user, (Select uu.lastname FROM "+thirdPartiesManager._TABLE_NAME_+" as tt, "+userManager._TABLE_NAME_+" as uu, "+orderContactManager._TABLE_NAME_+" as oocc WHERE c.commande_id = oocc.element_id AND oocc.fk_socpeople = uu.ref ) as assinged, (SELECT COUNT(*) FROM "+olm._TABLE_NAME_+" as l WHERE l."+olm._COLUMN_ORDER_ID_+" = c."+COLUMN_COMMANDE_ID+" ) as lines_nb FROM " + TABLE_NAME + " as c, "+thirdPartiesManager._TABLE_NAME_+" as t, "+userManager._TABLE_NAME_+" as u, "+orderContactManager._TABLE_NAME_+" as oc WHERE c."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_+" AND c."+COLUMN_COMMANDE_ID+" = oc."+orderContactManager._COLUMN_ELEMENT_ID_+" AND oc."+orderContactManager._COLUMN_FK_SOPEOPLE_+" = u."+userManager._COLUMN_REF_+" ORDER BY c."+COLUMN_COMMANDE_ID+" DESC";
            await db.transaction(async (tx) => {
                await tx.executeSql(sql, []).then(async ([tx,results]) => {
                    console.log("Query completed");

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id, is_sync, statut, ref_client, client_name, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, user, assinged, lines_nb } = row;
                        orders.push({ id, commande_id, is_sync, statut, ref_client, client_name, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, user, assinged, lines_nb });
                    }
                    
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
                console.log("SQL => "+sql);
                // console.log("orders - 1 ", orders[0]);
                await resolve(orders);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    // filtered sql
    async GET_ORDER_LIST_BETWEEN_FILTER_v2(from, to, filteredConfig){
        console.log("##### GET_ORDER_LIST_BETWEEN_FILTER_v2 #########################");
        console.log("Fom => "+from+" | To => "+to);
        console.log("filteredConfig => ", filteredConfig);
        const olm = new OrderLinesManager();
        const thirdPartiesManager = new ThirdPartiesManager();
        const userManager = new UserManager();
        const orderContactManager = new OrderContactManager();

        const tokenManager = new TokenManager();
        await tokenManager.initDB();
        const token = await tokenManager.GET_TOKEN_BY_ID(1).then(async (val) => {
            return val;
        });

        let sql = "SELECT c." + COLUMN_ID + ", c."+COLUMN_COMMANDE_ID+", c." + COLUMN_IS_SYNC + ", c." + COLUMN_STATUT + ", c." +COLUMN_SOCID + ", c." +COLUMN_USER_AUTHOR_ID + ", c." +COLUMN_REF_COMMANDE + ", c." +COLUMN_DATE_CREATION + ", c." +COLUMN_DATE_COMMANDE + ", c." +COLUMN_DATE_LIVRAISON + ", c." +COLUMN_NOTE_PUBLIC + ", c." +COLUMN_NOTE_PRIVEE + ", c." +COLUMN_TOTAL_HT + ", c." +COLUMN_TOTAL_TVA + ", c." +COLUMN_TOTAL_TTC + ", c." +COLUMN_BROUILLION + ", c." +COLUMN_REMISE_ABSOLUE + ", c." +COLUMN_REMISE_PERCENT + ", c." +COLUMN_REMISE +", t."+thirdPartiesManager._COLUMN_NAME_+" as client_name, (Select u_."+userManager._COLUMN_FIRSTNAME_+" || ' ' || u_."+userManager._COLUMN_LASTNAME_+" FROM user as u_ WHERE u_."+userManager._COLUMN_REF_+" = c."+COLUMN_USER_AUTHOR_ID+") as user, (Select uu.lastname FROM "+thirdPartiesManager._TABLE_NAME_+" as tt, "+userManager._TABLE_NAME_+" as uu, "+orderContactManager._TABLE_NAME_+" as oocc WHERE c.commande_id = oocc.element_id AND oocc.fk_socpeople = uu.ref ) as assinged, (SELECT COUNT(*) FROM "+olm._TABLE_NAME_+" as l WHERE l."+olm._COLUMN_ORDER_ID_+" = c."+COLUMN_COMMANDE_ID+" ) as lines_nb FROM " + TABLE_NAME + " as c, "+thirdPartiesManager._TABLE_NAME_+" as t, "+userManager._TABLE_NAME_+" as u, "+orderContactManager._TABLE_NAME_+" as oc ";

        if(filteredConfig.startDate == null && filteredConfig.endDate == null){
            sql += "WHERE c."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_+" AND c."+COLUMN_COMMANDE_ID+" = oc."+orderContactManager._COLUMN_ELEMENT_ID_+" AND oc."+orderContactManager._COLUMN_FK_SOPEOPLE_+" = u."+userManager._COLUMN_REF_+" "+(filteredConfig.filterCMD == null ? "" : "AND c." + COLUMN_REF_COMMANDE + " LIKE '" + filteredConfig.filterCMD.toUpperCase() + "%'") + (filteredConfig.filterClient_id == null ? "" : (filteredConfig.filterCMD == null ? " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"" : " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"")) + (filteredConfig.filterRepresentant_id == null ? "" : (filteredConfig.filterCMD == null && filteredConfig.filterClient_id == null ? " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"" : " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"")) + " ORDER BY c."+COLUMN_COMMANDE_ID+" DESC";
        }

        if(filteredConfig.startDate != null && filteredConfig.endDate == null){
            sql += "WHERE c."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_+" AND c."+COLUMN_COMMANDE_ID+" = oc."+orderContactManager._COLUMN_ELEMENT_ID_+" AND oc."+orderContactManager._COLUMN_FK_SOPEOPLE_+" = u."+userManager._COLUMN_REF_+" "+(filteredConfig.filterCMD == null ? "" : "AND c." + COLUMN_REF_COMMANDE + " LIKE '" + filteredConfig.filterCMD.toUpperCase() + "%'") + (filteredConfig.filterClient_id == null ? "" : (filteredConfig.filterCMD == null ? " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"" : " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"")) + (filteredConfig.filterRepresentant_id == null ? "" : (filteredConfig.filterCMD == null && filteredConfig.filterClient_id == null ? " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"" : " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"")) + " AND c." + COLUMN_DATE_LIVRAISON + " != '' AND c." + COLUMN_DATE_LIVRAISON + " > "+ (Date.parse(filteredConfig.startDate) / 1000) + " ORDER BY c."+COLUMN_COMMANDE_ID+" DESC";
        }

        if(filteredConfig.startDate == null && filteredConfig.endDate != null){
            sql += "WHERE c."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_+" AND c."+COLUMN_COMMANDE_ID+" = oc."+orderContactManager._COLUMN_ELEMENT_ID_+" AND oc."+orderContactManager._COLUMN_FK_SOPEOPLE_+" = u."+userManager._COLUMN_REF_+" "+(filteredConfig.filterCMD == null ? "" : "AND c." + COLUMN_REF_COMMANDE + " LIKE '" + filteredConfig.filterCMD.toUpperCase() + "%'") + (filteredConfig.filterClient_id == null ? "" : (filteredConfig.filterCMD == null ? " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"" : " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"")) + (filteredConfig.filterRepresentant_id == null ? "" : (filteredConfig.filterCMD == null && filteredConfig.filterClient_id == null ? " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"" : " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"")) + " AND c." + COLUMN_DATE_LIVRAISON + " != '' AND c." + COLUMN_DATE_LIVRAISON + " < "+ (Date.parse(filteredConfig.endDate) / 1000) + " ORDER BY c."+COLUMN_COMMANDE_ID+" DESC";
        }

        if(filteredConfig.startDate != null && filteredConfig.endDate != null){
            sql += "WHERE c."+COLUMN_SOCID+" = t."+thirdPartiesManager._COLUMN_REF_+" AND c."+COLUMN_COMMANDE_ID+" = oc."+orderContactManager._COLUMN_ELEMENT_ID_+" AND oc."+orderContactManager._COLUMN_FK_SOPEOPLE_+" = u."+userManager._COLUMN_REF_+" "+(filteredConfig.filterCMD == null ? "" : "AND c." + COLUMN_REF_COMMANDE + " LIKE '" + filteredConfig.filterCMD.toUpperCase() + "%'") + (filteredConfig.filterClient_id == null ? "" : (filteredConfig.filterCMD == null ? " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"" : " AND t."+thirdPartiesManager._COLUMN_REF_+" = "+filteredConfig.filterClient_id+"")) + (filteredConfig.filterRepresentant_id == null ? "" : (filteredConfig.filterCMD == null && filteredConfig.filterClient_id == null ? " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"" : " AND u."+userManager._COLUMN_REF_+" = "+filteredConfig.filterRepresentant_id+"")) + " AND c." + COLUMN_DATE_LIVRAISON + " != '' AND c." + COLUMN_DATE_LIVRAISON + " > "+ (Date.parse(filteredConfig.startDate) / 1000)+ " AND c." + COLUMN_DATE_LIVRAISON + " < "+ (Date.parse(filteredConfig.endDate) / 1000) + " ORDER BY c."+COLUMN_COMMANDE_ID+" DESC";
        }

        console.log("SQL build => " , sql);

        return await new Promise(async (resolve) => {
            const orders = [];
            await db.transaction(async (tx) => {
                await tx.executeSql(sql, []).then(async ([tx,results]) => {
                    console.log("Query completed");

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { id, commande_id, is_sync, statut, ref_client, client_name, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, user, assinged, lines_nb } = row;
                        orders.push({ id, commande_id, is_sync, statut, ref_client, client_name, socId, user_author_id, ref_commande, date_creation, date_commande, date_livraison, note_public, note_privee, total_ht, total_tva, total_ttc, brouillon, remise_absolue, remise_percent, remise, user, assinged, lines_nb });
                    }
                });
            }).then(async (result) => {
                await resolve(orders);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }

    async GET_LAST_ORDER(){
        console.log("##### GET_LAST_ORDER #########################");
        return await new Promise(async (resolve) => {
            
            await db.transaction(async (tx) => {
                await tx.executeSql("SELECT p." + COLUMN_ID + ", p."+COLUMN_COMMANDE_ID+", p."+COLUMN_DATE_CREATION+" FROM " + TABLE_NAME + " as p LIMIT 1 ORDER BY c."+COLUMN_COMMANDE_ID+" DESC", []).then(async ([tx,results]) => {
                    console.log("Query completed");
                    await resolve(results.rows.item(0));
                });
            }).then(async (result) => {
                //await this.closeDatabase(db);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve([]);
            });
        });
    }
    

    // Update order
    async UPDATE_ORDER(orders){
        console.log("##### UPDATE_ORDER #########################");
        console.log("##### updating "+orders.length+" #########################");

        return await new Promise(async (resolve) => {
            try{
                for(let x = 0; x < orders.length; x++){
                    const order = orders[x];

                    const sql = "UPDATE "+TABLE_NAME+" SET "+
                    ""+COLUMN_IS_SYNC+" = 1, "+
                    ""+COLUMN_STATUT+" = "+order.statut+", "+
                    ""+COLUMN_REF_CLIENT+" = '"+order.ref_client+"', "+
                    ""+COLUMN_SOCID+" = "+order.socid+", "+
                    ""+COLUMN_USER_AUTHOR_ID+" = "+order.user_author_id+", "+
                    ""+COLUMN_REF_COMMANDE+" = '"+order.ref_commande+"', "+
                    ""+COLUMN_DATE_CREATION+" = '"+order.date_creation+"', "+
                    ""+COLUMN_DATE_COMMANDE+" = '"+order.date_commande+"', "+
                    ""+COLUMN_DATE_LIVRAISON+" = '"+order.date_livraison+"', "+
                    ""+COLUMN_NOTE_PUBLIC+" = '"+order.note_public+"', "+
                    ""+COLUMN_NOTE_PRIVEE+" = '"+order.note_private+"', "+
                    ""+COLUMN_TOTAL_HT+" = '"+order.total_ht+"', "+
                    ""+COLUMN_TOTAL_TVA+" = '"+order.total_tva+"', "+
                    ""+COLUMN_TOTAL_TTC+" = '"+order.total_ttc+"', "+
                    ""+COLUMN_BROUILLION+" = '"+order.brouillon+"', "+
                    ""+COLUMN_REMISE_ABSOLUE+" = '"+order.remise_absolue+"', "+
                    ""+COLUMN_REMISE_PERCENT+" = '"+order.remise_percent+"', "+
                    ""+COLUMN_REMISE+" = '"+order.remise+"' "+
                    "WHERE "+COLUMN_REF_COMMANDE+" = '" +order.ref_commande +"'";

                    await db.transaction(async (tx) => {
                        await tx.executeSql(sql, []);
                    });
                }
                await resolve(true);
            } catch(error){
                console.log("error: ", error);
                await resolve(false);
            }
        });
    }

    // Update image path
    async UPDATE_STATUS(order){
        console.log("##### UPDATE_STATUS #########################");

        return await new Promise(async (resolve) => {
            const sql = "UPDATE "+TABLE_NAME+" SET "+
            ""+COLUMN_STATUT+" = "+order.statut+" "+
            "WHERE "+COLUMN_COMMANDE_ID+" = '" +order.commande_id +"'";

            await db.transaction(async (tx) => {
                console.log(sql)
                await tx.executeSql(sql, []);

            }).then(async (result) => {
                await resolve(true);
            }).catch(async (err) => {
                console.log('err: ', err);
                await resolve(false);
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
export default OrderManager;
