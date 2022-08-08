import React, { useState, useEffect, useCallback, Component } from 'react'
import { View, ScrollView, Text, StyleSheet, FlatList, useWindowDimensions, Platform, TouchableOpacity, Image } from 'react-native'
import Background from './Background'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Navbar from './Navbar'
import BackButton from './BackButton'
import TextInput from './TextInput'
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {FontAwesomeIcon as FontAwesomeReact} from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Button from './Button'

import firebase from 'firebase/app';
import { storage, store, authenticate } from "../App.js";

export default function MessageScreen(props) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [matches, setMatches] = useState([])
    const [selectedId, setSelectedId] = useState("");
    const navigation = useNavigation();

    const [scrollView, setScrollView] = useState("");
    const window = useWindowDimensions();
    const width = window.width
    const msgStyle = { maxHeight: window.height - 400, overflow: 'scroll', minHeight: 200 }

    useEffect(() => {
        var docRef = store.collection('users').doc(props.route.params.user.email)
        docRef.get().then((doc) => {
            if (doc.exists) {
                setMatches(doc.data().matches)
            } 
        });

    }, [])

    async function sendMessage(e) {
        e.preventDefault()

        if (message.length > 0) {
            await store.collection('messages').doc(selectedId).set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })

            await store.collection('messages').doc(selectedId).collection('convo').add({
                text: message,
                sender: props.route.params.user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
        setMessage('')
    }

    function chooseConvo(x) {
        setSelectedId(x)
        store.collection('messages').doc(x).collection('convo').orderBy('createdAt').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })

        if (Platform.OS != "web" || width < 500) {
            console.log("CHAT ID", x)
            navigation.navigate('ChatScreen', { chatId: x, user: props.route.params.user.email })
        }
    }

    const Item = ({ item, onPress, backgroundColor, textColor }) => {
        const docRef = store.collection('users').doc(item.email)
        const [image, setImage] = useState()
        docRef.get().then((doc) => {
            if (doc.exists) {
                setImage(doc.data().picture)
            }
        })
        return (
          <TouchableOpacity key={item} onPress={onPress} style={[styles.item, backgroundColor]}>
            <Image source={{uri: item.recImage}} style={styles.image} />
            <Text style={[styles.title, textColor]}>{item.name}</Text>
          </TouchableOpacity>
        );
    }

    const renderItem = ({ item }) => {
        const backgroundColor = item.conversation === selectedId ? "blue" : "white";
        const color = item.conversation === selectedId ? 'white' : 'black';

        return (
          <Item
            item={item}
            key={item}
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
            height: 600,
            marginTop: 80,
            marginLeft: 30,
            marginRight: 30,
            minHeight: 600,
        },
        buttons: {
            borderRadius: 1,
            backgroundColor: '#0b0035',
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        contacts: {
            flex: 2,
            backgroundColor: 'white',
            height: 600,
            borderRightWidth: 1,
            borderRightColor: '#e7e6e7',
        },
        messagesBox: {
            flex: 4,
            marginTop: 20,
        },
        title: {
            fontWeight: "bold",
        },
        item: {
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#e7e6e7',
            marginHorizontal: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        image: {
          width: 40,
          height: 40,
          borderRadius: 50,
          marginRight: 20,
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
            borderColor: "grey",
            color: 'white',
            backgroundColor: 'grey',
        },
        noMatches : {
            padding: 100,
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
        empty: {
            textAlign: "center",
            fontSize: 30,
        },
        swiping: {
            backgroundColor: "blue",
            color: "white",
            fontSize: 25,
            padding: 10,
            borderRadius: 20,
        },
        sendMessage: {
            display: 'flex',
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: '#e7e6e7',
        }
    });

    if (Platform.OS != "web" || width < 500) {
        if (typeof matches != "undefined" && matches.length > 0) {
            return (
              <Background>
                <FlatList
                  data={matches}
                  style={{paddingTop: 40}}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.conversation}
                  extraData={selectedId}
                /> 
              </Background>
            )
        } else {
            return (
                <Background>
                    <View style={styles.noMatches}>
                        <Text style={styles.empty}>No Matches Yet</Text>
                        <Button
                          mode="outlined"
                          style={styles.buttons}
                          color='white'
                          onPress={() => navigation.navigate('Swipe')}>Start Swiping
                        </Button>
                    </View>
              </Background>  
            )
        }
    }

    if (Platform.OS == "web" && matches.length <= 0) {
        return (
            <Background>
                <View style={styles.noMatches}>
                    <Text style={styles.empty}>No Matches Yet</Text>
                    <Button
                      mode="outlined"
                      style={styles.buttons}
                      color='white'
                      onPress={() => navigation.navigate('Swipe')}>Start Swiping
                    </Button>
                </View>
          </Background> 
        )
    }

    return (
    <Background>
     <View>
      <View style={styles.container}>
        <ScrollView style={styles.contacts}>
          <FlatList
            data={matches}
            renderItem={renderItem}
            keyExtractor={(item) => item.conversation}
            extraData={selectedId}
          /> 
        </ScrollView>
        <View style={styles.messagesBox}>
          <ScrollView style={msgStyle} ref={ref => {setScrollView(ref)}} onContentSizeChange={() => scrollView.scrollToEnd({animated: true})}>
            {messages.map(({ id, text, sender, uid }) => {
              if (sender == props.route.params.user.email) {
                var senderStyle = styles.sent
              } else {
                var senderStyle = styles.message
              }
              return(
                <View key={Math.random().toString(36).substr(2, 9)} style={styles.message, senderStyle}>
                    <Text style={styles.msge}>{text}</Text>
                </View>
              )
            })}
          </ScrollView>
          <View style={styles.sendMessage}>
            <TextInput 
               style={{ width: '90%', fontSize: 15, marginLeft: 15, outline: 'none' }}
               placeholder='Message...'
               value={message}
               onChangeText={e => setMessage(e)} 
               onSubmitEditing={(event) => sendMessage(event)}
            />
            <TouchableOpacity onPress={(event) => sendMessage(event)}>
              <MaterialCommunityIcons name="send" style={{marginLeft: 50, marginTop: 30}} color={"blue"} size={26} />
            </TouchableOpacity>
        </View>
       </View>
      </View>
      </View>
    </Background>
    )
}