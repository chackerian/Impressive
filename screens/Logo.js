import React, {Component, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import image from '../assets/logo.jpg'

export default function Logo({ goBack }) {
  const navigation = useNavigation();

  return (
  	<View style={styles.logo} onClick={() => navigation.goBack('StartScreen')}>
  		<Image source={image} style={styles.image} />
  	</View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
   }
})
