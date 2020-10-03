//import liraries
import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, TextInput, Dimensions, Alert } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import DatePicker from 'react-native-datepicker';
import DialogAndroid from 'react-native-dialogs';
import ThirdPartiesManager from '../../../Database/ThirdPartiesManager';
import UserManager from '../../../Database/UserManager';

// create a component
class OrderFilter extends Component {
    constructor(props){
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
        }
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

    async open_client_dialog(){
        console.log("open_client_dialog()");

        console.log("filterClient_name : ", this.state.filterClient_name)
        if(this.state.filterClient_name == null || this.state.filterClient_name == ""){
            alert("Veuillez remplir le champ 'client' avec le nom pour filtrer.");
            return;
        }

        // const loading = DialogAndroid.showProgress('Chargement...', {
        //     style: DialogAndroid.progressHorizontal // omit this to get circular
        // });
        // setTimeout(loading.dismiss, 5000);


        const tpm = new ThirdPartiesManager();
        await tpm.initDB();
        const data = await tpm.GET_CLIENT_BY_NAME(this.state.filterClient_name).then(async (val) => {
            return await val;
        });

        const LIST = [{id: "1", label: "Hello"}, {id: "1", label: "Hello"}, {id: "1", label: "Hello"}];

        const { selectedItem } = await DialogAndroid.showPicker('Veuillez selectionner un représentant', null, {
            positiveText: 'Ok', // this is what makes disables auto dismiss
            cancelable: false,
            type: DialogAndroid.listRadio,
            selectedIds: 'clientslist',
            items:
                data.map((row, index) => ( //clientsliste tableau deja remplie avec la liste client
                {
                  label: row.name,
                  id: row.ref,
                }
              ))
        });

        if (selectedItem) {
            if(Object.keys(selectedItem).length > 1){
                console.log('You selected item:', selectedItem);
                this.setState({filterClient_id: selectedItem.id, filterClient_name: selectedItem.label});
            }else{
                console.log('Unkown selected item:', selectedItem);
            }
        }
    }

    async open_representant_dialog(){
        console.log("open_representant_dialog()");

        console.log("filterRepresentant_name : ", this.state.filterRepresentant_name)
        if(this.state.filterRepresentant_name == null || this.state.filterRepresentant_name == ""){
            alert("Veuillez remplir le champ 'représentant' avec un Nom pour filtrer.");
            return;
        }

    // const loading = await DialogAndroid.showProgress('Chargement...', {
    //     style: DialogAndroid.progressHorizontal // omit this to get circular
    // });
    // setTimeout(loading.dismiss, 5000);


        const um = new UserManager();
        await um.initDB();
        const data = await um.GET_REPRESENTANT_BY_LASTNAME(this.state.filterRepresentant_name).then(async (val) => {
            return await val;
        });

        const { selectedItem } = await DialogAndroid.showPicker('Veuillez selectionner un représentant', null, {
            positiveText: 'Ok', // this is what makes disables auto dismiss
            cancelable: false,
            type: DialogAndroid.listRadio,
            selectedIds: 'clientslist',
            items:
                data.map((row, index) => ( //clientsliste tableau deja remplie avec la liste client
                {
                  label: row.lastname,
                  id: row.ref,
                }
              ))
        });

        if (selectedItem) {
            if(Object.keys(selectedItem).length > 1){
                console.log('You selected item:', selectedItem);
                this.setState({filterRepresentant_id: selectedItem.id, filterRepresentant_name: selectedItem.label});
            }else{
                console.log('Unkown selected item:', selectedItem);
            }
        }
    }

    search(){
        const filterData = {
            filterCMD: this.state.filterCMD,
            filterClient_id: this.state.filterClient_id,
            filterRepresentant_id: this.state.filterRepresentant_id,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        }

        

        if(filterData.filterCMD == ""){
            filterData.filterCMD = null;
        }

        if(filterData.filterClient_id == ""){
            filterData.filterClient_id = null;
        }

        if(filterData.filterRepresentant_id == ""){
            filterData.filterRepresentant_id = null;
        }

        if(filterData.startDate == ""){
            filterData.startDate = null;
        }

        if(filterData.endDate == ""){
            filterData.endDate = null;
        }

        if(filterData.startDate > filterData.endDate){
            Alert.alert(
                "Date",
                "La date de début ne peut pas être supérieure à la date de fin.",
                [
                  {text: "D'accord", onPress: () => true},
                ],
                { cancelable: false });       
            return;
        }

        if(filterData.filterCMD == null && filterData.filterClient_id == null && filterData.filterRepresentant_id == null && filterData.startDate == null && filterData.endDate == null){
            console.log("filterData old : ", filterData);
            console.log("filterData reseted : ", {});
            this.props.onDataToFilter({});
            return;
        }

        this.props.onDataToFilter(filterData);
    }


    render() {

        const textRefOrderInputChanged = (val) => {
            this.setState({
                filterCMD: val,
            });
        }
        const textRefClientInputChanged = (val) => {
            this.setState({
                filterClient_name: val,
            });
        }
        const textRefRepresentantInputChanged = (val) => {
            this.setState({
                filterRepresentant_name: val,
            });
        }

        return (
            <View>
                {this.props.settings.isFilter ?
                    <CardView cardElevation={7} cornerRadius={10} style={styles.filterCard}>
                    <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 5}}>

                            <DatePicker
                                style={{ width: '45%' }}
                                date={this.state.startDate}
                                mode="date"
                                placeholder="Date de début"
                                format="YYYY-MM-DD"
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                customStyles={{
                                dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                                dateInput: { marginLeft: 36, borderColor: '#00AAFF', borderWidth: 2, borderRadius: 25, height: 30 }
                                }}
                                onDateChange={(date) => { this.setState({ startDate: date }) }}
                            />
                            
                            <DatePicker
                                style={{ width: '45%' }}
                                date={this.state.endDate}
                                mode="date"
                                placeholder="Date de fin"
                                format="YYYY-MM-DD"
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                customStyles={{
                                dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                                dateInput: { marginLeft: 36, borderColor: '#00AAFF', borderWidth: 2, borderRadius: 25, height: 30 }
                                }}
                                onDateChange={(date) => { this.setState({ endDate: date }) }}
                            />
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

//make this component available to the app
export default OrderFilter;
