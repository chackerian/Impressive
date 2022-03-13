import React, {Component, useState, useEffect, useRef, createRef, setState, ReactNode} from 'react'
import Background from './Background'
import {StyleSheet, SafeAreaView, ScrollView, StatusBar, Image, TextInput, Text, View, Platform, Dimensions, PanResponder, Animated, TouchableOpacity, Alert, Button, Switch } from 'react-native';
import { Slider } from "@miblanchard/react-native-slider";
import NavSwipe from './NavSwipe';
import CardStack, { Card } from './swipe';
import { storage, store } from "../App.js";
import firebase from 'firebase/app';
// import './nobounce.js'
import { useNavigation } from '@react-navigation/native';

import Drawer from 'react-native-drawer';
import Alerts from './Alerts.js';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faTimesCircle, faSlidersH } from '@fortawesome/free-solid-svg-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

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

const DEFAULT_VALUE = 0;

const SliderContainer = (props: {
    caption: string;
    children: React.ReactElement;
    sliderValue?: Array<number>;
}) => {
    const {caption, sliderValue, trackMarks} = props;
    const [value, setValue] = useState(
        sliderValue ? sliderValue : DEFAULT_VALUE,
    );
    let renderTrackMarkComponent: ReactNode;

    const renderChildren = () => {
        return React.Children.map(
            props.children,
            (child: React.ReactElement) => {
                if (!!child && child.type === Slider) {
                    return React.cloneElement(child, {
                        onValueChange: setValue,
                        value,
                    });
                }

                return child;
            },
        );
    };

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.titleContainer}>
                <Text>{caption}</Text>
                <Text>{Array.isArray(value) ? value.join(' - ') : value}</Text>
            </View>
            {renderChildren()}
        </View>
    );
};

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
              <SliderContainer
                  caption="Miles Away"
                  sliderValue={[1]}>
                  <Slider maximumValue={25}
                      minimumValue={0}
                      step={1}
                      minimumTrackTintColor="blue"
                      thumbTintColor="blue" 
                  />
              </SliderContainer>
              <SliderContainer
                  caption="Age"
                  sliderValue={[18, 60]}>
                  <Slider
                      animateTransitions
                      maximumTrackTintColor="blue"
                      maximumValue={60}
                      minimumTrackTintColor="blue"
                      minimumValue={18}
                      step={2}
                      thumbTintColor="blue"
                  />
              </SliderContainer>
          </View>
          <View>
            <Text style={styles.titleContainer}>Interests</Text>
            <Switch
              style={{ marginTop: 30 }}
              onValueChange={this.toggleSwitch}
              value={this.state.switchValue}
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

  const [images, setImages] = useState([]);
  const [swiper, setSwiper] = useState();
  const [drawer, setDrawer] = useState();
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

  async function cards(){
    const user = await store.collection("users").doc(props.route.params.user.email).get()
    const userLikes = user.data().likes || []
    const userDislikes = user.data().dislikes || []

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
    cards()
  }, [])

  async function addLike(email){

    store.collection('users').doc(props.route.params.user.email).update({
      likes: firebase.firestore.FieldValue.arrayUnion(email)
    })

    const snapshot = await store.collection('users').doc(email).get();
    const data = snapshot.data();
    var likes = data.likes

    console.log("SWIPE LIKE", data.likes)
    if(likes.includes(props.route.params.user.email)){

             store.collection('users').doc(props.route.params.user.email).update({
                matches: firebase.firestore.FieldValue.arrayUnion(email)
            })

          if (Platform.OS == "web") {
            var alert = new Alerts().slide()
            console.log("SLIDE", alert)
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
      <CardStack 
        style={styles.content}
        ref={swiper => { setSwiper(swiper) }}
        onSwipeLeft={console.log("LEFT")}
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
          <FontAwesomeIcon icon={ faHeart } color={ '#02ff02' } size={ 40 } />
        </TouchableOpacity>
      </View>
    </View>
  </Drawer>
  )
}