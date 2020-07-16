import React, { memo, useState, useRef, useEffect, componentWillMount } from 'react';
import { Text, Alert, View, Animated ,Image} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import * as Facebook from 'expo-facebook';
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import * as Google from "expo-google-app-auth";

import firebaseSvc from '../../../services/firebaseSDK';
import styles from 'react-native-weekly-calendar/src/Style';





const FadeInView = (props) => {

  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0


  useEffect(() => {

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
      }
    ).start();
  }, [])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

const HomeScreen = ({ navigation }) => {


  const IOS_CLIENT_ID = "369112967382-tqc9ttloirgp9ne76rfmbdc3upmv26kf.apps.googleusercontent.com";
  const ANDROID_CLIENT_ID = "369112967382-gbahqts3s171d0p3uo3bceq1dedfq8ap.apps.googleusercontent.com";
  const apiUrlFacebook = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/FacebookUser';
  const apiUrlGoogle = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/GoogleUser';







  const appId = '2490345164547632';
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null)
  const [userDetailsFromDB, setUserDetailsFromDB] = useState(null)
  


  //signin with google
  const signInWithGoogle = async () => {
    //await AsyncStorage.removeItem('ProfileTourist')
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
        //AsyncStorage.setItem('googleFacebookAccount',JSON.stringify(profile));


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
              console.warn(result)
              //  console.warn("fetch POST= ", JSON.stringify(result));

              //respond from db:
              //0 = db error
              //1= sign up succeeded
              //2 = user already signed up, continue to next screens

              switch (result) {
                case 0:
                    Alert.alert(
                      'Error',
                      'An Error has occured, please try again',
                      [
                        { text: 'OK' },
                      ],
                      { cancelable: false }
                    )
                  break;

                case 1:
                    Alert.alert(
                      'Welcome!',
                      'Just finish the Regsitration and we are all set!',
                      [
                        { text: 'OK' },
                      ],
                      { cancelable: false }
                    )
                    navigation.navigate('RegisterScreen', { profile: profile })
                    break;

                case 2:

                  //StopLoadingProccessWithNavigate(CloseLoading, profile, result);
                  getTourist(profile.Email);

                  break;

                default:
                  Alert.alert(
                    'Error',
                    'An Error has occured, please try again',
                    [
                      { text: 'OK' },
                    ],
                    { cancelable: false }
                  )
                  break;
              }
            })


      } else {
        return { cancelled: true };
      }
    } catch ({e}) {
      alert(`Google Login Error: ${e}`);}
  };
  //funciton that create call back - loading and after navigation
  // const StopLoadingProccessWithNavigate = async (CloseLoading, profile, caseResult) => {

  //   CloseLoading(profile, caseResult);
  // }

  //loading timer
  // const CloseLoading = (profile, caseResult) => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500);
  //   navigateTo(profile, caseResult);
  // }


  //navigation to next page with all the details of the user
  // const navigateTo = (profile, caseResult) => {

  //   setTimeout(() => {
  //     if (caseResult == 1) {
  //       Alert.alert(
  //         'Welcome!',
  //         'Just finish the Regsitration and we are all set!',
  //         [
  //           { text: 'OK' },
  //         ],
  //         { cancelable: false }
  //       )
  //     }

  //     // caseResult == 1 ? navigation.navigate('RegisterScreen', { profile: profile }) :
  //     //   navigation.navigate('MyTabs', { screen: 'MyProfileStack', params: { screen: 'MyProfile', params: { profile: profile }, }, })
  //   }, 1500);


  // }



  //log in with facebook
  const logInWithFacebook = async () => {
    //await AsyncStorage.removeItem('ProfileTourist')
    try {
      await Facebook.initializeAsync(appId);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture.type(large)`);
        const temp = await response.json();
        const splitName = temp.name.split(' ')

        const profile = {
          FirstName: splitName[0],
          LastName: LastNameConverter(splitName),
          Email: temp.email,
          ProfilePic: temp.picture.data.url,
        }
        //AsyncStorage.setItem('googleFacebookAccount',JSON.stringify(profile));

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

              switch (result) {
                case 0:
                  Alert.alert(
                    'Error',
                    'An Error has occured, please try again',
                    [
                      { text: 'OK' },
                    ],
                    { cancelable: false }
                  )
                  break;

                case 1:
                  Alert.alert(
                    'Welcome!',
                    'Just finish the Regsitration and we are all set!',
                    [
                      { text: 'OK' },
                    ],
                    { cancelable: false }
                  )
                  navigation.navigate('RegisterScreen', { profile: profile })
                  break;

                case 2:

                  getTourist(profile.Email);
                  break;

                default:
                  Alert.alert(
                    'Error',
                    'An Error has occured, please try again',
                    [
                      { text: 'OK' },
                    ],
                    { cancelable: false }
                  )
                  break;
              }


            },
            (error) => {
              console.warn("err post=", error);
            });


      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  const getTourist = (email) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist?email=' + email, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })

    })
      .then(res => {
        //console.warn('res=', JSON.stringify(res));
        return res.json()
      })
      .then(
        async (result) => {
          //await AsyncStorage.removeItem('ProfileTourist')
          await AsyncStorage.setItem('ProfileTourist', JSON.stringify(result))
          let profile = await AsyncStorage.getItem('ProfileTourist')
          console.warn(profile)
          if (profile !== undefined || profile !== null) {
            Alert.alert(
              'Welcome!',
              'You sign in successfully! enjoy your trip!',
              [
                { text: 'OK' },

              ],
              { cancelable: false }
            )
            navigation.navigate('MyTabs', { screen: 'MyProfileStack', params: { screen: 'MyProfile', params: { profile: result }, }, });

          }
          ;
        }),
      (error) => {
        console.warn("err post=", error);
      };
  }


  //LastName converter for facebook users
  const LastNameConverter = (splitOfFacebookNames) => {
    const temp = [];
    for (let index = 1; index < splitOfFacebookNames.length; index++) {
      temp.push(splitOfFacebookNames[index]);

    }

    return temp.toString().replace(',', ' ');
  }
  return (
    <Background>
      <FadeInView>
        <Header>Welcome To IsraAdvisor</Header>
        {/* {isLoading && <AnimatedLoader
          visible={isLoading}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={{ width: 100, height: 100 }}
          source={require("../../../assets/loading.json")}
          speed={1}
        />} */}
        <Paragraph >
          Let's start create your trip in Israel!
    </Paragraph>
      </FadeInView>
      
      <View style={{ height: '25%' }}>

      </View>
      <FadeInView>
        <Button
          mode="outlined"
          onPress={signInWithGoogle}
          style={{ backgroundColor: '#DB4C3F' }}
        >
          <AntDesign name="google" size={25} color="white"></AntDesign>
          <Text style={{ color: 'white' }}>     Sign in With Google</Text>
        </Button>

      </FadeInView>

      <FadeInView>
        <Button
          mode="outlined"
          style={{ backgroundColor: '#3b5998', color: 'white', }}
          onPress={logInWithFacebook}
        >

          <FontAwesome name="facebook" size={20} color="white" styleIcon={{ marginRight: 10 }}></FontAwesome>

          <Text style={{ color: 'white' }}>   Sign in With Facebook</Text>
        </Button>
      </FadeInView>
      <FadeInView style={{ flexDirection: "row", }}>
        <Button mode="contained"
          style={{ backgroundColor: '#4b9fd6', color: 'white', width: '43.5%', marginRight: '1%' }}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Log in
    </Button>


        <Button
          mode="outlined"
          onPress={() => navigation.navigate('RegisterScreen')}
          style={{ width: '43.5%', marginLeft: '1%' }}
        >
          <Text style={{ color: '#4b9fd6' }}>Sign Up</Text>
        </Button>

      </FadeInView>
    </Background>
  )

};


export default memo(HomeScreen);
