import React from 'react'
import { TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function EditImageButton({ nav }) {
  return (
    <TouchableOpacity onPress={nav} style={styles.container}>
      <FontAwesomeIcon icon={ faCamera } size={ 20 } />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    left: 200,
    top: 100,
    position: 'absolute',
    padding: 1,
  }
})
