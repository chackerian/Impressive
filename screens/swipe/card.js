import React, { Component } from 'react';
import {
  View,
} from 'react-native';

const Card = ({ style, children }) => (
  <View style={style} >
    {children}
  </View>);

Card.defaultProps = {
  style:{},
  onSwiped: () => {},
  onSwipedLeft: () => {},
  onSwipedRight: () => {},
  onSwipedTop: () => {},
  onSwipedBottom: () => {},
}

export default Card;