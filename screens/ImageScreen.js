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
  const [color, setColorValue] = useState("");

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

  const setColor = (color) => {
    setColorValue(color)
  }

  // const dropped = (event) => {
  //   event.preventDefault();
  //   let dataTransferItemsList = []
  //   if (event.dataTransfer) {
  //     console.log('pic', event.dataTransfer);
  //     const dt = event.dataTransfer
  //     if (dt.files && dt.files.length) {
  //       dataTransferItemsList = dt.files
  //     } else if (dt.items && dt.items.length) {
  //       dataTransferItemsList = dt.items
  //     }
  //   } 

  //   if (event.target && event.target.files) {
  //     dataTransferItemsList = event.target.files
  //     console.log('files', event.target.files);
  //   }
  // }

        //   onDragEnter={(event) => dropped(event)}
        // onDrop={(event) => dropped(event)}
        // onDragLeave={setColor('black')}

  return (
      <View style={styles.container}
        onClick={openImagePicker}
        onDragOver={setColor('blue')}
      >
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
    minHeight: 150,
    border: '2px dashed black',
    cursor: 'pointer',
  }
})

