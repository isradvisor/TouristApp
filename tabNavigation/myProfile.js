import { Text, View, StyleSheet, Image, ImageBackground, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { sendEmail } from '../funnel/components/SendEmail';


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

    const send = () => {
        sendEmail(
            'IsraAdisor@gmail.com',
            '',
            ''
        ).then(() => {
            console.log('Our email successful provided to device mail ');
        });
    }

    const profile = route.params.profile;
    const [fontLoaded, setFontLoaded] = useState(false)
    return (
        <View>
            <FadeInView>
                {fontLoaded && <Text style={{ fontSize: 28, textAlign: 'center', fontFamily: 'ComicNeue-Bold' }}>{profile.FirstName}{"\n"} is it your First Time In Israel?</Text>}
            </FadeInView>
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
                        <FontAwesome onPress={() => navigation.navigate('HomeScreen')} style={styles.icons} name="sign-out" color='white' size={32} />
                        <Text onPress={() => navigation.navigate('HomeScreen')} style={styles.lableItem}>Log Out</Text>
                    </View>
                </ImageBackground>
            </FadeInView>

        </View>
    );
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