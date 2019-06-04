import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Modal from 'react-native-modal';
import { retrieveAuthData } from '../Util.js';

class DayScreen extends React.Component {

  constructor(props) {
    super(props);
    let schedulingOutfit = false;
    let refresh = false;
    let params = this.props.navigation.state.params;
    this.state = { schedulingOutfit, refresh, ...params };
    this.state.date = this.state.date || null;
    this.state.dayOutfits = this.state.dayOutfits || [];
    this.state.markDates = this.state.markDates || (() => {});
  }

  componentDidMount() {
    console.log("Day - did mount")
  }

  refresh() {
    this.setState({ refresh: !this.state.refresh });
  }

  unscheduleOutfit(outfit, index) {
    let outfitCopy = JSON.parse(JSON.stringify(outfit));
    outfitCopy.dates = outfitCopy.dates
      .filter(date => date != this.state.date);
    retrieveAuthData()
      .then(cookies => {
        let url = 'http://' + global.serverUrl + ':8080/api/outfit/insert';
        fetch(url, {
          method: 'POST',
          headers: {
            "authId": cookies[0],
            "token": cookies[1],
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(outfitCopy)
        })
          .then(response => response.json())
          .then(json => {
            outfit.dates = outfit.dates
              .filter(date => date != this.state.date);
            this.state.dayOutfits.splice(index, 1);
            this.state.markDates();
            this.refresh();
          })
          .catch(error => {
            console.log("unable to hit insert outfit endpoint:", error);
          });
      })
      .catch(error => {
        console.log("unable to retrieve cookies:", error);
      });
  }

  scheduleOutfit(outfit) {
    let outfitCopy = JSON.parse(JSON.stringify(outfit));
    let date = this.state.date;
    if (!outfitCopy.dates.includes(date)) {
      outfitCopy.dates.push(date);
    }
    retrieveAuthData()
      .then(cookies => {
        let url = 'http://' + global.serverUrl + ':8080/api/outfit/insert';
        fetch(url, {
          method: 'POST',
          headers: {
            "authId": cookies[0],
            "token": cookies[1],
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(outfitCopy)
        })
          .then(response => response.json())
          .then(json => {

            if (!outfit.dates.includes(date)) {
              outfit.dates.push(date);
              this.state.dayOutfits.push(outfit);
              this.state.markDates();
            }
            this.setState({ schedulingOutfit: false });
          })
          .catch(error => {
            console.log("unable to hit insert outfit endpoint:", error);
          });
      })
      .catch(error => {
        console.log("unable to retrieve cookies:", error);
      });
  }

  renderGridTile(outfit, index) {
    let navigation = this.props.navigation;
    let childProps = { outfit };
    return (
      <View style={styles.gridTile}>
      <TouchableWithoutFeedback
        onPress={() => navigation.push('Outfit', childProps)}>
      <View>
      <Menu>
        <Image
          style={styles.gridThumbnail}
          source={{ uri: outfit.src }} />
        <MenuTrigger
          children=
            <Icon
              name='ios-more'
              type='ionicon'
              color='black'
              underlayColor='transparent' />
          customStyles={{
            triggerOuterWrapper: styles.moreButton,
            triggerTouchable: { underlayColor: 'transparent'}
          }}
        />
        <MenuOptions
          customStyles={{optionsContainer: styles.menuOptions}}>
            <MenuOption
              onSelect={() => { this.unscheduleOutfit(outfit, index) }}
              children=<Text style={styles.menuText}>Unschedule</Text>
            />
        </MenuOptions>
        <Text style={styles.gridText}>{outfit.name}</Text>
      </Menu>
      </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  renderModalGridTile(outfit, index) {
    return (
      <View style={styles.gridTile}>
      <TouchableWithoutFeedback onPress={this.scheduleOutfit.bind(this, outfit)}>
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
    Title = <Text style={styles.title}>Day</Text>

    BackButton =
      <Icon
        name='ios-arrow-back'
        onPress={() => this.props.navigation.goBack()}
        underlayColor='transparent' type='ionicon' color='white'
        hitSlop={{right: 30, top: 10, bottom: 10}} />

    ScheduleButton =
      <Icon
        name='ios-add'
        type='ionicon'
        color='white'
        underlayColor='transparent'
        onPress={() => this.setState({ schedulingOutfit: true })}
        hitSlop={{left: 30, top: 10, bottom: 10}} />

    ScheduleModal =
      <Modal
        isVisible={this.state.schedulingOutfit}
        animationInTime={600}
        onBackdropPress={() => this.setState({ schedulingOutfit: false })}>
        <View style={styles.modal}>
          <Header containerStyle={styles.modalHeader}>
            <Icon
              name='ios-close'
              onPress={() => this.setState({ schedulingOutfit: false })}
              underlayColor='transparent'
              type='ionicon'
              color='white'
              hitSlop={{right: 30, top: 10, bottom: 10}} />
            <Text style={styles.modalTitle}>Outfits</Text>
          </Header>
          <FlatGrid
            items={Object.values(global.outfits)}
            itemDimension={130}
            renderItem={({item, index}) => this.renderModalGridTile(item, index)}
            spacing={0} />
        </View>
      </Modal>

    return (
      <View style={styles.container}>

        <Header
          leftComponent={BackButton}
          centerComponent={Title}
          rightComponent={ScheduleButton} />

        <FlatGrid
          items={this.state.dayOutfits}
          itemDimension={130}
          renderItem={({item, index}) => this.renderGridTile(item, index)}
          spacing={0}/>

        {ScheduleModal}

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
  moreButton: {
    position: 'absolute',
    top: 0,
    right: 7,
  },
  menuOptions: {
    maxWidth: 130,
    height: 36
  },
  menuText: {
    fontSize: 25
  },
  modal: {
    height: 500,
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

export default DayScreen;
