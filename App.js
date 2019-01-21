import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/Home.js'
import SettingsScreen from './components/Settings.js'
import AddScreen from './components/Add.js'
import ClosetScreen from './components/Closet.js'
import WardrobeScreen from './components/Wardrobe.js'

const TabNav =  createBottomTabNavigator(
  {
    Home: HomeScreen,
    Closet: ClosetScreen,
    Add: AddScreen,
    Wardrobe: WardrobeScreen,
    Settings: SettingsScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'md-home';
        } else if (routeName === 'Settings') {
          iconName = 'md-person';
        }
        else if (routeName === 'Add') {
          iconName = 'md-add-circle';
        }
        else if (routeName === "Closet") {
          iconName = 'md-shirt';
        }
        else if (routeName === 'Wardrobe') {
          iconName = 'ios-albums';
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

export default createAppContainer(TabNav);