import React, {useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Alert} from 'react-native';
import * as Font from 'expo-font';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Button, Slider, CheckBox } from 'react-native-elements';


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
  const currentProgressPer = 57;
  const [maximum, setMaximum] = useState(10000)
  const [budgetValue, setBudgetValue] = useState(0)
  const [checked, setChecked] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [disabledSlider, setDisabledSlider] = useState(false)
  const [calculateType, setCalculateType] = useState('')

 const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Budget'


 
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

    //on daily press
const dailyPress = () =>{
setShowVolume(true)
setMaximum(10000)
setBudgetValue(0)
setCalculateType('$ per day')
}
  //on whole trip press
const tripPress = () =>{
  setShowVolume(true)
  setMaximum(50000)
  setBudgetValue(0)
  setCalculateType('$ for whole trip')
}

//checkbox press
const unlimitedCheckBox = () =>{
if(!checked){
  setChecked(true)
  setDisabledSlider(true)
  setBudgetValue(0)
}else{
  setChecked(false)
  setDisabledSlider(false)
}
}

// on continue press
const fetchAndContinue = () =>{
  if(!checked){
    const user = {
      Email:  profile.Email,
      Budget: budgetValue + calculateType
    }
    fetchToDB(user)

  }
  else{
    const user = {
      Email: profile.Email,
      Budget: 'Unlimited budget'
  }
  fetchToDB(user)

}
  
}

//fetch to DB and continue to next page
const fetchToDB = (user) =>{
  fetch(apiUrl, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
    })
    
  })
    .then(res => {
     console.warn('res=', JSON.stringify(res));
      return res.json()
    })
    .then(
      (result) => {
      console.warn("fetch POST= ", JSON.stringify(result));

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
              console.warn('fetch Succeeded! :)')    
              navigation.navigate('Interest', {profile: profile})             
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
    <View style={styles.container}>
        <View style={styles.viewProgress}>
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
        <FadeInView style={styles.fadeTitle}>
          {fontLoaded && <Text style={styles.title}>What is your estimate budget?</Text> }
        </FadeInView>
        <FadeInView style={styles.fadeButtons}>
        <Button
            title="Daily Calculate"
            type="outline"
            buttonStyle={styles.dontKnowBtn}
            titleStyle={{color: 'white'}}
            onPress={dailyPress}
          />

        <Button
            title="Trip Calculate"
            type="outline"
            buttonStyle={styles.dontKnowBtn}
            titleStyle={{color: 'white'}}
            onPress={tripPress}
          />
         
        </FadeInView>

        {showVolume && <View style={styles.rowProgress}>
            <View style={{marginBottom: 30 }}>
             <View style={{flexDirection: 'row'}}> 
                  <Button
                  title="-"
                  type="outline"
                  buttonStyle={styles.minusBtn}
                  titleStyle={styles.btnTitle}
                  onPress={() => {budgetValue > 0 && setBudgetValue(budgetValue => budgetValue - 100)}}
                  disabled={disabledSlider}
                />
                <Slider
                  value={budgetValue}
                  animateTransitions
                  animationType='timing'
                  thumbTintColor={'#2196f3'}
                  style={{width: 270}}
                  minimumValue={0}
                  maximumValue={maximum}
                  onValueChange={value => setBudgetValue(value)}
                  disabled={disabledSlider}
                  
                />
                <Button
                title="+"
                type="outline"
                buttonStyle={styles.plusBtn}
                titleStyle={styles.btnTitle}
                onPress={() => {budgetValue < 50000 && setBudgetValue(budgetValue => budgetValue + 100)}}
                disabled={disabledSlider}
              />
            </View> 
            <Text style={styles.budgetValue}> ${budgetValue.toFixed(0)} </Text>
            </View>
            <CheckBox
              center
              title='Unlimited budget'
              checked={checked}
              containerStyle={styles.checkboxContainer}
              onPress={unlimitedCheckBox}
            />

        </View>}
       <View style={{ flex: 0.2}}>
       {(budgetValue > 0 || checked) &&  <Button
            title="Continue"
            type="outline"
            buttonStyle={styles.continueBtn}
            titleStyle={{color: 'white'}}
            onPress={fetchAndContinue}
        />}
       </View>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
  flex: 1,
   alignItems: 'center'

},
viewProgress:{
  marginTop: '15%'
},
fadeTitle:{
  width: 350,
  height: 100,  
  marginTop: 50
},

fadeButtons:{
  flex: 0.2, 
  flexDirection: 'row',  
  marginTop: 30
},

title: {
    fontSize: 28, 
    textAlign: 'center', 
    fontFamily: 'ComicNeue-Bold'
  },

  rowProgress:{
    flex: 1, 
    alignItems: 'stretch', 
    justifyContent: 'center'
  },

minusBtn:{
  width: 40, 
  height: 40, 
  backgroundColor: '#2196f3', 
  marginRight: 15, 
  borderRadius: 80
},
  dontKnowBtn: {
    backgroundColor: '#2196f3', 
    marginBottom: 20, 
    width: 150, 
    height: 50, 
    borderColor: '#2196f3', 
    borderRadius: 10,
    margin: 20
  },
  continueBtn: {
    backgroundColor: '#ade6d8', 
    marginBottom: 50, 
    width: 140, 
    height: 50, 
    borderColor: '#ade6d8', 
    borderRadius: 10,
    alignSelf: 'center'
  },
  btnTitle: {

    color: 'white', 
    fontWeight: "bold",
    alignSelf: 'center'
  },
  plusBtn:{
    width: 40, 
    height: 40, 
    backgroundColor: '#2196f3', 
     marginLeft: 15, 
     borderRadius: 80
    },
    budgetValue:{
      alignSelf: 'center', 
      fontWeight: "bold"
    },
    checkboxContainer:{
      backgroundColor: '#f2f2f2', 
      borderColor: '#f2f2f2'
    }
})


