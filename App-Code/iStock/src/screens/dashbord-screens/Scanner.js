//import liraries
import React, { Component } from 'react';
//import react in our code.
import { Text, View, Linking, TouchableHighlight, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
// import all basic components
import { CameraKitCameraScreen, } from 'react-native-camera-kit';

// create a component
class Scanner extends Component {
    constructor() {
        super();
        this.state = {
          //variable to hold the qr value
          qrvalue: '',
          opneScanner: false,
        };
    }

    onOpenlink() {
        //Function to open URL, If scanned 
        Linking.openURL(this.state.qrvalue);
        //Linking used to open the URL in any browser that you have installed
    }
    onBarcodeScan(qrvalue) {
        //called after te successful scanning of QRCode/Barcode
        this.setState({ qrvalue: qrvalue });
        this.setState({ opneScanner: false });
        console.log('qrvalue : ', qrvalue);
        console.log('opneScanner : ', false);
    }
    onOpneScanner() {
        var that = this;
        //To Start Scanning
        if(Platform.OS === 'android'){
        async function requestCameraPermission() {
            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,{
                'title': 'Permission Caméra',
                'message': 'Permettre à iStock de utiliser la caméra, pour scanner les QR Code ou Barecode'//'CameraExample App needs access to your camera '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //If CAMERA Permission is granted
                that.setState({ qrvalue: '' });
                that.setState({ opneScanner: true });
                console.log('opneScanner : ', true);
            } else {
                alert("CAMERA permission denied");
            }
            } catch (err) {
            alert("Camera permission err",err);
            console.warn(err);
            }
        }
        //Calling the camera permission function
        requestCameraPermission();
        }
        else{
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
            console.log('opneScanner : ', true);
        }    
    }

    render() {
        let displayModal;
        //If qrvalue is set then return this view
        if (!this.state.opneScanner) {
            return (
                <View style={styles.container}>
                    <Text style={styles.heading}>React Native QR Code Example</Text>
                    <Text style={styles.simpleText}>{this.state.qrvalue ? 'Scanned QR Code: '+this.state.qrvalue : ''}</Text>
                    {this.state.qrvalue.includes("http") ? 
                    <TouchableHighlight
                        onPress={() => this.onOpenlink()}
                        style={styles.button}>
                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Open Link</Text>
                    </TouchableHighlight>
                    : null
                    }
                    <TouchableHighlight
                    onPress={() => this.onOpneScanner()}
                    style={styles.button}>
                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                        Open QR Scanner
                        </Text>
                    </TouchableHighlight>
                </View>
            );
        }

        return (
            <View style={{ flex: 1 }}>
                <CameraKitCameraScreen
                showFrame={true}
                //Show/hide scan frame
                scanBarcode={true}
                //Can restrict for the QR Code only
                laserColor={'#00AAFF'}
                //Color can be of your choice
                frameColor={'#706FD3'}
                //If frame is visible then frame color
                colorForScannerFrame={'black'}
                //Scanner Frame color
                onReadCode={event =>
                    this.onBarcodeScan(event.nativeEvent.codeStringValue)
                }
                cameraOptions={{
                    flashMode: 'auto',                // on/off/auto(default)
                    focusMode: 'on',                  // off/on(default)
                    zoomMode: 'on',                   // off/on(default)
                    ratioOverlay:'1:1',               // optional
                    ratioOverlayColor: '#00000077'    // optional
                }}
                resetFocusTimeout={0}               // optional
                resetFocusWhenMotionDetected={true} // optional
                />

                <TouchableHighlight
                    onPress={() => {this.props.navigation.goBack(); }}
                    style={styles.backButton}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Back</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    backButton: {
        height: 20,
        width: "100%",
        backgroundColor: "#00AAFF"
    }
});

//make this component available to the app
export default Scanner;
