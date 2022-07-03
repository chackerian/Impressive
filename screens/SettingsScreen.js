import React, {useEffect, useRef, useState, setState} from 'react'
import {StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Button from './Button'
import TextInput from './TextInput'
import SearchLocationInput from './SearchLocationInput'
import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';
import NavLogout from './NavLogout';
import DateTimePicker from '@react-native-community/datetimepicker';
import InstagramLogin from 'react-instagram-login';
// import './InstagramAuth'
import { WithContext as ReactTags } from 'react-tag-input';

import firebase from 'firebase/app';
import { storage, store } from "../App.js";

export default function SettingsScreen(props) {

  function logIn(){}

  const [about, setAbout] = useState('');
  const [insta, setInsta] = useState();
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
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
    console.log('The tag at index ' + index + ' was clicked');
  };

  function save(){
    var user = props.route.params.user.email
    var userAge = getAge(date)
    if (location){
      setCity(location.split(",")[0])
      setState(location.split(",")[1])
    }
    console.log("INFO", tags)
    store.collection('users').doc(user).update({
      name: name,
      about: about,
      city: city,
      state: state,
      location: location,
      interests: tags,
      birthday: date,
      age: userAge,
    })
    navigation.navigate("Dashboard")
  }

  window.onload = function(){
      alert("test")
    }

  function instaLogin(){
    window.onmessage = function (e) {
      if (e.data) {
        var codesent = e.data.data
        console.log("CODE", codesent)
      }
    };

    var win = window.open("https://www.instagram.com/oauth/authorize/?app_id=445757196713182&redirect_uri=https://socially-b729a.web.app/&scope=user_profile,user_media&response_type=code", 'window', 'height=500,width=500')
    console.log("URl", win.location.href)
    if(win.location.href.startsWith("https://socially")){
      var code = win.location.search.match(/.*code=([^&|\n|\t\s]+)/)[1] || [];
      console.log("CODE", code)
      win.opener.postMessage(
          {
            type: "code",
            data: "ASD"
          },
          "*"
      );
      win.close()
    }
    // }
  }

  function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        console.log("DOC", doc.data())
        setName(doc.data().name || "");
        setTags(doc.data().interests || []);
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
        
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />

        <Button
          mode="outlined"
          color='black'
          onPress={() => instaLogin()}>Connect Instagram</Button>

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
