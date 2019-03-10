import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

class DayScreen extends React.Component {

  constructor(props) {
    super(props);
    let refresh = false;
    let params = this.props.navigation.state.params;
    this.state = { refresh, ...params };
    this.state.date = this.state.date || null;
    this.state.outfits = this.state.outfits || {};
    this.state.garments = this.state.garments || {};
    this.state.dayOutfits = this.state.dayOutfits || [];
    this.state.markDates = this.state.markDates || (() => {});
  }

  componentDidMount() {
    console.log("Day - did mount")
  }

  refresh() {
    this.setState({ refresh: !this.state.refresh });
  }

  handleRemovePress(outfit, index) {
    outfit.dates = outfit.dates.filter(date => date != this.state.date);
    this.state.dayOutfits.splice(index, 1);
    this.state.markDates();
    this.refresh();
  }

  renderGridTile(outfit, index) {
    let navigation = this.props.navigation;
    //let childProps = { outfit, ...this.state };
    return (
      <View style={styles.gridTile}>
      <TouchableWithoutFeedback>
      <Menu>
        <Image
          style={styles.gridThumbnail}
          source={{ uri: outfit.src }}
        />
        <MenuTrigger
          children=
            <Icon
              name='ios-more'
              type='ionicon'
              color='black'
              underlayColor='transparent'
            />
          customStyles={{
            triggerOuterWrapper: styles.moreButton
          }}
        />
        <MenuOptions
          customStyles={{optionsContainer: styles.menuOptions}}>
            <MenuOption
              onSelect={() => { this.handleRemovePress(outfit, index) }}
              children=<Text style={styles.menuText}>Remove</Text>
            />
        </MenuOptions>
        <Text style={styles.gridText}>{outfit.name}</Text>
      </Menu>
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

    AddButton =
      <Icon
        name='ios-add'
        type='ionicon'
        color='white'
        underlayColor='transparent'
        onPress={() => {}}
        hitSlop={{left: 30, top: 10, bottom: 10}} />

    return (
      <View style={styles.container}>

        <Header
          leftComponent={BackButton}
          centerComponent={Title}
          rightComponent={AddButton} />

        <FlatGrid
          items={this.state.dayOutfits}
          itemDimension={130}
          renderItem={({item, index}) => this.renderGridTile(item, index)}
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
    maxWidth: 105
  },
  menuText: {

  }
});

export default DayScreen;
