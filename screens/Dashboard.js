import React, { useState, useEffect, forceUpdate } from 'react'
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";

import Button from './Button'
import SettingsButton from './SettingsButton'
import EditImageButton from './EditImageButton'
import Background from './Background'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar'

import { storage, store } from "../App.js";

export default function Dashboard(props) {
  const navigation = useNavigation();
  const user = props.route.params.user
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState([]);
  const [image, setImage] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [instagram, setInstagram] = useState('');

    var docRef = store.collection('users').doc(props.route.params.user.email) 
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setName(doc.data().name);
        setAge(doc.data().age);
        setInterests(doc.data().interests);
        setAbout(doc.data().about);
        setImage(doc.data().picture)
        setCity(doc.data().city)
        setState(doc.data().state)
      }
    });

  function settings () {
    navigation.navigate('Settings')
  } 

  function imagesettings () {
    navigation.navigate('Image')
  } 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    name: {
      paddingTop: 15,
      fontSize: 30,
      fontWeight: 'bold',
    },
    image: {
      width: 100,
      height: 100,
      marginTop: 30,
      borderRadius: 50,
    },
    instaimage: {
      width: 50,
      height: 50,
      marginLeft: 15,
      display: 'flex',
    },
    details: {
      marginTop: 30,
      padding: 30,
      width: 300,
      alignItems: 'center',
      color: 'white',
      backgroundColor: '#0b0034',
      borderRadius: 1,
    },
    info: {
      alignItems: 'center',
      marginTop: 90,
    },
    instagram: {
      width: '220px',
      display: 'flex',
      marginTop: '20px',
      flexWrap: 'wrap',
    },
    location: {
      color: "blue",
      fontWeight: "bold",
      fontSize: 20,
    },
    about: {
      color: "white",
      paddingTop: 20,
      fontSize: 20,
    },
    interests: {
      paddingTop: 20,
      color: "white",
      fontSize: 20,
    },
    interest: {
      backgroundColor: 'blue',
      color: 'white',
    },
    photos: {
      width: '150px',
      height: '150px',
      position: 'relative',
      overflow: 'hidden',
      margin: 5,
    },
  })

  return (
    <Background>
    <View style={styles.container}>
    <Navbar />
      <View style={styles.info}>
        <Image source={{uri: image}} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <EditImageButton nav={imagesettings}/>
        <SettingsButton nav={settings}/>
        <View style={styles.details}>
          <FontAwesomeIcon icon={ faLocationArrow } size={30} color={"blue"} /><Text style={styles.location}>{city}, {state}</Text>
          <Text style={styles.about}>{about}</Text>
          <Text style={styles.interests}>Interests:</Text>
        </View>
      </View>
    </View>
  </Background>
  )
}
