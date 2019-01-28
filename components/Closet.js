import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, SectionList, StyleSheet, Alert, 
         StatusBar, ActionSheetIOS } from 'react-native';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curFilter: 'Type'}
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

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headline}>Your Closet</Text>
          <Ionicons onPress={this.ShowPicker.bind(this)} name="ios-menu" size={40} 
            style={{position: 'absolute', right: 5}}>
          </Ionicons>
        </View>
        <SectionList
          sections={[
            {title: 'Shirts', data: ['Red Shirt', 'Green Shirt', 'Blue Shirt']},
            {title: 'Jackets', data: ['Jean Jacker', 'Swag Jacket']},
          ]}
          renderItem={({item}) => <Text style={styles.item} 
          	onPress={this.GetSectionListItem.bind(this, navigate, item)}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
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
   paddingTop: 22,
   alignItems: 'stretch'
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
  headline: {
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: 'Arial',
    marginTop: 0,
  },
  header: {
    height: 40, 
    backgroundColor: 'powderblue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ClosetScreen;