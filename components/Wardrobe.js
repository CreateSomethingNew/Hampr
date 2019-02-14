import React from 'react';
import { Text, View, Button, TouchableWithoutFeedback,
         StyleSheet, Alert, FlatList, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';

class WardrobeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [] };
  }

  componentDidMount() {
    let items = Array.apply(null, Array(15)).map((v, i) => {
      return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
    });

    this.setState({
      dataSource: items,
    });
  }

  renderItem(item, navigate, state) {

    Thumbnail =
      <Image
        style={styles.imageThumbnail}
        source={{ uri: item.src }} />

    MoreButton =
      <Icon
        name='ios-more'
        type='ionicon'
        color='black'
        containerStyle={styles.menuIcon}
        underlayColor='transparent' />

    Label = <Text style={styles.text}>Synchilla</Text>

    return (
      <View style={styles.box}>
        <TouchableWithoutFeedback>
          <View>
            {Thumbnail}
            {MoreButton}
            {Label}

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {

    Title = <Text style={styles.title}>Wardrobe</Text>

    CalendarButton =
      <Icon
        name='ios-calendar'
        type='ionicon'
        color='white'
        underlayColor='transparent'
        onPress={() => this.props.navigation.navigate('Calendar')}
        hitSlop={{left: 30, top: 10, bottom: 10}} />

    return (
      <View style={styles.container}>

      <Header
      centerComponent={Title}
      rightComponent={CalendarButton}/>

      <FlatGrid
        items={this.state.dataSource}
        itemDimension={130}
        renderItem={({ item }) => (
            this.renderItem(item, this.props.navigation, this.props.navigation)
          )}
        spacing={0}
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
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  box: {
    backgroundColor: '#fff0b3',
    borderColor: '#fff',
    borderWidth: 5,
    margin: 3,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "Optima",
  },
  imageThumbnail: {
    //justifyContent: 'flex-end',
    //alignItems: 'center',
    height: 175,
  },
  menuIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
  }
});

export default WardrobeScreen;
