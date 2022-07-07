import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'

class Footer extends Component{

    render(){
        return(
            <View style={styles.footer}>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor:'rgb(56, 5, 222)',
        position:'absolute',
        bottom:0,
        width:100+'%',
        height:'10%',
    }
})

export default Footer
