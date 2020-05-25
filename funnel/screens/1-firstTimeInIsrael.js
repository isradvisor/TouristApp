import React, {useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Vibration, Image, ActivityIndicator, Alert } from 'react-native';
import * as Font from 'expo-font';
import {  Button } from 'react-native-elements';
import { SimpleLineIcons } from '@expo/vector-icons';

const FadeInView = (props) => {

  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  

  useEffect(() =>{

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


// You can then use your `FadeInView` in place of a `View` in your components:
export default ({route,navigation}) => {

    const profile = route.params.profile;
    const [fontLoaded, setFontLoaded] = useState(false)
    const vibrationDuration = 100;
    const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/FirstTimeInIsrael'


 //onPress function
  const Answer = (boolean) =>{
  
    Vibration.vibrate(vibrationDuration)
    Vibration.cancel()

        //fetch to db
        const user = {
          Email: profile.Email,
          FirstTimeInIsrael: boolean
        }
     
    fetch(apiUrl, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
      
    })
      .then(res => {
       //console.warn('res=', JSON.stringify(res));
        return res.json()
      })
      .then(
        (result) => {
       // console.warn("fetch POST= ", JSON.stringify(result));

      //list from fetch:
      //0 = db error
      //1= sign up succeeded

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
                             
                navigation.navigate('TripType', {profile: profile})
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
  }
//load the font before loading the whole page
useEffect(() => {
  async function loadFont() {
    loadContent();
    
  };
    loadFont();
  }, [])

  //font load
  const loadContent =  () =>{
    
    Font.loadAsync({
      'ComicNeue-Bold': require('../fonts/ComicNeue-Bold.ttf')
    }).then(() => setFontLoaded(true))

  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <FadeInView style={{  marginTop: 150}}>
  {fontLoaded && <Text style={{fontSize: 28, textAlign: 'center', fontFamily: 'ComicNeue-Bold'}}>{profile.FirstName}{"\n"} is it your First Time In Israel?</Text> }
      </FadeInView>
      <FadeInView style={{ marginTop: 50, justifyContent: 'center'}}>

      <Image
            source={ require('../pictures/firstTimeInIsrael.jpg' )}
            style={{ width: 400, height: 400, alignSelf: 'center' , paddingLeft: '5%', paddingRight: '5%', borderRadius: 150, opacity: 30}}
            PlaceholderContent={<ActivityIndicator style={{backgroundColor: 'white'}}/>}
            containerStyle={{borderRadius: 150}}
            placeholderStyle={{borderRadius: 75}}
        />
  <View style={styles.buttonsView}>
      <Button
         onPress={() => Answer(false)}
         icon={
          <SimpleLineIcons
            name="dislike"
            size={50}
            color="white"
          
          />}
      
        buttonStyle={styles.leftIcon}
      />
    
    <Button
           onPress={() => Answer(true)}
           icon={
          <SimpleLineIcons
            name="like"
            size={50}
            color="white"
          
          />}
        
        buttonStyle={styles.rightIcon}
      />

       
</View>

      </FadeInView>
    </View>
  )
}

const styles = StyleSheet.create({

rightIcon: {alignItems:'center',
            justifyContent:'center',
            width:100,
            height:100,
            backgroundColor:'#4ddb64',
            borderRadius:50,
            alignSelf: 'flex-end',
            marginTop: '40%',
            marginRight: '15%',
            shadowColor: 'rgba(0,0,0, .7)',
            shadowOffset: { height:0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 5
          },

leftIcon: {
            alignItems:'center',
            justifyContent:'center',
            width:100,
            height:100,
            backgroundColor:'#ff3b30',
            borderRadius:50,
            alignSelf: 'flex-start',
            marginTop: '40%',
            marginLeft: '15%',
            shadowColor: 'rgba(0,0,0, .7)',
            shadowOffset: { height:0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 5,
          },

buttonsView: {flexDirection: 'row', 
               justifyContent: 'space-between'
             }
})  