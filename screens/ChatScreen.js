import React, {useState, useEffect, useCallback, Component} from 'react'
import {View, ScrollView, Text, Button, StyleSheet, FlatList, useWindowDimensions, Platform, TouchableOpacity, Image} from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import BackButton from './BackButton'
import ChatInput from './ChatInput'
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {FontAwesomeIcon as FontAwesomeReact} from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import firebase from 'firebase/app';
import { storage, store, authenticate } from "../App.js";

export default function ChatScreen({route}, props) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [scrollView, setScrollView] = useState("");
  const navigation = useNavigation();
  const { chatId } = route.params;
  const { user } = route.params;

  const window = useWindowDimensions();
  const msgStyle = { maxHeight: window.height-400, overflow: 'scroll', minHeight: 200}

  useEffect(() => {
    console.log("CHAT ID:", chatId)
    store.collection('messages').doc(chatId).collection('convo').orderBy('createdAt').onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()))
    })
  }, [chatId])

  async function sendMessage(e) {
      e.preventDefault()
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
      height: window.height - 200,
      overflow: 'scroll',
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
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
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
     <View>
     <BackButton onPress={() => navigation.goBack()} goBack={navigation.goBack} />
       <ScrollView bounces={false} style={styles.container} ref={ref => {setScrollView(ref)}} onContentSizeChange={() => scrollView.scrollToEnd({animated: true})}>
          {messages.map(({ id, text, sender, uid }, index) => {
            if (sender == user) {
              var senderStyle = styles.sent
            } else {
              var senderStyle = styles.message
            }
            return(
              <View key={index}><Text style={styles.message, senderStyle}>{text}</Text></View>
            )
          })}
        </ScrollView>
        <View style={styles.sendMessage}>
          <ChatInput 
             style={{ width: "90%", marginLeft: 20, fontSize: 15, outline: 'none', height: 40, display: "flex"}}
             theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
             placeholder='Message...'
             value={message}
             onChangeText={e => setMessage(e)} 
             onSubmitEditing={(event) => sendMessage(event)}
          />
          <TouchableOpacity style={{display: "flex", marginTop: 20, marginLeft: 0}} onPress={(event) => sendMessage(event)}>
            <FontAwesomeIcon icon={ faCaretRight } size={ 26 } />
          </TouchableOpacity>
      </View>
    </View>
    </Background>
    )

}