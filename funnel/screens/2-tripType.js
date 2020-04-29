import React, {useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as Font from 'expo-font';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Button } from 'react-native-elements';

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
export default ({navigation}) => {

  const profile = navigation.getParam('profile');
  const [fontLoaded, setFontLoaded] = useState(false)
  const currentProgressPer = 15;
  const [tripType, setTripType] = useState('');
  const [tripChosen, setTripChosen] = useState(false)

 const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/TripType'


 
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

    const onTripTypePress = (travelType) =>{
     
      setTripType(travelType)
      setTripChosen(true)
    }

    const FetchDataAndContinue = () =>{

      //fetch to db
      const user = {
        Email: profile.Email,
        TripType: tripType
      }
   
  fetch(apiUrl, {
    method: 'POST',
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
      //console.warn("fetch POST= ", JSON.stringify(result));

    //list from fetch:
    //0 = db error
    //1= fetch succeeded

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
                          
              navigation.navigate('FlightsDates', {profile: profile})             
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
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{marginTop: '15%'}}>
        <AnimatedProgressWheel 
          size={120} 
          width={15} 
          color={'#0080ff'}
          progress={currentProgressPer}
          backgroundColor={'#E0E0E0'}
          animateFromValue={0}
          duration={2500}
          
          />

        </View>
        <FadeInView style={{width: 350, height: 100,  marginTop: 50}}>
          {fontLoaded && <Text style={styles.title}>What is your trip type?</Text> }
        </FadeInView>
        <FadeInView style={{ flex: 0.8}}>

        <View style={styles.firstRawView  }>
          <TouchableOpacity style={styles.viewInsideRaw} onPress={() => onTripTypePress('Couple')}>
                <Image
                          source={ require('../pictures/couplen.png' )}
                          style={tripType == 'Couple'? styles.imageActive: styles.imageStyle}
                          PlaceholderContent={<ActivityIndicator style={{backgroundColor: 'white'}}/>}
                          containerStyle={{borderRadius: 50}}
                          placeholderStyle={{borderRadius: 50}}
                />
                {fontLoaded && <Text style={styles.label}>Couple</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewInsideRaw}  onPress={() => onTripTypePress('Solo')}>
                <Image
                          source={ require('../pictures/solon.png' )}
                          style={tripType == 'Solo'? styles.imageActive: styles.imageStyle}                
                          PlaceholderContent={<ActivityIndicator style={{backgroundColor: 'white'}}/>}
                          containerStyle={{borderRadius: 50}}
                          placeholderStyle={{borderRadius: 50}}
                  />
                  {fontLoaded && <Text style={styles.label}>Solo</Text>}
          </TouchableOpacity>
      </View>

      <View style={styles.secondRawView}>
          <TouchableOpacity style={styles.viewInsideRaw} onPress={() => onTripTypePress('Family')}>
            <Image
                      source={ require('../pictures/familyn.png' )}
                      style={tripType == 'Family'? styles.imageActive: styles.imageStyle}
                      PlaceholderContent={<ActivityIndicator style={{backgroundColor: 'white'}}/>}
                      containerStyle={{borderRadius: 50}}
                      placeholderStyle={{borderRadius: 50}}
              />
              {fontLoaded && <Text style={styles.label}>Family</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewInsideRaw} onPress={() => onTripTypePress('Friends')}>
              <Image
                      source={ require('../pictures/friendsn.png' )}
                      style={tripType == 'Friends'? styles.imageActive: styles.imageStyle}
                      PlaceholderContent={<ActivityIndicator style={{backgroundColor: 'white'}}/>}
                      containerStyle={{borderRadius: 50}}
                      placeholderStyle={{borderRadius: 50}}
              />
              {fontLoaded && <Text style={styles.label}>Friends</Text>}
          </TouchableOpacity>
      </View>

        </FadeInView>
        {tripChosen && <View style={{flex: 0.2}}>
          <Button
            title="Continue"
            type="outline"
            buttonStyle={styles.continueButton}
            onPress={FetchDataAndContinue}
          />
        </View>}

       
    </View>
  )
}

const styles = StyleSheet.create({
  firstRawView: {
          flex: 0.5,
          flexDirection: "row"
                },
  secondRawView: {
          flex: 0.5, 
          flexDirection: "row", 
          marginTop: 10
                },
  viewInsideRaw: {
    width: '50%', height: '50%',flexDirection: "column", 
                },
  imageStyle: {
    width: 150, 
    height: 150,  
    marginLeft: '10%', 
    marginRight: '10%', 
    borderRadius: 30, 
    alignSelf: 'center',
    
    
  },
  imageActive: {
    width: 150, 
    height: 150,  
    marginLeft: '10%', 
    marginRight: '10%', 
    borderRadius: 30, 
    alignSelf: 'center',
    borderWidth: 2, borderColor: '#ade6d8',

  },
  label: {
    alignSelf: 'center', 
    fontFamily: 'ComicNeue-Bold', 
    marginTop: 5
  },
  title: {
    fontSize: 28, 
    textAlign: 'center', 
    fontFamily: 'ComicNeue-Bold'
  },
  continueButton: {
    backgroundColor: '#ade6d8', 
    marginTop: 10, 
    width: 140, 
    height: 50, 
    borderColor: '#ade6d8', 
    borderRadius: 10
  }
  
})


