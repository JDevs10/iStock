import React, { Component } from 'react';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import { CameraKitCameraScreen, } from 'react-native-camera-kit';


let PICKING_ACTION = 1;

export default class PickingPopUp extends Component {
    class_ = this;
    constructor(props) {
        super(props);
        this.state = {
            isShowNextPick: false,
            addRemoveNothing: 0,
            pickingDataSelected: {
                _opacity_: 1,
                pickingPickOption: 1,
                pickingMaxLimit: 0,
                pickingMimLimit: 0,
                product: {}
            },
            pickingDataOptionSelected: PICKING_ACTION,
            pickingDataOptions: [{id: 1, label: "Ajouter", value: 1}, {id: 2, label: "Retirer", value: 0}],
        };
    }

    componentDidMount(){
        const prepare_shipping_qty = parseInt(this.props.settings.pickingDataSelected.product.prepare_shipping_qty);
        this.props.settings.pickingDataSelected.product.prepare_shipping_qty = prepare_shipping_qty;
        this.setState({
            addRemoveNothing: this.props.settings.pickingDataSelected.product.prepare_shipping_qty,
            pickingDataSelected: this.props.settings.pickingDataSelected
        });
        console.log(this.state.pickingDataSelected);
    }

    handlePrepareScrollOptions = (event) =>{
        const result = (event.nativeEvent.contentOffset.x / 100) + 1;
        if(Number.isInteger(result)){
            console.log(result);
            console.log(event);
            PICKING_ACTION = result;
            this.setState({
                pickingDataOptionSelected: result
            });
        }
    }
  
    activeSaisiMode(){
        // this.setState({prepareMode: {saisi: true, barecode: false}})
    }

    add_100_ToTextInput(item) {
        if(item.qty >= (item.prepare_shipping_qty + 100)){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty + 100,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + 100;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    add_50_ToTextInput(item) {
        if(item.qty >= (item.prepare_shipping_qty + 50)){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty + 50,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + 50;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    add_10_ToTextInput(item) {
        if(item.qty >= (item.prepare_shipping_qty + 10)){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty + 10,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + 10;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    add_1_ToTextInput(item) {
        if(item.qty >= (item.prepare_shipping_qty + 1)){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty + 1,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) + 1;
            console.log("add :=> "+item.prepare_shipping_qty);
        }
    }
    remove_1_ToTextInput(item) {
        if((item.prepare_shipping_qty - 1) <= item.qty && (item.prepare_shipping_qty - 1) != -1){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty - 1,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - 1;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    remove_10_ToTextInput(item) {
        if((item.prepare_shipping_qty - 10) <= item.qty && (item.prepare_shipping_qty - 10) != -1){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty - 10,
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - 10;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    remove_50_ToTextInput(item) {
        if((item.prepare_shipping_qty - 50) <= item.qty && (item.prepare_shipping_qty - 50) != -1){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty - 50
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - 50;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }
    remove_100_ToTextInput(item) {
        if((item.prepare_shipping_qty - 100) <= item.qty && (item.prepare_shipping_qty - 100) != -1){
            this.setState({
            addRemoveNothing: item.prepare_shipping_qty - 100
            });
            item.prepare_shipping_qty = (item.prepare_shipping_qty == null ? 0 : item.prepare_shipping_qty) - 100;
            console.log("remove :=> "+item.prepare_shipping_qty);
        }
    }


    picking_Cancel(){
        this.props.onPickingClose(this.state.product);
    }
  
    picking_OK(product){
        console.log("picking_OK(product) :=> ", product);
  
        //prepare shipment line obj
        const PICK_LINE = {
          fk_expedition: product.fk_commande,
          entrepot_id: product.emplacement_id,
          origin_line_id: product.order_line_id,
          qty: product.prepare_shipping_qty,
          rang: product.rang,
          array_options: []
        };
        // return line obj to main called class
        this.props.onPickingOk(PICK_LINE);
    }

    selectProductWarehouse(data, index){
        const newData = this.state.pickingDataSelected.product.productLotDlcDluoData;
        newData.forEach((item, _index_) => {
            
            if(index != _index_){
                item.styles = [{
                    backgroundColor: "#DBDBDB"
                }]
            }else{
                item.styles = [{
                    backgroundColor: "#FFFFFF"
                }]
            }
        });
        const state = this.state;
        state.isShowNextPick = true;
        state.pickingDataSelected.product.selectProductWarehouse = data;
        this.setState({
            state
        });
    }

    unSelectProductWarehouse(){
        const newData = this.state.pickingDataSelected.product.productLotDlcDluoData;
        newData.forEach((item, _index_) => {
            item.styles = [{
                backgroundColor: "#FFFFFF"
            }]
        });
        this.setState({
            isShowNextPick: false
        });
    }


  render() {

    console.log(this.props.settings);

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
          height: this.state.orientation === 'portrait' ? '84%' : '74%',
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
          marginBottom: 70,
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
    <View>
        <Modal 
            visible={this.props.settings.isPopUpVisible} 
            transparent={true} >
            <View style={{height: "100%", width: "100%", justifyContent: "center"}}>
                <CardView cardElevation={25} cornerRadius={5} style={[styles.addPopUpCard, {}]}>
                    <View style={styles.addPopUpCard_body}>
                        <LinearGradient
                            start={{x: 0.0, y: 1}} end={{x: 0.5, y: 1}}
                            colors={['#00AAFF', '#706FD3']}
                            style={{width: "100%", flexDirection: "row", justifyContent: "flex-end", }}>

                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                                onPress={() => {this.picking_Cancel()}}>
                                <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center", backgroundColor: "#dbdbdb", paddingLeft: 13, paddingTop: 10, paddingBottom: 10, paddingRight: 13, margin: 5, borderRadius: 5, borderWidth: 1, borderColor: "#706FD3"}}
                                onPress={() => this.picking_OK(this.state.pickingDataSelected.product)}>
                                <Text style={{fontSize: 20, fontWeight: "bold", color: "#706FD3"}}>Ok</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <View style={{padding: 10,}}>

                            <View style={{width: "100%", }}>
                                <Text style={styles.addPopUpCard_title}>Préparation du <Text style={{color: "#000", fontSize: 20, textDecorationLine: 'underline'}}>{this.state.pickingDataSelected.product.barcode}</Text></Text>
                                
                                {this.state.pickingDataSelected.product.productLotDlcDluoData != null ?
                                    <View style={{height: 170, marginTop: 20, marginBottom: 20 }}>
                                        <Text style={{color: "#00AAFF", fontSize: 20, fontWeight: "bold"}}>Sélectionner un entrepot</Text>
                                        <ScrollView
                                            style={{
                                                borderWidth: 2,
                                                borderColor: "#000",
                                                borderRadius: 2,}}>
                                            {this.state.pickingDataSelected.product.productLotDlcDluoData.map((item, index) => (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={[{
                                                            borderWidth: 2,
                                                            borderColor: "#dbdbdb",
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 5,}, item.styles
                                                        ]}
                                                        onPress={() => this.selectProductWarehouse(item, index)} onLongPress={() => this.unSelectProductWarehouse(item, index)}>
                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Entrepot : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.entrepot}</Text></Text>
                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Lot : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.batch}</Text></Text>
                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>DLC : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.eatby}</Text></Text>
                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>DLUO : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.sellby}</Text></Text>
                                                        <Text style={{fontSize: 15, color: "#00AAFF", fontWeight: "bold",}}>Stock : <Text style={{color: "#000", fontSize: 15, fontWeight: "bold",}}>{item.stock}</Text></Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                :
                                    null
                                }

                                {this.state.isShowNextPick ? 
                                    <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-start", marginBottom: 20 }}>
                                    
                                    <View style={{height: 35, justifyContent: "center"}}>
                                        <Text style={{fontSize: 25, color: "#00AAFF", fontWeight: "bold", justifyContent: "center"}}>Mode : </Text>
                                    </View>
                                    <View style={{backgroundColor: "#dbdbdb", borderRadius: 5, height: 35, width: 100}}>
                                        <ScrollView 
                                            style={{flex: 1}} 
                                            horizontal= {true}
                                            decelerationRate={0}
                                            snapToInterval={100} //your element width
                                            snapToAlignment={"center"}
                                            onScroll={this.handlePrepareScrollOptions}>
                                            {this.state.pickingDataOptions.map((item, index) => (
                                                <View key={index} style={{width: 100, alignItems: "center"}}>
                                                    <Text style={{color: "#000000", fontSize: 20, fontWeight: "bold", margin: 1}}>{item.label}</Text>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            :
                                null
                            }
                                
                            </View>

                            {this.state.isShowNextPick ? 
                                <View style={{width: "100%", alignItems: "center"}}>
                                    
                                    <Text style={{color: "#000", fontWeight: "bold", fontSize: 25, width: "100%", marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing} / {this.state.pickingDataSelected.product.qty}</Text>
                                        
                                    <View style={{width: "100%", marginTop: "10%"}}>

                                        {this.state.pickingDataOptionSelected == 2 ? 
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
                                        : 
                                            null
                                        }

                                        {this.state.pickingDataOptionSelected == 1 ? 
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
                                        : 
                                            null
                                        }
                                    </View>
                                </View>
                            :
                                null
                            }
                        </View>
                    </View>
                </CardView>
            </View>
        </Modal>
    </View>
    );
  }
}
