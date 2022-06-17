import React, {Component, useState, useEffect, useRef, createRef, setState, ReactNode} from 'react'
import Background from './Background'
import {StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, TextInput, Text, View, Platform, Dimensions, PanResponder, Animated, TouchableOpacity, Alert, Button, Switch } from 'react-native';
import Slider from '@react-native-community/slider';

import NavSwipe from './NavSwipe';
import CardStack, { Card } from './swipe';
import { storage, store, authenticate } from "../App.js";
import firebase from 'firebase/app';
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
    this.state = {switchValue: "false", locationRange: 0, selectedInterests: []};
  }

  toggleSwitch = value => {
    this.setState({ switchValue: value });
  };

  render() {
    return (
      <View>
        <SafeAreaView style={styles.container}>
          <Text style={styles.titleContainer}>
            Distance
          </Text>
          <View contentContainerStyle={styles.container}>
              <Text>{this.state.locationRange} miles</Text>
              <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={20}
                onValueChange={(value) => this.setState({ locationRange: value })}
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

  const [cardsShow, setCardsShow] = useState(false);
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

  async function initImages(user){
    const userLikes = user.likes
    const userDislikes = user.dislikes
    const email = user.email

    var interacted = userLikes.concat(userDislikes, email)

    var snaps = []
    var snapshot = await store.collection("users").get()
    snaps.push(snapshot);
    const images = [];

    snapshot.docs.forEach((s) => {
      if(!interacted.includes(s.data().email)){
        console.log(s.data());
        images.push(s.data());
      } 
    });

    console.log("IMAGES", images)

    setImages(images);
  }

  async function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setUser(doc.data())
        console.log("USER INFO", doc.data())
        initImages(doc.data())
      }
    });

  }

  async function cards(){
    setCardsShow(true)
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

    var liked = {name: data.name, email: email, conversation: convo, recImage: data.picture }
    var otherliked = {name: user.name, email: props.route.params.user.email, conversation: convo, recImage: user.picture }

    if(likes.includes(props.route.params.user.email)){

          // Your matches
          store.collection('users').doc(props.route.params.user.email).update({
              matches: firebase.firestore.FieldValue.arrayUnion(liked)
          })

          // Their matches
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
     {/*{ cardsShow || images.length == 0  ? <Text></Text> : <Button onPress={cards} title="Show Users" /> }*/}
     { images.length == 0 ? <Text>No Users Left</Text> : <Text></Text> }
      <CardStack 
        style={styles.content}
        ref={swiper => { setSwiper(swiper) }}
        onSwipeLeft={() => console.log("LEFT")}
        changeShadowColor={color => { changeShadow(color)} }
      >
       {images.map((i) => {
        // var name = i.name.split(" ")[0]
        console.log("length", images.length)
        return (
          <Card style={[styles.card, styles.card1]} key={i.name} 
            onSwipedRight={(event) => addLike(i.email)} 
            onSwipedLeft={(event) => addDislike(i.email)}
          >
            <Image source={{uri: i.picture}} style={styles.image} />
            <View style={styles.info}> 
             <Text style={styles.label}>{i.name}, {i.age}</Text>
             <Text>{i.interests}</Text>
             <Text>{i.about}</Text>
             <Text style={styles.description}>{i.city}, {i.state}</Text>
            </View>
          </Card>
          )
        })}
      </CardStack>
     </View>
     {images.length > 0 ? 
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
      : <Text></Text>}
    </View>
  </Drawer>
  )
}