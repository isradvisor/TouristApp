import React,{useEffect} from 'react';
import { createAppContainer } from 'react-navigation';
import firstTimeInIsrael from './funnel/screens/1-firstTimeInIsrael';
import TripType from './funnel/screens/2-tripType';
import FlightsDates from './funnel/screens/3-FlightsDates'
import Budget from './funnel/screens/4-Budget'
import Interest from './funnel/screens/5-Interests'
import MatchScreen from './funnel/screens/6-matchScreen'
import GuideProfile from './funnel/screens/GuideProfile'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
} from './login/src/screens';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View,AsyncStorage } from 'react-native';
import MyProfile from "./tabNavigation/myProfile";
import MainExplore from "./tabNavigation/explore/mainExplore";
import CityExplore from "./tabNavigation/explore/cityExplore";
import Attractions from "./tabNavigation/explore/attractions";
import Resturants from "./tabNavigation/explore/resturants";
import Hotels from "./tabNavigation/explore/hotels";
import Chat from './tabNavigation/chat';
import EditProfile from './tabNavigation/editProfile';
import { FontAwesome } from '@expo/vector-icons';


//http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric


  fetch('http://api.openweathermap.org/data/2.5/group?id=293397,281184,294801,293322,295721,295277,7117228,294098&units=metric&appid=821ab800e4695da1b165f622f586a636', {
    method: 'GET',
    headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
    })
  })
    .then(res => {
        return res.json()
    })
    .then((result) => {
      try {
         AsyncStorage.setItem(
          'weather',
         JSON.stringify(result.list)
        );
      } catch (error) {
        // Error saving data
        console.warn('error : ',error)
      };
        (error) => {
            console.warn("err post=", error);
        };
    })


function MyTrip() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>My Trip!</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
      <Stack.Navigator initialRouteName="HomeScreen" headerMode="none" >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="firstTimeInIsrael" component={firstTimeInIsrael} />
        <Stack.Screen name="TripType" component={TripType} />
        <Stack.Screen name="FlightsDates" component={FlightsDates} />
        <Stack.Screen name="Budget" component={Budget} />
        <Stack.Screen name="Interest" component={Interest} />
        <Stack.Screen name="MatchScreen" component={MatchScreen} />
        <Stack.Screen name="GuideProfile" component={GuideProfile} />
        <Stack.Screen name="MyTabs" component={MyTabs} />
       
      </Stack.Navigator>
  );
}

const ExploreStack = createStackNavigator();

function MyExploreStack() {
  return (
      <ExploreStack.Navigator initialRouteName="MainExplore" headerMode="none" >
        <ExploreStack.Screen name="MainExplore" component={MainExplore} />
        <ExploreStack.Screen name="CityExplore" component={CityExplore} />
        <ExploreStack.Screen name="Attractions" component={Attractions} />
        <ExploreStack.Screen name="Resturants" component={Resturants} />
        <ExploreStack.Screen name="Hotels" component={Hotels} />
      </ExploreStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function MyProfileStack() {
  return (
      <ProfileStack.Navigator initialRouteName="MyProfile" headerMode="none" >
        <ProfileStack.Screen name="MyProfile" component={MyProfile} />
        <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      </ProfileStack.Navigator>
  );
}

  const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
        <Tab.Navigator
          initialRouteName="MyProfileStack"
          tabBarOptions={{
            activeTintColor: '#e91e63',
          }}
        >
          <Tab.Screen
            name="MyProfileStack"
            component={MyProfileStack}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="user" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
              tabBarLabel: 'Chat',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="comment" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MyTrip"
            component={MyTrip}
            options={{
              tabBarLabel: 'My Trip',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="map" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="MyExploreStack"
            component={MyExploreStack}
            options={{
              tabBarLabel: 'Explore',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="search" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
    );
  }

  export default function App() {
    return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );
  }
