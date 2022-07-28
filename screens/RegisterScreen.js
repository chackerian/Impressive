import React, { useState } from 'react'
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from './Background'
import Logo from './Logo'
import Button from './Button'
import TextInput from './TextInput'
import Navbar from './Navbar'
import BackButton from './BackButton'
import { useNavigation } from '@react-navigation/native';
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { nameValidator } from './helpers/nameValidator'
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";

import firebase from 'firebase/app';
import 'firebase/auth';
import { authenticate } from "firebase";

export default function RegisterScreen(props) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const isDeviceMobile = useMediaQuery({
      query: "(max-width: 1224px)",
  });

  const navigation = useNavigation();

  function logIn(){}

  const createUser = async (email, password, name) => {
     firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((userCredential) => {
       const user = userCredential.user;
       if(user) {
        var newUser = {
          name: name,
          email: email
        }
        props.route.params.login(newUser)
       }
      console.log("userCredential", user)
     })
     .catch((e) => {
      console.log(" error happened ", e)
     })
  }

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      console.log("ERROR", emailError, passwordError, nameError)
    }
    console.log("register", "EMAIL", email.value, "PASSWORD", password.value, "NAME", name.value)
    createUser(email.value, password.value, name.value)
      
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
          <Text style={styles.headline2}>Make new connections based on interests</Text>
            <View style={styles.login}>
              <View style={styles.form}>
                <TextInput
                  label="Name"
                  returnKeyType="next"
                  value={name.value}
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  error={!!name.error}
                  errorText={name.error}
                />
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  value={email.value}
                  onChangeText={(text) => setEmail({ value: text, error: '' })}
                  error={!!email.error}
                  errorText={email.error}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                />
                <TextInput
                  label="Password"
                  returnKeyType="done"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  value={password.value}
                  onChangeText={(text) => setPassword({ value: text, error: '' })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                />
              </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
              style={styles.button}
              onPress={onSignUpPressed}>Register
            </Button>
            <Button
              mode="outlined"
              style={styles.buttons}
              color='white'
              onPress={logIn}>Facebook Sign Up
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
                <TextInput
                  label="Name"
                  returnKeyType="next"
                  value={name.value}
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  error={!!name.error}
                  errorText={name.error}
                />
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  value={email.value}
                  onChangeText={(text) => setEmail({ value: text, error: '' })}
                  error={!!email.error}
                  errorText={email.error}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                />
                <TextInput
                  label="Password"
                  returnKeyType="done"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: "80%" }}
                  value={password.value}
                  onChangeText={(text) => setPassword({ value: text, error: '' })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                />
              </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
              style={styles.button}
              onPress={onSignUpPressed}>Register
            </Button>
            <Button
              mode="outlined"
              style={styles.buttons}
              color='white'
              onPress={logIn}>Facebook Sign Up
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
      borderRadius: "5px",
      borderWidth: "0",
      backgroundColor: '#018002',
      width: "80%",
      minWidth: "80%",
    },
    buttons: {
      borderRadius: "5px",
      borderWidth: "0",
      width: "80%",
      minWidth: "80%",
      backgroundColor: '#4267B2',
    },
    login: {
      alignItems: 'center',
      width: "inherit",
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
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
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
      marginTop: "0 !important",
      backgroundColor: "red",
      marginBottom: 0
    },
  })
