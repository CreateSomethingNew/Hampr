import React from 'react';
import { Text, View, SectionList, StyleSheet, Alert, StatusBar } from 'react-native';

class ClosetScreen extends React.Component {

	GetSectionListItem=(navigate, item)=>{
      navigate('ClothingItem');
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            {title: 'Shirts', data: ['Red Shirt']},
            {title: 'Jackets', data: ['Jackson']},
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
   paddingTop: 22
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