import React, { Component } from 'react';
import { StyleSheet, WebView } from 'react-native';

// The html for the webview can be seen here https://gist.github.com/xpsdeset/72a0ca5b774dfdbc8f60d45dbf379967
// Needed for fix "Setting onMessage on a WebView overrides existing values of window.postMessage, but a previous value was defined." You get the issue for ios
const patchPostMessageFunction = function () {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

const getObject= function (str) {
    try {
        return JSON.parse(str)
    } catch (error) {
        false
    }
    
}


class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
    }
    onMessage(m) {
        console.log(m);
        var newData = getObject(m.nativeEvent.data);
        if (newData && newData["loggedIn"] === true) {
          fetch('http://192.168.1.7:8080/auth/', {
            method: 'GET',
            headers: {
              "Auth-Code": newData["code"]
            },
          });
        }
    }

    render() {
        return (
            <WebView ref={(wv) => { this.webView = wv; }}
                source={{ uri: 'https://createsomethingnew.github.io/' }}
                    injectedJavaScript={patchPostMessageJsCode} 
                    onMessage={m => this.onMessage(m)}  
                    pointerEvents={"none"}
                    style={styles.webView}
                    useWebKit={true}
                    />
        );
    }
}


const styles = StyleSheet.create({
    webView: {
        marginTop: 50
    }
});

export default SplashScreen;

