import { Platform, PermissionsAndroid, Alert, BackHandler } from 'react-native';
import DefaultSettings from "./DefaultSettings";
const defaultSettings = new DefaultSettings();
import moment from "moment";

const RNFS = require('react-native-fs');
const myPermissions = [
	PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
];
// const LOGS_DIR_PATH = RNFS.DocumentDirectoryPath + '/iStock/logs/';
// const LOGS_DIR_PATH_EXT = RNFS.ExternalDirectoryPath + "/iStock/logs"; 
// const LOGS_DIR_PATH_EXT = RNFS.ExternalStorageDirectoryPath + "/iStock/logs";
const LOGS_DIR_PATH_EXT = RNFS.ExternalStorageDirectoryPath + "/iStock/logs";
const LOG_FILE = "LOG_iStock-v"+defaultSettings.VERSION+"_" + moment().format('YYYY-MM-DD') + "_.txt";
const LOG_DIR_FILE = LOGS_DIR_PATH_EXT + "/" + LOG_FILE;
const PREFIX = "txt";
const LOG_TYPE = {
	SQL: "SQL",
	URL: "URL",
	INFO: "INFO",
	WARNING: "WARNING",
	ERROR: "ERROR",
	CRITICAL: "CRITICAL",
};

async function writeInitLog(type_, class_, method_){
	const c = await checkPermissions();
	if(!c){
		return false;
	}
	
	if (await RNFS.exists(LOG_DIR_FILE)) {
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : Init...", 'utf8');
	} else {
		await RNFS.writeFile(LOG_DIR_FILE, defaultSettings.LOG_HEADER, 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : Init...", 'utf8');
	}
}

async function writeBackInitLog(type_, class_, method_){
	const c = await checkPermissions();
	if(!c){
		return false;
	}

	if (await RNFS.exists(LOG_DIR_FILE)) {
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : Init ===> back on the screen...", 'utf8');
	} else {
		await RNFS.writeFile(LOG_DIR_FILE, defaultSettings.LOG_HEADER, 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : ####################", 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : Init ===> back on the screen...", 'utf8');
	}
}

async function writeLog(type_, class_, method_, data_){
	const c = await checkPermissions();
	if(!c){
		return false;
	}

	if (await RNFS.exists(LOG_DIR_FILE)) {
		await RNFS.appendFile(LOG_DIR_FILE, "\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : " + data_, 'utf8');
	} else {
		await RNFS.writeFile(LOG_DIR_FILE, defaultSettings.LOG_HEADER, 'utf8');
		await RNFS.appendFile(LOG_DIR_FILE, "\n\n##### " + moment().format('DD/MM/YYYY-hh:mm:ss a') + " | " + type_ + " | " + class_ + " -> " + method_ + " : " + data_, 'utf8');
	}
}

async function creatLogDir(){
	const p = await permissions();
	if(!p){
		return false;
	}

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
			await resolve(true);
		}).catch(async (err) => {
			console.log("MyLogs path ERROR : ", LOGS_DIR_PATH_EXT, err);
			await resolve(false);
		});
		await RNFS.mkdir(LOGS_DIR_PATH_EXT).then(async (success) => {
			console.log("MyLogs path : ", LOGS_DIR_PATH_EXT, "Created!");
			await resolve(true);
		}).catch(async (err) => {
			console.log("MyLogs folder creation ERROR : ", LOGS_DIR_PATH_EXT, err);
			console.log("MyLogs RNFS : ", LOGS_DIR_PATH_EXT, RNFS);
			await resolve(false);
		});
	});
}

async function checkPermissions(){
	let final = true;
	for(let i=0; i<myPermissions.length; i++){
		const p = await PermissionsAndroid.check(myPermissions[i]);
		if(!p){
			final = false;
			break;
		}
	}
	return final;
}

async function permissions() {
	// We need to ask permission for Android only
    if (Platform.OS === 'android') {

		// Calling the permission function
		const granted = await PermissionsAndroid.requestMultiple(myPermissions);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			// Permission Granted
			console.log("Permission Granted", granted);
			return true;
		} else {
			// Permission Denied

			const c = await checkPermissions();
			if(c){
				return true;
			}

			Alert.alert(
				"Fermeture iStock",
				"Autorisation de stockage refusée, fermeture de l'application...",
				[
				  { text: 'Ok', onPress: () => {
						setTimeout(() => { 
							BackHandler.exitApp(); 
						}, 2000);
					} 
				  },
				],
				{ cancelable: false }
			);

			return false;
		}
	}
}

module.exports = {
	LOG_TYPE,
	writeInitLog,
	writeBackInitLog,
	writeLog,
	creatLogDir
}