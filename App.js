import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/RootNavigator";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
    </PaperProvider>
  );
}
