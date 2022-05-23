import React, {useEffect, useRef, useState, setState} from 'react'
import {StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import Button from './Button'
import TextInput from './TextInput'
import SearchLocationInput from './SearchLocationInput'
import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';
import NavLogout from './NavLogout';
import DateTimePicker from '@react-native-community/datetimepicker';
import InstagramLogin from 'react-instagram-login';

import firebase from 'firebase/app';
import { storage, store } from "../App.js";

export default function SettingsScreen(props) {

  function logIn(){}

  const [about, setAbout] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [a, setA] = useState('');
  const [locationString, setLocationString] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);
  const [instaDialog, setInstaDialog] = useState()

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const navigation = useNavigation();

  const getAge = age => Math.floor((new Date() - new Date(age).getTime()) / 3.15576e+10)

  function save(){
    var user = props.route.params.user.email
    var userAge = getAge(date)
    if (location){
      setCity(location.split(",")[0])
      setState(location.split(",")[1])
    }
    console.log("INFO", location, a)
    store.collection('users').doc(user).update({
      name: name,
      about: about,
      city: city,
      state: state,
      location: location,
      interests: interests,
      birthday: date,
      age: userAge,
    })
    navigation.navigate("Dashboard")
  }

  function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        console.log("DOC", doc.data())
        setName(doc.data().name || "");
        setInterests(doc.data().interests || "");
        setAbout(doc.data().about || "");
        // setDate(doc.data().birthday);
        setLocation(doc.data().location);
      }
    });
  }

    if (Platform.OS == "web") {
      console.log("WEB")
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
         FB.api('/me?fields=email,picture.type(normal),name', function(response) {
           console.log("GRAPH", response)
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
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

  }

  const authHandler = (err, data) => {
    console.log("INSTA", err, data);
  };

  useEffect(() => {
    initValues()
    setTimeout(function() {console.log("INSTA DIALOG", instaDialog)}, 4000)
    // instaDialog.showDialog();
  },[])

  const styles = StyleSheet.create({
    containers: {
      alignItems: 'center',
      height: '90%',
    },
    buttons: {
      color: 'black',
       height: 10,
    },
    locations: {
      width: 300,
      height: 10,
    },
    container: {
      flex: 1,
      padding: 10,
      width: 220,
    }
  });

  const responseInstagram = (response) => {
    console.log("INSTA RESP", response);
  }

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
    <NavLogout logout={props.route.params.logout}/>
      <View style={styles.containers}>
        <TextInput
          label="Name"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.container}>
        <SearchLocationInput location={location} city={setCity} state={setState} setLocation={setLocation}/>
        </View>

        <DateTimePicker
          style={{width: 200, height: 30}}
          value={date}
          mode="date"
          placeholder="select date"
          onChange={onChange}
        />

        <TextInput
          multiline
          numberOfLines={3}
          label="About Me"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue', underlineColor:'transparent',}}}
          value={about}
          onChangeText={setAbout}
          style={[styles.textInput]}
        />
        
        <TextInput
          multiline
          numberOfLines={3}
          label="Interests"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue', underlineColor:'transparent',}}}
          value={interests}
          onChangeText={setInterests}
        />

        <Button
          mode="outlined"
          color='black'
          onPress={save}>Connect Instagram</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={logIn}>Connect Facebook</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={save}>Save</Button>
        </View>
    </ScrollView>
  )
}
