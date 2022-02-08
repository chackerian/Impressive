import React, { useState, useEffect } from 'react'
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from 'expo-image-picker';
import { Image, StyleSheet, Text, View } from "react-native";
import Button from './Button'
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

export default function ImageScreen(props) {

  const [image, setImage] = useState(null);
  const [url, setImageURL] = useState("");

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var filename = "images/" + "IMG" + Math.round(Math.random()*100)

    var refs = firebase.storage().ref().child(filename);
    refs.put(blob).then((snapshot) => {
      firebase.storage().ref(filename).getDownloadURL()
        .then((url) => {
          setImageURL(url);
          var user = props.route.params.user.email
          firebase.firestore().collection('users').doc(user).update({
            picture: url
          })
      })

    })

  }

  let openImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    setImage(pickerResult.uri);

    if (!pickerResult.cancelled) {
      uploadImage(pickerResult.uri)
    }
  }
  
  return (
      <View style={styles.container}>
      <Button
        mode="outlined"
        color="black"
        onPress={openImagePicker}>Upload Image</Button>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 30,
  }
})

