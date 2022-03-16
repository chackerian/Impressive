import React, {useState, useEffect, useCallback} from 'react'
import {View, ScrollView, Text, Button, StyleSheet, FlatList, useWindowDimensions, Platform} from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import TextInput from './TextInput'
import { TouchableOpacity, Image } from 'react-native';

import firebase from 'firebase/app';

import { storage, store, authenticate } from "../App.js";

// Random number
const convo = String(Math.floor(Math.random()*1000000000000000))

export default function ChatScreen(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [matches, setMatches] = useState([])

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

  const matchSnap = store.collection('users').doc(props.route.params.user.email)

  matchSnap.get().then((doc) => {
      setMatches(doc.data().matches)
  })

  console.log("MATCHES", matches)

  // let DATA = []
  // matches.forEach((key)=>{
  //   DATA.push({title: key})
  // }); 

  const Item = ({ name }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
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
    msge: {
      flexDirection: "row",
      color: 'white',
    },
    message: {
      alignSelf: "flex-start",
      margin: 10,
      borderRadius: 20,
      borderWidth: 10,
      borderColor: "blue",
      color: 'white',
      backgroundColor: 'blue',
    },
    sendMessage: {
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: '#e7e6e7',
    }
  });

  const window = useWindowDimensions();
  const msgStyle = { maxHeight: window.height-400, overflow: 'scroll', minHeight: 200}

  return (
    <Background>
     <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.contacts}>
          <FlatList
            data={matches}
            renderItem={renderItem}
          /> 
        </View>
        <View style={styles.messagesBox}>
          <View style={msgStyle}>
              {messages.map(({ id, text, photoURL, uid }) => (
                  <View key={id} style={styles.message}>
                      <Image src={photoURL} alt="" />
                      <Text style={styles.msge}>{text}</Text>
                  </View>
              ))}
          </View>
          <View style={styles.sendMessage}>
            <TextInput 
               style={{ width: '78%', fontSize: 15, marginLeft: 15, outline: 'none' }}
               placeholder='Message...'
               value={message}
               onChangeText={e => setMessage(e)} 
               onSubmitEditing={(event) => sendMessage(event)}
            />
        </View>
       </View>
      </View>
      </ScrollView>
    </Background>
  )
}

