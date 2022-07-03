import React, {useEffect, useRef, useState, setState} from 'react'
import { Image, StyleSheet, Text, View, ScrollView, Alert, Platform } from "react-native";
import Logo from './Logo'
import Footer from './Footer'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';
import Button from './Button'

import firebase from 'firebase/app';
import 'firebase/auth';
import AppleAuth from './AppleAuth.js';

export default function StartScreen(props) {

  function logIn(){}

  const [usersc, setUserSc] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  var profile = function(){
    navigation.navigate('LoginScreen')
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
           console.log("GRAPH", response)
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
          console.log(response)
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

  const styles = StyleSheet.create({
    button: {
      borderRadius: 1,
      backgroundColor: 'green',
    },
    buttons: {
      borderRadius: 1,
      backgroundColor: '#4267B2',
    },
    login: {
      marginTop: 100,
      alignItems: 'center',
      borderRadius: 80,
      padding: 20,
    },
    facebook: {
      backgroundColor: '#4267B2',
    },
    headline: {
      fontWeight: "bold",
      fontSize: 25,
      width: 271,
      marginRight: 'auto',
      textAlign:'center',
      marginLeft: 'auto',
    },
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  })

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.headline}>Make new connections based on interests</Text>
      <ScrollView>
        <View style={styles.login}>
        <Button
          mode="outlined"
          color='white'
          style={styles.button}
          onPress={profile}>Login
        </Button>
        
        <Button
          mode="outlined"
          style={styles.buttons}
          color='white'
          onPress={logIn}>Facebook Sign In
        </Button>
        <AppleAuth login={props.route.params.login}/>
      </View>
      </ScrollView>
      <Footer />
    </View>
  )
}
