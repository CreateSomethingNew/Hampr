import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';

class CalendarScreen extends React.Component {

   Title = <Text style={styles.title}>Calendar</Text>
   BackButton = <Icon name='ios-arrow-back' type='ionicon' color='white' underlayColor='transparent'
      onPress={() => this.props.navigation.goBack()} hitSlop={{right: 50}} />
  render() {

    return (
      <View style={{ flex: 1 }}>

      <Header
         leftComponent={this.BackButton}
         centerComponent={this.Title}/>

      <Calendar
         onDayPress={(day) => {console.log('selected day', day)}}
         onDayLongPress={(day) => {console.log('selected day', day)}}
         monthFormat={'MMMM yyyy'}
         onMonthChange={(month) => {console.log('month changed', month)}}
         firstDay={0}
         />
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
});
      

export default CalendarScreen;
