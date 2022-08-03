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
import { WithContext as ReactTags } from 'react-tag-input';

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

  const handleTagClick = index => {

  };

  function logIn(){}

  const createUser = async (email, password, name, location) => {
     firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((userCredential) => {
       const user = userCredential.user;
       if(user) {
        var newUser = {
          name: name,
          email: email,
          location: location,
          interests: tags
        }
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
    console.log(email, password, name, location)
    createUser(email, password, name, location, tags)
  }

  if (Platform.OS == "web") {

    require('./fb')

      window.fbAsyncInit = function() {
        FB.init({
          appId            : '603428947262435',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v10.0'
        });
      };

      logIn = function() {

      FB.login(function(response) {
        if (response.authResponse) {
         FB.api('/me?fields=email,picture.type(large),name', function(response) {

           props.route.params.login(response)
         });
        }
    }, {scope: 'public_profile,email'});

  }

  } else {

  logIn = async function() {
      try {
        await Facebook.initializeAsync({
          appId: '603428947262435',
        });
        const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?fields=email,picture.type(large),name&access_token=${token}`);

          var user = (await response.json())
          props.route.params.login(user)
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

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
              <View style={styles.form}>
                <ReactTags
                  tags={tags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleTagClick={handleTagClick}
                  inputFieldPosition="bottom"
                  style={styles.input}
                  placeholder="Enter Interests"
                  autocomplete
                />
              </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
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
              <View style={styles.form}>
                <ReactTags
                  tags={tags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleTagClick={handleTagClick}
                  inputFieldPosition="bottom"
                  style={styles.input}
                  placeholder="Enter Interests"
                  autocomplete
                />
            </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
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
    body: {
      width: "100%",
      height: "100%"
    },
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
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
    button: {
      borderRadius: 5,
      borderWidth: 0,
      backgroundColor: '#018002',
      width: "80%",
      minWidth: "80%",
    },
    buttons: {
      borderRadius: 5,
      borderWidth: 0,
      width: "80%",
      minWidth: "80%",
      backgroundColor: '#4267B2',
    },
    login: {
      alignItems: 'center',
    },
    facebook: {
      backgroundColor: '#4267B2',
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
      flex: 1,
      width: "85%",
      maxHeight: "85%",
      margin: "auto",
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
