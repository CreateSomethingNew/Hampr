import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

class OutfitScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Outfit</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center'
  }
});

export default OutfitScreen;
