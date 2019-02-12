import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Calendar, CalendarList } from 'react-native-calendars';
import moment from "moment";

class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { markedDates: {} };
  }

  dummyApiCall() {
    let data = {
      '2019-02-07': 2,
      '2019-02-08': 3,
      '2019-02-09': 0,
      '2019-02-10': 1
    };
    return Promise.resolve(data);
  }

  componentDidMount() {
    let that = this;
    this.dummyApiCall()
      .then((dates) => {
        let markedDates = {};
        for (let date in dates) {
          const count = dates[date];
          const color = { color: 'black', selectedDotColor: 'black' };
          let dots = [];
          for (let i = 0; i < count; i++) {
            let dot = { key: i, ...color };
            dots.push(dot);
          }
          markedDates[date] = { dots };
        }
        that.setState(previousState => ({ markedDates }));
      });
  }

  render() {

    Title = <Text style={styles.title}>Calendar</Text>
    BackButton = <Icon name='ios-arrow-back' type='ionicon' color='white' underlayColor='transparent'
    onPress={() => this.props.navigation.goBack()}
    hitSlop={{right: 30, top: 10, bottom: 10}} />

    return (
      <View style={{ flex: 1 }}>

      <Header
      leftComponent={BackButton}
      centerComponent={Title}
      />

      <CalendarList
      onDayPress={(day) => {console.log('selected day', day)}}
      onDayLongPress={(day) => {console.log('selected day', day)}}
      monthFormat={'MMMM yyyy'}
      onMonthChange={(month) => {console.log('month changed', month)}}
      firstDay={0}
      markedDates={this.state.markedDates}
      markingType={'multi-dot'}
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
