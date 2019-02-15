import React from 'react';
import { Text, View, SectionList, StyleSheet, 
         ActionSheetIOS, FlatList, Image,
         TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curType: 'All', dataSource: [], refresh: false };
  }

  componentDidMount() {
    const outfitState = this.props.navigation.getParam('outfitState', null);
    if(outfitState != null) {
      this.setState({
        dataSource: outfitState,
      });
    }
    else {
      let items = Array.apply(null, Array(15)).map((v, i) => {
        return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
      });

      i = 0
      items.forEach(function (item) {
          item['highlight'] = false;
          if(i % 5 === 0)
            item['type'] = "Shirt";
          else if(i % 3 === 0)
            item['type'] = "Pants";
          else
            item['type'] = "Poop";
          i++;
      });

      this.setState({
        dataSource: items,
      });
    }
  }

	GetSectionListItem = (navigate, item) => {
      navigate('ClothingItem');
  };

  switchHighLight = (item) => {
    item.highlight = !item.highlight
    this.setState({ 
      refresh: !this.state.refresh
    })
  }

  ShowPicker = () => {
    const options = ['Cancel', 'Type', 'Color', 'Brand'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if(buttonIndex != 0) {
          this.setState({curFilter: options[buttonIndex]})
        }
      },
    );
  };

  EnterOutfitScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Outfit', {
      outfitState: tempSource,
    });
  }

  EnterClosetScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Clothing', {
      outfitState: tempSource,
    });
  }

  menuIcon = (
    <Icon name='menu' color='#fff' 
          onPress={this.ShowPicker.bind(this)} underlayColor='transparent' />
  )

  cartIcon = (
    <Icon name='shopping-cart' color='#fff' 
          onPress={this.EnterOutfitScreen.bind(this)} underlayColor='transparent' />
  )

  backIcon = (
    <Icon name='arrow-back' color='#fff' 
          onPress={this.EnterClosetScreen.bind(this)} underlayColor='transparent' />
  )

  saveIcon = (
    <Icon name='check' color='#fff' 
          onPress={this.ShowPicker.bind(this)} underlayColor='transparent' />
  )

  renderHeader(state) {
    if(state.routeName === "Clothing") {
      return (
        <Header
          leftComponent={this.cartIcon}
          centerComponent={{ text: 'Closet', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={this.menuIcon}
        />
      );
    }
    else {
      return (
        <Header
          leftComponent={this.backIcon}
          centerComponent={{ text: 'Outfit', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={this.saveIcon}
        />
      );
    }
  }

  renderItem = (item, navigate, state) => {
    if(item.highlight === true) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                       borderColor: '#ffff00', borderWidth: 5, margin: 3 }}>
          <TouchableWithoutFeedback onLongPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>Synchilla</Text>
        </View>
      );
    } 
    else if(item.highlight === false ) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                       borderColor: '#fff', borderWidth: 5, margin: 3 }}>
          <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
            onLongPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>Synchilla</Text>
        </View>
      );
    }
  }

  highlightFilter = (items, propState, type) => {
    if(propState.routeName === "Outfit") {
      highlightList = [];
      items.forEach(function(item) {
        if(item.highlight === true)
          highlightList.push(item);
      })
      return highlightList;
    }
    else {
      if(type === "All")
        return items;
      filterList = [];
      items.forEach(function(item) {
        if(item.type === type)
          filterList.push(item);
      })
      return filterList;
    }
  }

  ChangeFilter = (typeText) => {
    this.setState({
      curType: typeText,
      refresh: !this.state.refresh
    })
  }

  createScrollButtons = () => {
    const buttons = [];
    let marginLeft;
    let typeFreq = {};
    let sortList = [];
    buttons.push(<Text style={{ fontSize: 24, marginLeft: 20, marginRight: 20, paddingTop: 4 }}
                  onPress={this.ChangeFilter.bind(this, "All")}>
      All</Text>);
    this.state.dataSource.forEach(function(item) {
      if(!(item.type in typeFreq))
        typeFreq[item.type] = 1;
      else
        typeFreq[item.type]++;
    })
    for (let itemType in typeFreq)
      sortList.push([itemType, typeFreq[itemType]]);

    sortList.sort(function(a, b) {
      return b[1] - a[1];
    });
    for (let i = 0; i < sortList.length; i++) {
      buttons.push(<Text style={{ fontSize: 24, marginRight: 20, paddingTop: 4 }}
                         onPress={this.ChangeFilter.bind(this, sortList[i][0])}>
                         {sortList[i][0]}</Text>);
    }
    return buttons;
  }

  render() {
    const { navigate } = this.props.navigation;
    const { state } = this.props.navigation;
    const typeFilter = <View style={{  height: 40 }}>
                        <ScrollView style={{ backgroundColor: "#dcdcdc" }} 
                      horizontal={true} >
                      { this.createScrollButtons() }
                      </ScrollView>
                      </View>;

    return (
      <View style={styles.container}>
        { this.renderHeader(state) }
        { state.routeName === "Clothing" ? typeFilter : null }
        <FlatGrid
          itemDimension={130}
          items={ this.highlightFilter(this.state.dataSource, state, this.state.curType) }
          renderItem={({ item }) => (
              this.renderItem(item, navigate, state)
            )}
          spacing={0}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'column',
   alignItems: 'stretch',
  },
  text: {
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: 'bold',
    fontFamily: "Optima",
  },
  imageThumbnail: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 175,
  },
})

export default ClosetScreen;