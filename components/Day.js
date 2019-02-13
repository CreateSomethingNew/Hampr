import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';

class DayScreen extends React.Component {

  render() {

    const { navigation } = this.props;
    const day = navigation.getParam('day', 'UNDEFINED');

    Title = <Text style={styles.title}>Day</Text>
    BackButton =
      <Icon name='ios-arrow-back' onPress={() => this.props.navigation.goBack()}
        underlayColor='transparent' type='ionicon' color='white'
        hitSlop={{right: 30, top: 10, bottom: 10}} />

    return (
      <View style={styles.container}>

        <Header
          leftComponent={BackButton}
          centerComponent={Title} />

        <Text>{day.dateString}</Text>

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
  }
});

export default DayScreen;
