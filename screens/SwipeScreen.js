import React, {Component, useState, useEffect, useRef, createRef, setState, ReactNode} from 'react'
import Background from './Background'
import {StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, TextInput, Text, View, Platform, Dimensions, PanResponder, Animated, TouchableOpacity, Alert, Button, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import NavSwipe from './NavSwipe';
import CardStack, { Card } from './swipe';
import { storage, store, authenticate } from "../App.js";
import firebase from 'firebase/app';
// import './nobounce.js'
import { useNavigation } from '@react-navigation/native';

import Drawer from 'react-native-drawer';
import Alerts from './Alerts.js';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faTimesCircle, faSlidersH } from '@fortawesome/free-solid-svg-icons';

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        margin: 16,
        paddingBottom: 32,
    },
    sliderContainer: {
        paddingVertical: 16,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

class ControlPanel extends Component {

  constructor() {
    super();
    this.state = {switchValue: "false"};
  }

  toggleSwitch = value => {
    this.setState({ switchValue: value });
  };

  render() {
    return (
      <View>
        <SafeAreaView style={styles.container}>
          <Text style={styles.titleContainer}>
            Filters
          </Text>
          <View contentContainerStyle={styles.container}>
              <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
          </View>
          <View>
            <Text style={styles.titleContainer}>Interests</Text>
          </View>
        </SafeAreaView>

        <Button
          onPress={() => {
            this.props.closeDrawer();
          }}
          title="Back to Swipe"
        />
      </View>
    )
  }
}

export default function SwipeScreen(props) {

  const [images, setImages] = useState([]);
  const [swiper, setSwiper] = useState();
  const [drawer, setDrawer] = useState();
  const [user, setUser] = useState();
  const [shadowColor, setShadowColor] = useState("");
  const [slide, setSlide] = useState(createRef());
  const navigation = useNavigation();
  const alertRef = React.createRef();

  const styles = StyleSheet.create({
    image: {
      opacity: 1,
      height: 420,
    },
    info: {
      padding: 20,
      color: 'white',
      fontWeight: "bold",
      backgroundColor: "#313174",
    },
    description: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginLeft: 12,
    },
    viewport: {
      height: 250,
      marginTop: 200,
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
      marginTop: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card:{
      width: 320,
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
      color: 'white',
      fontWeight: 'bold',
      fontFamily: 'System',
      backgroundColor: 'transparent',
    },
    topNav: {
        backgroundColor:'rgb(12,0,51)',
        position:'absolute',
        height: '10%',
        top:0,
        width:100+'%'
    },
    slider: {
        paddingTop: 70,
        paddingRight: 20,
        alignItems: "flex-end",
    },
    text:{
        color:'rgb(255,255,255)',
        alignSelf: 'center',
        fontSize: 30
    },
  })

  function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setUser(doc.data())
      }
    });
  }

  async function cards(){
    console.log("DATA", user)
    const userLikes = user.likes
    const userDislikes = user.dislikes

    var interacted = userLikes.concat(userDislikes)
    var batches = [];

    interacted.push("A")
    batches.push(interacted.slice(0, 10));

    console.log("BATCHES", batches, "INTERACTED", interacted)

    var snaps = []
    var snapshot = await store.collection("users").where("email", "not-in", interacted).get()
    console.log("SNAPSHOT", snapshot)
    snaps.push(snapshot);

    console.log('SNAPS', snaps)

    const images = [];

    snapshot.docs.forEach((s) => {
      images.push(s.data());
    });
    setImages(images);

  }
  
  useEffect(() => {
    initValues()
  }, [])

  async function addLike(email){

    store.collection('users').doc(props.route.params.user.email).update({
      likes: firebase.firestore.FieldValue.arrayUnion(email)
    })

    const snapshot = await store.collection('users').doc(email).get();
    const data = snapshot.data();
    var likes = data.likes

    const convo = String(Math.floor(Math.random()*10000000))

    var liked = {name: data.name, email: email, conversation: convo }
    var otherliked = {name: user.name, email: props.route.params.user.email, conversation: convo }

    if(likes.includes(props.route.params.user.email)){

          console.log("New Match", props.route.params.user)
          store.collection('users').doc(props.route.params.user.email).update({
              matches: firebase.firestore.FieldValue.arrayUnion(liked)
          })

          store.collection('users').doc(email).update({
              matches: firebase.firestore.FieldValue.arrayUnion(otherliked)
          })

          if (Platform.OS == "web") {

          } else {

            Alert.alert(
              "New Match",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "Go to match", onPress: () => navigation.navigate('Messages') }
              ]
            );

          }

    }

  }

  var addDislike = function(email){
    store.collection('users').doc(props.route.params.user.email).update({
      dislikes: firebase.firestore.FieldValue.arrayUnion(email)
    })
  }

  var changeShadow = function(a){
    setShadowColor('red')
  }

  const closeFilter = () =>  {
    drawer.close()
  };

  const openFilter = () =>  {
    console.log("OPEN")
    drawer.open()
  };

  return (
    <Drawer
      ref={(ref) => setDrawer(ref)}
      content={<ControlPanel closeDrawer={closeFilter} />}
    >
    <View style={styles.body} id="main">
     <Alerts ref={alertRef}/>
      <View style={styles.topNav}>
          <StatusBar barStyle="light-content"/>
          <Text style={styles.text}></Text>
          <TouchableOpacity style={styles.slider} onPress={() => { openFilter() }}>
              <FontAwesomeIcon icon={ faSlidersH } size={ 30 } />
          </TouchableOpacity> 
      </View>
     <View style={styles.viewport}>
     <Button onPress={cards} title="Show Users" />
      <CardStack 
        style={styles.content}
        ref={swiper => { setSwiper(swiper) }}
        onSwipeLeft={() => console.log("LEFT")}
        changeShadowColor={color => { changeShadow(color)} }
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
          <FontAwesomeIcon icon={ faTimesCircle } color={ '#ff2400' } size={ 40 } />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]} onPress={() => {
          swiper.swipeRight();
        }}>
          <FontAwesomeIcon icon={ faHeart } color={ 'green' } size={ 40 } />
        </TouchableOpacity>
      </View>
    </View>
  </Drawer>
  )
}