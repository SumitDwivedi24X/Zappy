import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useState } from 'react';
import SearchBar from "../components/SearchBar";

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-green-700">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#15803d"
        translucent={false}
      />
      <View className="flex-1 bg-green-700">
        <Header />
        <View className="px-4">
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
