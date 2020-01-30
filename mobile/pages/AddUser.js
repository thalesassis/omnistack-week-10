import React from 'react';
import {View} from 'react-native';
import { WebView } from 'react-native-webview';

function AddUser({navigation}) {
    return <WebView startInLoadingState={true} originWhitelist={['*']} style={{flex:1}} mixedContentMode={'always'}
    javaScriptEnabled={true} domStorageEnabled={true} source={{ uri: `http://192.168.0.105:3000` }}
    
    />
}

export default AddUser;