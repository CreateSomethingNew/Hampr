import React from 'react';
import { Text, View, Button, TouchableHighlight, StyleSheet, Alert } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class WardrobeScreen extends React.Component {
   _onPressButton() {
      Alert.alert('You tapped the button!')
   }

   _onLongPressButton() {
      Alert.alert('You long-pressed the button!')
   }

   Title = <Text style={styles.title}>Wardrobe</Text>
   CalendarButton = <Icon name='ios-calendar' type='ionicon' color='white' underlayColor='transparent'
      onPress={() => this.props.navigation.navigate('Calendar')} />
      
   render() {

      return (
         <View style={{ flex: 1 }}>

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
