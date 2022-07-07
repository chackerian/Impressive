import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'

class Navbar extends Component{

    render(){
        return(
            <View style={styles.topNav}>
                <StatusBar barStyle="light-content"/>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topNav: {
        backgroundColor:'rgb(12,0,51)',
        position:'absolute',
        height: '10%',
        top:0,
        width:100+'%'
    },
    text:{
        color:'rgb(255,255,255)',
        alignSelf: 'center',
        fontSize:14
    }
})

export default Navbar