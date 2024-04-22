import * as React from 'react';
import * as SQLite from 'expo-sqlite';
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
  ScrollView,
} from 'react-native';
import { Divider } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase('little_lemon.db');

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
  const [selectedCategories, setSelectedCategories] = useState({});

  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  const initializeDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);',
        [],
        () => {
          console.log('Database initialized');
        },
        (error) => {
          console.log('Database initialization failed:', error);
        }
      );
    });
  };

  const checkData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM menu',
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            fetchMenu();
          } else {
            // Load data from database
            loadDataFromDB();
          }
        },
        (_, err) => {
          console.error(err);
        }
      );
    });
  };

  const loadDataFromDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM menu',
        [],
        (_, { rows: { _array } }) => {
          console.log('Retrieved menu items from database:', _array);
          setMenu(_array);
        },
        (_, err) => {
          console.error(err);
        }
      );
    });
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
      );
      const data = await response.json();
      setMenu(data.menu);
      console.log('Fetched menu data:', data.menu);

      db.transaction((tx) => {
        data.menu.forEach((item) => {
          const { name, description, price, image, category } = item;
          console.log(
            'Inserting menu item:',
            name,
            description,
            price,
            image,
            category
          );
          tx.executeSql(
            'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image, category],
            (_, result) => {
              console.log('Menu item inserted successfully:', result.insertId);
            },
            (_, error) => {
              console.error('Error inserting menu item:', error);
            }
          );
        });
      });
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    initializeDB();
    checkData();
  }, []);

  useEffect(() => {
    // Create an array of selected categories
    console.log('selectedCategories:', selectedCategories);
    const selected = Object.keys(selectedCategories).filter(
      (category) => selectedCategories[category]
    ).map(category => category.toLowerCase());
    console.log('selected:', selected);

    if (selected.length === 0) {
      // If no categories are selected, load all menu items
      console.log('Loading all menu items...');
      loadDataFromDB();
    } else {
      // Construct and execute SQL query for filtering by selected categories
      const placeholders = selected.map(() => '?').join(',');
      const query = `
        SELECT * FROM menu
        WHERE category IN (${placeholders})
      `;

      console.log('Executing SQL query:', query);
      console.log('Selected categories:', selected);

      db.transaction((tx) => {
        tx.executeSql(
          query,
          [...selected], // Pass selected categories as individual arguments
          (_, { rows: { _array } }) => {
            console.log('Menu items filtered:', _array);
            setMenu(_array);
          },
          (_, error) => {
            console.error('Error executing SQL query:', error);
          }
        );
      });
    }
  }, [selectedCategories]);

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

  const categories = [
    { name: 'Starters' },
    { name: 'Mains' },
    { name: 'Desserts' },
    { name: 'Drinks' },
    { name: 'Specials' },
  ];

  const handleCategoryPress = (categoryName) => {
    setSelectedCategories((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>ORDER FOR DELIVERY!</Text>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <Pressable
              key={index}
              style={[
                styles.button,
                selectedCategories[category.name] ? styles.selectedButton : {},
                index === 0 ? { marginLeft: 23 } : {},
              ]}
              onPress={() => handleCategoryPress(category.name)}>
              <Text
                style={[
                  styles.buttonText,
                  selectedCategories[category.name]
                    ? styles.selectedButtonText
                    : {},
                ]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
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
    flexDirection: 'row',
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
  selectedButton: {
    backgroundColor: '#495e57',
    borderRadius: 16,
    marginRight: 23,
  },
  selectedButtonText: {
    color: '#F4CE14',
    padding: 10,
    fontSize: 16,
    fontFamily: 'Karla_400Regular',
    fontWeight: '800',
  },
});
