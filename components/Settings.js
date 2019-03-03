import React from 'react';
import { Text, View, StyleSheet, SectionList,
				 TouchableWithoutFeedback, TextInput, Button } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

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
    this.setState({
        accountVis: false
      });
  }

  render() {
    const mismatch = <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 0, color: 'red' }}>
                        Emails Mismatch
                      </Text>;
    const mismatchPw = <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 0, color: 'red' }}>
                        Passwords Mismatch
                      </Text>;
    console.log(this.state);

    return (
      <View style={styles.container}>
        <Header
           centerComponent={{ text: 'Settings', style: { color: '#fff', fontSize: 20 } }}
         />
         <Modal isVisible={this.state.emailVis} animationInTime={600}
                 onBackdropPress={() => this.setState({emailVis: false})}>
            <View style={{ height: 270, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20, paddingBottom: 20 }}>
                Old email is {this.state.email}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold'}}>
                Enter New Email
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                onChangeText={(newEmail) => this.setState({newEmail})}
                value={this.state.newEmail}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Confirm New Email
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(confirmEmail) => this.setState({confirmEmail})}
                value={this.state.confirmEmail}
              />
              { this.state.mismatch ? mismatch : null }
              <Button
                style={{ paddingTop: 40 }}
                title="Save"
                color="#841584"
                onPress={this.changeEmail.bind(this)}
              />
            </View>
          </Modal>
          <Modal isVisible={this.state.pwVis} animationInTime={600}
                 onBackdropPress={() => this.setState({pwVis: false})}>
            <View style={{ height: 230, backgroundColor: 'white', flexDirection: 'column',
                           alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 20}}>
                Enter New Password
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                onChangeText={(newPw) => this.setState({newPw})}
                value={this.state.newPw}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Confirm New Password
              </Text>
              <TextInput
                style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(confirmPw) => this.setState({confirmPw})}
                value={this.state.confirmPw}
              />
              { this.state.mismatchPw ? mismatchPw : null }
              <Button
                style={{ paddingTop: 40 }}
                title="Save"
                color="#841584"
                onPress={this.changePw.bind(this)}
              />
            </View>
          </Modal>
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
		         { title: 'User Settings', data: ['Change Email', 'Change Password'] },
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