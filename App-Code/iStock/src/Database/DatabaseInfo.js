const RNFS = require('react-native-fs');
export default DatabaseInfo = {
    DATABASE_NAME: RNFS.ExternalCachesDirectoryPath + "/database/iStock.db",
    DATABASE_VERSION: "1.0",
    DATABASE_DISPLAY_NAME: "iStock_db",
    DATABASE_SIZE: "200000",
    DATABASE_BACKUP_LOCATION: RNFS.ExternalCachesDirectoryPath + "/database/iStock_backup.db"
}
