import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from './Background'
import Logo from './Logo'
import Button from './Button'
import TextInput from './TextInput'
import Navbar from './Navbar'
import BackButton from './BackButton'
import { useNavigation } from '@react-navigation/native';
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { nameValidator } from './helpers/nameValidator'

import firebase from 'firebase/app';
import 'firebase/auth';
import { authenticate } from "../App.js";

export default function RegisterScreen(props) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const navigation = useNavigation();

  const createUser = async (email, password) => {
    try {
     let response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if(response){
        console.log("RESPONSE")
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      console.log("ERROR", emailError, passwordError, nameError)
    }
      var user = {
        name: name.value,
        email: email.value
      }
      console.log("register", email.value, password.value, name.value)
      createUser(email.value, password.value)
      props.route.params.login(user)
  }

  return (
    <Background>
      <Navbar />
      <BackButton goBack={navigation.goBack} />
      <Logo goBack={navigation.goBack}/>
      <View style={styles.form}>
        <Text style={styles.signup}>Create Account</Text>
        <TextInput
          label="Name"
          returnKeyType="next"
          value={name.value}
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          onChangeText={(text) => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />
        <TextInput
          label="Email"
          returnKeyType="next"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          theme={{ colors: { primary: 'blue',underlineColor:'transparent',}}}
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={onSignUpPressed}
          style={{ marginTop: 24 }}
        >
          Sign Up
        </Button>
        <View style={styles.row}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  form: {
    alignItems: 'center',
  },
  signup: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontWeight: 'bold',
    color: "blue",
  },
})
