//import liraries
import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, Dimensions, Alert } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';


// create a component
class OrderFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            filterName: "",
            startDate: 0,
            endData: 0,
        }
    }


    cleanSearch(){
        this.setState({
            filterName: "",
            startDate: 0,
            endData: 0,
        });
    }

    search(){
        const filterData = {
            filterName: this.state.filterName,
            startDate: this.state.startDate,
            endData: this.state.endData,
        }

        if(filterData.filterName.length < 1){
            filterData.filterName = null;
        }

        if(filterData.startDate == 0){
            filterData.startDate = null;
        }

        if(filterData.endData == 0){
            filterData.endData = null;
        }

        if(filterData.filterName == null && filterData.startDate == null && filterData.endData == null){
            return;
        }

        this.props.onDataToFilter(filterData);
    }


    render() {

        const textInputChanged = (val) => {
            this.setState({
                filterName: val,
            });
          }

        return (
            <View>
                {this.props.settings.isFilter ? 
                    <CardView cardElevation={7} cornerRadius={10} style={styles.filterCard}>
                    <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 5}}>
                        <TouchableOpacity>
                        <View style={{padding: 5, alignItems: "center"}}>
                            <Icon name="calendar-alt" size={DeviceInfo.isTablet() ? 30 : 20} style={{color: "#706FD3"}}/>
                        </View>
                        </TouchableOpacity>
                            <View style={{width: "40%", borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{color: "#646464"}}> Date de début </Text>
                            </View>
                        <TouchableOpacity>
                        <View style={{padding: 5, alignItems: "center"}}>
                            <Icon name="calendar-alt" size={DeviceInfo.isTablet() ? 30 : 20} style={{color: "#706FD3"}}/>
                        </View>
                        </TouchableOpacity>
                        <View style={{width: "40%", borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: "#646464"}}> Date de fin </Text>
                        </View>
                    </View>
                    <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: 'center', padding: 5}}>
                        <TextInput style={{width: "50%", borderWidth: 2, borderColor: "#00AAFF", borderRadius: 25, paddingLeft: 20}} placeholder="Filter par ref client / CMD..." placeholderTextColor="#646464" onChangeText={(val) => textInputChanged(val)} value={this.state.filterName} />
                        <TouchableOpacity>
                            <View style={{backgroundColor: "#D7D7D7", padding: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                <Icon name="users" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.cleanSearch()}}>
                            <View style={{backgroundColor: "#D7D7D7", padding: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
                                <Icon name="trash" size={DeviceInfo.isTablet() ? 20 : 20} style={{color: "#00AAFF"}}/>
                            </View>    
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.search()}}>
                            <View style={{backgroundColor: "#00AAFF", padding: 5, borderRadius: 25, width: 60, alignItems: "center"}}>
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
        // marginBottom: 70,
      },
});

//make this component available to the app
export default OrderFilter;
