import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Calendar, CalendarList } from 'react-native-calendars';
import moment from "moment";

class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    let markedDates = {};
    let selectedDate = "";
    let refresh = false;
    let params = this.props.navigation.state.params;
    this.state = { markedDates, selectedDate, refresh, ...params };
    this.state.outfits = this.state.outfits || {};
    this.state.garments = this.state.garments || {};
  }

  componentDidMount() {
    this.markDates();
    console.log("Calendar - did mount")
  }

  refresh() {
    this.setState({ refresh: !this.state.refresh });
  }

  markDates() {
    let markedDates = {}
    let selectedDate = this.state.selectedDate;
    Object.values(this.state.outfits)
      .forEach(outfit => outfit.dates.forEach(date => {
        let key = outfit.id;
        let dot = { key, ...dotStyle }
        markedDates[date] = markedDates[date] || {};
        markedDates[date].dots = markedDates[date].dots || [];
        markedDates[date].dots.push(dot);
      }));
    if (selectedDate) {
      markedDates[selectedDate].selected = true;
    }
    this.setState({ markedDates });
  }

  getDayOutfits(date) {
    let outfits = this.state.outfits;
    let markedDates = this.state.markedDates;
    return date in markedDates && 'dots' in markedDates[date] ?
      markedDates[date].dots.map(dot => outfits[dot.key]) : [];
  }

  handleSavePress() {
    let id = this.state.outfit.id;
    let date = this.state.selectedDate;
    let dates = this.state.outfits[id].dates;
    if (!dates.includes(date)) {
      this.state.outfits[id].dates.push(date);
    }
    this.props.navigation.goBack();
  }

  handleDayPress(day) {
    // navigate to Day screen if not adding outfit to calendar
    if (!this.state.outfit) {
      let date = day.dateString;
      let outfits = this.state.outfits;
      let garments = this.state.garments;
      let dayOutfits = this.getDayOutfits(date);
      let markDates = this.markDates.bind(this);
      let childProps = { date, outfits, garments, dayOutfits, markDates };
      this.props.navigation.navigate('Day', childProps);
      return;
    }

    let selectedDate = this.state.selectedDate;
    let markedDates = Object.assign({}, this.state.markedDates);

    // deselect old date
    if (selectedDate) {
      let dots = markedDates[selectedDate].dots;
      delete markedDates[selectedDate];
      if (dots) {
        markedDates[selectedDate] = { dots };
      }
    }

    // select new date
    selectedDate = day.dateString;
    markedDates[selectedDate] = { selected: true, ...markedDates[selectedDate] };
    this.setState({ selectedDate, markedDates });
  }

  render() {
    console.log("Rendering Calendar");
    console.log(this.state.markedDates);
    Title = <Text style={styles.title}>Calendar</Text>
    BackButton =
      <Icon
        name='ios-arrow-back'
        onPress={() => this.props.navigation.goBack()}
        underlayColor='transparent' type='ionicon' color='white'
        hitSlop={{right: 30, top: 10, bottom: 10}} />
    SaveButton =
      <TouchableWithoutFeedback onPress={this.handleSavePress.bind(this)}>
        <View style={styles.saveButton}>
          <Text style={styles.text}>Save</Text>
        </View>
      </TouchableWithoutFeedback>;

    return (
      <View style={styles.container}>

        <Header
          leftComponent={BackButton}
          centerComponent={Title} />

        <CalendarList
          onDayPress={this.handleDayPress.bind(this)}
          onDayLongPress={(day) => {console.log('selected day', day)}}
          monthFormat={'MMMM yyyy'}
          onMonthChange={(month) => {console.log('month changed', month)}}
          firstDay={0}
          markedDates={this.state.markedDates}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: '#00adf5',
            dayTextColor: '#2d4150',
          }} />

        {this.state.selectedDate ? SaveButton : null}

      </View>
    );
  }
}

const dotStyle = {
  color: '#2d4150',
  selectedDotColor: '#ffffff',
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00BF4D',
    height: 70,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
});


export default CalendarScreen;
