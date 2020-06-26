import React, { useState } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import {
    emailValidator
  } from '../login/src/core/utils';
  import Modal from 'react-native-modal';
  import TextInput from '../login/src/components/TextInput';
  import { Avatar } from 'react-native-elements'
  import { MaterialIcons } from '@expo/vector-icons'; 
  import * as ImagePicker from 'expo-image-picker';

export default function EditProfile({ route, navigation }) {

    const profile = route.params.profile;

    const [firstName, setFirstName] = useState({ value: '', error: '' });
    const [lastName, setLastName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [errorFromDB, setErrorFromDB] = useState(false)
    const [counter, setCounter] = useState(0)
    const [oldEmail, setOldEmail] = useState('')
    const [imageUri, setImageUri] = useState('')
    const [updatedUser, setUpdatedUser] = useState('');

    const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/EditProfile'
    const apiUploadPic = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/UploadPicture'


    
    const updateToDB = () =>{
        
        setOldEmail(email.value)
        const emailError = emailValidator(email.value);

        if (emailError){
            setEmail({ ...email, error: emailError });
            
            return;
        }

        //if the validation ok, he will turn to this path of update
        else{
            
            if(counter == 0){
                const user = {
                    Email: profile.Email,
                    SecondEmail: email.value,
                    FirstName: firstName.value,
                    LastName: lastName.value
                }
                setUpdatedUser(user)
                fetchToDB(user, apiUrl);
                setCounter(1)
            }
            else{
                setUpdatedUser(user)
                const user = {
                    Email: oldEmail,
                    SecondEmail: email.value,
                    FirstName: firstName.value,
                    LastName: lastName.value
                }
                setUserInAsyncStorage(user);
                fetchToDB(user, apiUrl);
                setCounter(1)
                
            }
        }
        }

        const setUserInAsyncStorage = async (user) =>{
            try {
                await AsyncStorage.setItem(
                  'user',
                 JSON.stringify(user)
                );
              } catch (error) {
                // Error saving data
                console.warn('error : ',error)
              }
        }

        const fetchToDB = (user, api) =>{
            
            fetch(api, {
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

            if(result == 1){
                setModalVisible(true)
            }
            else{
                setModalVisible(true)
                setErrorFromDB(true)
            }
              })
        }

       

        const UploadImage = async () =>{
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
              });
          
              console.log(result);
          
              if (!result.cancelled) {
                setImageUri(result.uri );
                const user = {
                    Email: profile.Email,
                    ProfilePic: result.uri
                }
                fetchToDB(user, apiUploadPic)
              }
        };
       
        const pressOk = () =>{
            setModalVisible(!modalVisible);
            const user = {
                Email: updatedUser.SecondEmail,
                FirstName: updatedUser.FirstName,
                LastName: updatedUser.LastName,
                ProfilePic: ''
            }
            
           updatedUser != undefined && navigation.navigate('MyProfile',{profile: user});
           
        }

        const getUpdatedData = async () =>{
            try {
                const temp =  JSON.parse( await AsyncStorage.getItem(
                  'user'
                ));

               console.warn('temp = ', temp)
              } catch (error) {
                // Error saving data
                console.warn('error : ',error)
              }
        }

    return (
        <View style={styles.headerContainer}>
            <View
                style={styles.headerBackgroundImage}
                blurRadius={10}
                backgroundColor='#cce6ff'
            >

                <View style={styles.headerColumn}>
                    {profile.ProfilePic == null || !profile.hasOwnProperty('ProfilePic') ?

                        <Avatar
                            rounded
                            source={imageUri== ''? require('../assets/user.png') : {uri: imageUri}}
                            size='xlarge'
                            avatarStyle={styles.userImage}
                        />
                        :
                        <Avatar
                            rounded
                            source={{
                                uri: profile.ProfilePic
                            }}
                            size='xlarge'
                            avatarStyle={styles.userImage}
                            />
                    }
                    <TouchableOpacity onPress={UploadImage} style={{marginTop: 15, width:56,
                    height:56,position:'absolute',right:70,top:50,backgroundColor:'white',borderRadius:45,zIndex:20,alignItems:'center',justifyContent:'center'}} >
                    <MaterialIcons name="edit" size={28} color="black"/>
                    </TouchableOpacity>
                    <Text style={styles.userNameText}>{profile.FirstName} {profile.LastName} </Text>
                </View>
            </View>
            <View style={styles.body}>
            <View style={styles.input}>
                <TextInput
                    label={firstName.value == ''?  profile.FirstName : "First Name"}
                    labelStyle={styles.color}
                    returnKeyType="next"
                    value={firstName.value}
                    onChangeText={text => setFirstName({ value: text, error: '' })}
                    error={!!firstName.error}
                    errorText={firstName.error}
                    placeHolder={'text'}
                />
            </View>
            <View style={styles.input}>
                <TextInput
                    label={lastName.value == ''?  profile.LastName : "Last Name"}
                    labelStyle={styles.color}
                    returnKeyType="next"
                    value={lastName.value}
                    onChangeText={text => setLastName({ value: text, error: '' })}
                    error={!!lastName.error}
                    errorText={lastName.error}

                />
            </View>
            <View style={styles.input}>
                <TextInput
                    label={email.value == ''?  profile.Email : "Email"}
                    labelStyle={styles.color}
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
            </View>

            <TouchableOpacity 
            style={styles.buttonHeader}
            onPress={updateToDB}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>
                        Update
                       </Text>
                </View>
            </TouchableOpacity>

            </View>
            <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        animationInTiming={2000}
        animationOut={'slideOutDown'}
        animationOutTiming={2000}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!errorFromDB? <Text style={styles.modalText}>Update Succeeded!</Text> : <Text style={styles.modalText}>Error to update, please try again.</Text>}

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                pressOk()
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
              
      
    </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    container: {
        flex: 1,
    },
    color: {
        color: '#4da6ff'
    },
    emailContainer: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 30,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 35,
    },
    headerContainer: {},
    headerColumn: {
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                alignItems: 'center',
                elevation: 1,
                marginTop: -1,
                marginTop: 50
            },
            android: {
                alignItems: 'center',
            },
        }),
    },
    placeIcon: {
        color: 'white',
        fontSize: 26,
    },

    userImage: {
        marginBottom: 15,
        marginTop: 30,

    },
    userNameText: {
        color: '#4da6ff',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
        marginTop: 20
    },
    input: {
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50,
    },
    button: {
        backgroundColor: '#66b3ff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
    buttonHeader: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        

    },
    body: {
        backgroundColor: '#f2f2f2',
        height:450
        

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 24
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18
      },
      icon: {
        backgroundColor: '#ccc',
        position: 'absolute',
        right: 0,
        bottom: 0
       }
})
