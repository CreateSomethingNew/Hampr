import React from 'react';
import { Text, View, SectionList, StyleSheet, 
         ActionSheetIOS, FlatList, Image,
         TouchableWithoutFeedback, ScrollView, TextInput } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';
import Menu, { MenuProvider, MenuOptions, 
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Modal from 'react-native-modal';

class ClosetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { curTags: [], curType: 'All', dataSource: [], 
                   refresh: false, select: false, modalVisible: false, outFitName: "Name" };
  }

  componentDidMount() {
    const outfitState = this.props.navigation.getParam('outfitState', null);
    if(outfitState != null) {
      this.setState({
        dataSource: outfitState,
      });
    }
    else {
      let items = Array.apply(null, Array(15)).map((v, i) => {
        return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
      });

      i = 0
      items.forEach(function (item) {
        item['type'] = [];
        item['tags'] = [];
          item['highlight'] = false;
          if(i % 5 === 0) {
            item['name'] = "Green Shirt";
            item['type'].push("Shirt");
            item['tags'].push("Green");
            item['tags'].push("Striped");
          }
          else if(i % 3 === 0) {
            item['name'] = "Red Pants";
            item['type'].push("Pants");
            item['tags'].push("Red");
          }
          else {
            item['name'] = "Poop";
            item['type'].push("Poop");
          }
          i++;
      });

      this.setState({
        dataSource: items,
      });
    }
  }

	GetSectionListItem = (navigate, item) => {
      navigate('ClothingItem');
  };

  switchHighLight = (item) => {
    item.highlight = !item.highlight
    this.setState({ 
      refresh: !this.state.refresh
    })
  }

  enterSelect = () => {
    this.setState({
      select: true,
      refresh: !this.state.refresh
    })
  }

  exitSelect = () => {
    this.state.dataSource.forEach(function(item) {
      item.highlight = false;
    })
    this.setState({
      select: false,
      refresh: !this.state.refresh
    })
  }

  EnterOutfitScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Outfit', {
      outfitState: tempSource,
    });
  }

  EnterClosetScreen = () => {
    tempSource = this.state.dataSource;
    this.props.navigation.navigate('Clothing', {
      outfitState: tempSource,
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
    globalState.dataSource.forEach(function(item) {
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

    for (let i = 0; i < sortList.length; i++) {
      inactiveTagComponentList.push(<MenuOption
        onSelect={() => this.AddTag(sortList[i][0], globalState)} children=
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
      tagComponentList.push(<MenuOption onSelect={() => something.RemoveTag(name, globalState)}
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
          onPress={this.EnterClosetScreen.bind(this)} underlayColor='transparent' />
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
    if(state.routeName === "Clothing") {
      if(globalState.select) {
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
      if(this.state.select === false) {
        return (
          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff0b3', 
                         borderColor: '#fff', borderWidth: 5, margin: 3 }}>
            <TouchableWithoutFeedback onPress={this.GetSectionListItem.bind(this, navigate, item)}
              onLongPress={this.enterSelect.bind(this)}>
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
      items.forEach(function(item) {
        if(item.highlight === true)
          highlightList.push(item);
      })
      return highlightList;
    }
    else {
      filterList = [];
      items.forEach(function(item) {
        if(item.type.includes(type) || type == "All") {
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
    buttons.push(<TouchableWithoutFeedback onPress={this.ChangeFilter.bind(this, "All")}>
                  <View>
                  <Text style={{ fontSize: 24, marginLeft: 20, marginRight: 20, paddingTop: 4 }}>
                 All</Text></View></TouchableWithoutFeedback>);
    this.state.dataSource.forEach(function(item) {
      item.type.forEach(function(curType) {
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
      buttons.push(<TouchableWithoutFeedback onPress={this.ChangeFilter.bind(this, sortList[i][0])}>
                  <View><Text style={{ fontSize: 24, marginRight: 20, paddingTop: 4 }}>
                         {sortList[i][0]}</Text></View></TouchableWithoutFeedback>);
    }
    return buttons;
  }

  getNumHighlight = (dataSource) => {
    let num = 0;
    dataSource.forEach(function(item) {
      if(item.highlight)
        num += 1;
    })
    return num;
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

    return (
      <MenuProvider>
        <View style={styles.container}>
          { this.renderHeader(state, this.state) }
          { state.routeName === "Clothing" ? typeFilter : null }
          <Modal isVisible={this.state.modalVisible} animationInTime={600}
                 onBackdropPress={() => this.setState({modalVisible: false})}>
            <View style={{ height: 300, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20 }}>
                Add Image
              </Text>
              <Icon name='image' underlayColor='transparent' size={60} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20 }}>
                Enter Name
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(outfitName) => this.setState({outfitName})}
                placeholder={"Name"}/>
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
        </View>
        { this.state.select ? addToCart : null }
      </MenuProvider>
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