import React, {useState, useEffect, useCallback} from 'react'
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import TextInput from './TextInput'
import { TouchableOpacity, Image } from 'react-native';
// import SendIcon from '@mui/icons-material/Send';
import './Chat.js';

import firebase from 'firebase/app';

import { storage, store, authenticate } from "../App.js";
const convo = String(Math.floor(Math.random()*1000000000000000))

export default function ChatScreen({ navigation }) {
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([])
  useEffect(() => {
      store.collection('messages').doc(convo).collection('convo').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()))
      })
  }, [])

   async function sendMessage(e) {
        e.preventDefault()
        const uid = authenticate.currentUser.uid
        const avatar = authenticate.currentUser.photoURL

        if (message.length > 0){
          await store.collection('messages').doc(convo).set({
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })

          await store.collection('messages').doc(convo).collection('convo').add({
              text: message,
              avatar,
              uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        }
        setMessage('')
    }

  class StyleSheets {
    static create(obj) {
      var result = {};
      for (var key in obj) {
        result[key] = obj[key]
      }
      return result;
    }
  }  

  const styles = StyleSheets.create({
    msg: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 10,
      paddingLeft: 0,
      paddingRight: 10,
      margin: 5,
      marginTop: 40,
      borderRadius: 4,
      alignItems: 'center',
      color: 'white',
      backgroundColor: 'blue',
      width: '20%',
    },
  });

  return (
    <Background>
     <ScrollView>
      <Navbar />
      <View className="container">
        <View className="contacts"></View>
        <View className="msgs">
              {messages.map(({ id, text, photoURL, uid }) => (
                  <View>
                      <View key={id} style={styles.msg} className={`msg ${uid === authenticate.currentUser.uid ? 'sent' : 'received'}`}>
                          <Image src={photoURL} alt="" />
                          <Text>{text}</Text>
                      </View>
                  </View>
              ))}
        </View>
      </View>
      <TextInput 
       style={{ width: '78%', fontSize: 15, fontWeight: '600', marginLeft: 5, marginBottom: -3 }}
       theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
       placeholder='Message...'
       value={message}
       onChangeText={e => setMessage(e)} />
      <TouchableOpacity onPress={sendMessage}>
      <Text>Search</Text>
      </TouchableOpacity>
      </ScrollView>
    </Background>
  )
}

