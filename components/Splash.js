import React from 'react';
import { Text, View } from 'react-native';

class SplashScreen extends React.Component {
  componentDidMount() {
    console.log("Splash - did mount")
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
}

export default SplashScreen;
