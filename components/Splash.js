import React, { Component } from 'react';
import { StyleSheet, WebView, AsyncStorage, View, Button } from 'react-native';
import { retrieveData } from '../Util.js'

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

restart = (that) => {
  console.log(that);
  that.forceUpdate();
}


class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
        retrieveData().then(function(resp) {
          fetch('http://' + serverUrl + ':8080/auth/login', {
            method: 'GET',
            headers: {
              "authId": resp[0],
              "token": resp[1]
            },
          }).then(function(response) {
            console.log(response);
          });
        })
    }

    onMessage(m, that) {
        var newData = getObject(m.nativeEvent.data);
        if (newData && newData["loggedIn"] === true) {
          console.log("start");
          fetch('http://' + serverUrl + ':8080/auth/code', {
            method: 'GET',
            headers: {
              "Auth-Code": newData["code"]
            },
          })
          .then(function(response) {
            if(!(response.ok)){
              throw new Error();
            }
            return response.json();
          }).then(function(resp) {
            AsyncStorage.multiSet([['authId', resp['id']], ['token', resp['access_token']]])
              .then(function() {
                that.props.logIn();
              })
          })
          .catch(function() {
            that.forceUpdate();
          });
        }
    }

    render() {

        let that = this;

        return (
          <View style={{flex:11}}>
            <WebView ref={(wv) => { this.webView = wv; }}
              source={{ uri: 'https://createsomethingnew.github.io/' }}
              injectedJavaScript={patchPostMessageJsCode} 
              onMessage={m => this.onMessage(m, that)}  
              pointerEvents={"none"}
              style={styles.webView}
              useWebKit={true}
            />
            <Button
              onPress={() => this.webView.reload()}
              title="Restart"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        );
    }
}


const styles = StyleSheet.create({
    webView: {
        marginTop: 50,
        flex:1
    }
});

export default SplashScreen;

