import React from 'react';
import { Text, View, Button, TouchableWithoutFeedback, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

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
    maxWidth: 105
  },
  menuText: {

  }
});

export default WardrobeScreen;
