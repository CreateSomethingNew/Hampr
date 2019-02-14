import React from 'react';
import { Button, FlatList, Form, List, Picker, StyleSheet, Text, TextInput, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = {
  form: {
    flex: 3,
    justifyContent: 'left',
    padding: 10,
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#bbb",
    height: 30,
    padding: 5,
  },
};

class SelectOrEnter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: [],
    };
  }

  addSelection(text) {
    if (text === "") {
      return;
    }
    var selections = this.state.selections.slice();
    selections.push(text);
    this.setState({selections: selections});
  }

  render() {
    return (
      <View>
        <TextInput
          editable={true}
          placeholder={this.props.placeholder}
          style={styles.textInput}
          onSubmitEditing={(text) => this.addSelection(text)}
        />
        <List>
          <FlatList
            data={this.state.selections}
            renderItem={({selection}) => (
              <ListItem
                title={selection}
              />
            )}
          />
        </List>
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
            name="image"
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
            placeholder="Enter Type"
          />
          <SelectOrEnter
            placeholder="Enter Tags"
          />
        </View>
        <View>
          <Button 
            title="Submit"
            onPress={this.handleSubmit}
          />
        </View>
      </View>
    );
  }
}

export default AddScreen;