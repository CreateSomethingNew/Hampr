import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from './components/Home.js';
import SettingsScreen from './components/Settings.js';
import AddScreen from './components/Add.js';
import ClosetScreen from './components/Closet.js';
import WardrobeScreen from './components/Wardrobe.js';
import OutfitScreen from './components/Outfit.js';
import CalendarScreen from './components/Calendar.js';
import DayScreen from './components/Day.js';
import SplashScreen from './components/Splash.js';
import LoadingScreen from './components/Loading.js';
import { MenuProvider } from 'react-native-popup-menu';
import GetData from './Api.js';

global.serverUrl = "192.168.0.125";

const WardrobeStack = createStackNavigator(
    {
        Wardrobe: WardrobeScreen,
        Outfit: OutfitScreen,
        Calendar: CalendarScreen,
        Day: DayScreen,
        Outfit: OutfitScreen
    },
    {
        initialRouteName: 'Wardrobe',
        headerMode: 'none'
    }
);

WardrobeStack.navigationOptions = ({ navigation }) => {
   return {
      tabBarVisible: navigation.state.index === 0
   };
};

const ClothingStack = createStackNavigator(
  {
    Clothing: {
    	screen: ClosetScreen
    },
    ClothingItem: {
    	screen: AddScreen
    },
    Outfit: {
    	screen: ClosetScreen
    },
    Select: {
      screen: ClosetScreen
    }
  },
  {
  	initialRouteName: 'Clothing',
  	headerMode: 'none'
  }
);

ClothingStack.navigationOptions = ({ navigation }) => {
	return {
  	tabBarVisible: navigation.state.index === 0,
	};
};

const TabNav = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Closet: ClothingStack,
    Add: AddScreen,
    Wardrobe: WardrobeStack,
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

const AppContainer = createAppContainer(TabNav);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: false, loggedIn: false };
  }

  logIn() {
    this.setState({loggedIn : true});
    GetData()
      .then(() => {
        this.setState({ ready: true });
      });
  }

  componentDidMount() {
  }

  renderLoading() {
    return <LoadingScreen/>;
  }

  renderSplash() {
    return <SplashScreen logIn = {this.logIn.bind(this)}/>;
  }

  renderApp() {
    return (
      <MenuProvider>
        <AppContainer/>
      </MenuProvider>
    );
  }

  render() {
    return this.state.ready ? this.renderApp() : (this.state.loggedIn ? this.renderLoading() : this.renderSplash());
  }
}
