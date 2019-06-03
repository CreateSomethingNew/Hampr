import React from 'react';
import { Text, View, StyleSheet, SectionList,
				 TouchableWithoutFeedback, TextInput, Button } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { deleteAuthData, retrieveAuthData } from '../Util.js'

class SettingsScreen extends React.Component {

	constructor(props) {
    super(props);
    this.state = { email: "", password: "", emailVis: false, newEmail: "",
      confirmEmail: "", mismatch: false, pwVis: false, newPw: "", 
      confirmPw: "", mismatchPw: false, dataVis: false, accountVis: false };
  }

  componentDidMount() {
    this.setState({
          email: "test@abc.com", password: "testpw"
    });
  }

  HandleSetting = (item) => {
    if(item === "Change Email") {
      this.setState({
        emailVis: true
      });
    }
    else if(item === "Change Password") {
      this.setState({
        pwVis: true
      });
    }
    else if(item === "Delete All Data") {
      this.setState({
        dataVis: true
      });
    }
    else if(item === "Delete Account") {
      this.setState({
        accountVis: true
      })
    }
  }

  makeItem = (item) => {
  	return (
  		<TouchableWithoutFeedback onPress={() => this.HandleSetting(item)}>
  			<View>
  				<Text style={styles.SectionListItems} > { item } </Text>
  			</View>
  		</TouchableWithoutFeedback> 
  	)
  }

  changeEmail = () => {
    if(this.state.newEmail.length === 0 && this.state.confirmEmail.length === 0) {
      return;
    }
    else if(this.state.newEmail.toLowerCase() !== this.state.confirmEmail.toLowerCase()) {
      this.setState({
        mismatch: true
      });
    }
    else {
      this.setState({
        email: this.state.newEmail.toLowerCase(), newEmail: "", confirmEmail: "", emailVis: false, mismatch: false 
      });
    }
  }

  changePw = () => {
    if(this.state.newPw.length === 0 && this.state.confirmPw.length === 0) {
      return;
    }
    else if(this.state.newPw !== this.state.confirmPw) {
      this.setState({
        mismatchPw: true
      });
    }
    else {
      this.setState({
        password: this.state.newPw, newPw: "", confirmPw: "", 
        pwVis: false, mismatchPw: false 
      });
    }
  }

  deleteData = () => {
    this.setState({
        dataVis: false
      });
  }

  deleteAccount = () => {
    retrieveAuthData()
      .then(cookies => {
        fetch('http://' + global.serverUrl + ':8080/api/user/delete', {
          method: 'PUT',
          headers: {
            "authId": cookies[0],
            "token": cookies[1],
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        })
          .then(response => response.json())
          .then(json => {
            deleteAuthData().then(() => {
              this.setState({
                accountVis: false
              });
              global.restartLogin();
            }).catch(() => {
              throw new Error();
            })
          })
          .catch(error => {
            console.log("unable to hit delete account endpoint:", error);
          });
      })
      .catch(error => {
        console.log("unable to retrieve cookies:", error);
      });
  }

  render() {
    const mismatch = <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 0, color: 'red' }}>
                        Emails Mismatch
                      </Text>;
    const mismatchPw = <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 0, color: 'red' }}>
                        Passwords Mismatch
                      </Text>;

    return (
      <View style={styles.container}>
        <Header
           centerComponent={{ text: 'Settings', style: { color: '#fff', fontSize: 20 } }}
         />
          <Modal isVisible={this.state.dataVis} animationInTime={600}
                 onBackdropPress={() => this.setState({dataVis: false})}>
            <View style={{ height: 100, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20, paddingBottom: 10}}>
                Do you want to delete all data?
              </Text>
              <View style={{ flexDirection: 'row'}}>
                <Button
                  style={{ paddingTop: 40 }}
                  title="Yes"
                  color="#841584"
                  onPress={this.deleteData.bind(this)}
                />
                <Button
                  style={{ paddingTop: 40 }}
                  title="No"
                  color="#841584"
                  onPress={() => this.setState({ dataVis: false })}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.accountVis} animationInTime={600}
                 onBackdropPress={() => this.setState({accountVis: false})}>
            <View style={{ height: 100, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20, paddingBottom: 10}}>
                Do you want to delete your account?
              </Text>
              <View style={{ flexDirection: 'row'}}>
                <Button
                  style={{ paddingTop: 40 }}
                  title="Yes"
                  color="#841584"
                  onPress={this.deleteAccount.bind(this)}
                />
                <Button
                  style={{ paddingTop: 40 }}
                  title="No"
                  color="#841584"
                  onPress={() => this.setState({ accountVis: false })}
                />
              </View>
            </View>
          </Modal>
         <SectionList
		       sections={[
		         { title: 'Data Settings', data: ['Delete All Data', 'Delete Account']}
		       ]}
		       renderSectionHeader={ ({section}) => 
		       	<Text style={styles.SectionHeader}> { section.title } </Text> }
		       renderItem={ ({item}) => (this.makeItem(item)) }
		       keyExtractor={ (item, index) => index }
		     />
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
   SectionHeader:{
      backgroundColor : '#64B5F6',
      fontSize : 20,
      padding: 5,
      color: '#fff',
      fontWeight: 'bold'
   },
    SectionListItems:{
      fontSize : 16,
      padding: 6,
      color: '#000',
      backgroundColor : '#F5F5F5'
  },
})

export default SettingsScreen;