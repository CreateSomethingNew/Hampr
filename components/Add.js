import React from 'react';
import { Button, FlatList, Form, Picker, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu, { MenuProvider, MenuOptions, 
         MenuOption, MenuTrigger } from 'react-native-popup-menu';

// TODO:
// - provide data source of all garments
// - scrape existing types/tags from data source

const styles = {
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 3,
    justifyContent: 'left',
    padding: 10,
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#bbb',
    height: 30,
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 2.5,
  },
};

class SelectOrEnter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actives: props.actives,
      inactives: this.getInactives(props.existings, props.actives),
      existings: this.props.existings,
    };
  }

  getInactives = (existings, actives) => {
    activesSet = new Set(actives);
    inactives = existings.filter(existing => !activesSet.has(existing));
    return inactives;
  };

  addSelection = (text) => {
    var actives = this.state.actives.slice();
    var inactives = this.state.inactives.slice();
    var existings = this.state.existings.slice();

    if (text === '') {
      return;
    }

    if (actives.includes(text)) {
      return;
    }
    actives.push(text);

    if ((index = inactives.indexOf(text)) != -1) {
      inactives.splice(index, 1);
    }

    this.setState({
      actives: actives,
      inactives: inactives,
      existings: existings,
    });
  };

  removeSelection = (text) => {
    var actives = this.state.actives.slice();
    var inactives = this.state.inactives.slice();
    var existings = this.state.existings.slice();

    if (existings.includes(text)) {
      inactives.push(text);
    }

    actives.splice(actives.indexOf(text), 1);

    this.setState({
      actives: actives,
      inactives: inactives,
      existings: existings,
    });
  };

  addPopup = (existings) => {
    return (
      <Menu>
        <MenuTrigger
          children={
            <View style={{justifyContent: 'center', backgroundColor: 'blue',
                marginHorizontal: 5, marginVertical: 2.5}}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: '#fff',
                  textAlign: 'center'}}>
                {this.props.placeholder}
              </Text>
            </View>
          }
        />
        <MenuOptions>
          <ScrollView>
            <Text>Existing Types/Tags</Text>
            <FlatList
              data={this.state.inactives}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <ListItem
                  title={item}
                  rightIcon={
                    <Icon
                      name='add-circle'
                      onPress={(envent) => this.addSelection(item)}
                    />
                  }
                />
              )}
            />
            <TextInput
              editable={true}
              placeholder={this.props.placeholder}
              style={styles.textInput}
              onSubmitEditing={(event) => {
                this.addSelection(event.nativeEvent.text)
              }}
            />
          </ScrollView>
        </MenuOptions>
      </Menu>
    );
  };

  render() {
    return (
      <View>
        {this.addPopup('Add Type')}
        <FlatList
          data={this.state.actives}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem
              title={item}
              rightIcon={
                <Icon
                  name='remove-circle'
                  onPress={(event) => {
                    this.removeSelection(item);
                  }}
                />
              }
            />
          )}
        />
      </View>
    );
  }
}

class AddScreen extends React.Component {
  handleSubmit() {

  }



  render() {
    title = <Text style={styles.title}>Add Garment</Text>

    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={title} 
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Icon
            name='image'
            size={32}
            color='#0000ff'
          />
        </View>
        <View style={{ flex: 3, justifyContent: 'left' }}>
          <TextInput
            style={ styles.textInput }
            editable={true}
            placeholder={'Garment Name'}
          />
          <SelectOrEnter
            placeholder='Enter Type'
            existings={['pants', 'shirts', 'poop']}
            actives={[]}
          />
          <SelectOrEnter
            placeholder='Enter Tags'
            existings={['denim', 'formal', 'poop']}
            actives={[]}
          />
        </View>
        <View>
          <Button 
            title='Submit'
            onPress={this.handleSubmit}
          />
        </View>
      </View>
    );
  }
}

export default AddScreen;