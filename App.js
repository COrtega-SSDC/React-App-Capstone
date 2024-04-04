import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home'
// import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isOnboardingCompleted, setOnboardingStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        if (value !== null) {
          setOnboardingStatus(JSON.parse(value));
        }

      } catch (e) {
        console.log(e)
      }
      setIsLoading(false)
    }

    checkOnboardingStatus();
  }, [])

  // if (isLoading) {
  //   // We haven't finished reading from AsyncStorage yet
  //   return <SplashScreen />;
  // }
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
