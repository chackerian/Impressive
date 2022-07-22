import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, View } from "react-native";

import SettingsButton from './SettingsButton'
import EditImageButton from './EditImageButton'
import Background from './Background'

import { HiLocationMarker } from 'react-icons/hi'
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar'

import { store } from "../App.js";

export default function Dashboard(props) {
  const navigation = useNavigation();
  const [ userData, setUserData ] = useState({});
  const [ interests, setInterests ] = useState([]);

function data(){
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setUserData(doc.data());
        console.log(doc.data().picture)
        if(doc.data().interests){
          setInterests(doc.data().interests)
        }
      }
    });
}

  useEffect(() => {
    data()
  }, [])

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
      width: 350,
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
      paddingBottom: 20,
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
    tag: {
      backgroundColor: "green",
      color: "white",
      width: "fit-content",
      borderRadius: 7,
      paddingVertical: 5,
      paddingHorizontal: 2,
      marginRight: 2,
    },
    interestContainer: {
      display: "flex",
      flexDirection: "row",
    },
    locationContainer: {
      display: "flex",
      flexDirection: "row",
    }
  })

  return (
    <Background>
    <View style={styles.container}>
    <Navbar />
      <View style={styles.info}>
        <Image source={{uri: userData.picture}} style={styles.image} />
        <Text style={styles.name}>{userData.name}</Text>
        <EditImageButton nav={imagesettings}/>
        <SettingsButton nav={settings}/>
        <View style={styles.details}>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>{userData.location}</Text><HiLocationMarker />
          </View>
          <Text style={styles.about}>{userData.about}</Text>
          <View style={styles.interestContainer}>
          {interests.map((i) => {
            return (
              <Text style={styles.tag}>{i.text}</Text>
            )
          })}
          </View>
        </View>
      </View>
    </View>
  </Background>
  )
}