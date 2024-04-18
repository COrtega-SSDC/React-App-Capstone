import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';

import { Divider } from 'react-native-paper';

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
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
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
  const [menu, setMenu] = useState([]);

  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  const fetchMenu = async () => {
    const response = await fetch(
      'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
    );
    const data = await response.json();
    setMenu(data.menu);
  };

  // const fetchImages = async () => {
  //   const response = await fetch(
  //     'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/greekSalad.jpg?raw=true'
  //   );
  //   const data = await response.json();
  //   setMenu(data);
  // };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  } else {
    return text;
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>ORDER FOR DELIVERY!</Text>
      <View style={styles.filterContainer}>
        <Pressable style={styles.button} marginLeft={23}>
          <Text style={styles.buttonText}>Starters</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Mains</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Desserts</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Drinks</Text>
        </Pressable>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.listContainer}>
        <FlatList
          scrollEnabled={true}
          ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
          data={menu}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={1}>
                  {truncateText(item.description, 36)}
                </Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                  }}
                  style={styles.itemImage}
                />
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  cardContainer: {
    marginBottom: 25,
    marginLeft: 25,
    flexDirection: 'row'
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  listContainer: {
    paddingBottom: 200,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 80,
  },
  headerText: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 25,
    fontSize: 25,
    fontFamily: 'MarkaziText_500Medium',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#EDEFEE',
    borderRadius: 16,
    marginRight: 23,
  },
  buttonText: {
    color: '#495e57',
    padding: 10,
    fontSize: 16,
    fontFamily: 'Karla_400Regular',
    fontWeight: '800',
  },
  description: {
    marginBottom: 35,
    fontSize: 16,
    fontFamily: 'Karla_400Regular',
    color: '#495e57',
  },
  divider: {
    height: 1,
    backgroundColor: 'grey',
  },
  itemDivider: {
    height: 1,
    marginRight: 23,
    backgroundColor: '#EDEFEE',
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
  itemName: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    marginBottom: 23,
    marginTop: 23,
  },
  itemImage: {
    width: 81.47,
    height: 79.73,
    resizeMode: 'cover',
    marginLeft: 27,
    marginTop: 23,
  },
  itemPrice: {
    fontSize: 20,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: '#495e57',
  },
  profile: {
    marginRight: 25,
  },
});
