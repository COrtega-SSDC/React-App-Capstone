import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';
import {
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
} from 'react-native';
import { Divider } from 'react-native-paper';
import Search from '../assets/search icon.png';
import HeroImage from '../assets/Hero image.png';

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
  const [searchText, setSearchText] = useState('');

  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  const localImageMappings = {
    'greekSalad.jpg': require('../assets/Greek salad.png'),
    'bruschetta.jpg': require('../assets/Bruschetta.png'),
    'grilledFish.jpg': require('../assets/Grilled fish.png'),
    'pasta.jpg': require('../assets/Pasta.png'),
    'lemonDessert.jpg': require('../assets/Lemon dessert.png'),
  };
  const getLocalImage = (imageName) => {
    const imageResource = localImageMappings[imageName];
    if (imageResource) {
      return imageResource;
    } else {
      console.log('Falling back to placeholder for:', imageName); // Useful for debugging
      return require('../assets/default-placeholder.jpg');
    }
  };

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

      db.transaction((tx) => {
        data.menu.forEach((item) => {
          const imageName = item.image.split('/').pop(); // Get just the filename
          // No longer insert the require statement in the database, just the filename
          tx.executeSql(
            'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
            [item.name, item.description, item.price, imageName, item.category]
            // ...callbacks
          );
        });
      });

      // Immediately update the menu state to show local images
      const updatedMenuData = data.menu.map((item) => {
        const imageName = item.image.split('/').pop(); // Get just the filename
        const localImage = localImageMappings[imageName]; // Get the corresponding local image
        return { ...item, image: localImage };
      });

      setMenu(updatedMenuData);
      console.log('Fetched menu data:', updatedMenuData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  const fetchFilteredMenu = () => {
  const searchTextFormatted = searchText.trim().toLowerCase();
  let query = 'SELECT * FROM menu WHERE 1=1'; // Neutral starting point
  let params = [];

  // Text filter
  if (searchTextFormatted) {
    query += ' AND lower(name) LIKE ?';
    params.push(`%${searchTextFormatted}%`);
  }

  // Category filter
  const selectedCategoryKeys = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
  if (selectedCategoryKeys.length > 0) {
    query += ' AND category IN (' + selectedCategoryKeys.map(() => '?').join(',') + ')';
    params = params.concat(selectedCategoryKeys.map(key => key.toLowerCase()));
  }

  db.transaction(tx => {
    tx.executeSql(
      query,
      params,
      (_, { rows: { _array } }) => {
        console.log('Filtered results:', _array); // Helpful for debugging
        setMenu(_array);
      },
      (_, error) => console.error('Error executing filter query:', error)
    );
  });
};


  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {truncateText(item.description, 36)}
        </Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View>
        <Image source={getLocalImage(item.image)} style={styles.itemImage} />
      </View>
    </View>
  );

  useEffect(() => {
    initializeDB();
    checkData();
  }, []);

  useEffect(() => {
    // Create an array of selected categories
    console.log('selectedCategories:', selectedCategories);
    const selected = Object.keys(selectedCategories)
      .filter((category) => selectedCategories[category])
      .map((category) => category.toLowerCase());
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

  useEffect(() => {
  const handler = setTimeout(() => {
    fetchFilteredMenu(); 
  }, 500); 

  return () => {
    clearTimeout(handler); 
  };
}, [searchText, JSON.stringify(selectedCategories)]); 


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
  setSelectedCategories(prevState => ({
    ...prevState,
    [categoryName]: !prevState[categoryName],
  }), fetchFilteredMenu); 
};

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <View style={styles.heroText}>
            <View>
              <Text style={styles.littlelemon}>Little Lemon</Text>
              <Text style={styles.chicago}>Chicago</Text>
              <Text style={styles.wall}>
                We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image source={HeroImage} style={styles.heroImage} />
          </View>
          <ImageBackground
            source={Search}
            style={styles.input}
            imageStyle={styles.imageStyle}>
            <TextInput
              style={{ flex: 1 }}
              value={searchText}
              placeholder={'Search '}
              onChangeText={setSearchText}
            />
          </ImageBackground>
        </View>
        <Text style={styles.headerText}>ORDER FOR DELIVERY!</Text>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <Pressable
                key={index}
                style={[
                  styles.button,
                  selectedCategories[category.name]
                    ? styles.selectedButton
                    : {},
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
            ItemSeparatorComponent={() => (
              <Divider style={styles.itemDivider} />
            )}
            data={menu}
            renderItem={renderItem}
          />
          <Divider style={styles.itemDivider} />
        </View>
      </View>
    </ScrollView>
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
  heroContainer: {
    marginTop: 5,
    backgroundColor: '#495e57',
    width: 427,
  },
  heroText: {
    marginLeft: 22,
    flexDirection: 'row',
    position: 'relative',
  },
  listContainer: {
    paddingBottom: 50,
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
  chicago: {
    fontSize: 40,
    fontFamily: 'MarkaziText_500Medium',
    fontWeight: 'regular',
    color: 'white',
    marginBottom: 17,
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
  heroImage: {
    height: 156,
    width: 140,
    resizeMode: 'fit',
    borderRadius: 16,
    marginTop: 87,
    marginLeft: 230,
    position: 'absolute',
  },
  imageStyle: {
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    height: 17.5,
    width: 17.5,
    marginTop: 11,
    marginLeft: 11,
  },
  input: {
    marginTop: 32,
    marginBottom: 24,
    marginRight: 28,
    marginLeft: 22,
    paddingLeft: 40,
    height: 42,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    backgroundImage: `url(${Search})`,
  },
  itemDivider: {
    height: 2,
    marginRight: 23,
    marginLeft: 26,
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
    resizeMode: 'fill',
    marginLeft: 27,
    marginTop: 40,
  },
  itemPrice: {
    fontSize: 20,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: '#495e57',
  },
  littlelemon: {
    marginBottom: -24,
    fontSize: 64,
    fontFamily: 'MarkaziText_500Medium',
    color: '#F4CE14',
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
  wall: {
    color: 'white',
    fontFamily: 'Karla_400Regular',
    fontSize: 18,
    fontWeight: 500,
    width: 220,
    height: 105,
  },
});
