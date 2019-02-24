import React from 'react';
import { Button, FlatList, Form, Picker, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu, { MenuProvider, MenuOptions, 
         MenuOption, MenuTrigger } from 'react-native-popup-menu';

// TODO:
// - wrap screen in MenuItem
// - wrap popup in Menu, MenuTrigger
// - provide data source of all garments
// - scrape existing types/tags from data source

const styles = {
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
  },
};

class SelectOrEnter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actives: props.actives,
      inactives: this.getInactives(props.existings, props.actives),
    };
  }

  getInactives = (existings, actives) => {
    activesSet = new Set(actives);
    inactives = existings.filter(existing => !activesSet.has(existing));
    return inactives;
  };

  addSelection = (event) => {
    var text = event.nativeEvent.text
    if (text === '') {
      return;
    }
    var actives = this.state.actives;
    for (var i in actives) {
      if (actives[i].text === text) {
        return;
      }
    }
    actives = actives.slice();
    actives.push({text: text});
    this.setState({
      actives: actives,
    });
  }

  removeSelection = (text) => {
    var actives = this.state.actives.slice();
    var i = actives.map(function(e) {
      return e.text;
    }).indexOf(text);
    actives.splice(i, 1);
    this.setState({
      actives: actives
    });
  }

  addPopup = (existings) => {
    return (
      <Menu>
        <MenuTrigger
          children={
            <Text>{this.props.placeholder}</Text>
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
                  title={item.text}
                  rightIcon={
                    <Icon
                      name='remove-circle'
                      onPress={(event) => {
                        this.removeSelection(item.text);
                      }}
                    />
                  }
                />
              )}
            />
            <TextInput
              editable={true}
              placeholder={this.props.placeholder}
              style={styles.textInput}
              onSubmitEditing={(text) => this.addSelection(text)}
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
              title={item.text}
              rightIcon={
                <Icon
                  name='remove-circle'
                  onPress={(event) => {
                    this.removeSelection(item.text);
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
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Icon
            name='image'
            style={{ size: 64 }}
          />
        </View>
        <View style={{ flex: 3, justifyContent: 'left' }}>
          <Text>Name</Text>
          <TextInput
            style={ styles.textInput }
            editable={true}
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