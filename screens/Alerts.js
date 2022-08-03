import React, { Component, setState, useState, useEffect} from "react";
import { Animated, Text, View, StyleSheet, Button, SafeAreaView, Dimensions } from "react-native";

export default class Alerts extends Component {

  constructor(props) {
   super(props);
     this.state = {
       visibility: 'none',
       x: new Animated.Value(0)
      }
  }


  slide = () => {
    const windowWidth = Dimensions.get('window').width;
    this.setState({visibility: "block"})
    Animated.spring(this.state.x, {
      toValue: windowWidth-200,
      delay: 100,
    }).start();

  };

render() {
  return (
      <Animated.View style={{transform: [{ translateX: this.state.x }], display: this.state.visibility }}> 
        <Text style={styles.alert}>New Match</Text>
      </Animated.View>
    )
  } 
}

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    color: 'white',
    borderRadius: 24,
    backgroundColor: 'blue',
    padding: 20,
    top: 100,
    right: 'auto',
    bottom: 'auto',
    left: 30,
  }
})