import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export function RegisterHeader() {

  return (
    <View style={styles.header}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
    </View>
  );
}

const Onboarding = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState("")
  const [isFormValid, setIsFormValid] = useState(false);
  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });


  const navigation = useNavigation();

  useEffect(() => {

    setIsFormValid(
      firstNameCheck(firstName) &&
      lastNameCheck(lastName) &&
      emailValidation(email))

  }, [firstName, lastName, email]);

  const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const firstNameCheck = (firstname) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(firstname);
  }

  const lastNameCheck = (lastname) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(lastname);
  }


  const handleOnboarding = async () => {
    try {

      const values = [
        ['firstName', firstName],
        ['lastName', lastName],
        ['email', email],
        ['onboardingCompleted', 'true']
      ];

      await AsyncStorage.multiSet(values);

      // Navigate to the next screen or perform any other action
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error storing onboarding completion status:', error);
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (

    <View style={styles.container}>
      <View>
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

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder='Last Name'
          onChangeText={setLastName}
          value={lastName}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
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
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  label: {
    textAlign: "left",
    marginLeft: 15,
    fontFamily: 'Karla_400Regular',
  },
  logo: {
    width: 179,
    height: 76,
    resizeMode: 'contain',
  },
  headerText: {
    padding: 40,
    fontSize: 25,
    fontFamily: 'Karla_400Regular',
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