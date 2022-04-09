import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsButton({ nav }) {
  return (
    <TouchableOpacity onPress={nav} style={styles.container}>
      <FontAwesomeIcon icon={ faCog } size={ 30 } />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 200,
    top: 10,
  }
})
