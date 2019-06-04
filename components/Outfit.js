import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Header, Icon } from 'react-native-elements';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { retrieveAuthData } from '../Util.js'

class OutfitScreen extends React.Component {

  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = { ...params };
    this.state.outfit = this.state.outfit || {};
    this.state.outfitGarments = this.state.outfit.garments
      .map(garmentId => global.garments[garmentId]);
  }



  renderGridTile(garment) {
    return (
      <View style={styles.gridTile}>
      <TouchableWithoutFeedback onPress={() => {}}>
      <View>
        <Image
          style={styles.gridThumbnail}
          source={{ uri: garment.src }} />
        <Text style={styles.gridText}>{garment.name}</Text>
      </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let navigation = this.props.navigation;
    let outfit = this.state.outfit;
    let childProps = { outfit };

    Title = <Text style={styles.title}>{this.state.outfit.name}</Text>

    BackButton =
      <Icon
        name='ios-arrow-back'
        onPress={() => this.props.navigation.goBack()}
        underlayColor='transparent'
        type='ionicon'
        color='white'
        hitSlop={{right: 30, top: 10, bottom: 10}} />

    CalendarButton =
      <Icon
        name='calendar-plus'
        type='material-community'
        color='white'
        underlayColor='transparent'
        onPress={() => navigation.push('Calendar', childProps)}
        hitSlop={{left: 30, top: 10, bottom: 10}}/>

    return (
      <View style={styles.container}>

      <Header>
        {BackButton}
        {Title}
        {CalendarButton}
      </Header>

      <FlatGrid
        items={this.state.outfitGarments}
        itemDimension={130}
        renderItem={({ item }) => this.renderGridTile(item)}
        spacing={0}/>

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
    height: 72
  },
  menuText: {
    fontSize: 25
  },
});

export default OutfitScreen;
