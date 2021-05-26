import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, Dimensions, Alert } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import DialogAndroid from 'react-native-dialogs';


export default class OrderLinesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isShowClientDialog: true,
        isMoreFilter: true,

        filterCMD: "",
        filterClient_id: "",
        filterClient_name: "",
        filterRepresentant_id: "",
        filterRepresentant_name: "",
        startDate: 0,
        endDate: 0,
    };
  }


    extend_Minimize_Filter(){
        this.setState({
            isMoreFilter: !this.state.isMoreFilter
        });
    }


    cleanSearch(){
        this.setState({
            filterCMD: "",
            filterClient_id: "",
            filterClient_name: "",
            filterRepresentant_id: "",
            filterRepresentant_name: "",
            startDate: 0,
            endDate: 0,
        });
    }

  render() {
    return (
        <View>
            {this.props.settings.isFilter ?
                <CardView cardElevation={7} cornerRadius={10} style={styles.filterCard}>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 5}}>

                </View>

                {!this.state.isMoreFilter ? 
                    null
                : 
                    <View style={{width: "100%", padding: 5}}>
                        <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center', padding: 5}}>
                            <View style={{width: "50%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center'}}>
                                <Icon name="tag" size={20} style={{color: "#00AAFF"}}/>
                                <TextInput style={{width: "80%", height: 35, borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, paddingLeft: 20, marginRight: 10, marginLeft: 10}} placeholder="Filter par ref CMD..." placeholderTextColor="#646464" onChangeText={(val) => textRefOrderInputChanged(val)} value={this.state.filterCMD} />
                            </View>
                        </View>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center', padding: 5}}>
                            <View style={{width: "50%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center'}}>
                                <Icon name="users" size={20} style={{color: "#00AAFF"}}/>
                                <TextInput style={{width: "80%", height: 35, borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, paddingLeft: 20, marginRight: 10, marginLeft: 10}} placeholder="Filter par client..." placeholderTextColor="#646464" onChangeText={(val) => textRefClientInputChanged(val)} value={this.state.filterClient_name} />
                                <TouchableOpacity onPress={() => {this.open_client_dialog()}}>
                                    <View style={{backgroundColor: "#D7D7D7", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                        <Icon name="users" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center', padding: 5}}>
                            <View style={{width: "50%", flexDirection: "row", justifyContent: "flex-start", alignItems: 'center'}}>
                                <Icon name="user" size={20} style={{color: "#00AAFF"}}/>
                                <TextInput style={{width: "80%", height: 35, borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, paddingLeft: 20, marginRight: 10, marginLeft: 10}} placeholder="Filtrer par représentant (par Nom)..." placeholderTextColor="#646464" onChangeText={(val) => textRefRepresentantInputChanged(val)} value={this.state.filterRepresentant_name}  />
                                <TouchableOpacity onPress={() => {this.open_representant_dialog()}}>
                                    <View style={{backgroundColor: "#D7D7D7", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                        <Icon name="user" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }

                

                <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end", alignItems: 'center', padding: 5}}>
                    {this.state.isMoreFilter ? 
                        <TouchableOpacity onPress={() => {this.extend_Minimize_Filter()}}>
                            <View style={{backgroundColor: "#D7D7D7", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                <Icon name="caret-up" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                            </View>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={() => {this.extend_Minimize_Filter()}}>
                            <View style={{backgroundColor: "#D7D7D7", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                <Icon name="caret-down" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                            </View>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => {this.cleanSearch()}}>
                        <View style={{backgroundColor: "#D7D7D7", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                            <Icon name="trash" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                        </View>    
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.search()}}>
                        <View style={{backgroundColor: "#00AAFF", padding: 5, marginLeft: 20, marginRight: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                            <Icon name="search" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#fff"}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                </CardView>
            :
                null
            }
        </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
    filterCard: {
        // height: 90,
        width: '95%',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 10,
        // marginBottom: 70,
      },
});