import React, { useState } from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Input } from 'react-native-elements';


export default function EditProfile({ route, navigation }) {

    const profile = route.params.profile;

    const [firstName, setFirstName] = useState({ value: '', error: '' });
    const [lastName, setLastName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });

    return (
        <View style={styles.headerContainer}>
            <View
                style={styles.headerBackgroundImage}
                blurRadius={10}
                backgroundColor='#cce6ff'
            >

                <View style={styles.headerColumn}>
                    {profile.ProfilePic == null || !profile.hasOwnProperty('ProfilePic') ?

                        <Image
                            style={styles.userImage}
                            source={require('../assets/user.png')}

                        />
                        :
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: profile.ProfilePic
                            }}
                        />

                    }
                    <Text style={styles.userNameText}>{profile.FirstName} {profile.LastName} </Text>
                </View>
            </View>
            <View style={styles.body}>
            <View style={styles.input}>
                <Input
                    label="First Name"
                    labelStyle={styles.color}
                    returnKeyType="next"
                    value={profile.FirstName}
                    onChangeText={text => setFirstName({ value: text, error: '' })}
                    error={!!firstName.error}
                    errorText={firstName.error}
                />
            </View>
            <View style={styles.input}>
                <Input
                    label="Last Name"
                    labelStyle={styles.color}
                    returnKeyType="next"
                    value={profile.LastName}
                    onChangeText={text => setLastName({ value: text, error: '' })}
                    error={!!lastName.error}
                    errorText={lastName.error}

                />
            </View>
            <View style={styles.input}>
                <Input
                    label="Email"
                    labelStyle={styles.color}
                    returnKeyType="next"
                    value={profile.Email}
                    onChangeText={text => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"

                />
            </View>

            <TouchableOpacity style={styles.buttonHeader}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>
                        Update
                       </Text>
                </View>
            </TouchableOpacity>

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
        borderRadius: 85,
        borderWidth: 3,
        borderColor: '#e6f2ff',
        height: 150,
        marginBottom: 15,
        marginTop: 30,
        width: 150,
    },
    userNameText: {
        color: '#4da6ff',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    input: {
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
    },
    button: {
        backgroundColor: '#66b3ff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25
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
    




})
