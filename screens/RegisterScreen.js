import React, { useState } from 'react'
import { Alert, View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
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
import { useMediaQuery } from "react-responsive";
import SearchLocationInput from './SearchLocationInput'

import firebase from 'firebase/app';
import 'firebase/auth';
import { authenticate } from "firebase";

export default function RegisterScreen(props) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [LatLng, setLatLng] = useState({})

  const isDeviceMobile = useMediaQuery({
      query: "(max-width: 1224px)",
  });

  function logIn(){}

  const navigation = useNavigation();

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

  function InterestsNavigate() {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const locationError = nameValidator(location)
      var data = {
          name: name.value,
          email: email.value,
          password: password.value,
          location: location,
          lat: LatLng.lat,
          lng: LatLng.lng,
        }
    console.log(data)
    if (emailError || nameError || locationError) {
      console.log("ERROR", emailError, passwordError, nameError)
    } else {
      navigation.navigate("AddInterestsScreen", data)
    }
  }

  if (isDeviceMobile || Platform.OS == "ios"){

    return (
    <View style={{ height: "100%" }}>
      <View style={styles.box2}></View>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <BackButton onPress={() => navigation.goBack()} goBack={navigation.goBack} />
          <Logo goBack={() => navigation.goBack()} style={styles.mobilelogo} />
            <View style={styles.login}>
              <View style={styles.form}>
                <TextInput
                  label="Name"
                  returnKeyType="next"
                  value={name.value}
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: 200, height: 60 }}
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  error={!!name.error}
                  errorText={name.error}
                />
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: 200, height: 60 }}
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
                  style={{ width: 200, height: 60 }}
                  value={password.value}
                  onChangeText={(text) => setPassword({ value: text, error: '' })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                />
                <SearchLocationInput style={{width: 200, height: 60}} location={location} setLatLng={(val) => {setLatLng(val)}} setLocation={setLocation} />
              </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
              style={styles.button}
              onPress={() => InterestsNavigate()}>Next
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
                  style={{ width: 200 }}
                  onChangeText={(text) => setName({ value: text, error: '' })}
                  error={!!name.error}
                  errorText={name.error}
                />
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
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
                  theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
                  style={{ width: 200 }}
                  value={password.value}
                  onChangeText={(text) => setPassword({ value: text, error: '' })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                />
               <SearchLocationInput style={{width: 200, height: 60}} location={location} setLatLng={(val) => {setLatLng(val)}} setLocation={setLocation} />
              </View>
            <Button
              mode="outlined"
              color='white'
              width="100vh"
              style={styles.button}
              onPress={() => InterestsNavigate()}>Next
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
