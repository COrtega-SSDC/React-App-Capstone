import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import { Avatar, Checkbox } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';


export function ProfileHeader() {
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

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <HeaderBackButton label="Profile" onPress={() => navigation.goBack()} style={styles.backButton} />
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/LogoTest.png')} style={styles.logo} />
      </View>
      
      <Pressable style={styles.profile}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 179, height: 76 }} />
        ) : (
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {renderInitials(firstName, lastName)}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default function Profile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderNotif, setOrderNotif] = useState(false);
  const [passwordNotif, setpasswordNotif] = useState(false)
  const [offers, setOffers] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const [image, setImage] = useState(null)

  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  const firstNameCheck = (firstname) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(firstname);
  }

  const lastNameCheck = (lastname) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(lastname);
  }

  const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError('')
      return true
    }
    else {
      setEmailError('Please enter a valid email address')
      return false
    }
  };

  const phoneNumberValidation = (phoneNumber) => {
    const numberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (numberRegex.test(phoneNumber)) {
      setPhoneError('')
      return true
    }
    else {
      setPhoneError('Please enter a valid phone number')
      return false
    }
  }

  const profileData = async () => {
    try {
      
      const values = [
        ['firstName', firstName], 
        ['lastName', lastName], 
        ['email', email], 
        ['onboardingCompleted', 'true'],
        ['orderStatus', String(orderNotif)],
        ['passwordChange', String(passwordNotif)],
        ['offers', String(offers)],
        ['newsletter', String(newsletter)]
      ];

      await AsyncStorage.multiSet(values);

    } catch (error) {
      console.error('Error storing profile information:', error);
    }
  };

  const getProfileData = async () => {
    try {
      const keys = ['firstName', 'lastName', 'email', 'phoneNumber', 'orderStatus', 'passwordChange', 'offers', 'newsletter'];
      const values = await AsyncStorage.multiGet(keys);
      const storedData = Object.fromEntries(values);

      setFirstName(storedData.firstName || '');
      setLastName(storedData.lastName || '');
      setEmail(storedData.email || '');
      setPhoneNumber(storedData.phoneNumber || '');
      setOrderNotif(storedData.orderStatus === 'true')
      setpasswordNotif(storedData.passwordChange === 'true')
      setOffers(storedData.offers === 'true')
      setNewsletter(storedData.newsletter === 'true')

    } catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {getProfileData()}, [])

  useEffect(() => {   

    setIsFormValid(
      firstNameCheck(firstName) &&
      lastNameCheck(lastName) &&
      emailValidation(email) &&
      phoneNumberValidation(phoneNumber)
    )
  }, [firstName, lastName, email, phoneNumber])

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  const renderInitials = (firstName, lastName) => {
    const firstInitial = firstName.length > 0 ? firstName[0] : '';
    const lastInitial = lastName.length > 0 ? lastName[0] : '';
    return firstInitial + lastInitial;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.headerText}>Personal Information</Text>

        <View style={styles.containerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>Avatar</Text>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 72, height: 72 }} />
            ) : (
              <View style={styles.initialsAvatar}>
                <Text style={styles.initialsText}>
                  {renderInitials(firstName, lastName)}
                </Text>
              </View>
            )}
          </View>

          <Pressable style={styles.change} onPress={pickImage}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
          <Pressable style={styles.remove} onPress={() => setImage(null)}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>

        <View style={styles.containerForm}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={setFirstName}
            value={firstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setLastName}
            value={lastName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        <Text style={styles.notification}>Email Notifications</Text>
        <View style={styles.containerNotif}>
          <View style={styles.containerCheckBox}>
            <Checkbox
              status={orderNotif ? 'checked' : 'unchecked'}
              onPress={() => {
                setOrderNotif(!orderNotif);
              }}
            />
            <Text style={styles.checkboxText}>Order Statuses</Text>
          </View>
          <View style={styles.containerCheckBox}>
            <Checkbox
              status={passwordNotif ? 'checked' : 'unchecked'}
              onPress={() => {
                setpasswordNotif(!passwordNotif);
              }}
            />
            <Text style={styles.checkboxText}>Password Changes</Text>
          </View>
          <View style={styles.containerCheckBox}>
            <Checkbox
              status={offers ? 'checked' : 'unchecked'}
              onPress={() => {
                setOffers(!offers);
              }}
            />
            <Text style={styles.checkboxText}>Special Offers</Text>
          </View>
          <View style={styles.containerCheckBox}>
            <Checkbox
              status={newsletter ? 'checked' : 'unchecked'}
              onPress={() => {
                setNewsletter(!newsletter);
              }}
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>

        </View>

        <Pressable style={styles.signOutButton}
          onPress={() => {
            AsyncStorage.clear()
          }}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
        <View style={styles.containerButton}>
          <Pressable style={styles.discard}>
            <Text style={styles.discardText} onPress={getProfileData}>Discard Changes</Text>
          </Pressable>
          <Pressable style={styles.save} onPress={profileData}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  containerCheckBox: {
    flexDirection: 'row',
  },
  containerForm: {
    marginTop: 10,
  },
  containerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  containerNotif: {
    marginLeft: 12,
    marginTop: 10,
  },
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
    marginLeft: 30
  },
  avatar: {
    marginTop: 10,
    marginLeft: -15
  },
  avatarLabel: {
    marginBottom: 10,
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
  },
  change: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginTop: 40,
    marginLeft: 20,
    borderRadius: 10,
    backgroundColor: '#495e57',
  },
  changeText: {
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: 'white',
  },
  checkboxText: {
    marginTop: 7,
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red'
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 40,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#EE9972',
    backgroundColor: '#F4CE14',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Karla_400Regular',
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  discard: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginTop: 40,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#495e57',
  },
  discardText: {
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: '#495e57',
  },
  headerText: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 25,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
  },
  initialsAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    padding: 12,
    marginRight: 20,
    marginBottom: 30,
    marginLeft: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    textAlign: 'left',
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 12,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: 'gray',
  },
  logo: {
    width: 179,
    height: 76,
    resizeMode: 'contain',
  },
  notification: {
    textAlign: 'left',
    marginLeft: 20,
    fontSize: 25,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
  },
  profile: {
    marginRight: 25
  },
  profileInitials: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 36,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
  },  
  remove: {
    paddingVertical: 13,
    paddingHorizontal: 23,
    marginTop: 40,
    marginLeft: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#495e57',
  },
  removeText: {
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: '#495e57',
  },
  save: {
    paddingVertical: 13,
    paddingHorizontal: 13,
    marginTop: 40,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#495e57',
  },
  saveText: {
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: 'white',
  },
});
