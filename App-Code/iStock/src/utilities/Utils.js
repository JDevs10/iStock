function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}

function checkObjExistInDetailBatchList(obj, list) {
    for (var index = 0; index < list.length; index++) {
        if (list[index].batch === obj.batch && list[index].entrepot_id === obj.entrepot && list[index].fk_origin_stock === obj.fk_origin_stock) {
            return true;
        }
    }
    return false;
}

function checkObjExistInSelectedProductWarehouse(obj, list) {
    for (var index = 0; index < list.length; index++) {

        console.log("checkObjExistInSelectedProductWarehouse :=> ",list[index].batch, obj.batch, "|", list[index].entrepot_id, obj.entrepot_id,"|", list[index].fk_origin_stock, obj.fk_origin_stock);

        if (list[index].batch === obj.batch && list[index].entrepot_id === obj.entrepot_id && list[index].fk_origin_stock === obj.fk_origin_stock) {
            return true;
        }
    }
    return false;
}
 

module.exports = {
    containsObject,
    checkObjExistInDetailBatchList,
    checkObjExistInSelectedProductWarehouse
}