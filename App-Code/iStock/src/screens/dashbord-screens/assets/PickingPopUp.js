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
        this.setState({
            addRemoveNothing: this.props.settings.pickingDataSelected.product.prepare_shipping_qty,
            pickingDataSelected: this.props.settings.pickingDataSelected
        });
        console.log(this.state);
    }

    handlePrepareScrollOptions = (event) =>{
        const result = (event.nativeEvent.contentOffset.x / 150) + 1;
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
        // this.setState({isPopUpVisible: false, _opacity_: 1});
        this.props.onPickingClose(this.state.product);
    }
  
    picking_OK(product){
        const PICK = {
          action: PICKING_ACTION,
          product_id: product.id,
          product_ref: product.ref,
          product_stock: product.qty,
          order_qty: product.qty,
          prepare_qty: product.addRemoveNothing
        }
  
  
  
        //check if this article was picked before
        /*
        let isPickedBefore = false;
        const newPickingLineData = this.state.pickingLineData;
        for(let x = 0; x < newPickingLineData.length; x++){
          if(newPickingLineData[x].ref != null && newPickingLineData[x].barcode != null){
            
            const data__ = this.state.data;
            for(let y = 0; y < data__.length; y++){
              if(newPickingLineData[x].ref == data__[y].ref && newPickingLineData[x].barcode == data__[y].barcode){
                isPickedBefore = true;
                newPickingLineData[x].prepare_qty = PICK.prepare_qty;
              }
            }
            
          }
        }
  
        if(!isPickedBefore){
          console.log('PICK || isPickedBefore == false : ', PICK);
          newPickingLineData.push(PICK);
          this.setState({pickingLineData : newPickingLineData});
        }
        console.log('PICK || isPickedBefore == true : ', PICK);
        */
        
        
  
        const COLUMN_ID = null;
        const COLUMN_ROWID = null;
        const COLUMN_ORIGIN_ID = "origin_id";
        const COLUMN_LINE_ID = "line_id";
        const COLUMN_FK_ORIGIN = "fk_origin";
        const COLUMN_FK_EXPEDITION = "fk_expedition";
        const COLUMN_ORIGIN_LINE_ID = "origin_line_id";
        const COLUMN_FK_ORIGIN_LINE = "fk_origin_line";
        const COLUMN_FK_PRODUCT = "fk_product";
        const COLUMN_ENTREPOT_ID = "entrepot_id";
        const COLUMN_QTY = "qty";
        const COLUMN_QTY_ASK = "qty_ask";
        const COLUMN_QTY_SHIPPED = "qty_shipped";
        const COLUMN_REF = "ref";
        const COLUMN_PRODUCT_REF = "product_ref";
        const COLUMN_LIBELLE = "libelle";
        const COLUMN_PRODUCT_LABEL = "product_label";
        const COLUMN_DESC = "desc";
        const COLUMN_DESCRIPTION = "description";
        const COLUMN_DETAILS_ENTREPOT__ENTREPOT_ID = "details_entrepot__entrepot_id";
        const COLUMN_DETAILS_ENTREPOT__QTY_SHIPPED = "details_entrepot__qty_shipped";
        const COLUMN_DETAILS_ENTREPOT__LINE_ID = "details_entrepot__line_id";
        const COLUMN_PRICE = "price";   // total ht
        
  
        
  
        //this.setState({isPopUpVisible: false, _opacity_: 1, addRemoveNothing: PICK.prepare_qty});
        // this.setState({isPopUpVisible: false, _opacity_: 1,});

        this.props.onPickingOk(PICK);
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
          // marginBottom: 20,
        },
        cardViewStyle1: {
          paddingTop: 10,
          alignItems: 'center',
          flexDirection: 'row',
          width: '95%',
          //height: 150,
        },
        article: {
          //alignItems: 'center',
          margin: 20,
          width: '100%'
        },
        ic_and_details: {
          flexDirection: 'row',
          margin: 3,
          //alignItems: 'center',
        },
        aname: {
          width: '80%',
        },
        articlename: {
          color: '#00AAFF',
          fontSize: 20,
          //marginBottom: 15,
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
          margin: 20,
          marginBottom: 70,
          // position: 'absolute',
        },
        addPopUpCard_body : {
          // height: 600,
          width: '100%',
        },
        addPopUpCard_title : {
          color: "#00AAFF",
          fontSize: 30,
          fontWeight: "bold",
          margin: 20
        },
        // prepareModeStyleSaisi: {
        //   backgroundColor: (this.state.prepareMode.saisi ? "#dbdbdb" : null)
        // },
        // prepareModeStyleBarecode: {
        //   backgroundColor: (this.state.prepareMode.barecode ? "#dbdbdb" : null)
        // },
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

                    <View style={{padding: 20,}}>

                    <View style={{paddingBottom: 50, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.addPopUpCard_title}>Préparation du <Text style={{color: "#000", fontSize: 20, textDecorationLine: 'underline'}}>{this.state.pickingDataSelected.product.barcode}</Text></Text>
                        {/* <TouchableOpacity
                            style={[styles.prepareModeStyleSaisi, {flexDirection: "row", justifyContent: "center", alignItems: "center",  borderWidth: 1, borderColor: "#00AAFF", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, width: "15%", height: 50,}]}
                            onPress={() => this.activeSaisiMode() }>
                            <Text style={{fontSize: 20, fontWeight: "bold", color: "#00AAFF"}}>Saisi</Text>
                            <Icon name="edit" size={20} style={{color: "#00AAFF", marginLeft: 10}}/>
                        </TouchableOpacity> */}
                        <View style={{backgroundColor: "#dbdbdb", borderRadius: 5, height: 80, width: 150}}>
                            <ScrollView 
                                style={{flex: 1}} 
                                horizontal= {true}
                                decelerationRate={0}
                                snapToInterval={150} //your element width
                                snapToAlignment={"center"}
                                onScroll={this.handlePrepareScrollOptions}>
                                {this.state.pickingDataOptions.map((item, index) => (
                                    <View style={{width: 150, alignItems: "center"}}>
                                    <Text style={{color: "#00AAFF", fontSize: 25, fontWeight: "bold", margin: 20}}>{item.label}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={{width: "100%", alignItems: "center"}}>
                        
                    <Text style={{color: "#000", fontWeight: "bold", fontSize: 25, width: 75, marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing} / {this.state.pickingDataSelected.product.qty}</Text>
                        
                        <View style={{width: "100%", marginTop: "10%"}}>
                        {/* <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        </View> */}

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

                            {/* <Text style={{color: "#000", fontSize: 20, width: 75, marginLeft: 5,  marginRight: 5, textAlign: "center"}}>{this.state.addRemoveNothing} / {this.state.pickingDataSelected.product.qty}</Text> */}

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
                    </View>
                </View>
                </CardView>
            </View>
        </Modal>
      </View>
    );
  }
}
