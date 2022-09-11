import React, { useState} from 'react'
import { StyleSheet, Text, View, Alert, Platform, TouchableOpacity } from "react-native";
import Logo from './Logo'
import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';
import Button from './Button';
import TextInput from './TextInput';
import { emailValidator } from './helpers/emailValidator';
import { passwordValidator } from './helpers/passwordValidator';
import { useMediaQuery } from "react-responsive";

import firebase from 'firebase/app';
import 'firebase/auth';
import AppleAuth from './AppleAuth.js';

export default function StartScreen(props) {

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const navigation = useNavigation();

   const isDeviceMobile = useMediaQuery({
        query: "(max-width: 1224px)",
    });

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        props.route.params.login(user)
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });

  }

  function logIn(){}

  const [usersc, setUserSc] = useState(null);
  const [user, setUser] = useState(null);

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
    button: {
      borderRadius: 5,
      borderWidth: 0,
      backgroundColor: '#018002',
      width: 200,
    },
    buttons: {
      borderRadius: 5,
      borderWidth: 0,
      width: 200,
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
      width: 271,
      marginRight: 'auto',
      textAlign:'center',
      marginLeft: 'auto',
      color: "white"
    },
    headline2: {
      fontWeight: "bold",
      fontSize: 25,
      width: 271,
      textAlign:'center',
      color: "black"
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
    topContainer : {
      backgroundColor: "#018002",
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
  })

  if (isDeviceMobile || Platform.OS == "ios"){
    return (
    <View style={{ height: "100%" }}>
      <View style={styles.box2}></View>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Logo />
          <Text style={styles.headline2}>Make new connections based on interests</Text>
            <View style={styles.login}>
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: '#018002', underlineColor:'transparent' }}}
                  style={{ width: 200 }}
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
                  theme={{ colors: { primary: '#018002',underlineColor:'transparent',}}}
                  style={{ width: 200 }}
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
              style={styles.button}
              onPress={onLoginPressed}>Login
            </Button>
            <Button
              mode="outlined"
              style={styles.buttons}
              color='white'
              onPress={logIn}>Facebook Sign In
            </Button>
            <View style={styles.forgotPassword}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ResetPasswordScreen')}>
                  <Text style={styles.forgot} onPress={() => firebase.auth().sendPasswordResetEmail("vaibhavyash28@gmail.com")}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>
            <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            <AppleAuth login={props.route.params.login}/>
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
          <Logo />
          <Text style={styles.headline}>Make new connections based on interests</Text>
        </View>
        <View style={styles.rightContainer}>
            <View style={styles.login}>
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: '#018002', underlineColor:'transparent' }}}
                  style={{ width: 200 }}
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
                  theme={{ colors: { primary: '#018002',underlineColor:'transparent',}}}
                  style={{ width: 200 }}
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
              onPress={onLoginPressed}>Login
            </Button>
            <View style={styles.forgotPassword}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ResetPasswordScreen')}>
                  <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>
            <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            <Button
              mode="outlined"
              style={styles.buttons}
              color='white'
              onPress={logIn}>Facebook Sign In
            </Button>
            <AppleAuth login={props.route.params.login}/>
          </View>
        </View>
      </View>
    </View>
  )
}
}
