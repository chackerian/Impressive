import React, {useEffect, useRef, useState, setState} from 'react'
import {StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Share } from 'react-native';
import Button from './Button'
import TextInput from './TextInput'
import SearchLocationInput from './SearchLocationInput'
import { useNavigation } from '@react-navigation/native';
import * as Facebook from 'expo-facebook';
import NavLogout from './NavLogout';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WithContext as ReactTags } from 'react-tag-input';

import firebase from 'firebase/app';
import { storage, store } from "../App.js";

export default function SettingsScreen(props) {

  const [userData, setUserData] = useState({
    name: '',
    age: '',
    city: '',
    state: '',
    about: '',
    interests: [],
    date: '',
  });
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState([])

  const navigation = useNavigation();

  function logIn(){}

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Impressive - Make New Connections Through Interests - https://socially-b729a.web.app/',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || userData.date;
    setUserData({...userData, date: currentDate});
  };

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

  function save(){
    var user = props.route.params.user.email
    if (userData.location){
      setUserData({...userData, city: userData.location.split(",")[0]})
      setUserData({...userData, state: userData.location.split(",")[1]})
    }

    console.log("userinfo", location)
    store.collection('users').doc(user).update({
      name: userData.name,
      about: userData.about,
      city: userData.city || "",
      state: userData.state || "",
      location: location || "",
      interests: tags,
      birthday: "",
      age: userData.age || "",
    })
    navigation.navigate("Dashboard")
  }

  function instaLogin(){
    window.open("https://localhost:3000/auth/instagram/?email="+props.route.params.user.email, "_self")
  }

  function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setTags(doc.data().interests)
        setUserData(doc.data());
        setLocation(doc.data().location)
      }
    });
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
         FB.api('/me?fields=email,picture.type(normal),name', function(response) {

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
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

  }

  useEffect(() => {
    initValues()
  },[])

  const styles = StyleSheet.create({
    containers: {
      paddingTop: 20,
      alignItems: 'center',
      height: '90%',
    },
    input: {
      backgroundColor: "#e7e7e7",
      paddingLeft: 10,
      paddingTop: 20,
      paddingBottom: 20,
      width: "26em",
      fontSize: 20,
  },
  });

  return (
    <View>
    <NavLogout logout={props.route.params.logout}/>
      <View style={styles.containers}>
        <TextInput
          label="Name"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          style={{ width: 300}}
          value={userData.name}
          onChangeText={(val) => { setUserData({...userData, name: val}) }}
        />
        <SearchLocationInput style={{ width: 300}} location={location} setLocation={(val) => {setLocation(val)}}/>

        <TextInput
          multiline
          numberOfLines={3}
          label="About Me"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue', underlineColor:'transparent',}}}
          style={{ width: 300}}
          value={userData.about}
          onChangeText={(val) => { setUserData({...userData, about: val}) }}
        />

        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          style={{ width: 300}}
          placeholder="Enter Interests"
          autocomplete
        />

        <Button
          mode="outlined"
          color='black'
          onPress={instaLogin}>Connect Instagram</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={logIn}>Connect Facebook</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={onShare}>Share</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={save}>Save</Button>
        </View>
      </View>
  )
}