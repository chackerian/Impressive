import React, {useState, useEffect, useCallback} from 'react'
import {View, ScrollView, Text, Button, StyleSheet, FlatList, useWindowDimensions, Platform, TouchableOpacity, Image} from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import TextInput from './TextInput'

import firebase from 'firebase/app';

import { storage, store, authenticate } from "../App.js";

export default function MessageScreen(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [matches, setMatches] = useState([])
  const [selectedId, setSelectedId] = useState("");

  const window = useWindowDimensions();
  const msgStyle = { maxHeight: window.height-400, overflow: 'scroll', minHeight: 200}

  useEffect(() => {
      store.collection('users').doc(props.route.params.user.email).get().then((doc) => {
          if(doc.data()){
            setMatches(doc.data().matches)
            console.log(doc.data().matches)
          }
      })

  }, [])

   async function sendMessage(e) {
      e.preventDefault()

      if (message.length > 0){
        await store.collection('messages').doc(selectedId).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        await store.collection('messages').doc(selectedId).collection('convo').add({
            text: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      }
      setMessage('')
  }

  function chooseConvo(x){
    console.log(selectedId, x)
    setSelectedId(x)
    console.log(selectedId)
    store.collection('messages').doc(x).collection('convo').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => doc.data()))
    })
    console.log("MESSAGES", messages)
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.conversation === selectedId ? "blue" : "white";
    const color = item.conversation === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        style={{width: "100%"}}
        onPress={() => chooseConvo(item.conversation)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

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

  return (
    <Background>
     <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.contacts}>
          <FlatList
            data={matches}
            renderItem={renderItem}
            keyExtractor={(item) => item.conversation}
            extraData={selectedId}
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

