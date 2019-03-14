import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { CalendarList } from 'react-native-calendars';
import { FlatGrid } from 'react-native-super-grid';
import Modal from 'react-native-modal';

class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    let markedDates = {};
    let selectedDate = "";
    let refresh = false;
    let dayModalOutfits = [];
    let params = this.props.navigation.state.params;
    this.state = { markedDates, selectedDate, refresh, dayModalOutfits,
      ...params };
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

  navigateToDay(day) {
    let date = day.dateString;
    let outfits = this.state.outfits;
    let garments = this.state.garments;
    let dayOutfits = this.getDayOutfits(date);
    let markDates = this.markDates.bind(this);
    let childProps = { date, outfits, garments, dayOutfits, markDates };
    this.props.navigation.navigate('Day', childProps);
  }

  handleDayPress(day) {
    if (!this.state.outfit) {
      this.navigateToDay(day);
      return;
    }
    let selectedDate = this.state.selectedDate;
    let markedDates = { ...this.state.markedDates };
    if (selectedDate) {
      markedDates[selectedDate] = { ...markedDates[selectedDate] };
      delete markedDates[selectedDate].selected;
    }
    selectedDate = day.dateString;
    markedDates[selectedDate] = { ...markedDates[selectedDate] };
    markedDates[selectedDate].selected = true;
    this.setState({ selectedDate, markedDates });
  }

  handleDayLongPress(day) {
    this.setState({ dayModalOutfits: this.getDayOutfits(day.dateString) });
  }

  renderModalGridTile(outfit) {
    return (
      <View style={styles.gridTile}>
      <TouchableWithoutFeedback>
      <View>
        <Image
          style={styles.gridThumbnail}
          source={{ uri: outfit.src }} />
        <Text style={styles.gridText}>{outfit.name}</Text>
        </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {

    Title = <Text style={styles.title}>Calendar</Text>

    BackButton =
      <Icon
        name='ios-arrow-back'
        onPress={() => this.props.navigation.goBack()}
        underlayColor='transparent'
        type='ionicon'
        color='white'
        hitSlop={{right: 30, top: 10, bottom: 10}} />

    SaveButton =
      <TouchableWithoutFeedback onPress={this.handleSavePress.bind(this)}>
        <View style={styles.saveButton}>
          <Text style={styles.text}>Save</Text>
        </View>
      </TouchableWithoutFeedback>

    DayModal =
      <Modal
        isVisible={this.state.dayModalOutfits.length > 0}
        animationInTime={600}
        onBackdropPress={() => this.setState({ dayModalOutfits: [] })}>
        <View style={styles.modal}>
          <Header containerStyle={styles.modalHeader}>
            <Icon
              name='ios-close'
              onPress={() => this.setState({ dayModalOutfits: [] })}
              underlayColor='transparent'
              type='ionicon'
              color='white'
              hitSlop={{right: 30, top: 10, bottom: 10}} />
            <Text style={styles.modalTitle}>Scheduled Outfits</Text>
          </Header>
          <FlatGrid
            items={this.state.dayModalOutfits}
            itemDimension={130}
            renderItem={({item, index}) => this.renderModalGridTile(item, index)}
            spacing={0} />
        </View>
      </Modal>

    Calendar =
      <CalendarList
        onDayPress={this.handleDayPress.bind(this)}
        onDayLongPress={this.handleDayLongPress.bind(this)}
        monthFormat={'MMMM yyyy'}
        onMonthChange={(month) => {console.log('month changed', month)}}
        firstDay={0}
        markedDates={this.state.markedDates}
        markingType={'multi-dot'}
        theme={{ ...calendarStyle }} />

    return (
      <View style={styles.container}>
        <Header
          leftComponent={BackButton}
          centerComponent={Title} />
        {Calendar}
        {DayModal}
        {this.state.selectedDate.length > 0 && SaveButton}

      </View>
    );
  }
}

const calendarStyle = {
  selectedDayBackgroundColor: '#00adf5',
  dayTextColor: '#2d4150',
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
  gridTile: {
    backgroundColor: '#fff0b3',
    borderColor: '#fff',
    borderWidth: 5,
    margin: 3,
  },
  gridText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "Optima",
  },
  gridThumbnail: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 175,
  },
  modal: {
    height: 300,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  modalHeader: {
    paddingTop: -20,
    height: 40
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
  },
});


export default CalendarScreen;
