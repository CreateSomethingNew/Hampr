import React from 'react';
import { Text, View, SectionList, StyleSheet, Alert, 
         StatusBar, ActionSheetIOS, FlatList, Image,
         TouchableWithoutFeedback } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curFilter: 'Type', dataSource: {} };
  }

   componentDidMount() {
    var that = this;
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
    });
    that.setState({
      dataSource: items,
    });
  }

	GetSectionListItem=(navigate, item)=>{
      navigate('ClothingItem');
  };

  ShowPicker=()=>{
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

  menuIcon = (
    <Icon name='menu' color='#fff' onPress={this.ShowPicker.bind(this)} />
  )

  plusIcon = (
    <View style={{ flexDirection: 'row' }}>
      <Icon name='shopping-cart' color='#fff' onPress={this.ShowPicker.bind(this)} />
    </View>
  )

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Header
          leftComponent ={this.plusIcon}
          centerComponent={{ text: 'Closet', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={this.menuIcon}
        />
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
              <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
                onLongPress={this.GetSectionListItem.bind(this, navigate, item)}>
                <Image style={styles.imageThumbnail} source={{ uri: item.src }} />
              </TouchableWithoutFeedback>
              <Text style={{paddingLeft: 55}}>Hi</Text>
            </View>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index}
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
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

export default ClosetScreen;
