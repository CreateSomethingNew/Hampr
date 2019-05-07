import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import { Header, Icon } from 'react-native-elements';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      console.log("global.score", global.score)
  }

  render() {
  	Title = <Text style={styles.title}>Home</Text>

    return (
      <View style={{ flex: 1 }}>

      	<Header
        centerComponent={Title}
        />

        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center'}}>

        	<Text style={{ fontWeight: 'bold', fontSize: 20 }}>Closet Score</Text>
	        <ProgressCircle
	            percent={global.score * 100}
	            radius={50}
	            borderWidth={8}
	            color="#3399FF"
	            shadowColor="#999"
	            bgColor="#fff"
	        >
	            <Text style={{ fontSize: 18 }}>{(global.score * 100).toString()  + '%'}</Text>
	        </ProgressCircle>

	        <Text style={{fontWeight: 'bold', fontSize: 20}}>{"Trending: " + global.trending}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
