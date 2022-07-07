import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Button from './Button'

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
            <View style={styles.topNav}>
                <StatusBar barStyle="light-content"/>
                <Text style={styles.text}></Text>
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
        paddingHorizontal: 10
    },
    slider: {
        paddingTop: 50,
        paddingRight: 30,
        alignItems: "flex-end",
    },
    text:{
        color:'rgb(255,255,255)',
        alignSelf: 'center',
        fontSize: 30
    }
})

export default NavLogout