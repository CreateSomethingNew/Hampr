import React from 'react';
import { Form, Picker, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

class AddScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="image"/>
        <Text>Name</Text>
        <TextInput editable={true} value={"hello"}></TextInput>
        <Text>Type</Text>
        <TextInput editable={true} value={"enter type"}></TextInput>
        <Text>Tags</Text>
        <TextInput editable={true} value={"enter tag"}></TextInput>
      </View>
    );
  }
}

export default AddScreen;