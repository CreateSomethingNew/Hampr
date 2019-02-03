import React from 'react';
import { Text, View, Button, TouchableHighlight, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class WardrobeScreen extends React.Component {
    _onPressButton() {
        Alert.alert('You tapped the button!')
    }

    _onLongPressButton() {
        Alert.alert('You long-pressed the button!')
    }

    CalendarButton = <Icon name='ios-calendar' type='ionicon' color='white' />
    Title = <Text style={styles.title}>Wardrobe</Text>

  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>

        <Header
            centerComponent={this.Title}
            rightComponent={this.CalendarButton}/>
        <TouchableHighlight
            onPress={this._onPressButton}
            onLongPress={this._onLongPressButton}>
            <Text>Button</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
   color: 'white',
   fontSize: 20,
   fontWeight: 'bold'
  }
})

export default WardrobeScreen;
