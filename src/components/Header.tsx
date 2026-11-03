import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

const Header = () => {
  const nav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  return (
    <View className="rounded-b-2xl px-4 pb-4">
      <Text className="text-sm text-white">Delivery Starting in</Text>
      <View className="mt-2 flex-row items-end justify-between">
        <View>
          <Text className="text-3xl font-extrabold text-white">
            15 minutes ⚡️
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Text
              className="font-medium text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Unthinkable Solutions, Sec-30, 122001
            </Text>
            <Ionicons name="chevron-down-outline" size={16} color="white" />
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable>
            <Ionicons name="heart-outline" size={24} color="white" />
          </Pressable>
          <Pressable>
            <Ionicons name="person-outline" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
