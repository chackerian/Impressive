import React, {useEffect, useRef, useState, setState} from 'react'
import {StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import Button from './Button'
import TextInput from './TextInput'
import * as Facebook from "expo-auth-session/providers/facebook";
import { useNavigation } from '@react-navigation/native';
import NavLogout from './NavLogout';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import firebase from 'firebase/app';
import { storage, store } from "../App.js";

export default function SettingsScreen(props) {

  const [about, setAbout] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [locationString, setLocationString] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const navigation = useNavigation();

  const getAge = age => Math.floor((new Date() - new Date(age).getTime()) / 3.15576e+10)

  function save(){
    var user = props.route.params.user.email
    var userAge = getAge(date)
    console.log("INFO", date, userAge, location, locationString)
    store.collection('users').doc(user).update({
      name: name || "",
      about: about || "",
      interests: interests || "",
      birthday: date || "",
      age: userAge || "",
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

  useEffect(() => {
    initValues()
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
          value={name}
          onChangeText={setName}
        />

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
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          value={about}
          onChangeText={setAbout}
          style={[styles.textInput]}
        />
        
        <TextInput
          multiline
          numberOfLines={3}
          label="Interests"
          placeholderTextColor="#666666"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
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
          onPress={save}>Connect Facebook</Button>

        <Button
          mode="outlined"
          color='black'
          onPress={save}>Save</Button>
        </View>
    </ScrollView>
  )
}
