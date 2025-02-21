

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Login from './screens/Login';
import Profile from './screens/Profile';
import useAuthStore from './components/store/useAuthStore';
import SelectClass from './screens/SelectClass';
import Home from './screens/Home';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Weekly from './screens/Weekly';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from './assets/constants';
import Internet from './components/store/Internet';
import ReportIssueScreen from './screens/ReportIssueScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const NavigatewithTabs = () => {
  return (
    <Tabs.Navigator initialRouteName='Home' screenOptions={{ headerShown: false ,tabBarShowLabel:false}}>
      <Tabs.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ color, size,focused }) => (
            <Ionicons name={focused?'home':'home-outline'}size={size} color={focused ? colors.primary : 'gray'} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="Weekly" 
        component={Weekly}
        options={{
          tabBarIcon: ({ color, size ,focused}) => (
            <Ionicons name={focused?'calendar':'calendar-outline'}size={size} color={focused ? colors.primary : 'gray'} />
          ),
        }} 
      />
      <Tabs.Screen name="Profile" component={Profile} options={{
          tabBarIcon: ({ color, size ,focused}) => (
            <Ionicons name={focused?'settings':'settings-outline'}size={size} color={focused ? colors.primary : 'gray'} />
          ),
        }} />

    </Tabs.Navigator>
  );
};
const App = () => {
  const {user,isInitialized} = useAuthStore((state) => state);
  const [initialRoute, setInitialRoute] = useState('');
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    // Request notification permissions
    
    const requestPermissions = async () => {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    };
    requestPermissions();

    // Checking user login state
    const checkUserSession = async () => {
     
      if(isInitialized === false) return;


      if (user === null) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('NavigatewithTabs');
      }
      setLoading(false);
    };

    checkUserSession();

    // Foreground notification listener
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   Alert.alert('New Notification', JSON.stringify(remoteMessage));
    //   console.log(remoteMessage);
    // });

  }, [user,isInitialized]); // Added `user` as a dependency to re-run when `user` updates

  if (loading || !isInitialized) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NavigatewithTabs" component={NavigatewithTabs} />
        <Stack.Screen name="Internet" component={Internet} />

        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SelectClass" component={SelectClass} />
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="ReportIssueScreen" component={ReportIssueScreen}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

