import React from 'react';
import { Text, View } from 'react-native';

class WardrobeScreen extends React.Component {
  render() {
    console.log('TARK!');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Wardrobe!</Text>
      </View>
    );
  }
}

export default WardrobeScreen;
