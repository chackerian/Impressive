import React, { Component, useState, useEffect } from 'react'
import {StyleSheet, SafeAreaView, StatusBar, Image, Text, View, Platform, TouchableOpacity, Alert, Button } from 'react-native';
import Slider from '@react-native-community/slider';

import CardStack, { Card } from './swipe';
import { store } from "../App.js";
import firebase from 'firebase/app';
import TextInput from './TextInput'
import { useNavigation } from '@react-navigation/native';
import { WithContext as ReactTags } from 'react-tag-input';
import { useMediaQuery } from "react-responsive";

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
    this.state = {locationRange: 0, location: 0, tags: []};
  }

  handleDelete = i => {
    this.setState({tags: this.state.tags.filter((tag, index) => index !== i)});
    this.props.setFilter({tags: this.state.tags.filter((tag, index) => index !== i), locationRange: this.state.locationRange})
  };

  handleAddition = tag => {
    this.setState({tags: [...this.state.tags, tag]});
    this.props.setFilter({tags: [...this.state.tags, tag], locationRange: this.state.locationRange})
  };

  handleLocation = (value) => {
    this.setState({ locationRange: value })
    this.props.setFilter(this.state)
  }

  slide = (value) => {
    this.setState({location: value})
  }

  render() {
    return (
      <View style={styles.test}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.titleContainer}>
            Distance
          </Text>
          <View contentContainerStyle={styles.container}>
              <Text>{this.state.location} miles</Text>
              <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={20}
                onSlidingComplete={this.handleLocation}
                onValueChange={this.slide}
              />
          </View>
          <View>
            <Text style={styles.titleContainer}>Interests</Text>
            <ReactTags
              tags={this.state.tags}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleTagClick={this.handleTagClick}
              inputFieldPosition="bottom"
              autocomplete
            />
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
  const [filter, setFilter] = useState({});
  const [shadowColor, setShadowColor] = useState("");
  const navigation = useNavigation();
  const alertRef = React.createRef();

  const styles = StyleSheet.create({
    body: {
      transition: 'all .5s'
    },
    sideContainer: {
      transition: 'all .5s'
    },
    image: {
      opacity: 1,
      height: 310,
    },
    about: {
      fontSize: 14,
      padding: "1em",
      color: 'white',
    },
    info: {
      padding: 20,
      color: 'white',
      fontWeight: "bold",
      backgroundColor: "#313174",
      height: "14em",
    },
    description: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      marginLeft: 12,
      padding: "1em",
    },
    viewport: {
      height: 190,
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
    tag: {
      backgroundColor: "green",
      color: "white",
      width: "fit-content",
      borderRadius: 7,
      paddingVertical: 5,
      paddingHorizontal: 2,
      marginRight: 2,
      cursor: "pointer",
      textTransform: "capitalize"
    },
    interestContainer: {
      display: "flex",
      flexDirection: "row",
    },
    text: {
        color:'rgb(255,255,255)',
        alignSelf: 'center',
        fontSize: 30
    },
  })

  async function initImages(user){
    console.log("INIT IMAGES")
    const userLikes = user.likes
    const userDislikes = user.dislikes
    const email = user.email

    var interacted = userLikes.concat(userDislikes, email)

    var snaps = []
    console.log("FILTER", filter)
    if (filter.tags && filter.tags.length > 0){
      var snapshot = await store.collection("users").where("interests", "array-contains", filter.tags[0]).get()
    } else {
      var snapshot = await store.collection("users").get()
    }
    snaps.push(snapshot);
    const images = [];

    snapshot.docs.forEach((s) => {
      if(!interacted.includes(s.data().email)){
        images.push(s.data());
      }
    });
    console.log("USERS", images)
    setImages(images);
  }

  async function initValues() {
    var docRef = store.collection('users').doc(props.route.params.user.email)
    docRef.get()
    .then((doc) => {
      console.log(doc.exists)
      if (doc.exists) {
        setUser(doc.data());
      }
    })
    .catch((err) => {
      console.log(err)
    })

  }

  async function cards(){
    setCardsShow(true)
  }

  useEffect(() => {
    setTimeout(initValues, 1000);
  }, [])

  useEffect(() => {
    if(user) {
      initImages(user);
    }
  }, [filter, user])

  async function addLike(email){

    console.log("LIKED", email)

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

  const [isOpened, setisOpened] = useState(false)
  const [style, setStyle] = useState({backgroundColor: "white",left: '-25vw', width: "25vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
  const [mainStyle, setMainStyle] = useState({marginLeft: 0})

  const isDeviceMobile = useMediaQuery({
      query: "(max-width: 1224px)",
  });

 const openFilter = () => {
    if(!isOpened) {
      setisOpened(true)
      if(isDeviceMobile) {
        setMainStyle({marginLeft: "100vw"})
        setStyle({zIndex: 5, backgroundColor: "white", left: '0', width: "100vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
      } else {
        setMainStyle({marginLeft: "25vw"})
        setStyle({zIndex: 5, backgroundColor: "white", left: '0', width: "25vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
      }
    } else {
      setisOpened(false)
      if(isDeviceMobile) {
        setMainStyle({marginLeft: "0"})
        setStyle({zIndex: 5, backgroundColor: "white", left: '-100vw', width: "100vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
      }
      setMainStyle({marginLeft: "0"})
      setStyle({backgroundColor: "white", left: '-25vw', width: "25vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
    }
  }

  const closeFilter = () => {
    setisOpened(false)
    if(isDeviceMobile) {
        setMainStyle({marginLeft: "0"})
        setStyle({zIndex: 5, backgroundColor: "white", left: '-100vw', width: "100vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
    } else {
      setMainStyle({marginLeft: "0"})
      setStyle({backgroundColor: "white", left: '-25vw', width: "25vw", height: "calc(100vh - 49px)", bottom: 0, overflow: "hidden", display: "block", position: "absolute"})
    }
  }

  return (
    <>
    <View style={[ styles.sideContainer, style ]}><ControlPanel closeDrawer={closeFilter} setFilter={setFilter}/></View>
    <View style={[ styles.body, mainStyle ]} id="main">
     <Alerts ref={alertRef}/>
      <View style={styles.topNav}>
          <StatusBar barStyle="light-content"/>
          <Text style={styles.text}></Text>
          <TouchableOpacity style={styles.slider} onPress={openFilter}>
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
        return (
          <Card style={[styles.card, styles.card1]} key={i.name}
            onSwipedRight={(event) =>{ addLike(i.email)}}
            onSwipedLeft={(event) => { addDislike(i.email) }}
          >
            <Image source={{uri: i.picture}} style={styles.image} />
            <View style={styles.info}>
             <Text style={styles.label}>{i.name}, {i.age}</Text>
             <Text style={styles.about}>{i.about}</Text>
             <Text style={styles.description}>{i.city}, {i.state}</Text>
             <View style={styles.interestContainer}>
             {i.interests.map((interest) => {
              return (
                <Text style={styles.tag}>{interest.text}</Text>
              )
             })}
             </View>
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
    </>
  )
}