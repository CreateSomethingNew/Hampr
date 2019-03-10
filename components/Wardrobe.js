import React from 'react';
import { Text, View, Button, TouchableWithoutFeedback, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

class WardrobeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { outfits: {}, garments: {} };
  }

  getOutfitsApi() {
    let data = {
      0: {
        id: 0,
        name: 'Outfit 0',
        src: 'http://placehold.it/200x200?text=Outfit_0',
        dates: ['2019-03-10', '2019-03-19', '2019-03-04'],
        garments: [0, 1]
      },
      1: {
        id: 1,
        name: 'Outfit 1',
        src: 'http://placehold.it/200x200?text=Outfit_1',
        dates: ['2019-03-12'],
        garments: [2]
      },
      2: {
        id: 2,
        name: 'Outfit 2',
        src: 'http://placehold.it/200x200?text=Outfit_2',
        dates: ['2019-03-10'],
        garments: [0]
      },
      3: {
        id: 3,
        name: 'Outfit 3',
        src: 'http://placehold.it/200x200?text=Outfit_3',
        dates: ['2019-03-15'],
        garments: [1, 2]
      }
    };
    return Promise.resolve(data);
  }

  getGarmentsApi() {
    let data = {
      0: {
        id: 0,
        name: 'Garment 0',
        src: 'http://placehold.it/200x200?text=Garment_0',
        types: ['Type A'],
        tags: ['Tag A', 'Tag B']
      },
      1: {
        id: 1,
        name: 'Garment 1',
        src: 'http://placehold.it/200x200?text=Garment_1',
        types: ['Type B', 'Type C'],
        tags: ['Tag C']
      },
      2: {
        id: 2,
        name: 'Garment 2',
        src: 'http://placehold.it/200x200?text=Garment_2',
        types: ['Type C'],
        tags: ['Tag A']
      }
    };
    return Promise.resolve(data);
  }

  componentDidMount() {
    console.log('Wardrobe - did mount');
    Promise.all([this.getOutfitsApi(), this.getGarmentsApi()])
      .then((data) => {
        this.setState({ outfits: data[0], garments: data[1] });
      });
  }

  renderGridTile(outfit) {
    let navigation = this.props.navigation;
    let childProps = { outfit, ...this.state };
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
              onSelect={()=>{navigation.navigate('Calendar', childProps)}}
              children=<Text style={styles.menuText}>Add to Calendar</Text>
            />
        </MenuOptions>
        <Text style={styles.gridText}>{outfit.name}</Text>
      </Menu>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let navigation = this.props.navigation;
    let outfits = this.state.outfits;
    let garments = this.state.garments;
    let childProps = { outfits, garments };

    Title = <Text style={styles.title}>Wardrobe</Text>

    CalendarButton =
      <Icon
        name='ios-calendar'
        type='ionicon'
        color='white'
        underlayColor='transparent'
        onPress={() => navigation.navigate('Calendar', childProps)}
        hitSlop={{left: 30, top: 10, bottom: 10}}/>

    return (
      <View style={styles.container}>

      <Header
        centerComponent={Title}
        rightComponent={CalendarButton}/>

      <FlatGrid
        items={Object.values(this.state.outfits)}
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
