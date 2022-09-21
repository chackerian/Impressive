import React, { useState } from 'react'
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from './Background'
import Logo from './Logo'
import Button from './Button'
import TextInput from './TextInput'
import Navbar from './Navbar'
import BackButton from './BackButton'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMediaQuery } from "react-responsive";
import TagInput from './TagInput.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import { authenticate } from "firebase";

export default function AddInterestsScreen(props) {

  const isDeviceMobile = useMediaQuery({
      query: "(max-width: 1224px)",
  });

  const navigation = useNavigation();
  const route = useRoute();
  const [tags, setTags] = useState([])
  const [age, setAge] = useState({ value: '', error: '' })

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification()
  }

  const createUser = async (email, password, name, location, tags, lat, lng, age) => {
     firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((userCredential) => {
       const user = userCredential.user;
       if(user) {
        var newUser = {
          name: name,
          email: email,
          location: location,
          lat: lat,
          lng: lng,
          interests: tags,
          age: age
        }
        sendVerificationEmail()
        props.route.params.login(newUser);
       }

     })
     .catch((e) => {
      console.log(" error happened ", e)
     })
  }

  const onSignUpPressed = () => {
    const email = route.params.email
    const password = route.params.password
    const name = route.params.name
    const location = route.params.location
    const lat = route.params.lat
    const lng = route.params.lng
    createUser(email, password, name, location, tags, lat, lng, age.value)
  }

  if (isDeviceMobile){

    return (
    <View style={{ height: "100%" }}>
      <View style={styles.box2}></View>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <BackButton onPress={() => navigation.goBack()} goBack={navigation.goBack} />
          <Logo goBack={() => navigation.goBack()} style={styles.mobilelogo} />
            <View style={styles.login}>
              <TextInput
                  label="Age"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: 100 }}
                  value={age.value}
                  onChangeText={(text) => setAge({ value: text, error: '' })}
                  error={!!age.error}
                  errorText={age.error}
                />
              <View style={styles.form}>
                <TagInput
                  tags={tags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                />
              </View>
            <Button
              mode="outlined"
              color='white'
              style={styles.button}
              onPress={onSignUpPressed}>Register
            </Button>
          </View>
        </View>
      </View>
    </View>
  )

  } else {

  return (
    <View style={{ height: "100%" }}>
      <View style={styles.box}></View>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Logo goBack={() => navigation.goBack()}/>
          <Text style={styles.headline}>Make new connections based on interests</Text>
        </View>
        <BackButton onPress={() => navigation.goBack()} goBack={navigation.goBack} />
        <View style={styles.rightContainer}>
            <View style={styles.login}>
                <TextInput
                  label="Age"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: 100 }}
                  value={age.value}
                  onChangeText={(text) => setAge({ value: text, error: '' })}
                  error={!!age.error}
                  errorText={age.error}
                />
              <View style={styles.form}>
               <TagInput
                  tags={tags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                />
            </View>
            <Button
              mode="outlined"
              color='white'
              style={styles.button}
              onPress={onSignUpPressed}>Register
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
  }
}

  const styles = StyleSheet.create({
    forgotPassword: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'column',
      marginTop: 4,
      alignItems: 'center',
    },
    forgot: {
      fontSize: 13,
      color: "red",
    },
    link: {
      fontWeight: 'bold',
    },
    form: {
      alignItems: 'center',
      padding: 0,
      width: "100%",
    },
    default: {
      backgroundColor: 'blue',
      width: 300
    },
    button: {
      borderRadius: 5,
      borderWidth: 0,
      backgroundColor: '#018002',
      width: 200,
    },
    login: {
      alignItems: 'center',
    },
    headline: {
      fontWeight: "bold",
      fontSize: 25,
      width: 300,
      marginRight: 'auto',
      textAlign:'center',
      marginLeft: 'auto',
      color: "white"
    },
    headline2: {
      fontWeight: "bold",
      fontSize: 25,
      width: 273,
      textAlign:'center',
      color: "black",
      fontFamily: ""
    },
    container: {
      width: "85%",
      height: 570,
      maxHeight: "85%",
      marginTop: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "auto",
      display: "flex",
      flexDirection: "row",
      shadowColor: "rgba(0,0,0,0.30)",
      backgroundColor: "white"
    },
    leftContainer: {
      backgroundColor: "#018002",
      width: "40%",
      textAlign:'center',
      justifyContent: 'center'
    },
    rightContainer: {
      justifyContent:'center',
      alignContent: 'center',
      width: "60%",
      alignItems: "center"
    },
    mainContainer: {
      justifyContent:'center',
      alignContent: 'center',
      width: "100%",
      alignItems: "center"
    },
    box: {
      width: "41.5%",
      height: "100%",
      backgroundColor: "#018002",
      position: "absolute",
    },
    box2: {
      width: "50%",
      height: "100%",
      backgroundColor: "#018002",
      position: "absolute",
    },
    mobilelogo: {
      marginTop: "0",
      backgroundColor: "red",
      marginBottom: 0
    },
  })
