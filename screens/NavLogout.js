import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

class NavLogout extends Component{

  constructor(props) {
    super(props);
  }

  logout = () => {
    console.log("LOGOUT")
    this.props.logout()
  }

    render(){
        return(
            <View style={styles.topNav} onPress={this.logout}>
                <TouchableOpacity style={styles.slider} onPress={this.logout}>
                    <Text style={{fontWeight: "bold"}}>Logout</Text>
                </TouchableOpacity> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topNav: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    slider: {
        paddingRight: 30,
        alignItems: "flex-end",
    }
})

export default NavLogout