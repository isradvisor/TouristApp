import React, { useEffect, useState, useRef} from 'react';
import firstTimeInIsrael from './funnel/screens/1-firstTimeInIsrael';
import TripType from './funnel/screens/2-tripType';
import FlightsDates from './funnel/screens/3-FlightsDates'
import Budget from './funnel/screens/4-Budget'
import MatchScreen from './funnel/screens/6-matchScreen'
import GuideProfile from './funnel/screens/GuideProfile'
import { HomeScreen,LoginScreen,RegisterScreen, ForgotPasswordScreen, Dashboard} from './login/src/screens';
import MyTrip from "./tabNavigation/myTrip";
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {ActivityIndicator, Alert, AppState} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MyProfile from "./tabNavigation/myProfile";
import MainExplore from "./tabNavigation/explore/mainExplore";
import CityExplore from "./tabNavigation/explore/cityExplore";
import Attractions from "./tabNavigation/explore/attractions";
import Resturants from "./tabNavigation/explore/resturants";
import Hotels from "./tabNavigation/explore/hotels";
import Search from './tabNavigation/explore/search'; 
import Chat from './tabNavigation/chat';
import EditProfile from './tabNavigation/editProfile';
import { FontAwesome } from '@expo/vector-icons';
import firebaseSvc from './services/firebaseSDK';
import Interest from './funnel/screens/5-Interests';




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
      console.warn('error : ', error)
    };
    (error) => {
      console.warn("err post=", error);
    };
  })




const Stack = createStackNavigator();

function MyStack(props) {

  return (
    props.data2 !== 'HomeScreen' ?
      <Stack.Navigator initialRouteName="MyTabs" headerMode="none" >
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
      :
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
      <ExploreStack.Screen name="Search" component={Search} />
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
          tabBarIcon: ({color, size }) => (
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
  const [data, setData] = useState(null)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);



  useEffect(() => {
    AsyncStorage.clear();
    readUserData();
  }, [])

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      try {
        await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
          if (value !== null) {
            const profile = JSON.parse(value);
            if (profile !== null || profile !== undefined) {
              checkStatus(profile);
            }
          }

        });

      }
      catch (e) {
        console.warn('failed to fetch data')
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);


  };

 

  const readUserData = async () => {
    try {
      await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
        if (value !== null) {
          const profile = JSON.parse(value);
          if (profile !== null || profile !== undefined) {
            setData(profile)
          }
        }
        else {
          setData('HomeScreen');
        }
      });

    }
    catch (e) {
      console.warn('failed to fetch data')
    }
  }



  const ChangeStatus = (user) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip', {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          let TouristStatus = "";

          result.map((item) => {
            if (item.TouristEmail == user.TouristEmail) { TouristStatus = item.Status } {
            }
          })
          AsyncStorage.setItem('ChatStatus', TouristStatus)
        },
        (error) => {
          console.log("err post=", error);
        });
  }


  const checkStatus = (profile) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip/GetTouristStatus?email=' + profile.Email, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })

    })
      .then(res => {
        return res.json()
      })
      .then(
        async (result) => {
          GetGuideDetails(result.GuideEmail);
          await AsyncStorage.removeItem('ChatStatus');
          await AsyncStorage.setItem('ChatStatus', result.Status)
          if (result.Status == 'Start Chat') {
            const user = {
              email: profile.Email,
              password: profile.PasswordTourist
            }
            await firebaseSvc.login(user);
          }
          else if (result.Status == 'Accept Request') {
            const user2 = {
              name: profile.FirstName + ' ' + profile.LastName,
              email: profile.Email,
              password: profile.PasswordTourist,
              URL: profile.ProfilePic
            }
            firebaseSvc.createAccount(user2, result.GuideEmail).then((solve) => {
              console.warn('this is sinup data==>  ' + JSON.stringify(solve))

            }).catch((fail) => {
              console.warn('not getting data...................')
            })
            let user = {
              TouristEmail: profile.Email,
              GuideEmail: result.GuideEmail,
              Status: 'Start Chat'
            }
            ChangeStatus(user)

          }
          else if (result.Status == 'Decline Chat') {
            Alert.alert(
              'Your Friend Request has been denied!',
              'GO TO CHAT TO CHOOSE DIFFRENT GUIDE',
              [
                {
                  text: 'OK'
              
                },
              ],
              { cancelable: false }
            )

          }

        }),
      (error) => {
        console.warn("err post=", error);
      };

  }


  const GetGuideDetails = (email) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide?email=' + email, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })

    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          AsyncStorage.setItem('Guide', JSON.stringify(result));
        }
      ),
      (error) => {
        console.warn("err post=", error);
      };
  }





  if (data !== null) {
    return (
      <NavigationContainer>
        <MyStack data2={data} />
      </NavigationContainer>
    );

  } else {
    return (
      <ActivityIndicator
        animating={true}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',

          height: 80
        }}
        size="large"
      />
    );
  }

}
