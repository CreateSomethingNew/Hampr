import React from 'react';
import { Button, FlatList, Form, Image, Picker, ScrollView, StyleSheet, Text, TextInput, 
  TouchableWithoutFeedback, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu, { MenuProvider, MenuOptions,
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { ImagePicker, Permissions } from 'expo';

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
    this.parentActives = props.actives;
  }

  componentWillReceiveProps(props) {
    this.setState({
      actives: props.actives,
      inactives: this.getInactives(props.existings, props.actives),
      existings: this.props.existings,
    });  
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
    this.props.alterParent(this.props.mode, actives);
  };

  removeSelection = (text) => {
    var actives = this.state.actives.slice();
    var inactives = this.state.inactives.slice();
    var existings = this.state.existings;

    if (existings.includes(text)) {
      inactives.push(text);
    }

    actives.splice(actives.indexOf(text), 1);

    this.setState({
      actives: actives,
      inactives: inactives,
      existings: existings,
    });
    this.props.alterParent(this.props.mode, actives);
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
                {this.props.mode.addMessage}
              </Text>
            </View>
          }
        />
        <MenuOptions>
          <ScrollView>
            <Text>{this.props.mode.existingMessage}</Text>
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
              placeholder={this.props.mode.newMessage}
              style={styles.textInput}
              ref={ref => this.textInputRef = ref}
              onSubmitEditing={(event) => {
                this.addSelection(event.nativeEvent.text);
                this.textInputRef.clear();
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
  constructor(props) {
    super(props);
    title = '';
    brand = '',
    types = [];
    tags = [];
    imageUri = '';
    this.state = {
      title: title,
      brand: brand,
      types: types,
      tags: tags,
      imageUri: imageUri,
      id: -1,
    };
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      item = this.props.navigation.getParam('item', null);
      if(item !== null) {
        this.setState({
          title: item.name,
          brand: item.brand,
          types: item.types,
          tags: item.tags,
          imageUri: item.src,
          id: item.id,
        })
      }
      else {
        this.setState({
          title: '',
          brand: '',
          types: [],
          tags: [],
          imageUri: '',
          id: null,
        });
      }
    }
  );

  handleSubmit = () => {
    if(this.state.id !== null) {
      garmentObj = {};
      garmentObj['name'] = this.state.title;
      garmentObj['brand'] = this.state.brand;
      garmentObj['types'] = this.state.types;
      garmentObj['tags'] = this.state.tags;
      garmentObj['id'] = this.state.id;
      garmentObj['src'] = this.state.imageUri;

      //do a back end calls
      garments[this.state.id] = garmentObj;

      this.props.navigation.navigate('Clothing');
    }
    else {
      allKeys = Object.keys(garments);
      max = -1
      allKeys.forEach(function(key) {
        if(parseInt(key) > max) {
          max = parseInt(key);
        }
      });
      garmentObj = {}
      garmentObj['name'] = this.state.title;
      garmentObj['brand'] = this.state.brand;
      garmentObj['types'] = this.state.types;
      garmentObj['tags'] = this.state.tags;
      garmentObj['id'] = max + 1;
      if(this.state.imageUri === '') {
        garmentObj['src'] = 'http://placehold.it/200x200';
      }
      else {
        garmentObj['src'] = this.state.imageUri;
      }

      //do a back end call

      garments[max + 1] = garmentObj;
      this.setState({
        title: '',
        brand: '',
        types: [],
        tags: [],
        imageUri: '',
      });
    }
  }

  Modes = Object.freeze({
    TYPE: {
      addMessage: 'Add Type',
      existingMessage: 'Existing Types',
      newMessage: 'New Type',
      activesId: 'types',
    },
    TAG: {
      addMessage: 'Add Tags',
      existingMessage: 'Existing Tags',
      newMessage: 'New Tags',
      activesId: 'tags',
    },
  });

  getChildState = (mode, actives) => {
    switch (mode) {
      case this.Modes.TYPE:
        state = {types: actives};
        break;
      case this.Modes.TAG:
        state = {tags: actives};
        break;
      default:
        console.log('Unsupported mode');
        return;
    }
    this.setState(state);
  }

  showPicker = () => {
    curThis = this;
    this.getCameraAsync()
    .then(curThis.getRollAsync().
        then(curThis.pickImage()));
  }

  async pickImage() {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true
    });

    if(!result.cancelled) {
      this.setState({ imageUri : result.uri })
    }
  }

  async getCameraAsync() {
    const { Permissions } = Expo;
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      return "grant";
    } else {
      return "not grant";
    }
  }

  async getRollAsync() {
    const { Permissions } = Expo;
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      return "grant";
    } else {
      return "not grant";
    }
  }

  getExistingTags = () => {
    tagList = []
    Object.values(garments).forEach(function(item) {
      item.tags.forEach(function(tag) {
        if(!tagList.includes(tag)) {
          tagList.push(tag);
        }
      });
    });
    return tagList;
  }

  getExistingTypes = () => {
    typeList = []
    Object.values(garments).forEach(function(item) {
      item.types.forEach(function(type) {
        if(!typeList.includes(type)) {
          typeList.push(type);
        }
      });
    });
    return typeList;
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    title = <Text style={styles.title}>Add Garment</Text>

    editTitle = <Text style={styles.title}>Edit Garment</Text>

    photo = <View style={{ flex: 1, justifyContent: 'center' }}>
          <Icon
            name='image'
            size={32}
            color='#0000ff'
            onPress={() => this.showPicker()}
          />
          </View>

    img = <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => this.showPicker()}>
              <Image
                style={{width: 80, height: 80}}
                source={{uri: this.state.imageUri}}
              />
            </TouchableWithoutFeedback>
          </View>

    backIcon = <Icon name='arrow-back' color='#fff'
                  onPress={() => this.navigateBack()} underlayColor='transparent' />

    deleteButton = <Button
            title={'Delete'}
            onPress={this.handleSubmit}
          />

    spacing = <View style={{width: 50, height: 0, backgroundColor: 'white'}} />

    existingTags = this.getExistingTags();
    existingTypes = this.getExistingTypes();

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={this.state.id === null ? null : backIcon}
          centerComponent={this.state.id === null ? title : editTitle}
        />
        { this.state.imageUri === '' ? photo : img }
        <View style={{ flex: 3, justifyContent: 'left' }}>
          <TextInput
            style={ styles.textInput }
            editable={true}
            placeholder={'Garment Name'}
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
          <TextInput
            style={styles.textInput}
            editable={true}
            placeholder='Garment Brand'
            onChangeText={(text) => this.setState({brand: text})}
            value={this.state.brand}
          />
          <SelectOrEnter
            mode={this.Modes.TYPE}
            existings={existingTypes}
            actives={this.state.types}
            alterParent={this.getChildState.bind(this)}
          />
          <SelectOrEnter
            mode={this.Modes.TAG}
            existings={existingTags}
            actives={this.state.tags}
            alterParent={this.getChildState.bind(this)}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            title={this.state.id === null ? 'Submit' : 'Save'}
            onPress={this.handleSubmit}
          />
          {this.state.id === null ? null : spacing}
          {this.state.id === null ? null : deleteButton}
        </View>
      </View>
    );
  }
}

export default AddScreen;
