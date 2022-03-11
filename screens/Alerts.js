import React, { Component, setState, useState} from "react";
import { Animated, Text, View, StyleSheet, Button, SafeAreaView } from "react-native";

export default class Alerts extends Component {

  constructor(props) {
   super(props);
     this.state = {
       visibility: 'none',
       x: new Animated.Value(0)
      }
  }

  slide = () => {
    Animated.spring(this.state.x, {
      toValue: -100,
    }).start();
    this.setState({
      visibility: 'block',
    });

   Animated.spring(this.state.x, {
      toValue: 200,
      delay: 900,
    }).start();
    this.setState({
      visibility: 'none',
    });

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
    right: 30,
    bottom: 'auto',
    left: 'auto',
  }
})