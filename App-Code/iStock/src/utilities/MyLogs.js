//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultSettings from "./DefaultSettings";
const defaultSettings = new DefaultSettings();
import moment from "moment";

const RNFS = require('react-native-fs');
const LOGS_DIR_PATH = RNFS.DocumentDirectoryPath + '/iStock/logs/';
const LOGS_DIR_PATH_EXT = RNFS.ExternalStorageDirectoryPath + "/iStock/logs";   // ExternalStorageDirectoryPath
const LOG_FILE = "LOG_iStock-v"+defaultSettings.VERSION+"_" + moment().format('YYYY-MM-DD') + "_.txt";
const LOG_DIR_FILE = LOGS_DIR_PATH_EXT + "/" + LOG_FILE;
const PREFIX = "txt";
const LOG_TYPE = {
	SQL: "SQL",
	INFO: "INFO",
	WARNING: "WARNING",
	ERROR: "ERROR",
	CRITICAL: "CRITICAL",
};

async function writeLog(type_, class_, method_, data_){
	if (await RNFS.exists(LOG_DIR_FILE)) {
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : " + data_, 'utf8');
	} else {
		await RNFS.writeFile(LOG_DIR_FILE, defaultSettings.LOG_HEADER, 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : " + data_, 'utf8');
	}
}

async function creatLogDir(){
	return await new Promise(async (resolve) => {
		await RNFS.readDir(LOGS_DIR_PATH_EXT).then(async (result) => {
			console.log('ls ', LOGS_DIR_PATH_EXT, result);  // using result[0].mtime to filter my 5 recent log files
			await result.forEach(async (element) => {
				console.log( moment().format('DD/MM/YYYY-hh:mm:ss a')," < ", moment(element.mtime).add(5, 'days').format('DD/MM/YYYY-hh:mm:ss a') );
				if(moment() < moment(element.mtime).add(5, 'days') ){
					console.log("dont delete log");
				}else{
					await RNFS.unlink(element.path).then(async (result) => {
						console.log("Log => ",element.path, "deleted!");
						console.log(result);
					});
				}
			});
		}).catch(async (err) => {
			console.log("MyLogs folder creation ERROR : ", LOGS_DIR_PATH_EXT, err);
			return await resolve(false);
		});
		await RNFS.mkdir(LOGS_DIR_PATH_EXT).then(async (success) => {
			console.log("MyLogs path : ", LOGS_DIR_PATH_EXT, "Created!");
			return await resolve(true);
		}).catch(async (err) => {
			console.log("MyLogs path creation ERROR : ", LOGS_DIR_PATH_EXT, err);
			return await resolve(false);
		});
	});
}

module.exports = {
	LOG_TYPE,
	writeLog,
	creatLogDir
}