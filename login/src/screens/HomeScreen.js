import React, { memo, useState } from 'react';
import { Text, Alert} from 'react-native'
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import * as Facebook from 'expo-facebook';
import {FontAwesome, AntDesign} from '@expo/vector-icons'
import * as Google from "expo-google-app-auth";
import AnimatedLoader from "react-native-animated-loader";
//commit check

const HomeScreen = ({ navigation }) => {
  

const IOS_CLIENT_ID = "369112967382-tqc9ttloirgp9ne76rfmbdc3upmv26kf.apps.googleusercontent.com";
const ANDROID_CLIENT_ID = "369112967382-gbahqts3s171d0p3uo3bceq1dedfq8ap.apps.googleusercontent.com";
const apiUrlFacebook = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/FacebookUser';
const apiUrlGoogle = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/GoogleUser';
const appId = '2490345164547632';
const [isLoading, setIsLoading] = useState(false);

//login with google
const signInWithGoogle = async () => {
  setIsLoading(true)
  try {
    const result = await Google.logInAsync({
      iosClientId: IOS_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID,
      scopes: ["profile", "email"]
    });

    if (result.type === "success") {
     // console.warn("LoginScreen.js.js 21 | ", result);
      
      const temp = result;
     
       const profile = {
        FirstName: temp.user.givenName,
        LastName: temp.user.familyName,
        Email: temp.user.email,
        ProfilePic: temp.user.photoUrl,
      }

      //fetch to db
      fetch(apiUrlGoogle, {
        method: 'POST',
        body: JSON.stringify(profile),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })
        
      })
        .then(res => {
       //  console.warn('res=', JSON.stringify(res));
          return res.json()
        })
        .then(
          (result) => {
        //  console.warn("fetch POST= ", JSON.stringify(result));

        //respond from db:
        //0 = db error
        //1= sign up succeeded
        //2 = user already signed up, continue to next screens

            switch(result){
              case 0:
                Alert.alert(
                  'Error',
                  'An Error has occured, please try again',
                  [
                    {text: 'OK', onPress: () => setIsLoading(false)},
                  ],
                  { cancelable: false }
                )
                break;

                case 1:

                  StopLoadingProccessWithNavigate(CloseLoading, profile);
                  
                break;
                case 2:
                  StopLoadingProccessWithNavigate(CloseLoading, profile);
                break;

                    default:
                    Alert.alert(
                      'Error',
                      'An Error has occured, please try again',
                      [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
                    break;
          }})
      navigation.navigate('Dashboard', { profile: profile })

    } else {
      return { cancelled: true };
    }
  } catch (e) {
    console.warn('LoginScreen.js.js 30 | Error with login', e);
    return { error: true };
  }
};
//funciton that create call back - loading and after navigation
const StopLoadingProccessWithNavigate = async (CloseLoading,  profile) =>{
  CloseLoading(profile);
}

//loading timer
const CloseLoading = (profile) =>{
  setTimeout(() => { 
  setIsLoading(false);
 }, 1500);
 navigateTo(profile);
}


//navigation to next page with all the details of the user
const navigateTo = (profile) =>{
 
 setTimeout(() => { 
  Alert.alert(
    'Welcome!',
    'You sign in successfully! enjoy your trip!',
    [
      {text: 'OK'},
    ],
    { cancelable: false }
  )
  navigation.navigate('Dashboard', { profile: profile });
  }, 1500);
}

    

//log in with facebook
const logInWithFacebook = async () =>{
  try {
    await Facebook.initializeAsync(appId);
    const {type, token} = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`);
    
       const temp = await response.json();
      
       const profile = {
        FirstName: temp.name,
        Email: temp.email,
        ProfilePic: temp.picture.data.url,
      }


      //fetch to db
      fetch(apiUrlFacebook, {
        method: 'POST',
        body: JSON.stringify(profile),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })
        
      })
        .then(res => {
       //  console.warn('res=', JSON.stringify(res));
          return res.json()
        })
        .then(
          (result) => {
        //  console.warn("fetch POST= ", JSON.stringify(result));

        //respond from db:
        //0 = db error
        //1= sign up succeeded
        //2 = user already signed up, continue to next screens

            switch(result){
              case 0:
                Alert.alert(
                  'Error',
                  'An Error has occured, please try again',
                  [
                    {text: 'OK'},
                  ],
                  { cancelable: false }
                )
                break;

                case 1:
                  Alert.alert(
                    'Welcome!',
                    'You sign in successfully! enjoy your trip!',
                    [
                      {text: 'OK'},
                    ],
                    { cancelable: false }
                  )
                navigation.navigate('Dashboard', { profile: profile })
                break;

                case 2:
                  Alert.alert(
                    'Welcome!',
                    'You sign in successfully! enjoy your trip!',
                    [
                      {text: 'OK'},
                    ],
                    { cancelable: false }
                  )
                navigation.navigate('Dashboard', { profile: profile })
                break;

                    default:
                    Alert.alert(
                      'Error',
                      'An Error has occured, please try again',
                      [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
                    break;
            }
            
         
           },
          (error) => {
            console.warn("err post=", error);
          });
      navigation.navigate('Dashboard', { profile: profile })

    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}
  return(
<Background>
    <Logo />
    <Header>Welcome To IsraVisor</Header>
    {isLoading &&  <AnimatedLoader
        visible={isLoading}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{width: 100, height: 100}}
        source={require("../../../assets/loading.json")}
        speed={1}
      />}
    <Paragraph>
      Let's start create your trip in Israel!
    </Paragraph>
    
    <Button mode="contained" 
       style={{ backgroundColor: '#4b9fd6', color: 'white'}}
      onPress={() => navigation.navigate('LoginScreen')}
    >
      Log in
    </Button>

    <Button 
      mode="outlined" 
      style={{ backgroundColor: '#3b5998', color: 'white'}}
      onPress={logInWithFacebook}
      >
     
    <FontAwesome name="facebook" size={20} color="white" styleIcon={{marginRight: 10}}></FontAwesome>
    
    <Text style={{color: 'white'}}>   Sign in With Facebook</Text>
    </Button>


    <Button
      mode="outlined"
      onPress={signInWithGoogle}
      style={{ backgroundColor: '#DB4C3F'}}
    >
      <AntDesign name="google" size={25} color="white"></AntDesign>
    <Text style={{color: 'white'}}>     Sign in With Google</Text>
    </Button>

    
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('RegisterScreen')}
    >
       <Text style={{color: '#4b9fd6'}}>Sign Up</Text>
    </Button>
  </Background>
  )
  
};


export default memo(HomeScreen);
