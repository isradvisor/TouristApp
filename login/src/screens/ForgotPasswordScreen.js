import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { emailValidator } from '../core/utils';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';
import firebaseSvc from '../../../services/firebaseSDK'

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const apiUrl = "http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Reset"


  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(email.value),
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
          if (result !== null) {
            firebaseSvc.UpdatePassword(result);

            Alert.alert(
              'success!',
              'Your password has been sent to your email',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            )
          
          }
          else {
            Alert.alert(
              'Error',
              'Email not found',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            )
          }},
  (error) => {
    console.warn("err post=", error);
  });

  //navigation.navigate('LoginScreen');
};

return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Background>
      <BackButton goBack={() => navigation.navigate('LoginScreen')} />

      {/* <Logo /> */}

      <Header>Restore Password</Header>

      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
        Reset Password
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.label}>← Back to login</Text>
      </TouchableOpacity>
    </Background>
  </TouchableWithoutFeedback>
);
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#4b9fd6'
  },
  label: {
    color: theme.colors.white,
    width: '100%',
  },
});

export default memo(ForgotPasswordScreen);
