import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator, nameValidator, } from '../core/utils';
import AnimatedLoader from "react-native-animated-loader";
import { Button as BTNElements, CheckBox } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import DatePicker from 'react-native-datepicker'



const RegisterScreen = ({ route, navigation }) => {

  const googleFacebookAccount = route.params;
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPass, setConfirmPass] = useState({ value: '', error: '' });
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [maleChecked, setMaleChecked] = useState(false)
  const [femaleChecked, setFemaleChecked] = useState(false)
  const [languages, setLanguages] = useState([])
  const [languageChosen, setLanguageChosen] = useState('')
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notifications, setNotification] = useState({});




  const apiSignUpUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Register'
  const apiGFSignUpFirstTimeUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/GoogleFacebookSignUpFirstTime'
  const languageApiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Language';

  //on load the screen - get all the languages from DB
  useEffect(() => {
    registerForPushNotificationsAsync();
    const _notificationSubscription = Notifications.addListener(_handleNotification);
    getFromDB();
    if (googleFacebookAccount != undefined) {
      setFirstName({ value: googleFacebookAccount.profile.FirstName, error: '' });
      setLastName({ value: googleFacebookAccount.profile.LastName, error: '' });
      setEmail({ value: googleFacebookAccount.profile.Email, error: '' })
    }

  }, [])

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setExpoPushToken(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const _handleNotification = notification => {
    console.log(notification);
    setNotification(notification)
  };


  const sendPushNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Welcome To IsraAdvisor!',
      body: 'Happy to have you on board!',
      data: { data: 'goes here' },
      _displayInForeground: true,
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };




  //get all languages
  const getFromDB = () => {
    fetch(languageApiUrl, {
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
          const temp = [];
          for (let i = 0; i < result.length; i++) {

            const Id = result[i].Id
            const lbl = result[i].LName
            temp.push({ label: lbl, value: Id })

          }
          setLanguages(temp)

        },
        (error) => {
          console.warn("err post=", error);
        });
  }


  //show date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);

  };

  //hide date picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //on confirm press
  const handleConfirm = date => {
    setBirthdate(date);
    hideDatePicker();
  };

  //on sign up pressed - validation & post if validation approved
  const _onSignUpPressed = () => {
    setIsLoading(true)
    //validation
    const nameError = nameValidator(firstName.value);
    const lastNameError = nameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPassError = passwordValidator(confirmPass.value);

    if (password.value !== confirmPass.value) {
      Alert.alert(
        'Error',
        'Password and Confirm password are not matched!',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      )
    }
    else {

      if (emailError || passwordError || nameError || lastNameError || password.value != confirmPass.value || gender == '' || birthdate == null || languageChosen == '') {
        setFirstName({ ...firstName, error: nameError });
        setLastName({ ...lastName, error: lastNameError });
        setEmail({ ...email, error: emailError });
        setPassword({ ...password, error: passwordError });
        setConfirmPass({ ...confirmPass, error: confirmPassError })
        if (password.value != confirmPass.value || passwordError) {
          Alert.alert(
            'Error',
            'Password confirmation is incorrect',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }
        if (nameError) {
          Alert.alert(
            'Error',
            'Please enter a valid name',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }
        if (email == '' || emailError) {
          Alert.alert(
            'Error',
            'Email Address is not valid',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }
        if (gender == '') {
          Alert.alert(
            'Error',
            'Please choose gender',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }
        if (birthdate == null) {
          Alert.alert(
            'Error',
            'Please set your BirthDate',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }
        if (languageChosen == '') {
          Alert.alert(
            'Error',
            'Please set your native language',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )
        }


        return;
      }

      //if the validation ok, he will turn to this path of registration
      else {
        const user = {
          FirstName: firstName.value,
          LastName: lastName.value,
          Email: email.value,
          PasswordTourist: password.value,
          Gender: gender,
          YearOfBirth: birthdate,
          LanguageCode: languageChosen,
          Token: expoPushToken
        }
        if (googleFacebookAccount == undefined) {

          fetchToDB(user, apiSignUpUrl)
        } else {

          fetchToDB(user, apiGFSignUpFirstTimeUrl)
        }
      }
    }
  };


  //POST or PUT - depence on if the user Sign up with google or facebook account, or new sign up
  const fetchToDB = (user, apiUrl) => {
    fetch(apiUrl, {
      method: googleFacebookAccount == undefined ? 'POST' : 'PUT',
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

          //Error list from fetch:
          //0 / 1 = db error
          //2= sign up succeeded
          //3 = email already use


          switch (result) {
            case 0:
              Alert.alert(
                'Error',
                'An Error has occured, please try again',
                [
                  { text: 'OK', onPress: () => setIsLoading(false) },
                ],
                { cancelable: false }
              )
              setIsLoading(false)
              break;

            case 2:
              StopLoadingProccessWithNavigate(CloseLoading, user);
              break;

            case 3:
              Alert.alert(
                'Error',
                'Email already in use, please change Email address',
                [
                  { text: 'OK', onPress: () => setIsLoading(false) },
                ],
                { cancelable: false }
              )

              break;

            default:

              Alert.alert(
                'Error',
                'An Error has occured, please try again',
                [
                  { text: 'OK', onPress: () => setIsLoading(false) },
                ],
                { cancelable: false }
              )
              break;
          }
        },
        (error) => {
          console.warn("err post=", error);
          setIsLoading(false)
        });
  }


  //funciton that create call back - loading and after navigation
  const StopLoadingProccessWithNavigate = async (CloseLoading, profile) => {
    CloseLoading(profile);
  }

  //loading timer
  const CloseLoading = (profile) => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    navigateTo(profile);
  }


  //navigation to next page with all the details of the user
  const navigateTo = (profile) => {
    AsyncStorage.setItem('ProfileTourist', JSON.stringify(profile));
    setTimeout(() => {
      navigation.navigate('Dashboard', { profile: profile })
      sendPushNotification();
    }, 2500);

  }




  //checked or unchecked function for the Gender
  const toggleGender = (id) => {
    if (id == 1 && !maleChecked) {
      setMaleChecked(true)
      setFemaleChecked(false)
      setGender('male')
    }
    if (id == 2 && !femaleChecked) {
      setFemaleChecked(true);
      setMaleChecked(false)
      setGender('female')
    }
  }


  return (

    <Background>

      <BackButton goBack={() => navigation.navigate('HomeScreen')} />


      <View
        style={{ width: '100%', paddingVertical: 20, justifyContent: 'center', position: 'absolute', marginTop: '-18%' }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >

        <View style={{ alignSelf: 'center', width: '65%' }}>
          <Header >Create Account</Header>
        </View>



        {isLoading && <AnimatedLoader
          visible={isLoading}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={{ width: 100, height: 100 }}
          source={require("../../../assets/loading.json")}
          speed={1}
        />}

        <TextInput
          label="First Name"
          returnKeyType="next"
          value={googleFacebookAccount == undefined ? firstName.value : googleFacebookAccount.profile.FirstName}
          onChangeText={text => setFirstName({ value: text, error: '' })}
          error={!!firstName.error}
          errorText={firstName.error}
          disabled={googleFacebookAccount == undefined ? false : true}
        />

        <TextInput
          label="Last Name"
          returnKeyType="next"
          value={googleFacebookAccount == undefined ? lastName.value : googleFacebookAccount.profile.LastName}
          onChangeText={text => setLastName({ value: text, error: '' })}
          error={!!lastName.error}
          errorText={lastName.error}
          disabled={googleFacebookAccount == undefined ? false : true}
        />

        <TextInput
          label="Email"
          returnKeyType="next"
          value={googleFacebookAccount == undefined ? email.value : googleFacebookAccount.profile.Email}
          onChangeText={text => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          disabled={googleFacebookAccount == undefined ? false : true}
        />

        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry

        />

        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmPass.value}
          onChangeText={text => setConfirmPass({ value: text, error: '' })}
          error={!!confirmPass.error}
          errorText={confirmPass.error}
          secureTextEntry
        />

        <View style={{ fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 4, color: 'black', paddingRight: 30, backgroundColor: 'white', marginTop: 20, width: '60%', alignSelf: 'center' }}>
          <RNPickerSelect
            onValueChange={(value) => setLanguageChosen(value)}
            items={languages}
            placeholder={{ label: 'Select a language', value: null }}

          />
        </View>

        <View style={{ flex: 0, flexDirection: 'row' }}>
          <Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', fontSize: 18 }}>Gender:</Text>
          <CheckBox
            title='Male'
            checked={maleChecked}
            containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
            textStyle={{ color: 'white' }}
            onPress={() => toggleGender(1)}
          />
          <CheckBox
            title='Female'
            checked={femaleChecked}
            containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
            textStyle={{ color: 'white' }}
            onPress={() => toggleGender(2)}
          />


        </View>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <Text style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center', fontSize: 18 }}>BirthDay:</Text>

          {/* <BTNElements
            icon={
              <Foundation
                name="calendar"
                size={30}
                color="black"
              />
            }
            iconContainerStyle={{ alignSelf: 'flex-start', flexDirection: 'row' }}
            title={birthdate == null ? "    BirthDate" : '  ' + moment(birthdate).format('DD-MM-YYYY')}
            buttonStyle={{ width: '78%', backgroundColor: 'white', alignSelf: 'center', marginLeft: 10, marginVertical: 12, borderRadius: 7 }}
            titleStyle={{ color: 'black' }}
            onPress={showDatePicker}
          /> */}
          <DatePicker
            style={{ backgroundColor: "#fff", marginLeft: 10 }}
            date={birthdate}
            placeholder="Birthday"
            format="YYYY-MM-DD"
            maxDate={new Date()}
            mode="date"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            headerTextIOS='Pick your BirthDate'
            onDateChange={(date) => handleConfirm(date)}

          />

        </View>

        <Button
          mode="contained"
          onPress={_onSignUpPressed} style={styles.button}
          style={{ backgroundColor: '#4b9fd6', color: 'white' }}
        >
          Sign Up
      </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>


      </View>

    </Background>

  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.white,
    marginBottom: 100,

  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    alignSelf: 'center'
  },
  link: {
    fontWeight: 'bold',
    color: '#4b9fd6',
  },


});

export default memo(RegisterScreen);
