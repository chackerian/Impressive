import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

export default function Logo({ goBack }) {
  return (
  	<View style={styles.logo}>
  		<Image source={require('../assets/logo.jpg')} style={styles.image} onClick={goBack} />
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
