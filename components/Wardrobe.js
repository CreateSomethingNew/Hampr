import React from 'react';
import { Text, View, Button, TouchableWithoutFeedback,
  StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
  import { Header, Icon } from 'react-native-elements';
  import { FlatGrid } from 'react-native-super-grid';
  import Menu, { MenuOptions,
    MenuOption, MenuTrigger } from 'react-native-popup-menu';

    class WardrobeScreen extends React.Component {
      constructor(props) {
        super(props);
        this.state = { dataSource: [] };
      }

      componentDidMount() {
        let items = Array.apply(null, Array(15)).map((v, i) => {
          return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
        });

        this.setState({
          dataSource: items,
        });
      }

      renderItem(item, navigate, state) {
        return (
          <View style={styles.gridTile}>
          <TouchableWithoutFeedback>
          <Menu>
            <Image
              style={styles.gridThumbnail}
              source={{ uri: item.src }}
            />
            <MenuTrigger
              children=
                <Icon
                  name='ios-more'
                  type='ionicon'
                  color='black'
                  underlayColor='transparent'
                />
              customStyles={{
                triggerOuterWrapper: styles.moreButton
              }}
            />
            <MenuOptions
              customStyles={{optionsContainer: styles.menuOptions}}>
                <MenuOption
                  onSelect={()=>{}}
                  children=<Text style={styles.menuText}>Option 1</Text>
                />
                <MenuOption
                  onSelect={()=>{}}
                  children=<Text>Option 2</Text>
                />
                <MenuOption
                  onSelect={()=>{}}
                  children=<Text>Option 3</Text>
                />
            </MenuOptions>
            <Text style={styles.gridText}>Synchilla</Text>
          </Menu>
          </TouchableWithoutFeedback>
          </View>
        );
      }

      render() {

        Title = <Text style={styles.title}>Wardrobe</Text>

        CalendarButton =
        <Icon
        name='ios-calendar'
        type='ionicon'
        color='white'
        underlayColor='transparent'
        onPress={() => this.props.navigation.navigate('Calendar')}
        hitSlop={{left: 30, top: 10, bottom: 10}} />

        return (
          <View style={styles.container}>

          <Header
          centerComponent={Title}
          rightComponent={CalendarButton}/>

          <FlatGrid
          items={this.state.dataSource}
          itemDimension={130}
          renderItem={({ item }) => (
            this.renderItem(item, this.props.navigation, this.props.navigation)
          )}
          spacing={0}
          />

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
      },
      gridTile: {
        backgroundColor: '#fff0b3',
        borderColor: '#fff',
        borderWidth: 5,
        margin: 3,
      },
      gridText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "Optima",
      },
      gridThumbnail: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 175,
      },
      moreButton: {
        position: 'absolute',
        top: 0,
        right: 7,
      },
      menuOptions: {
        maxWidth: 100
      },
      menuText: {

      }
    });

    export default WardrobeScreen;
