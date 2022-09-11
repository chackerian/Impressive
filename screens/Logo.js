import React, {Component, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import image from '../assets/logo.jpg'
import { useMediaQuery } from "react-responsive"


export default function Logo({ goBack }) {
  const navigation = useNavigation();

  const isDeviceMobile = useMediaQuery({
      query: "(max-width: 1224px)",
  });

  if(isDeviceMobile) {
    return (
        <View style={mobleStyles.logo} onClick={() => navigation.goBack('StartScreen')}>
          <Image source={image} />
        </View>
      )
  }
  return (
  	<View style={styles.logo} onClick={() => navigation.goBack('StartScreen')}>
  		<Image source={image} style={styles.image} />
  	</View>
  )
}

const mobleStyles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
      alignItems: 'center',
      justifyContent: 'center',
   }
})

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
