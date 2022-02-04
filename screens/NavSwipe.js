import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

class Navbar extends Component{

    render(){
        return(
            <View style={styles.topNav}>
                <StatusBar barStyle="light-content"/>
                <Text style={styles.text}></Text>
                <TouchableOpacity style={styles.slider}>
                    <FontAwesomeIcon icon={ faSlidersH } size={ 30 } />
                </TouchableOpacity> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topNav: {
        backgroundColor:'rgb(12,0,51)',
        overScrollBehavior: 'contain',
        overScrollBehaviorY: 'contain',
        position:'absolute',
        height: '10%',
        top:0,
        width:100+'%'
    },
    slider: {
        paddingTop: 70,
        paddingRight: 20,
        alignItems: "flex-end",
    },
    text:{
        color:'rgb(255,255,255)',
        alignSelf: 'center',
        fontSize: 30
    }
})

export default Navbar