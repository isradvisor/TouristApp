import React from 'react'
import { Icon, SocialIcon } from 'react-native-elements'
import {
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View,
    Linking,

} from 'react-native';



export default function EditProfile({ route, navigation }) {

    const profile = route.params.profile;

    return (
        <View style={styles.headerContainer}>
            <View
                style={styles.headerBackgroundImage}
                blurRadius={10}
                backgroundColor='#cce6ff'
            >

                <View style={styles.headerColumn}>
                    
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Lionel_Messi_vs_Valladolid.jpg'
                            }}
                        /> 
                    <Text style={styles.userNameText}>leo messi</Text>
                  
                </View>
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


    userAddressRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userCityRow: {
        backgroundColor: 'transparent',
    },
    userCityText: {
        color: '#A5A5A5',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    userImage: {
        borderRadius: 85,
        borderWidth: 3,
        borderColor:'#e6f2ff',
        height: 170,
        marginBottom: 15,
        marginTop: 30,
        width: 170,
    },
    userNameText: {
        color: '#66b3ff',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    contactNameColumn: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    contactNameText: {
        color: 'gray',
        fontSize: 14,
        fontWeight: '200',
        marginTop: -10
    },
    contactColumn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    contactText: {
        fontSize: 16,
    },
    contactRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20
    },
    contactIcon: {
        fontSize: 30,
        marginRight: 10,
    },
    separator: {
        flex: 8,
        flexDirection: 'row',
        borderColor: '#EDEDED',
        borderWidth: 0.8,
        marginTop: 20
    },
    aboutMeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    AboutMeTitleColumn: {
        flexDirection: 'row',
    },
    AboutMeText: {
        fontSize: 14,
        marginTop: 10,
        color: 'grey',
        marginLeft: 15
    },
    AboutMeTitle: {
        fontSize: 16,
    },
    socialMediaRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    }
})
