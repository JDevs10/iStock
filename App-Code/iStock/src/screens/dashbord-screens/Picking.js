//import liraries
import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import CheckBox  from '@react-native-community/checkbox';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import NavbarPicking from '../../navbar/NavbarPicking';
import PickingButton from './assets/PickingButton';
import MyFooter_v2 from '../footers/MyFooter_v2';
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import { checkObjExistInDetailBatchList, checkObjExistInSelectedProductWarehouse } from '../../utilities/Utils';
import ShipmentsManager from '../../Database/ShipmentsManager';
import ShipmentLinesManager from '../../Database/ShipmentLinesManager';
import ShipmentLineDetailBatchManager from '../../Database/ShipmentLineDetailBatchManager';
import Toast from 'react-native-simple-toast';


// create a component
class Picking extends Component {
    constructor(props) {
        super(props);
    
        /**
         * Returns true if the screen is in portrait mode
         */
        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };
    
        /**
        * Returns true of the screen is in landscape mode
        */
        const isLandscape = () => {
            const dim = Dimensions.get('screen');
            return dim.width >= dim.height;
        };
    
        this.state = {
            isPopUpVisible: false,
            isLoading: true,
            data: [],
            lastSelectedProductBatch: "",
            pickingDataSelected: {
                _opacity_: 1,
                pickingPickOption: 1,
                pickingMaxLimit: 0,
                pickingMimLimit: 0,
                product: {}
            },
            orientation: isPortrait() ? 'portrait' : 'landscape',
        };
        
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    componentDidMount(){
        this.getData();
        this.updateDataInfo();     

        this.listener = this.props.navigation.addListener('focus', () => {
            // Prevent default action
            this.getData();
            this.updateDataInfo();
            return;
        });
    }

    getData(){
        const pickingDataSelected = this.props.route.params.pickingDataSelected;
        const state = this.state;
        state.cmd_header = this.props.route.params.cmd_header;

        // console.log("pickingDataSelected ", JSON.stringify(pickingDataSelected));

        state.pickingDataSelected = pickingDataSelected;
        
        const prepare_shipping_qty = parseInt(pickingDataSelected.product.prepare_shipping_qty);
        pickingDataSelected.product.prepare_shipping_qty = prepare_shipping_qty;
        // this.setState({
        //     addRemoveNothing: pickingDataSelected.product.prepare_shipping_qty,
        //     pickingDataSelected: pickingDataSelected
        // });
        // console.log("pickingDataSelected", this.state.pickingDataSelected);
        // console.log("productLotDlcDluoData", this.state.pickingDataSelected.productLotDlcDluoData);
        state.isLoading = false;
        this.setState(state);
    }

    updateDataInfo(){
        //set layout to default
        const state = this.state;
        let _prepare_ = 0;

        state.pickingDataSelected.product.productLotDlcDluoData.forEach((item, index) => {
            item.isBatchSelected = false,
            item.styles = [{
                backgroundColor: "#DBDBDB"
            }]
        });

        //check is product have saved selected warehouses to load
        // console.log("state.pickingDataSelected.product.selectedProductWarehouse ", JSON.stringify(state.pickingDataSelected.product.selectedProductWarehouse));

        if(state.pickingDataSelected.product.selectedProductWarehouse.length > 0){

            //load different selected batches in the list with styles
            state.pickingDataSelected.product.productLotDlcDluoData.forEach((item, index) => {
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    
                    if(item.batch == _item_.batch){
                        _prepare_ = _prepare_ + _item_.qty;
                        item.prepare = _item_.qty;
                        item.isBatchSelected = true,
                        item.styles = [{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#00AAFF"
                        }];
                    }

                });
            });
        }

        state.addRemoveNothing = _prepare_;
        state.pickingDataSelected.product.prepare_shipping_qty = _prepare_;
        this.setState(state);
    }

    selectProductWarehouse(item, index){
        const state = this.state;

        //set layout to default
        state.pickingDataSelected.product.productLotDlcDluoData.forEach((_item_, _index_) => {
            if(item.batch == _item_.batch){
                item.isBatchSelected = true,
                item.styles = [{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#00AAFF"
                }];
            }
        });

        //save selected batch in selectedProductWarehouse array
        //check if batch existe in list

        // console.log("state.pickingDataSelected.product.selectedProductWarehouse.length ", state.pickingDataSelected.product.selectedProductWarehouse.length);

        if(state.pickingDataSelected.product.selectedProductWarehouse.length > 0){
            if(!checkObjExistInDetailBatchList(item, state.pickingDataSelected.product.selectedProductWarehouse)){
                const newItem = {
                    fk_origin_stock: item.fk_origin_stock,
                    stock: item.stock,
                    fk_product: item.fk_product,
                    qty: item.prepare,
                    batch: item.batch,
                    sellby: item.sellby,
                    eatby: item.eatby,
                    entrepot_label: item.entrepot_label,
                    entrepot_id: item.entrepot,
                    fk_expeditiondet: state.pickingDataSelected.product.id,
                };
                state.lastSelectedProductBatch = item.batch;
                state.pickingDataSelected.product.selectedProductWarehouse.push(newItem);
            }
            else{
                state.lastSelectedProductBatch = item.batch;
            }
        }
        else{
            const newItem = {
                fk_origin_stock: item.fk_origin_stock,
                stock: item.stock,
                fk_product: item.fk_product,
                qty: item.prepare,
                batch: item.batch,
                sellby: item.sellby,
                eatby: item.eatby,
                entrepot_label: item.entrepot_label,
                entrepot_id: item.entrepot,
                fk_expeditiondet: state.pickingDataSelected.product.id,
            };
            state.lastSelectedProductBatch = item.batch;
            state.pickingDataSelected.product.selectedProductWarehouse.push(newItem);
        }
        
        state.isShowNextPick = true;
        this.setState(state);
    }

    unSelectProductWarehouse(item, index) {
        const state = this.state;
        let _prepare_ = 0;
        
        // set layout item to unselect
        state.pickingDataSelected.product.productLotDlcDluoData.forEach((_item_, _index_) => {
            if(item.batch == _item_.batch){
                
                // console.log("_prepare_ -- ", _prepare_, _item_.prepare);

                _prepare_ = ((_prepare_ - _item_.prepare) < 0 ? ((_prepare_ + _item_.prepare) - _item_.prepare) : (_prepare_ - _item_.prepare));
                item.prepare = 0;
                item.isBatchSelected = false,
                item.styles = [{
                    backgroundColor: "#DBDBDB"
                }]
            }
            else{
                // console.log("_prepare_ ++ ", _prepare_, _item_.prepare);

                _prepare_ = _prepare_ + _item_.prepare;
            }
        });

        // console.log("_prepare_ ", _prepare_);
        // console.log("itemitemitem ", item);
        // console.log("state.pickingDataSelected.product.selectedProductWarehouse.length b :: ", state.pickingDataSelected.product.selectedProductWarehouse.length);

        const newList = state.pickingDataSelected.product.selectedProductWarehouse.filter(p => p.batch != state.lastSelectedProductBatch);
        state.pickingDataSelected.product.selectedProductWarehouse = newList;
        // console.log("state.pickingDataSelected.product.selectedProductWarehouse.length a :: ", state.pickingDataSelected.product.selectedProductWarehouse.length);

        state.isShowNextPick = false;
        state.lastSelectedProductBatch = "";
        state.addRemoveNothing = _prepare_;
        state.pickingDataSelected.product.prepare_shipping_qty = _prepare_;
        this.setState(state);
    }

    add_100_ToTextInput(item) {
        const ADD = 100;
        if( item.qty >= (item.prepare_shipping_qty + ADD)){
            let isBatchMax = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == _item_.stock){
                    isBatchMax = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare + ADD) <= _item_.stock){
                    _item_.prepare = _item_.prepare + ADD;
                }
            });

            // check if lot item stock is max with detail batch stock
            if(!isBatchMax){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty + ADD) <= _item_.stock){
                        _item_.qty = _item_.qty + ADD;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty + ADD
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + ADD;
                console.log("add :=> "+item.prepare_shipping_qty);
            }
        }
    }
    add_50_ToTextInput(item) {
        const ADD = 50;
        if( item.qty >= (item.prepare_shipping_qty + ADD)){
            let isBatchMax = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == _item_.stock){
                    isBatchMax = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare + ADD) <= _item_.stock){
                    _item_.prepare = _item_.prepare + ADD;
                }
            });

            // check if lot item stock is max with detail batch stock
            if(!isBatchMax){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty + ADD) <= _item_.stock){
                        _item_.qty = _item_.qty + ADD;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty + ADD
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + ADD;
                console.log("add :=> "+item.prepare_shipping_qty);
            }
        }
    }
    add_10_ToTextInput(item) {
        const ADD = 10;
        if( item.qty >= (item.prepare_shipping_qty + ADD)){
            let isBatchMax = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == _item_.stock){
                    isBatchMax = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare + ADD) <= _item_.stock){
                    _item_.prepare = _item_.prepare + ADD;
                }
            });

            // check if lot item stock is max with detail batch stock
            if(!isBatchMax){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty + ADD) <= _item_.stock){
                        _item_.qty = _item_.qty + ADD;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty + ADD
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + ADD;
                console.log("add :=> "+item.prepare_shipping_qty);
            }
        }
    }
    add_1_ToTextInput(item) {
        const ADD = 1;
        if( item.qty >= (item.prepare_shipping_qty + ADD)){
            let isBatchMax = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == _item_.stock){
                    isBatchMax = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare + ADD) <= _item_.stock){
                    _item_.prepare = _item_.prepare + ADD;
                }
            });

            // check if lot item stock is max with detail batch stock
            if(!isBatchMax){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty + ADD) <= _item_.stock){
                        _item_.qty = _item_.qty + ADD;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty + ADD
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + ADD;
                console.log("add :=> "+item.prepare_shipping_qty);
            }
        }
    }
    remove_1_ToTextInput(item) {
        const REMOVE = 1;
        if((item.prepare_shipping_qty - REMOVE) >= 0){
            var isBatchMim = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == 0){
                    isBatchMim = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare - REMOVE) >= 0){
                    _item_.prepare = _item_.prepare - REMOVE;
                }
            });

            // check if lot item stock is max with detail batch stock
            console.log("isBatchMim :=> ",isBatchMim);
            if(!isBatchMim){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty - REMOVE) >= 0){
                        _item_.qty = _item_.qty - REMOVE;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty - REMOVE
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - REMOVE;
                console.log("REMOVE :=> "+item.prepare_shipping_qty);
            }
            else{

                //check if contains in selectedProductWarehouse list
                const newList = state.pickingDataSelected.product.selectedProductWarehouse.filter(p => p.batch != state.lastSelectedProductBatch);
                state.pickingDataSelected.product.selectedProductWarehouse = newList;
                console.log("item.selectedProductWarehouse remove :=> ", state.pickingDataSelected.product.selectedProductWarehouse);
                this.setState(state);
            }
        }
    }
    remove_10_ToTextInput(item) {
        const REMOVE = 10;
        if((item.prepare_shipping_qty - REMOVE) >= 0){
            var isBatchMim = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == 0){
                    isBatchMim = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare - REMOVE) >= 0){
                    _item_.prepare = _item_.prepare - REMOVE;
                }
            });

            // check if lot item stock is max with detail batch stock
            console.log("isBatchMim :=> ",isBatchMim);
            if(!isBatchMim){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty - REMOVE) >= 0){
                        _item_.qty = _item_.qty - REMOVE;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty - REMOVE
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - REMOVE;
                console.log("REMOVE :=> "+item.prepare_shipping_qty);
            }
            else{

                //check if contains in selectedProductWarehouse list
                const newList = state.pickingDataSelected.product.selectedProductWarehouse.filter(p => p.batch != state.lastSelectedProductBatch);
                state.pickingDataSelected.product.selectedProductWarehouse = newList;
                console.log("item.selectedProductWarehouse remove :=> ", state.pickingDataSelected.product.selectedProductWarehouse);
                this.setState(state);
            }
        }
    }
    remove_50_ToTextInput(item) {
        const REMOVE = 50;
        if((item.prepare_shipping_qty - REMOVE) >= 0){
            var isBatchMim = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == 0){
                    isBatchMim = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare - REMOVE) >= 0){
                    _item_.prepare = _item_.prepare - REMOVE;
                }
            });

            // check if lot item stock is max with detail batch stock
            console.log("isBatchMim :=> ",isBatchMim);
            if(!isBatchMim){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty - REMOVE) >= 0){
                        _item_.qty = _item_.qty - REMOVE;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty - REMOVE
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - REMOVE;
                console.log("REMOVE :=> "+item.prepare_shipping_qty);
            }
            else{

                //check if contains in selectedProductWarehouse list
                const newList = state.pickingDataSelected.product.selectedProductWarehouse.filter(p => p.batch != state.lastSelectedProductBatch);
                state.pickingDataSelected.product.selectedProductWarehouse = newList;
                console.log("item.selectedProductWarehouse remove :=> ", state.pickingDataSelected.product.selectedProductWarehouse);
                this.setState(state);
            }
        }
    }
    remove_100_ToTextInput(item) {
        const REMOVE = 100;
        if((item.prepare_shipping_qty - REMOVE) >= 0){
            var isBatchMim = false;

            //check && update lot list
            const state = this.state;
            item.productLotDlcDluoData.forEach((_item_, _index_) => {
                if(state.lastSelectedProductBatch == _item_.batch && _item_.prepare == 0){
                    isBatchMim = true;
                    return;
                }

                if(state.lastSelectedProductBatch == _item_.batch && (_item_.prepare - REMOVE) >= 0){
                    _item_.prepare = _item_.prepare - REMOVE;
                }
            });

            // check if lot item stock is max with detail batch stock
            console.log("isBatchMim :=> ",isBatchMim);
            if(!isBatchMim){

                //check && update lot list
                state.pickingDataSelected.product.selectedProductWarehouse.forEach((_item_, _index_) => {
                    if(state.lastSelectedProductBatch == _item_.batch && (_item_.qty - REMOVE) >= 0){
                        _item_.qty = _item_.qty - REMOVE;
                    }
                });

                console.log("item.selectedProductWarehouse :=> ", state.pickingDataSelected.product.selectedProductWarehouse);

                state.addRemoveNothing = item.prepare_shipping_qty - REMOVE
                this.setState(state);

                item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - REMOVE;
                console.log("REMOVE :=> "+item.prepare_shipping_qty);
            }
            else{

                //check if contains in selectedProductWarehouse list
                const newList = state.pickingDataSelected.product.selectedProductWarehouse.filter(p => p.batch != state.lastSelectedProductBatch);
                state.pickingDataSelected.product.selectedProductWarehouse = newList;
                console.log("item.selectedProductWarehouse remove :=> ", state.pickingDataSelected.product.selectedProductWarehouse);
                this.setState(state);
            }
        }
    }


    async _onPickingDone(){
        const cmd_header = this.state.cmd_header;
        const product = this.state.pickingDataSelected.product;
        console.log("_onPickingDone :====> ", JSON.stringify(product));

        
        if(product.selectedProductWarehouse.length > 0){
            // check if a shipment draft exist for this order
            // check if shipment obj exist in db
            const sm = new ShipmentsManager();
            await sm.initDB();
            const isShipment = await sm.GET_SHIPMENTS_BY_ORIGIN(product.fk_commande).then(async (val) => {
                return val;
            });


            if(isShipment == null){
                // create shipment obj & array lines
                const SHIPMENT = {
                    id: "null",
                    shipment_id: "null",
                    ref: "SH-PROV-"+moment(),
                    project_id: "null",
                    socid: cmd_header.socId,
                    origin_id: product.fk_commande,
                    origin:"commande",
                    entrepot_id: "null",
                    projectid: "null",
                    shipping_method_id: 2,
                    shipping_method: "Génerict Transport", 
                    user_author_id: 1, // need current user token id
                    origin_type: (product.origin_type == null ? "null" : product.origin_type),
                    weight: (product.weight == null ? "0" : product.weight),
                    weight_units: (product.weight_units == null ? "0" : product.weight_units),
                    size_w: (product.sizeW == null ? "0" : product.sizeW),
                    width_units: (product.width_units == null ? "0" : product.width_units),
                    size_h: (product.sizeH == null ? "0" : product.sizeH),
                    height_units: (product.height_units == null ? "0" : product.height_units),
                    size_s: (product.sizeS == null ? "0" : product.sizeS),
                    depth_units: (product.depth_units == null ? "0" : product.depth_units),
                    true_size: "xx",
                    date_creation: parseInt(new Date().getTime()/1000), // get current timestamp in seconds
                    date_delivery: (cmd_header.date_livraison == null ? "null" : cmd_header.date_livraison),
                    tracking_number: (product.tracking_number == null ? "null" : product.tracking_number),
                    tracking_url: (product.tracking_url == null ? "null" : product.tracking_url),
                    statut: 0, //brouillion / draft
                    is_synchro: "false", // 0 => false | 1 => true
                };
        
                console.log('SHIPMENT', SHIPMENT);

                //insert to db header
                const isShipment_ = await sm.INSERT_SHIPMENTS([SHIPMENT]).then(async (val) => {
                    return val;
                });

                const insertedShipment = await sm.GET_SHIPMENTS_BY_ORIGIN(cmd_header.commande_id).then(async (val) => {
                    return val;
                });


                //insert shipment lines of each different detail batch entrepot_id
                const numberOfLines = [];
                const SHIPMENT_LINES = [];

                const selectedProductWarehouse = product.selectedProductWarehouse;
                for(let x=0; x<selectedProductWarehouse.length; x++){
                    const detail_batch = selectedProductWarehouse[x];

                    const obj = {
                        fk_origin_stock: detail_batch.fk_origin_stock,
                        stock: detail_batch.stock,
                        fk_product: detail_batch.fk_product,
                        qty: detail_batch.qty,
                        batch: detail_batch.batch,
                        sellby: detail_batch.sellby,
                        eatby: detail_batch.eatby,
                        entrepot_label: detail_batch.entrepot_label,
                        entrepot_id: detail_batch.entrepot_id,
                        fk_expeditiondet: "null", // reset when line is inserted
                        id: "null"
                    }
                    
                    if(numberOfLines.length > 0){
                        if(!numberOfLines.includes(obj.entrepot_id)){
                            // create line && detail_batch obj
                            const line = {
                                rang: product.rang,
                                qty: obj.qty, // update if entrepot_id exist in numberOfLines
                                entrepot_id: obj.entrepot_id,
                                fk_expedition: insertedShipment.id,
                                origin_line_id: product.order_line_id,
                                shipment_id: insertedShipment.id,
                                id: "null",
                                detail_batch: [obj]
                            };
                            numberOfLines.push(line.entrepot_id);
                            SHIPMENT_LINES.push(line);
                        }
                        else{
                            // loop in SHIPMENT_LINES
                            // find SHIPMENT_LINES[x].entrepot_id == detail_batch.entrepot_id
                            // update line qty && push detail_batch obj in array
                            await SHIPMENT_LINES.forEach((item, index) => {
                                if(item.entrepot_id == obj.entrepot_id){

                                    item.qty = item.qty + obj.qty;
                                    item.detail_batch.push(obj);
                                }
                            });
                        }
                    }
                    else{
                        // create line && detail_batch obj
                        const line = {
                            rang: product.rang,
                            qty: obj.qty, // update if entrepot_id exist in numberOfLines
                            entrepot_id: obj.entrepot_id,
                            fk_expedition: insertedShipment.id,
                            origin_line_id: product.order_line_id,
                            shipment_id: insertedShipment.id,
                            id: "null",
                            detail_batch: [obj]
                        };
                        numberOfLines.push(line.entrepot_id);
                        SHIPMENT_LINES.push(line);
                    }
                }


                console.log('SHIPMENT_LINES ==> ', JSON.stringify(SHIPMENT_LINES));

                const slm = new ShipmentLinesManager();
                await slm.initDB();
                const isShipmentLines_ = await slm.INSERT_SHIPMENT_LINES(SHIPMENT_LINES).then(async (val) => {
                    return val;
                });


                if(isShipment_ && isShipmentLines_){
                    // alert("Expédition créé !");
                    Toast.showWithGravity('Expédition créé !', Toast.LONG, Toast.TOP);
                }else{
                    // alert("Expédition non créé !");
                    Toast.showWithGravity('Expédition non créé !', Toast.LONG, Toast.TOP);
                }
            }
            else{
                
                //shipment existe so check picked line
                const slm = new ShipmentLinesManager();
                await slm.initDB();
                const isShipmentLine = await slm.GET_SHIPMENT_LINE_BY_ORIGIN_LINE_ID(product.order_line_id).then(async (val) => {
                    return val;
                });


                // Check shipment line
                if(isShipmentLine == null && isShipmentLine.length == 0){

                    //if shipment line does not exist
                    //insert shipment lines of each different detail batch entrepot_id
                    const numberOfLines = [];
                    const SHIPMENT_LINES = [];

                    const selectedProductWarehouse = product.selectedProductWarehouse;
                    for(let x=0; x<selectedProductWarehouse.length; x++){
                        const detail_batch = selectedProductWarehouse[x];

                        const obj = {
                            fk_origin_stock: detail_batch.fk_origin_stock,
                            stock: detail_batch.stock,
                            fk_product: detail_batch.fk_product,
                            qty: detail_batch.qty,
                            batch: detail_batch.batch,
                            sellby: detail_batch.sellby,
                            eatby: detail_batch.eatby,
                            entrepot_label: detail_batch.entrepot_label,
                            entrepot_id: detail_batch.entrepot_id,
                            fk_expeditiondet: "null", // reset when line is inserted
                            id: "null"
                        }
                        
                        if(numberOfLines.length > 0){
                            if(!numberOfLines.includes(obj.entrepot_id)){
                                // create line && detail_batch obj
                                const line = {
                                    rang: product.rang,
                                    qty: obj.qty, // update if entrepot_id exist in numberOfLines
                                    entrepot_id: obj.entrepot_id,
                                    fk_expedition: isShipment.id,
                                    origin_line_id: product.order_line_id,
                                    shipment_id: isShipment.id,
                                    id: "null",
                                    detail_batch: [obj]
                                };
                                await numberOfLines.push(line.entrepot_id);
                                await SHIPMENT_LINES.push(line);
                            }
                            else{
                                // loop in SHIPMENT_LINES
                                // find SHIPMENT_LINES[x].entrepot_id == detail_batch.entrepot_id
                                // update line qty && push detail_batch obj in array
                                await SHIPMENT_LINES.forEach((item, index) => {
                                    if(item.entrepot_id == obj.entrepot_id){

                                        item.qty = item.qty + obj.qty;
                                        item.detail_batch.push(obj);
                                    }
                                });
                            }
                        }
                        else{
                            // create line && detail_batch obj
                            const line = {
                                rang: product.rang,
                                qty: obj.qty, // update if entrepot_id exist in numberOfLines
                                entrepot_id: obj.entrepot_id,
                                fk_expedition: isShipment.id,
                                origin_line_id: product.order_line_id,
                                shipment_id: isShipment.id,
                                id: "null",
                                detail_batch: [obj]
                            };
                            await numberOfLines.push(line.entrepot_id);
                            await SHIPMENT_LINES.push(line);
                        }
                    }


                    console.log('SHIPMENT_LINES ==> ', JSON.stringify(SHIPMENT_LINES));

                    const isShipmentLines_ = await slm.INSERT_SHIPMENT_LINES(SHIPMENT_LINES).then(async (val) => {
                        return val;
                    });
                    
                    if(isShipmentLines_){
                        // alert("Produit ajouté dans l'expédition !");
                        Toast.showWithGravity("Produit ajouté dans l'expédition !", Toast.LONG, Toast.TOP);
                    }else{
                        // alert("Produit non ajouté dans l'expédition !");
                        Toast.showWithGravity("Produit non ajouté dans l'expédition !", Toast.LONG, Toast.TOP);
                    }

                }
                else{
                    console.log("============================================> ", JSON.stringify(isShipmentLine));

                    // shipment lines exist for origin_line_id
                    // so remove shipment lines && detail_batch lines of product origin_line_id
                    const sldbm = new ShipmentLineDetailBatchManager();
                    await sldbm.initDB();
                    
                    const isRemoveShipmentLineDetailBatch = await sldbm.DELETE_SHIPMENT_LINE_DETAIL_BATCH_BY_FK_PRODUCT(product.product_id).then(async (val) => {
                        return await val;
                    });

                    const isRemoveShipmentLines = await slm.DELETE_SHIPMENT_LINES_BY_ORIGIN_LINE_ID(product.order_line_id).then(async (val) => {
                        return await val;
                    });

                    //insert shipment lines of each different detail batch entrepot_id
                    const numberOfLines = [];
                    const SHIPMENT_LINES = [];

                    const selectedProductWarehouse = product.selectedProductWarehouse;
                    for(let x=0; x<selectedProductWarehouse.length; x++){
                        const detail_batch = selectedProductWarehouse[x];

                        const obj = {
                            fk_origin_stock: detail_batch.fk_origin_stock,
                            stock: detail_batch.stock,
                            fk_product: detail_batch.fk_product,
                            qty: detail_batch.qty,
                            batch: detail_batch.batch,
                            sellby: detail_batch.sellby,
                            eatby: detail_batch.eatby,
                            entrepot_label: detail_batch.entrepot_label,
                            entrepot_id: detail_batch.entrepot_id,
                            fk_expeditiondet: "null", // reset when line is inserted
                            id: "null"
                        }
                        
                        if(numberOfLines.length > 0){
                            if(!numberOfLines.includes(obj.entrepot_id)){
                                // create line && detail_batch obj
                                const line = {
                                    rang: product.rang,
                                    qty: obj.qty, // update if entrepot_id exist in numberOfLines
                                    entrepot_id: obj.entrepot_id,
                                    fk_expedition: isShipment.id,
                                    origin_line_id: product.order_line_id,
                                    shipment_id: isShipment.id,
                                    id: "null",
                                    detail_batch: [obj]
                                };
                                await numberOfLines.push(line.entrepot_id);
                                await SHIPMENT_LINES.push(line);
                            }
                            else{
                                // loop in SHIPMENT_LINES
                                // find SHIPMENT_LINES[x].entrepot_id == detail_batch.entrepot_id
                                // update line qty && push detail_batch obj in array
                                await SHIPMENT_LINES.forEach((item, index) => {
                                    if(item.entrepot_id == obj.entrepot_id){

                                        item.qty = item.qty + obj.qty;
                                        item.detail_batch.push(obj);
                                    }
                                });
                            }
                        }
                        else{
                            // create line && detail_batch obj
                            const line = {
                                rang: product.rang,
                                qty: obj.qty, // update if entrepot_id exist in numberOfLines
                                entrepot_id: obj.entrepot_id,
                                fk_expedition: isShipment.id,
                                origin_line_id: product.order_line_id,
                                shipment_id: isShipment.id,
                                id: "null",
                                detail_batch: [obj]
                            };
                            await numberOfLines.push(line.entrepot_id);
                            await SHIPMENT_LINES.push(line);
                        }
                    }


                    console.log('SHIPMENT_LINES ==> ', JSON.stringify(SHIPMENT_LINES));

                    const isShipmentLines_ = await slm.INSERT_SHIPMENT_LINES(SHIPMENT_LINES).then(async (val) => {
                        return val;
                    });


                    if(isShipmentLines_){
                        Toast.showWithGravity("Produit mit à jour dans l'expédition !", Toast.LONG, Toast.TOP);
                    }else{
                        Toast.showWithGravity("Produit non à jour dans l'expédition !", Toast.LONG, Toast.TOP);
                    }

                }
                
            }
        }
        
        //return to order detail (order lines)
        this.props.navigation.goBack();
    }

    render() {
        
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                // for popup when active
            },
            mainBody: {
                backgroundColor: '#ffffff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 30,
                height: this.state.orientation === 'portrait' ? '84%' : '85%',
                width: '100%',
                position: "absolute",
                bottom: this.state.orientation === 'portrait' ? "10%" : "15%",
                opacity: this.state._opacity_,
            },
            cardViewStyle: {
                width: '95%',
                margin: 10,
            },
            cardViewStyle1: {
                paddingTop: 10,
                alignItems: 'center',
                flexDirection: 'row',
                width: '95%',
            },
            article: {
                margin: 20,
                width: '100%'
            },
            ic_and_details: {
                flexDirection: 'row',
                margin: 3,
            },
            aname: {
                width: '80%',
            },
            articlename: {
                color: '#00AAFF',
                fontSize: 20,
            },
            aref: {
                width: '20%',
            },
            ref: {
                backgroundColor: '#dbdbdb',
                height: 30,
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                textAlignVertical: 'center'
            },
            iconDetails: {
                marginRight: 10,
                color: '#00AAFF',
            },
            pricedetails: {
                flexDirection: 'row',
                width: '100%',
            },
            price: {
                width: '75%',
            },
            addPopUpCard : {
                // height: 600,
                width: '95%',
                // justifyContent: "center",
                // alignContent: "center",
                // alignItems: "center",
                // padding: 20,
              margin: 10,
                // marginBottom: 70,
                // position: 'absolute',
            },
            addPopUpCard_body : {
                // height: 600,
                width: '100%',
            },
            addPopUpCard_title : {
                color: "#00AAFF",
                fontSize: 25,
                fontWeight: "bold",
            },
            lastCard: {
                height: 70,
                width: '95%',
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                margin: 20,
                // marginBottom: 70,
            },
            lastCard_text: {
                flex: 1,
                fontSize: 20,
                fontWeight: "bold",
                margin: 20
            },
            backButton: {
                height: 50,
                width: "50%",
                backgroundColor: "#00AAFF",
                // justifyContent: "center",
                // alignItems: "center",
                // alignContent: "center",
            }
        });

        return (
            <View style={styles.container}>

                <LinearGradient
                    start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                    colors={['#00AAFF', '#706FD3']}
                    style={styles.container}>

                    <NavbarPicking _navigation={this.props} textTittleValue={"Picking"}/>
                    <View style={styles.mainBody}>

                        <View style={{flex: 1}}>
                            {/* <Text style={[styles.addPopUpCard_title, {marginLeft: "auto", marginRight: "auto"}]}>Sélectionner un entrepot</Text> */}
                            <Text style={{color: "#00AAFF", fontSize: 20, fontWeight: "bold", marginLeft: "auto", marginRight: "auto"}}>Sélectionner un entrepot</Text>  

                            <ScrollView
                                nestedScrollEnabled = {true}>
                                
                                {this.state.pickingDataSelected.product.productLotDlcDluoData != null ?
                                    <View style={{marginTop: 20, marginBottom: 20}}>
                                        <Text style={{color: "#00AAFF", fontSize: 20, fontWeight: "bold", marginLeft: "auto", marginBottom: 10}}>Préparation Total : <Text style={{color: "#000", fontSize: 20, fontWeight: "bold", }}>{this.state.addRemoveNothing} / {this.state.pickingDataSelected.product.qty}</Text></Text>
                                        
                                        <ScrollView
                                            nestedScrollEnabled = {true}
                                            style={{
                                                borderWidth: 2,
                                                borderColor: "#000",
                                                borderRadius: 2,}}>
                                            {this.state.pickingDataSelected.product.productLotDlcDluoData.map((item, index) => (
                                                <View key={index}>
                                                    {/* {item.entrepot == "null" || item.batch == "null" || item.eatby == "null" || item.sellby == "null" || item.stock == "null" ? 
                                                        null
                                                    : */}
                                                        <TouchableOpacity
                                                            style={[{
                                                                borderWidth: 2,
                                                                borderColor: "#dbdbdb",
                                                                borderRadius: 5,
                                                                padding: 5,
                                                                margin: 5,}, item.styles
                                                            ]}
                                                            onPress={() => this.selectProductWarehouse(item, index)} onLongPress={() => this.unSelectProductWarehouse(item, index)}>
                                                                <View style={{width: "100%", flexDirection: "row"}}>
                                                                    <View style={{width: "6%", marginLeft: "1%"}}>
                                                                        <CheckBox
                                                                            value={item.isBatchSelected}/>
                                                                    </View>
                                                                    <View style={{width: "93%",}}>
                                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Entrepot : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.entrepot_label}</Text></Text>
                                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Lot : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.batch}</Text></Text>
                                                                        
                                                                        <View style={{width: "100%", flexDirection: "row"}}>
                                                                            <View style={{}}>
                                                                                <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>DLC : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.eatby}</Text></Text>
                                                                            </View>
                                                                            <View style={{marginLeft: "auto"}}>
                                                                                <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>DLUO : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.sellby}</Text></Text>
                                                                            </View>
                                                                        </View>

                                                                        <View style={{width: "100%", flexDirection: "row"}}>
                                                                            <View style={{}}>
                                                                                <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Stock : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.stock}</Text></Text>
                                                                            </View>
                                                                            <View style={{marginLeft: "auto"}}>
                                                                                <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Préparation : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.prepare}</Text></Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            
                                                        </TouchableOpacity>
                                                     {/* } */}
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                :
                                    <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                                        <View>
                                            <Text style={styles.lastCard_text}>Aucun Lot lié à ce produit...</Text>
                                        </View>
                                    </CardView>
                                }

                                {this.state.isLoading ? 
                                    <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                                        <View>
                                            <Text style={styles.lastCard_text}>Loading Data...</Text>
                                        </View>
                                    </CardView>
                                : 
                                    <CardView cardElevation={7} cornerRadius={10} style={styles.lastCard}>
                                        <View>
                                            <Text style={styles.lastCard_text}>No More Data...</Text>
                                        </View>
                                    </CardView>
                                }

                            </ScrollView>

                            {this.state.isShowNextPick ? 
                                    <View style={{width: "100%", marginBottom: 50}}>

                                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.remove_100_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>100</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.remove_50_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>50</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.remove_10_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>10</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.remove_1_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="minus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>1</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={{color: "#000", fontWeight: "bold", fontSize: 25, width: "100%", marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing} / {this.state.pickingDataSelected.product.qty}</Text>

                                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.add_1_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>1</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.add_10_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>10</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.add_50_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>50</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 100, borderWidth: 1, borderColor: "#00AAFF"}}
                                                onPress={() => this.add_100_ToTextInput(this.state.pickingDataSelected.product)}>
                                                <Icon name="plus" size={20} style={{color: "#00AAFF", marginRight: 10}}/>
                                                <Text style={{fontSize: 20}}>100</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                :
                                    null
                                }

                            {/* Main twist button */}
                            <PickingButton navigation={this.props.navigation} isPickingDone={this._onPickingDone.bind(this)}/>
                            {/* END Main twist button */}
                        </View>

                    </View>
                    <MyFooter_v2 />
                </LinearGradient>
            </View>
        );
    }
}


//make this component available to the app
export default Picking;
