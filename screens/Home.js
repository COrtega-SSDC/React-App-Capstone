import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Karla_400Regular } from '@expo-google-fonts/karla';
import { MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

    let [fontsLoaded, fontError] = useFonts({
        Karla_400Regular,
        MarkaziText_500Medium,
      });

      if (!fontsLoaded && !fontError) {
        return null;
      }
    

}