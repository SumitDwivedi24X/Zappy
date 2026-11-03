import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import {
  navigationRef,
  setIsNavigationReady,
} from './src/navigation/Navigation';
import RootNavigator from './src/navigation/navigators/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={() => setIsNavigationReady(true)}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
