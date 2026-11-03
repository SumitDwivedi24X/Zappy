import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@react-native-vector-icons/fontAwesome/static';
import { MainRoutes } from '../Routes';
import HomeScreen from '../../screens/HomeScreen';
import StoreScreen from '../../screens/StoreScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ tabBarActiveTintColor: '#1E88E5', headerShown: false }}
    >
      <Tab.Screen
        name={MainRoutes.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={MainRoutes.Store}
        component={StoreScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="shopping-bag" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const styles = StyleSheet.create({});
