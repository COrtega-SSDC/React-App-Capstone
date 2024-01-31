import * as React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../screens/Onboarding";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ title: 'Onboarding', headerTitleAlign: 'center' }}/>
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile', headerTitleAlign: 'center' }} />
    </Stack.Navigator>

  );
};

export default RootNavigator;