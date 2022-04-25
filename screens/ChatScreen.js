import React, {useState, useEffect, useCallback, Component} from 'react'
import {View, ScrollView, Text, Button, StyleSheet, FlatList, useWindowDimensions, Platform, TouchableOpacity, Image} from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import BackButton from './BackButton'
import TextInput from './TextInput'
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import firebase from 'firebase/app';

import { storage, store, authenticate } from "../App.js";

export default function ChatScreen({route}, props) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const navigation = useNavigation();
  const { chatId } = route.params;
  const { user } = route.params;

  const window = useWindowDimensions();
  const msgStyle = { maxHeight: window.height-400, overflow: 'scroll', minHeight: 200}

  store.collection('messages').doc(chatId).collection('convo').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => doc.data()))
  })

  async function sendMessage(e) {
      e.preventDefault()
      console.log("send chat")

      var convo = await store.collection('messages').doc(chatId)

      if (message.length > 0){
        console.log("MESSAGE", message)

        if (!convo){
          await store.collection('messages').doc(chatId).set({
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        }

        await store.collection('messages').doc(chatId).collection('convo').add({
            text: message,
            sender: user,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      }
      setMessage('')
  }

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#e7e6e7',
      marginTop: 80,
      marginLeft: 30,
      marginRight: 30,
    },
    contacts: {
      flex: 2,
      backgroundColor: 'white',
      borderRightWidth: 1,
      borderRightColor: '#e7e6e7',
    },
    messagesBox: {
      flex: 4,
      marginTop: 20,
    },
    item: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e7e6e7',
      marginHorizontal: 8,
    },
    message: {
      alignSelf: "flex-start",
      margin: 10,
      borderRadius: 20,
      borderWidth: 10,
      borderColor: "grey",
      color: 'white',
      backgroundColor: 'grey',
    },
    sent: {
      alignSelf: "flex-end",
      margin: 10,
      borderRadius: 20,
      borderWidth: 10,
      borderColor: "blue",
      color: 'white',
      backgroundColor: 'blue',
    },
    sendMessage: {
      height: 80,
      marginBottom: 30,
      borderTopWidth: 1,
      borderTopColor: '#e7e6e7',
    }
  });

  function back(){
    navigation.navigate("MessageScreen")
  }

return(
    <Background>
     <Navbar />
     <ScrollView bounces={false} style={styles.container}>
        {messages.map(({ id, text, sender, uid }, index) => {
          if (sender == user) {
            var senderStyle = styles.sent
          } else {
            var senderStyle = styles.message
          }
          return(
            <View><Text key={index} style={styles.message, senderStyle}>{text}</Text></View>
          )
        })}
      </ScrollView>
      <View style={styles.sendMessage}>
        <TextInput 
           style={{ width: '140%', fontSize: 15, marginLeft: 15, outline: 'none', height: 40}}
           theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
           placeholder='Message...'
           value={message}
           onChangeText={e => setMessage(e)} 
           onSubmitEditing={(event) => sendMessage(event)}
        />
        <TouchableOpacity onPress={(event) => sendMessage(event)}>
          <MaterialCommunityIcons name="send" style={{marginLeft: 20, marginTop: 0}} color={"blue"} size={26} />
        </TouchableOpacity>
    </View>
    </Background>
    )

}