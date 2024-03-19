import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import { Avatar, Checkbox } from 'react-native-paper';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderNotif, setOrderNotif] = useState(false);
  const [passwordNotif, setpasswordNotif] = useState(false)
  const [offers, setOffers] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  let [fontsLoaded, fontError] = useFonts({
    Karla_400Regular,
    MarkaziText_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.headerText}>Personal Information</Text>

        <View style={styles.containerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>Avatar</Text>
            <Avatar.Icon size={72} icon="folder" />
          </View>

          <Pressable style={styles.change}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
          <Pressable style={styles.remove}>
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

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="number-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>

        <Text style={styles.notification}>Email Notifications</Text>
        <View style={styles.containerCheckbox}>
          <Checkbox
            status={orderNotif ? 'checked' : 'unchecked'}
            onPress={() => {
              setOrderNotif(!orderNotif);
            }}
          />
          <Checkbox
            status={passwordNotif ? 'checked' : 'unchecked'}
            onPress={() => {
              setpasswordNotif(!passwordNotif);
            }}
          />
          <Checkbox
            status={offers ? 'checked' : 'unchecked'}
            onPress={() => {
              setOffers(!offers);
            }}
          />
          <Checkbox
            status={newsletter ? 'checked' : 'unchecked'}
            onPress={() => {
              setNewsletter(!newsletter);
            }}
          />
        </View>

        <Pressable style={styles.signOutButton}>
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
        <View style={styles.containerButton}>
          <Pressable style={styles.discard}>
            <Text style={styles.discardText}>Discard Changes</Text>
          </Pressable>
          <Pressable style={styles.save}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  containerCheckbox: {
    marginLeft: 15,
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
  avatar: {
    margin: '10px 0 0 -15px',
  },
  avatarLabel: {
    marginBottom: 10,
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
  },
  change: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: '40px 0 0 20px',
    borderRadius: 10,
    backgroundColor: '#495e57',
  },
  changeText: {
    fontSize: 15,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: 'white',
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 10,
    margin: '40px 20px 0 20px',
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
    margin: '40px 20px 0 0',
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
    textAlign: 'left',
    margin: '25px auto auto 20px',
    fontSize: 25,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    padding: 15,
    margin: 'auto 20px 30px 20px',
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    textAlign: 'left',
    margin: '0 0 5px 20px',
    fontSize: 12,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
    color: 'gray',
  },
  notification: {
    textAlign: 'left',
    marginLeft: 20,
    fontSize: 25,
    fontFamily: 'Karla_400Regular',
    fontWeight: 'bold',
  },
  remove: {
    paddingVertical: 13,
    paddingHorizontal: 23,
    margin: '40px 0 0 20px',
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
    margin: '40px 0 0 10px',
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
