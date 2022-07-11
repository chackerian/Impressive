import React, {useEffect, useRef, useState, setState} from 'react'
import {StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
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
    location: '',
    state: '',
    about: '',
    interests: [],
    date: '',
  });
  const [tags, setTags] = useState([])

  const navigation = useNavigation();

  function logIn(){}

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

    console.log("userinfo", userData)
    store.collection('users').doc(user).update({
      name: userData.name,
      about: userData.about,
      city: userData.city,
      state: userData.state,
      location: userData.location,
      interests: tags,
      birthday: "",
      age: userData.age,
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
        setUserData(doc.data());
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
    setTimeout(function() {}, 4000)
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

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
    <NavLogout logout={props.route.params.logout}/>
      <View style={styles.containers}>
        <TextInput
          label="Name"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          value={userData.name}
          onChangeText={(val) => { setUserData({...userData, name: val}) }}
        />
        <View style={styles.container}>
        <SearchLocationInput location={userData.location} city={(val) => { setUserData({...userData, city: val})}} state={(val) => { setUserData({...userData, state: val})}} setLocation={(val) => { setUserData({...userData, location: val})}}/>
        </View>

        <DateTimePicker
          style={{width: 200, height: 30}}
          value={userData.date}
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
          value={userData.about}
          onChangeText={(val) => { setUserData({...userData, about: val}) }}
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
          onPress={instaLogin}>Connect Instagram</Button>

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