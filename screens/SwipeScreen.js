import React, {useState, useEffect, useRef, setState} from 'react'
import Background from './Background'
import {StyleSheet, Image, TextInput, Text, View, Dimensions, PanResponder, Animated, TouchableOpacity, Alert } from 'react-native';
import NavSwipe from './NavSwipe';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { storage, store } from "../App.js";
import firebase from 'firebase/app';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function SwipeScreen(props) {

  const [images, setImages] = useState([]);
  const [swiper, setSwiper] = useState();

  const styles = StyleSheet.create({
    image: {
      opacity: 1,
      height: 420,
    },
    info: {
      padding: 2,
    },
    description: {
      fontSize: 20,
      marginLeft: 12,
    },
    viewport: {
      height: 250,
      marginTop: 300,
      overScrollBehavior: 'contain',
      overScrollBehaviorY: 'contain',
      marginLeft: 'auto',
      marginRight: 'auto',
      alignItems: 'center',
    },
    button: {
      padding: 30,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    buttonContainer:{
      flexDirection:'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content:{
      flex: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card:{
      width: 320,
      height: 500,
      backgroundColor: 'lightgray',
      borderRadius: 5,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity:0.5,
    },
    label: {
      marginLeft: 12,
      fontSize: 25,
      fontFamily: 'System',
      backgroundColor: 'transparent',
    },
  })

  async function cards(){
    const user = await store.collection("users").doc(props.route.params.user.email).get()
    const userLikes = user.data().likes || []
    const userDislikes = user.data().dislikes || []

    var interacted = userLikes.concat(userDislikes)
    var div = [];

    while(interacted.length) {
      div.push(interacted.splice(0, 10));
    }

    var snaps = []
    for(var x=0; x<div.length; x++){
      var snapshot = await store.collection("users").where("email", "not-in", div[x]).get()
      snaps.push(snapshot);
    }

    console.log(snaps)

    const images = [];

    snapshot.docs.forEach((s) => {
      images.push(s.data());
    });
    setImages(images);
  }
  
  useEffect(() => {
    cards()
  }, [])

  async function addLike(email){

    store.collection('users').doc(props.route.params.user.email).update({
      likes: firebase.firestore.FieldValue.arrayUnion(email)
    })

    const snapshot = await store.collection('users').doc(email).get();
    const data = snapshot.data();
    console.log(data)

    if (Platform.OS == "web") {
      Alerts.success('Test message stackslide effect!', {
        position: 'top-right',
        effect: 'stackslide'
      });
    } else {

      Alert.alert(
        "New Match",
        "My Alert Msg",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Go to match", onPress: () => console.log("OK Pressed") }
        ]
      );

    }

     // Create convo

  }

  var addDislike = function(email){
    store.collection('users').doc(props.route.params.user.email).update({
      dislikes: firebase.firestore.FieldValue.arrayUnion(email)
    })
  }

  return (
    <View>
     <NavSwipe />
     <View style={styles.viewport}>
      <CardStack 
        style={styles.content}
        ref={swiper => { setSwiper(swiper) }}
      >
       {images.map((i) => {
        var name = i.name.split(" ")[0]
        return (
          <Card style={[styles.card, styles.card1]} key={i.name} 
            onSwipedRight={(event) => addLike(i.email)} 
            onSwipedLeft={(event) => addDislike(i.email)}
          >
            <Image source={{uri: i.picture}} style={styles.image} />
            <View style={styles.info}> 
             <Text style={styles.label}>{name}, {i.age}</Text>
             <Text style={styles.description}>{i.city}, {i.state}</Text>
            </View>
          </Card>
          )
        })}
      </CardStack>
     </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button]} onPress={() => {
          swiper.swipeLeft();
        }}>
          <FontAwesomeIcon icon={ faTimesCircle } color={ 'red' } size={ 40 } />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]} onPress={() => {
          swiper.swipeRight();
        }}>
          <FontAwesomeIcon icon={ faHeart } color={ 'green' } size={ 40 } />
        </TouchableOpacity>
      </View>
    </View>
  )
}

