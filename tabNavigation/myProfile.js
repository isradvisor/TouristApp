import { Text, View, StyleSheet, Image, ImageBackground, Animated, AsyncStorage, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { sendEmail } from '../funnel/components/SendEmail';
import { Notifications } from 'expo';
import firebaseSvc from '../services/firebaseSDK';

const bacckgroundPic = {
    uri: 'https://c1.wallpaperflare.com/preview/25/631/792/dead-sea-salt-israel.jpg'
}

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


const MyProfile = ({ route, navigation }) => {
    //const profile = route.params.profile;
    const [profile, setProfile] = useState(null)
    const [fontLoaded, setFontLoaded] = useState(false)
    const [notifications, setNotification] = useState({});
    let data = null;

    useEffect(() => {
        readUserData();
    },[])

    const readUserData = async () => {
        try {
            await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
                if (value == null) {
                    await AsyncStorage.getItem('googleFacebookAccount').then((value) => {
                        data = JSON.parse(value);
                        setProfile(data);

                    })
                } else {
                    data = JSON.parse(value);
                    setProfile(data);


                }

            }).then(() => {
                _notificationSubscription = Notifications.addListener(_handleNotification);
            });
        }
        catch (e) {
            console.warn('failed to fetch data')

        }

    }

    const _handleNotification = notification => {
        //Vibration.vibrate();
        setNotification(notification)
      
        const user2 = {
            name: data.FirstName + ' ' + data.LastName,
            email: data.Email,
            password: data.PasswordTourist,
            URL: data.ProfilePic
        }
        console.warn(user2)
        console.warn(notification.data);
        if (notification.data.path !== null) {
            if (notification.data.path == 'Chat') {
                console.warn('enter creat acount');
                firebaseSvc.createAccount(user2, notification.data.info).then((solve) => {
                    console.warn('this is sinup data==>  ' + JSON.stringify(solve))
                }).catch((fail) => {
                    console.warn('not getting data...................')
                })
            }
            //navigation.navigate('MyTabs', { screen: notification.data.path, params: { profile: profile } });
        }
        //console.warn(notification);

    }



    const logOutAndCleanAsyncStorage = () => {
        AsyncStorage.removeItem('ProfileTourist')
        AsyncStorage.removeItem('googleFacebookAccount')
        navigation.navigate('HomeScreen')
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
                <FadeInView >
                    <ImageBackground
                        source={bacckgroundPic}
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
        color: 'white',
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