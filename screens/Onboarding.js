import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Onboarding = () => {
  return (
      <View style={styles.container}>
        <Image source={require('../assets/little-lemon-logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>
          Little Lemon, your local Mediterranean Bistro
        </Text>
      </View>

  )

};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: 225,
    width: 325,
    resizeMode: 'contain',
    marginTop: 160,
    marginBottom: 35
  },
  headerText: {
    padding: 40,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 150
  }
})