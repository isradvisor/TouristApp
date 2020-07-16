import { Text, View, StyleSheet, Image, ImageBackground, Animated, ActivityIndicator, AnimatedLoader, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { sendEmail } from '../funnel/components/SendEmail';
import { Notifications } from 'expo';
import firebaseSvc from '../services/firebaseSDK';
import { useRoute } from '@react-navigation/native';





// const bacekgroundPic = {
//     uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTrLwj32NAzB7FQKHvgOknR76K5RalnfSJUtg&usqp=CAU'
// }

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


const MyProfile = ({ navigation }) => {

    //const profile = route.params.profile;
    const [status, setStatus] = useState(null)
    const [profile, setProfile] = useState(null)
    const [fontLoaded, setFontLoaded] = useState(false)
    const [notifications, setNotification] = useState({});
    const [showrating, setShowRating] = useState(3.5);
    const [isLoading, setIsLoading] = useState(false);
    const [gotNotification, setGotNotification] = useState(false);
    const route = useRoute();


    let data = null;

    // useEffect(()=>{
    //     readUserData();
    // },[])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readUserData();
        });

        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        _notificationSubscription = Notifications.addListener(_handleNotification);

    }, [])


    const _handleNotification = async (notification) => {
        if (notification.data.path !== null) {

            if (notification.data.path == 'Chat') {
                console.warn('currentRoute', route)
                if (route.name !== 'Chat') {
                    Alert.alert(
                        'New Message',
                        'You Have A New Message',
                        [
                            { text: 'OK', onPress: () => navigation.navigate('MyTabs', { screen: 'Chat' }) }
                        ],
                        { cancelable: false }
                    )
                }

            }
            else if (notification.data.path == 'MyTrip') {

                Alert.alert(
                    'New Trip Alert',
                    'Your trip was update',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('MyTabs', { screen: 'MyTrip' }) }
                    ],
                    { cancelable: false }
                )
            }
        }
    }



    const checkStatus = (email) => {
        fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip/GetTouristStatus?email=' + email, {
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
                    if (result !== null) {
                        GetGuideDetails(result.GuideEmail);
                        await AsyncStorage.removeItem('ChatStatus');
                        await AsyncStorage.setItem('ChatStatus', result.Status)
                        setStatus(result.Status);
                        console.warn('resultStatud', result)
                        if (result.Status == 'Start Chat') {
                            const user = {
                                email: data.Email,
                                password: data.PasswordTourist
                            }
                            await firebaseSvc.login(user);

                            //setIsLoading(false);
                            //GetGuideDetails(result.GuideEmail);

                        }
                        else if (result.Status == 'Accept Request') {
                            const user2 = {
                                name: data.FirstName + ' ' + data.LastName,
                                email: data.Email,
                                password: data.PasswordTourist,
                                URL: data.ProfilePic
                            }
                            firebaseSvc.createAccount(user2, result.GuideEmail).then((solve) => {
                                console.warn('this is sinup data==>  ' + JSON.stringify(solve))

                            }).catch((fail) => {
                                console.warn('not getting data...................')
                            })
                            let user = {
                                TouristEmail: data.Email,
                                GuideEmail: result.GuideEmail,
                                Status: 'Start Chat'
                            }
                            ChangeStatus(user)

                        }
                        else if (result.Status == 'Decline Chat') {
                            alert('Your Request has been denied')
                            navigation.navigate('MatchScreen')
                        }
                        else if (result.Status == 'send request') {

                        }
                    }
                    else {
                        let tempArr = [];
                        let keys = ['firstTimeInIsrael', 'TripType', 'FlightsDates', 'Budget','Interest','MatchScreen'];
                            AsyncStorage.multiGet(keys, (err, stores) => {
                              stores.map((result, i, store) => {
                                // get at each store's key/value so you can work with it
                                let key = store[i][0];
                                let value = store[i][1];
                                tempArr.push({key:key,value:value});
                              });
                              for (let i = 0; i < tempArr.length; i++) {
                                  const element = tempArr[i];
                                  console.warn('element',element)
                                  if (element.value == null) {
                                      console.warn('key',element.key);
                                      navigation.navigate(element.key,{profile:data});
                                    break;
                                  }
                                  
                              }
                            }
                            )
                    }

                }),
            (error) => {
                console.warn("err post=", error);
            };

    }

    const GetGuideDetails = (email) => {
        fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide?email=' + email, {
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
                    AsyncStorage.setItem('Guide', JSON.stringify(result));
                }
            ),
            (error) => {
                console.warn("err post=", error);
            };
    }

    const readUserData = async () => {
        try {
            await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
                if (value !== null) {
                    data = JSON.parse(value);
                    setProfile(data);
                    checkStatus(data.Email);
                }

            })
            // .then(() => {
            //     _notificationSubscription = Notifications.addListener(_handleNotification);
            // });
        }
        catch (e) {
            console.warn('failed to fetch data')

        }

    }

    const ChangeStatus = (user) => {
        console.warn('in change in app', user)
        fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip', {
            method: 'PUT',
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
                    console.warn('changeStatus', result)

                    let TouristStatus = "";

                    result.map((item) => {
                        if (item.TouristEmail == user.TouristEmail) { TouristStatus = item.Status } {
                        }
                    })
                    console.warn('currentStatus', TouristStatus)
                    AsyncStorage.setItem('ChatStatus', TouristStatus)
                    setStatus(TouristStatus);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }




    const logOutAndCleanAsyncStorage = async () => {
        //let keys = ['ProfileTourist', 'googleFacebookAccount'];
        let keys = ['ProfileTourist', 'googleFacebookAccount', 'messagesTourist', 'idChatTourist', 'GuideUser', 'idChatGuide', 'top3Guides', 'ChatStatus', 'GuideUser','firstTimeInIsrael', 'TripType', 'FlightsDates', 'Budget','Interest','MatchScreen'];
        await AsyncStorage.multiRemove(keys, (err) => {
            if (err == null) {
                navigation.navigate('HomeScreen')
            }
            // keys k1 & k2 removed, if they existed
            // do most stuff after removal (if you want)

        });
        //await AsyncStorage.removeItem('googleFacebookAccount')
        // await AsyncStorage.removeItem('messagesTourist');
        // await AsyncStorage.removeItem('idChatTourist');
        // await AsyncStorage.removeItem('GuideUser');
        // await AsyncStorage.removeItem('idChatGuide');
        // await AsyncStorage.removeItem('top3Guides')
        // await AsyncStorage.removeItem('ProfileTourist').then(
        // )

    }



    const send = () => {
        sendEmail(
            'IsraAdisor@gmail.com',
            '',
            ''
        ).then(() => {
            console.log('Our email successful provided to device mail ');
        });
    }

    if (profile !== null) {
        return (
            <View>
                {/* {isLoading &&  <AnimatedLoader
        visible={isLoading}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{width: 100, height: 100}}
        source={require("../assets/loading.json")}
        speed={1}
      />} */}
                <FadeInView >
                    <ImageBackground
                        source={require('../login/src/assets/Backgroung-IsraAdvisor.jpeg')}
                        style={{ width: '100%', height: 735 }}
                    >
                        <View style={styles.mainbody}>
                            {profile.ProfilePic == null || !profile.hasOwnProperty('ProfilePic') ?

                                <Image
                                    style={styles.imgProfile}
                                    source={require('../assets/user.png')}

                                />
                                :
                                <Image
                                    style={styles.imgProfile}
                                    source={{
                                        uri: profile.ProfilePic
                                    }}
                                />

                            }

                            <Text style={styles.name}>{profile.FirstName} {profile.LastName}</Text>
                        </View>
                        <View>
                            <FontAwesome onPress={send} style={styles.icons} name="envelope" color='white' size={32} />
                            <Text onPress={send} style={styles.lableItem}>Contact Us</Text>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <FontAwesome style={styles.icons} name="edit" color='white' size={32} />
                            <Text onPress={() => navigation.navigate('EditProfile', { profile: profile })}
                                style={styles.lableItem}>
                                Edit Profile
                        </Text>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <FontAwesome onPress={() => logOutAndCleanAsyncStorage()} style={styles.icons} name="sign-out" color='white' size={32} />
                            <Text onPress={() => logOutAndCleanAsyncStorage()} style={styles.lableItem}>Log Out</Text>
                        </View>
                    </ImageBackground>
                </FadeInView>

            </View>
        );
    } else {
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
    mainbody: {
        marginTop: 30,
        marginLeft: 24,
        marginRight: 24,
        marginBottom: 70
    },
    imgProfile: {
        borderRadius: 85,
        borderWidth: 3,
        borderColor: 'white',
        height: 130,
        marginBottom: 15,
        marginTop: 80,
        width: 130,
        marginLeft: 100

    },
    name: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    icons: {
        marginLeft: 100
    },
    username: {
        color: '#626FB4',
        fontSize: 16,
        marginLeft: 110,
        marginTop: 4
    },
    itemProfile: {
        marginTop: 30
    },
    lableItem: {
        marginTop: -25,
        marginLeft: 160,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold'
    },
    subLableItem: {
        marginTop: 4,
        marginLeft: 60,
        fontSize: 16,
        color: '#50D9EA'
    }



})

export default MyProfile