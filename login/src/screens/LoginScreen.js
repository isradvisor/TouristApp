import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { CheckBox } from 'react-native-elements'
import AnimatedLoader from "react-native-animated-loader";
import firebaseSvc from '../../../services/firebaseSDK';
const LoginScreen = ({ navigation }) => {
  
  const [email, setEmail] = useState({ value: '', error: '' }); 
  const [password, setPassword] = useState({ value: '', error: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
   const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist';
  
   //on login press 
  const _onLoginPressed = async () => {
    setIsLoading(true)
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setIsLoading(false)
      return;
    }
    else{
     
    const user = {
      Email: email.value,
      PasswordTourist: password.value
    };
  
    
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
      
    })
      .then(res => {
       // console.warn('res=', JSON.stringify(res));
        return res.json()
      })
      .then(
        (result) => {
         
         //console.warn("fetch POST= ", JSON.stringify(result));
        const profile = result;
          if(result == null){
            Alert.alert(
              'Error',
              'Invalid Email or Password',
              [
                {text: 'Forget your password?', onPress: () => CombineFunction()},
                {text: 'Cancel', onPress: () => setIsLoading(false)},
              ],
              { cancelable: false }
            )
          }
          else{
            StopLoadingProccessWithNavigate(CloseLoading, profile);
            
           }
        },
        
        (error) => {
          console.warn("err post=", error);
          setIsLoading(false)
        });

     }
  };

const CombineFunction = () =>{
  setIsLoading(false);
  navigation.navigate('ForgotPasswordScreen');
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
const navigateTo = async (profile) =>{
    const user = {
        email:profile.Email,
        password:profile.PasswordTourist
    }
    try {
      await AsyncStorage.setItem(
        'ProfileTourist',
        JSON.stringify(profile)
      );
    } catch (error) {
      // Error saving data
      console.warn(error);
    }
    //AsyncStorage.clear();
  setTimeout(() => {
    navigation.navigate('MyTabs', { screen: 'MyProfileStack',params:{ screen:'MyProfile',params:{profile: profile},},}); 
   }, 2500);
 }


//remember me function
 const toggleRememberMe = () => {
    if(rememberMe === true){
      setRememberMe(false)
      forgetUser();
    }
    else{
      setRememberMe(true)
      rememberUser();
    }
      
  }

  //this func save user details if he press on remember me
 const rememberUser = async () => {
  const user = {
    Email: email.value,
    PasswordTourist: password.value,
    rememberMe: rememberMe
  }
  
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      // Error saving data
    }
    }

    //each time when the screen shows, it will check if there is or not a user that store in the async storage
   useEffect(() =>{
    getRememberedUser()
    
   }, [])
   
   //check if there is or not user in async storage, if there is, his data will show automatically in the screen
    const getRememberedUser = async () => {
      try {
        
        const user = await AsyncStorage.getItem('user');
        const userDetails = JSON.parse(user);
        if (user !== null) {
          // We have username!!
         
          setEmail({ ...email, value: userDetails.Email })
          setPassword({ ...password, value: userDetails.PasswordTourist }) 
          setRememberMe(true)
        }
      } catch (error) {
        // Error retrieving data
      }
      };

//this func will forget user details if he press on remember me
    const forgetUser = async () => {
      try {
        await AsyncStorage.removeItem('user');
      } catch (error) {
       // Error removing
      }
    };

 
  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      {/* <Logo /> */}

      <Header>Welcome back</Header>
        {isLoading &&  <AnimatedLoader
        visible={isLoading}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{width: 100, height: 100}}
        source={require("../../../assets/loading.json")}
        speed={1}
      />}
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

      <CheckBox
        center
        title='Remember Me'
        checked={rememberMe}
        containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent' }}
        textStyle={{color: 'white'}}
        checkedColor='white'
        onPress={toggleRememberMe}
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button 
      mode="contained" 
      onPress={_onLoginPressed}
      style={{ backgroundColor: '#4b9fd6', color: 'white' }}
      >
        Log in
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.white,
  },
  link: {
    fontWeight: 'bold',
    color: '#4b9fd6',
  },
});

export default memo(LoginScreen);