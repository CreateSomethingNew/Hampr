import React from 'react';
import { Text, View, Button, TouchableWithoutFeedback, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { retrieveAuthData } from '../Util.js';

class WardrobeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Wardrobe - did mount');
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
            this.forceUpdate();
          }
  );

  deleteOutfit(outfitId) {
    retrieveAuthData()
      .then(cookies => {
        let url = 'http://' + global.serverUrl + ':8080/api/outfit/delete';
        fetch(url, {
          method: 'DELETE',
          headers: {
            "authId": cookies[0],
            "token": cookies[1],
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(outfitId)
        })
          .then(response => response.json())
          .then(json => {
            delete global.outfits[outfitId];
            this.forceUpdate();
          })
          .catch(error => {
            console.log("unable to hit delete outfit endpoint:", error);
          });
      })
      .catch(error => {
        console.log("unable to retrieve cookies:", error);
      });
  }

  renderGridTile(outfit) {
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
              color='black' />
          customStyles={{
            triggerOuterWrapper: styles.moreButton,
            triggerTouchable: { underlayColor: 'transparent'}
          }}
        />
        <MenuOptions
          customStyles={{optionsContainer: styles.menuOptions}}>
            <MenuOption
              onSelect={() => navigation.push('Calendar', childProps)}
              children=<Text style={styles.menuText}>Schedule</Text>
            />
            <MenuOption
              onSelect={this.deleteOutfit.bind(this, outfit.id)}
              children=<Text style={styles.menuText}>Delete</Text>
            />
        </MenuOptions>
        <Text style={styles.gridText}>{outfit.name}</Text>
      </Menu>
      </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let navigation = this.props.navigation;

    Title = <Text style={styles.title}>Wardrobe</Text>

    CalendarButton =
      <Icon
        name='calendar'
        type='material-community'
        color='white'
        underlayColor='transparent'
        onPress={() => navigation.push('Calendar')}
        hitSlop={{left: 30, top: 10, bottom: 10}}/>

    return (
      <View style={styles.container}>

      <Header
        centerComponent={Title}
        rightComponent={CalendarButton}/>

      <FlatGrid
        items={Object.values(global.outfits)}
        itemDimension={130}
        renderItem={({item}) => this.renderGridTile(item)}
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

export default WardrobeScreen;
