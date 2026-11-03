import { FontAwesome } from '@react-native-vector-icons/fontawesome/static';
import { View, Text, TextInput } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-gray-200 rounded-full px-4 py-2 shadow">
      <FontAwesome name="search" size={20} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search for restaurants or dishes"
        placeholderTextColor="#9CA3AF"
        className="flex-1 rounded-full bg-gray-200 px-4 py-2 text-gray-800"
      />
    </View>
  ); 
}
