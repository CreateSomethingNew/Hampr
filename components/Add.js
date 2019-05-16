import React from 'react';
import { Button, FlatList, Form, Image, Picker, ScrollView, StyleSheet, Text, TextInput,
  TouchableWithoutFeedback, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu, { MenuProvider, MenuOptions,
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { ImagePicker, Permissions } from 'expo';
import { retrieveAuthData } from '../Util.js'

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
      id: null,
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

  deleteItem = () => {
    let outfitIds = [];
    Object.values(global.outfits).forEach(outfit => {
      if (outfit.garments.includes(this.state.id)) {
        outfitIds.push(outfit.id);
      }
    });

    retrieveAuthData()
      .then(cookies => {
        fetch('http://' + global.serverUrl + ':8080/api/garment/delete', {
          method: 'DELETE',
          headers: {
            "authId": cookies[0],
            "token": cookies[1],
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "garmentId": this.state.id,
            "outfitIds": outfitIds
          })
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            delete global.garments[this.state.id];
            outfitIds.forEach(outfitId => {
              let outfit = global.outfits[outfitId]
              outfit.garments = outfit.garments.filter(v => v !== this.state.id);
            });
            this.props.navigation.navigate('Clothing', { repoll: true });
          })
          .catch(error => {
            console.log("unable to hit delete garment endpoint:", error);
          });
      })
      .catch(error => {
        console.log("unable to retrieve cookies:", error);
      });


    //this.props.navigation.state.params.refresh();
    //this.props.navigation.goBack();
  }

  handleSubmit = () => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newDate = year + "/" + month + "/" + day;

    if(this.state.id !== null) {
      garmentObj = {};
      garmentObj['name'] = this.state.title;
      garmentObj['brand'] = this.state.brand;
      garmentObj['types'] = this.state.types;
      garmentObj['tags'] = this.state.tags;
      garmentObj['id'] = this.state.id;
      garmentObj['src'] = this.state.imageUri;
      garmentObj['date'] = newDate;


       retrieveAuthData()
      .then(cookies => {
        console.log("editing new garment", "cookies", cookies)
        fetch('http://' + global.serverUrl + ':8080/api/garment/insert', {
            method: 'POST',
            headers: {
                "authId": cookies[0],
                "token": cookies[1],
                "Content-Type": "application/json"
            },
            body: JSON.stringify(garmentObj),
        })
        .then(response => {
            if (!response.ok) {
                console.log("editing garment returned bad response:")
                console.log(response)
                throw new Error();
            }
            return;
        })
        .then(() => {
        	garments[this.state.id] = garmentObj;
			this.props.navigation.navigate('Clothing', {repoll: true});
        })
        .catch(error => console.log("error editing garment", error));
  	  });
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
      garmentObj['date'] = newDate;
      garmentObj['id'] = (max + 1).toString();
      if(this.state.imageUri === '') {
        garmentObj['src'] = 'http://placehold.it/200x200';
      }
      else {
        garmentObj['src'] = this.state.imageUri;
      }

      //do a back end call
      retrieveAuthData()
      .then(cookies => {
        console.log("instering new garment", "cookies", cookies)
        fetch('http://' + global.serverUrl + ':8080/api/garment/insert', {
            method: 'POST',
            headers: {
                "authId": cookies[0],
                "token": cookies[1],
                "Content-Type": "application/json"
            },
            body: JSON.stringify(garmentObj),
        })
        .then(response => {
            if (!response.ok) {
                console.log("insert garment returned bad response:")
                console.log(response)
                throw new Error();
            }
            return;
        })
        .then(() => {
        	garments[(max + 1).toString()] = garmentObj;
      		this.setState({
	        	title: '',
	        	brand: '',
	        	types: [],
	        	tags: [],
	        	imageUri: ''
      		});
        })
        .catch(error => console.log("error inserting garment", error));
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
      base64: true,
      quality: 0
    });

    if(!result.cancelled) {
      this.setState({ imageUri : 'data:image/jpg;base64,' + result.base64 })
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
            onPress={this.deleteItem}
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
