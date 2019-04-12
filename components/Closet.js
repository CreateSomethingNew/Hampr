import React from 'react';
import { Text, View, SectionList, StyleSheet,
         ActionSheetIOS, FlatList, Image,
         TouchableWithoutFeedback, ScrollView, TextInput,
         Button } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuOptions,
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Modal from 'react-native-modal';
import { ImagePicker, Permissions } from 'expo';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curTags: [], curType: 'All', dataSource: [], 
                   refresh: false, modalVisible: false, outFitName: "", imageUri: ""};
  }

  componentDidMount() {
    const outfitState = this.props.navigation.getParam('outfitState', null);
    const curTags = this.props.navigation.getParam('curTags', null);
    const curType = this.props.navigation.getParam('curType', null);
    if(outfitState != null) {
      this.setState({
        dataSource: outfitState,
        curTags: curTags,
        curType: curType,
      });
    }
    else {
      Object.values(garments).forEach(function(item) {
          item.highlight = false;
      })
      this.setState({
        dataSource: garments,
      });
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      if(this.props.navigation.getParam('repoll', null) === null) {
      	const curTags = this.props.navigation.getParam('curTags', []);
    		const curType = this.props.navigation.getParam('curType', "All");
        Object.values(garments).forEach(function(item) {
          if(!('highlight' in item)) {
            item.highlight = false;
          }
        })
    		this.setState({
        	curTags: curTags,
        	curType: curType,
      	});
        return;
      }
      else {
        Object.values(garments).forEach(function(item) {
          item.highlight = false;
        })
        this.setState({
          curTags: [], curType: 'All', dataSource: garments, 
          refresh: false, modalVisible: false, outFitName: "", imageUri: ""
        });
      }
    }
  );

  genUniqueID = () => {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

	GetSectionListItem = (navigate, item) => {
      navigate('ClothingItem', {
        item: item
      });
  };

  switchHighLight = (item) => {
    item.highlight = !item.highlight
    this.setState({
      refresh: !this.state.refresh
    })
  }

  selectHighLight = (item) => {
    item.highlight = !item.highlight
    this.setState({
      refresh: !this.state.refresh
    })
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Select', {
      outfitState: tempSource,
      curTags: this.state.curTags,
      curType: this.state.curType,
    });
  }

  enterSelect = () => {
    this.props.navigation.navigate('Select', {
    	outfitState: this.state.dataSource,
    	curTags: this.state.curTags,
      curType: this.state.curType,
    });
  }

  exitSelect = () => {
    Object.values(this.state.dataSource).forEach(function(item) {
      item.highlight = false;
    })
    this.setState({
      refresh: !this.state.refresh
    })
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Clothing', {
    	outfitState: tempSource,
    	curTags: this.state.curTags,
      curType: this.state.curType,
    });
  }

  EnterOutfitScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Outfit', {
      outfitState: tempSource,
      curTags: this.state.curTags,
      curType: this.state.curType,
    });
  }

  EnterClosetScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Clothing', {
      anything: null,
    });
  }

  toggleModal = () => {
    this.setState({
      modalVisible : true
    })
  }

  RemoveTag = (tag, globalState) => {
    let newTags = globalState.curTags;
    newTags = newTags.filter(v => v !== tag);
    this.setState({
      curTags: newTags,
      refresh: !globalState.refresh
    })
  }

  MakeLine = () => {
      return (
        <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }} />
      );
  }

  AddTag = (tag, globalState) => {
    let newTags = globalState.curTags;
    newTags.push(tag);
    this.setState({
      curTags: newTags,
      refresh: !globalState.refresh
    })
  }

  InactiveTags = (globalState) => {
    tagFreq = {};
    sortList = [];
    inactiveTagComponentList = [];
    Object.values(globalState.dataSource).forEach(function(item) {
      item.tags.forEach(function(curTag) {
        if(!(globalState.curTags.includes(curTag))) {
          if(!(curTag in tagFreq))
            tagFreq[curTag] = 1;
          else
            tagFreq[curTag]++;
        }
      });
    });
    for (let itemTag in tagFreq)
      sortList.push([itemTag, tagFreq[itemTag]]);

    sortList.sort(function(a, b) {
      return b[1] - a[1];
    });

    let something = this;

    for (let i = 0; i < sortList.length; i++) {
      inactiveTagComponentList.push(<MenuOption
        key={something.genUniqueID()} onSelect={() => this.AddTag(sortList[i][0], globalState)} children=
      <View>
        <Text>{sortList[i][0]}</Text>
        <Icon name='plus' type='entypo' color='#000000' underlayColor='transparent'
              containerStyle={{ position: 'absolute', top: 0, right: 10 }} size={20} />
      </View> />);
    }
    return inactiveTagComponentList;
  }

  ActiveTags = (globalState) => {
    tagComponentList = [];
    let something = this;
    globalState.curTags.forEach(function(name) {
      tagComponentList.push(<MenuOption key={something.genUniqueID()} onSelect={() => something.RemoveTag(name, globalState)}
       children=
      <View>
        <Text>{name}</Text>
        <Icon name='cross' type='entypo' color='#000000' underlayColor='transparent'
              containerStyle={{ position: 'absolute', top: 0, right: 10 }} size={20} />
      </View> />);
    });
    return tagComponentList;
  }

  menuIcon = (globalState) => {
    const active = this.ActiveTags(globalState);
    const inactive = this.InactiveTags(globalState);

    return (
      <Menu>
        <MenuTrigger customStyles={{ triggerTouchable: { underlayColor: 'transparent'} }}
                     children=<Icon name='menu' color='#fff' /> />
        <MenuOptions>
          <ScrollView style={{ maxHeight: 200 }}>
            { active }
          </ScrollView>
          { active.length > 0 && inactive.length > 0 ? this.MakeLine() : null }
          <ScrollView style={{ maxHeight: 200 }}>
            { inactive }
          </ScrollView>
        </MenuOptions>
      </Menu>
    );
  }

  backIcon = (
    <Icon name='arrow-back' color='#fff'
          onPress={this.enterSelect.bind(this)} underlayColor='transparent' />
  )

  saveIcon = (
    <Icon name='check' color='#fff' 
          underlayColor='transparent' onPress={this.toggleModal.bind(this)} />
  )

  selectText = (
    <Text onPress={this.enterSelect.bind(this)} style={{ color: '#fff', fontSize: 20  }}>
      Select
    </Text>
  )

  cancelText = (
    <Text onPress={this.exitSelect.bind(this)} style={{ color: '#fff', fontSize: 20  }}>
      Clear
    </Text>
  )

  renderHeader(state, globalState) {
    if(state.routeName === "Clothing" || state.routeName === "Select") {
      if(state.routeName === "Select") {
        return (
          <Header
            leftComponent={ this.cancelText }
            centerComponent={{ text: 'Closet', style: { color: '#fff', fontSize: 20 } }}
            rightComponent={ this.menuIcon(globalState) }
          />
        );
      }
      else {
        return (
          <Header
            leftComponent={ this.selectText }
            centerComponent={{ text: 'Closet', style: { color: '#fff', fontSize: 20 } }}
            rightComponent={ this.menuIcon(globalState) }
          />
        );
      }
    }
    else {
      return (
        <Header
          leftComponent={this.backIcon}
          centerComponent={{ text: 'Outfit', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={this.saveIcon}
        />
      );
    }
  }

  renderItem = (item, navigate, state) => {
    if(state.routeName === "Outfit") {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3',
                       borderColor: '#ffff00', borderWidth: 5, margin: 3 }}>
          <TouchableWithoutFeedback onPress={this.switchHighLight.bind(this, item)}>
            <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
          </TouchableWithoutFeedback>
          <Text style={styles.text}>{item.name}</Text>
        </View>
      );
    }
    else {
      if(state.routeName === 'Clothing') {
        return (
          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3',
                         borderColor: '#fff', borderWidth: 5, margin: 3 }}>
            <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
              onLongPress={this.selectHighLight.bind(this, item)}>
              <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
            </TouchableWithoutFeedback>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        );
      }
      else {
        if(item.highlight === true) {
          return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3',
                           borderColor: '#ffff00', borderWidth: 5, margin: 3 }}>
              <TouchableWithoutFeedback onPress={this.switchHighLight.bind(this, item)}>
                <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
              </TouchableWithoutFeedback>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          );
        }
        else if(item.highlight === false ) {
          return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3',
                           borderColor: '#fff', borderWidth: 5, margin: 3 }}>
              <TouchableWithoutFeedback onPress={this.switchHighLight.bind(this, item)}>
                <Image style={styles.imageThumbnail} source={{ uri: item.src }}/>
              </TouchableWithoutFeedback>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          );
        }
      }
    }
  }

  highlightFilter = (items, propState, type, curTags) => {
    if(propState.routeName === "Outfit") {
      highlightList = [];
      Object.values(items).forEach(function(item) {
        if(item.highlight === true)
          highlightList.push(item);
      })
      return highlightList;
    }
    else {
      filterList = [];
      Object.values(items).forEach(function(item) {
        if(item.types.includes(type) || type == "All") {
          viewFlag = true;
          for(var i = 0; i < curTags.length; i++) {
            if(!(item.tags.includes(curTags[i]))) {
              viewFlag = false;
              break;
            }
          }
          if(viewFlag)
            filterList.push(item);
        }
      })
      return filterList;
    }
  }

  ChangeFilter = (typeText) => {
    this.setState({
      curType: typeText,
      refresh: !this.state.refresh
    })
  }

  createScrollButtons = () => {
    const buttons = [];
    let marginLeft;
    let typeFreq = {};
    let sortList = [];
    buttons.push(<TouchableWithoutFeedback key={this.genUniqueID()} onPress={this.ChangeFilter.bind(this, "All")}>
                  <View>
                  <Text style={{ fontSize: 24, marginLeft: 20, marginRight: 20, paddingTop: 4 }}>
                 All</Text></View></TouchableWithoutFeedback>);
    Object.values(this.state.dataSource).forEach(function(item) {
      item.types.forEach(function(curType) {
        if(!(curType in typeFreq))
          typeFreq[curType] = 1;
        else
          typeFreq[curType]++;
      })
    })
    for (let itemType in typeFreq)
      sortList.push([itemType, typeFreq[itemType]]);

    sortList.sort(function(a, b) {
      return b[1] - a[1];
    });
    for (let i = 0; i < sortList.length; i++) {
      buttons.push(<TouchableWithoutFeedback key={this.genUniqueID()} onPress={this.ChangeFilter.bind(this, sortList[i][0])}>
                  <View><Text style={{ fontSize: 24, marginRight: 20, paddingTop: 4 }}>
                         {sortList[i][0]}</Text></View></TouchableWithoutFeedback>);
    }
    return buttons;
  }

  getNumHighlight = (dataSource) => {
    let num = 0;
    Object.values(dataSource).forEach(function(item) {
      if(item.highlight)
        num += 1;
    })
    return num;
  }

  saveOutfit = (navigate) => {
    allKeys = Object.keys(outfits);
    max = -1
    allKeys.forEach(function(key) {
      if(parseInt(key) > max) {
        max = parseInt(key);
      }
    });
    outfitObj = {};
    outfitObj['name'] = this.state.outFitName;
    outfitObj['dates'] = [];
    outfitObj['id'] = max + 1;
    if(this.state.imageUri === '') {
      outfitObj['src'] = 'http://placehold.it/200x200';
    }
    else {
      outfitObj['src'] = this.state.imageUri;
    }
    garmentsList = []
    Object.values(this.state.dataSource).forEach(function(item) {
      if(item.highlight === true) {
        garmentsList.push(item.id);
      }
    });
    outfitObj['garments'] = garmentsList;

    outfits[max + 1] = outfitObj;
    
    navigate('Clothing', { repoll: true });
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

  render() {
    const { navigate } = this.props.navigation;
    const { state } = this.props.navigation;

    const typeFilter = <View style={{  height: 40 }}>
                        <ScrollView style={{ backgroundColor: "#dcdcdc" }}
                      horizontal={true} >
                      { this.createScrollButtons() }
                      </ScrollView>
                      </View>;
                      
    const numItemsHighlight = this.getNumHighlight(this.state.dataSource);

    const addToCart = <TouchableWithoutFeedback onPress={this.EnterOutfitScreen.bind(this)}>
                        <View style={{ height: 50, backgroundColor: 'green',
                                     justifyContent: 'center', alignItems: 'center' }}>
                        <Text >Add {numItemsHighlight} to cart</Text>
                        </View>
                      </TouchableWithoutFeedback>;

    modalImage = <Icon name='image' underlayColor='transparent' size={120} 
                onPress={() => this.showPicker()}/>

    img = <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => this.showPicker()}>
              <Image
                style={{width: 120, height: 90}}
                source={{uri: this.state.imageUri}}
              />
            </TouchableWithoutFeedback>
          </View>

    return (
        <View style={styles.container}>
          { this.renderHeader(state, this.state) }
          { state.routeName === "Clothing" || state.routeName === "Select" ? typeFilter : null }
          <Modal isVisible={this.state.modalVisible} animationInTime={600}
                 onBackdropPress={() => this.setState({modalVisible: false, imageUri: ""})}>
            <View style={{ height: 270, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20 }}>
                Add Image
              </Text>
              { this.state.imageUri === '' ? modalImage : img }
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 0 }}>
                Enter Name
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(outFitName) => this.setState({outFitName})}
              />
              <Button
                style={{ paddingTop: 40 }}
                title="Save"
                color="#841584"
                onPress={this.saveOutfit.bind(this, navigate)}
              />
            </View>
          </Modal>
          <FlatGrid
            itemDimension={130}
            items={ this.highlightFilter(this.state.dataSource, state, this.state.curType,
              this.state.curTags) }
            renderItem={({ item }) => (
                this.renderItem(item, navigate, state)
              )}
            spacing={0}
          />
          { state.routeName === "Select" ? addToCart : null }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: 'column',
   alignItems: 'stretch',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "Optima",
  },
  imageThumbnail: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 175,
  },
})

export default ClosetScreen;
