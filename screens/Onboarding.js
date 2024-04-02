import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {

  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [isFormValid, setIsFormValid] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    
    setIsFormValid(firstNameCheck(firstName) == true && emailValidation(email) == true);
  }, [firstName, email]);

  const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const firstNameCheck = (firstname) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(firstname);
  }

  const handleOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
      await AsyncStorage.setItem('firstName', JSON.stringify(firstName))
      await AsyncStorage.setItem('email', JSON.stringify(email))

      // Navigate to the next screen or perform any other action
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error storing onboarding completion status:', error);
    }
  };

  return (

    <View style={styles.container}>
      <View>
        <Image source={require('../assets/Test.png')} style={styles.logo} />
        <Text style={styles.headerText}>
          Let us get to know you
        </Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder='First Name'
          onChangeText={setFirstName}
          value={firstName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          keyboardType='email-address'
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View>
        <Pressable
          style={[styles.button, isFormValid ? styles.buttonEnabled : styles.buttonDisabled]}
          onPress={() => handleOnboarding()}
          disabled={!isFormValid}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>

    </View>



  )

};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white"
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 82,
    borderRadius: 8,
    marginTop: 40
  },
  buttonEnabled: {
    backgroundColor: '#495e57', 
  },
  buttonDisabled: {
    backgroundColor: '#EDEFEE', 
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  label: {
    textAlign: "left",
    marginLeft: 15,
  },
  logo: {
    height: 75,
    width: 325,
    resizeMode: 'contain',
    marginTop: 20,
    // marginBottom: 35
  },
  headerText: {
    padding: 40,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    marginTop: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  }
})