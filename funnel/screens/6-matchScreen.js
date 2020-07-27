import React, { useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Font from 'expo-font';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Card, ListItem, Button } from 'react-native-elements';
import { create } from 'uuid-js';



const FadeInView = (props) => {

  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  useEffect(() => {

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: props.duration == undefined ? 2000 : props.duration,
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
export default ({ route, navigation }) => {
  const [profile, setProfile] = useState('');
  const [TouristId, setTouristId] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [topThreeGuides, setTopThreeGuides] = useState([]);

  let apiUrl = "";



  const apiGetGuidesUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide/TopMatchGuides';

  //load the font before loading the whole page
  useEffect(() => {
    async function loadFont() {
      loadContent();

    };
    loadFont();

    tempFunc();

  }, [])

  const tempFunc = async () => {
    let profile = await AsyncStorage.getItem('ProfileTourist');
    if (profile !== undefined || profile !== null) {
      profile = JSON.parse(profile);
      getTourist(profile.Email)
    }
    else {
      getTourist(route.params.profile.Email);
    }
  }


  const getTourist = async (email) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist?email=' + email, {
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
          await AsyncStorage.setItem('ProfileTourist', JSON.stringify(result))
          let profile = await AsyncStorage.getItem('ProfileTourist');
          if (profile !== undefined || profile !== null) {
            profile = JSON.parse(profile);
            setTouristId(profile.TouristID);
            setProfile(profile)
            apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Match/calculateTouristBetweenGuides/' + profile.TouristID
          }
          await AsyncStorage.getItem("top3Guides")
            .then((value) => {
              if (value !== null) {
                let top3Guides = JSON.parse(value);
                setTopThreeGuides(top3Guides)

              } else {
                getAllMatchGuidesToTourist();
              }
            }
            )

        }),
      (error) => {
        console.warn("err post=", error);
      };

  }




  const onPressCreate = async (profile, guide) => {
    sinupData(profile, guide)
  }

  const sinupData = (profile, guide) => {
    const user = {
      name: profile.FirstName + ' ' + profile.LastName,
      email: profile.Email,
      password: profile.PasswordTourist,
      URL: profile.ProfilePic
    }
    postStatus(user, guide);
    let ifExist = true;
    AsyncStorage.setItem('MatchScreen', JSON.stringify(ifExist))
    navigation.navigate('MyTabs', { screen: 'MyProfileStack', params: { screen: 'MyProfile', params: { profile: profile, guide: guide }, }, });
    //  AsyncStorage.clear();



  }

  const postStatus = (user, guide) => {
    fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip/AddRequest', {
      method: 'POST',
      body: JSON.stringify({
        GuideEmail: guide.Email,
        TouristEmail: user.email,
        Status: 'send request'
      }),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })

    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log(result);
        },

        (error) => {
          console.warn("err post=", error);
        });
  }


  //font load
  const loadContent = () => {

    Font.loadAsync({
      'ComicNeue-Bold': require('../fonts/ComicNeue-Bold.ttf')
    }).then(() => setFontLoaded(true))

  }

  //get Function from DB - list of the top 3 match guides and their id
  const getAllMatchGuidesToTourist = () => {
    fetch(apiUrl, {
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
          result.length > 0 && getGuides(result);

        },

        (error) => {
          console.warn("err post=", error);
        });
  }

  //after the first get, fetch the guides from db with array of 3 id
  const getGuides = (matchResults) => {

    const topThreeGuides = [matchResults[0].Id2, matchResults[1].Id2, matchResults[2].Id2]

    if (topThreeGuides.length > 0) {

      fetch(apiGetGuidesUrl, {
        method: 'POST',
        body: JSON.stringify(topThreeGuides),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })

      })
        .then(res => {
          return res.json()
        })
        .then(
          async (result) => {
            for (let i = 0; i < result.length; i++) {
              if (result[i].gCode == matchResults[i].Id2) {

                result[i] = {
                  ...result[i],
                  Percents: matchResults[i].Percents

                }
              }

            }
            await AsyncStorage.setItem("top3Guides", JSON.stringify(result));
            setTopThreeGuides(result)


          },

          (error) => {
            console.warn("err post=", error);
          });
    }

  }
  const changecolor = (number) => {

    if (number > 80) {
      return '#4ddb64'
    }
    else if(number>60){
      return '#dbdb4d';
    }
    else{
      return '#db714d';
    }
  }


  if (profile !== null) {
    return (
      <View style={styles.container}>

        <View style={styles.viewProgress}>

          <AnimatedProgressWheel
            size={120}
            width={15}
            color={'#0080ff'}
            progress={100}
            backgroundColor={'#E0E0E0'}
            animateFromValue={0}
            duration={2500}
          />

        </View>
        <FadeInView style={styles.fadeTitle} duration={4000}>
          {fontLoaded && <Text style={styles.title}>Ok {profile.FirstName}!</Text>}
        </FadeInView>
        <FadeInView style={styles.fadeTitle} duration={5000}>
          {fontLoaded && <Text style={styles.title}>Now After we builed{"\n"}your profile, let's pick{"\n"}an expert that will help{"\n"}you to build your trip</Text>}
        </FadeInView>

        {topThreeGuides.length > 0 &&

          <FadeInView style={styles.fadeTitle} duration={4000}>
            <Card title="IT'S A MATCH!" titleStyle={styles.matchTtile}>
              {
                topThreeGuides.map((guide, i) => {
                  let pic ="";
                  {guide.ProfilePic ==null || guide.ProfilePic =="" ? 
                  pic='http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png'
                  :
                  pic=guide.ProfilePic
                 }
                  
                  return (
                    <View key={i}>
                      <ListItem
                        key={i}
                        leftAvatar={{
                          title: guide.FirstName,
                          
                          source: { uri: pic },
                          size: 'medium',
                          resizeMode: "cover",
                        }}
                        badge={{
                          value: guide.Percents.toFixed(2) + '%',
                          badgeStyle: style={ height: 50, borderRadius: 100,backgroundColor:changecolor(guide.Percents.toFixed(2))}
                        }}
                        bottomDivider
                        title={guide.FirstName + ' ' + guide.LastName}
                        subtitle='view profile'
                        subtitleStyle={{ fontSize: 12, color: '#2089dc', textDecorationLine: 'underline' }}
                        onPress={() => navigation.navigate('GuideProfile', { guide: guide })}
                        chevron
                        rightElement={
                          <Button
                            title={' Friend ' + "\n" + 'Request'}
                            titleStyle={{ fontSize: 14 }}
                            containerStyle={{ marginLeft: 10 }}
                            onPress={() => onPressCreate(profile, guide)}
                          />}
                      />
                    </View>
                  );
                })
              }
            </Card>
          </FadeInView>}


      </View>

    );
  }
  else {
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',


  },

  viewProgress: {
    marginTop: '15%',

  },

  fadeTitle: {
    width: 420,
    marginTop: 40,
  },

  title: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'ComicNeue-Bold'
  },

  matchTtile: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
  },

})

