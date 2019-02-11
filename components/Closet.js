import React from 'react';
import { Text, View, SectionList, StyleSheet, 
         ActionSheetIOS, FlatList, Image,
         TouchableWithoutFeedback } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curFilter: 'Type', dataSource: {}, refresh: false };
  }

  componentDidMount() {
    const outfitState = this.props.navigation.getParam('outfitState', null);
    if(outfitState != null) {
      this.setState({
        dataSource: outfitState,
      });
    }
    else {
      console.log("haha");
      let items = Array.apply(null, Array(60)).map((v, i) => {
        return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
      });

      items.forEach(function (item) {
          item['highlight'] = false;
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

  menuIcon = (
    <Icon name='menu' color='#fff' onPress={this.ShowPicker.bind(this)} />
  )

  cartIcon = (
    <Icon name='shopping-cart' color='#fff' onPress={this.EnterOutfitScreen.bind(this)} />
  )

  backIcon = (
    <Icon name='arrow-back' color='#fff' onPress={this.ShowPicker.bind(this)} />
  )

  saveIcon = (
    <Icon name='check' color='#fff' onPress={this.ShowPicker.bind(this)} />
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
    if(state.routeName === "Outfit" && item.highlight === true) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                       borderColor: '#ffff00', borderWidth: 5, margin: 3, marginColor: '#fff' }}>
          <TouchableWithoutFeedback onLongPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>Synchilla</Text>
        </View>
      );
    } 
    else if(state.routeName === "Outfit" && item.highlight === false) {
      return null;
    }
    else if(item.highlight === false ) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                       borderColor: '#fff', borderWidth: 5, margin: 3, marginColor: '#fff' }}>
          <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
            onLongPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>Synchilla</Text>
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                       borderColor: '#ffff00', borderWidth: 5, margin: 3, marginColor: '#fff' }}>
          <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
            onLongPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>Synchilla</Text>
        </View>
      );
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { state } = this.props.navigation;

    return (
      <View style={styles.container}>
        {this.renderHeader(state)}
        <FlatList
          data={ this.state.dataSource }
          extraData = {this.state.refresh}
          renderItem={({ item }) => (
            this.renderItem(item, navigate, state)
          )}
          numColumns={2}
          keyExtractor={(item, index) => index}
          horizontal={false}
          style={{ }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'column',
   alignItems: 'stretch'
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
