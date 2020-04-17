import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../core/utils';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-material-dropdown';
import AnimatedLoader from "react-native-animated-loader";
import {Button as BTNElements} from 'react-native-elements';
import {Foundation} from '@expo/vector-icons'
import  moment  from  "moment";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPass, setConfirmPass] = useState({ value: '', error: '' });
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Register'

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
  setBirthdate(moment(date).format('YYYY-MM-DD'))
  hideDatePicker();
};


  const _onSignUpPressed = () => {
    setIsLoading(true)
    //validation
    const nameError = nameValidator(firstName.value);
    const lastNameError = nameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPassError = passwordValidator(confirmPass.value);


    if (emailError || passwordError || nameError || lastNameError || password.value != confirmPass.value || gender == '') {
      setFirstName({ ...firstName, error: nameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPass({...confirmPass, error: confirmPassError})
      if(password.value != confirmPass.value){
        Alert.alert(
          'Error',
          'Password confirmation is incorrect',
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        )
      }
      if(gender == ''){
        Alert.alert(
          'Error',
          'Please choose gender',
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        )
      }
      
      return;
    }
    
    //if the validation ok, he will turn to this path of registration
    else{
      
     const user = {
        FirstName: firstName.value,
        LastName: lastName.value,
        Email: email.value,
        PasswordTourist: password.value,
        Gender: gender,
        YearOfBirth: birthdate
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
         // console.warn("fetch POST= ", JSON.stringify(result));

        //Error list from fetch:
        //0 = db error
        //1= sign up succeeded
        //2 = email already use


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
                setIsLoading(flase)
                break;

                case 1:
                  StopLoadingProccessWithNavigate(CloseLoading, user);
                break;

                case 2:
                  Alert.alert(
                    'Error',
                    'Email already in use, please change Email address',
                    [
                      {text: 'OK', onPress: () => setIsLoading(false)},
                    ],
                    { cancelable: false }
                  )

                  break;

                  default:

                    Alert.alert(
                      'Error',
                      'An Error has occured, please try again',
                      [
                        {text: 'OK', onPress: () => setIsLoading(false)},
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
const StopLoadingProccessWithNavigate = async (CloseLoading,  profile) =>{
  CloseLoading(profile);
}

//loading timer
const CloseLoading = (profile) =>{
  setTimeout(() => { 
  setIsLoading(false);
 }, 2500);
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
  }, 2500);
}

    
  };

  const data = [{
    value: 'Male',
  }, {
    value: 'Female',
  }];
  return (
    
    <Background>


      <ScrollView 
      style={{width: '100%', paddingVertical: 20, }}
      contentContainerStyle={{ flexGrow: 1,justifyContent: "space-between"}}
      showsVerticalScrollIndicator={false}
      >
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <View style={{alignSelf: 'center', marginTop: 50}}>
         <Logo />
      </View>
      <Header>Create Account</Header>
      
      {isLoading &&  <AnimatedLoader
        visible={isLoading}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{width: 100, height: 100}}
        source={require("../../../assets/loading.json")}
        speed={1}
      />}
      
      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstName.value}
        onChangeText={text => setFirstName({ value: text, error: '' })}
        error={!!firstName.error}
        errorText={firstName.error}
      />

      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={text => setLastName({ value: text, error: '' })}
        error={!!lastName.error}
        errorText={lastName.error}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
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

         
          <Dropdown
             containerStyle={styles.DropDown}
             textColor='black'
             label='Gender'
             labelTextStyle={{marginLeft: 10, marginTop: 4}}
             itemTextStyle={{color: 'black'}}
             dropdownOffset={{ 'top': 0 }}
             data={data}
             onChangeText={value => setGender(value)}
           />

         <View style={{alignItems: 'center'}}>

         <BTNElements
            icon={
          <Foundation
            name="calendar"
            size={30}
            color="black"
          />
            }
            iconContainerStyle={{alignSelf: 'flex-start', flexDirection: 'row'}}
            title={birthdate == null ?"    BirthDate" : JSON.stringify(moment(birthdate).format('DD-MM-YYYY'))}
            buttonStyle={{ width: '78%', backgroundColor: 'white', alignSelf: 'center', marginLeft: 10, marginVertical: 12, borderRadius: 7}}
            titleStyle={{color: 'black'}}
            onPress={showDatePicker}
         />
          <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS='Pick your BirthDate'
        />
          
         </View>

      <Button 
      mode="contained" 
      onPress={_onSignUpPressed} style={styles.button}
      style={{ backgroundColor: '#4b9fd6', color: 'white'}}
      >
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      
     
      </ScrollView>

    </Background>
    
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.white,
    marginBottom: 100
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: '#4b9fd6',
  },
  DropDown:{
    backgroundColor: 'white', 
    width: '50%',
    alignSelf: 'center', 
    marginVertical: 12,  
    borderRadius: 5 ,
  },

});

export default memo(RegisterScreen);
