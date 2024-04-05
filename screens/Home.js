import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export function HomeHeader() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  const getData = async () => {
    try {
      const keys = ['firstName', 'lastName'];

      const values = await AsyncStorage.multiGet(keys);
      const storedData = Object.fromEntries(values);

      setFirstName(storedData.firstName || '');
      setLastName(storedData.lastName || '');
    } catch (e) {
      console.log(e);
    }
  };

  const renderInitials = (firstName, lastName) => {
    const firstInitial = firstName.length > 0 ? firstName[0] : '';
    const lastInitial = lastName.length > 0 ? lastName[0] : '';
    return firstInitial + lastInitial;
  };

  useEffect(() => {
    getData();
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('Profile'); // replace 'ProfileScreen' with the actual route name
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}></View>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/LogoTest.png')} style={styles.logo} />
      </View>
      
      <Pressable onPress={handleProfilePress} style={styles.profile}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 179, height: 76 }} />
        ) : (
          <View style={styles.initialsAvatar}>
            <Text style={styles.initialsText}>
              {renderInitials(firstName, lastName)}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default function Home() {
  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
    ).then();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View>
      <Text>Homepage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 80
  },
  initialsAvatar: {
    width: 50,
    height: 50,
    borderRadius: 36,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
  },  
  logo: {
    width: 179,
    height: 76,
    resizeMode: 'contain',
  },
  profile: {
    marginRight: 25
  },
});
