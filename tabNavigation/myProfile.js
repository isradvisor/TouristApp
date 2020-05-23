import { Text, View, StyleSheet, Image,ImageBackground } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 

const profilePic={
    uri:'https://scontent.fhfa1-2.fna.fbcdn.net/v/t1.0-9/10689695_727899903913303_8982095541983094130_n.jpg?_nc_cat=107&_nc_sid=174925&_nc_ohc=adxwDCZJgNoAX8cA4dG&_nc_ht=scontent.fhfa1-2.fna&oh=664cba17afaeeab055c0502f9c40ae80&oe=5EE83530'
}
const bacckgroundPic ={
    uri:'https://c1.wallpaperflare.com/preview/25/631/792/dead-sea-salt-israel.jpg'
}


const MyProfile = ({ route }) => {
    const profile = route.params.profile;
    return (
        <View>
            <ImageBackground 
            source={bacckgroundPic}
            style={{width:'100%',height:735}}
            >
            <View style={styles.mainbody}>
            {profile.ProfilePic !== null ?
                        <Image
                            style={styles.imgProfile}
                            source={{
                                uri: profile.ProfilePic
                            }}
                        /> :
                        <Image
                            style={styles.imgProfile}
                            source={require('../assets/user.png')}

                        />
                    }
                <Text style={styles.name}>{profile.FirstName} {profile.LastName}</Text>
            </View>
            <View>
            <MaterialCommunityIcons style={styles.icons} name="bell" color='white' size={32} />
            <Text style={styles.lableItem}>notifications</Text>
            </View>
            <View style={{marginTop:30}}>
            <FontAwesome style={styles.icons} name="edit" color='white' size={32} />
            <Text style={styles.lableItem}>edit Profile</Text>
            </View>
            <View style={{marginTop:30}}>
            <MaterialCommunityIcons style={styles.icons} name="logout" color='white' size={32} />
            <Text style={styles.lableItem}>log out</Text>
            </View>
            </ImageBackground>
           

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
        borderColor:'white',
        height: 130,
        marginBottom: 15,
        marginTop: 80,
        width: 130,
        marginLeft:100

    },
    name: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    icons:{
        marginLeft:100
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
        fontWeight:'bold'
    },
    subLableItem: {
        marginTop: 4,
        marginLeft: 60,
        fontSize: 16,
        color: '#50D9EA'
    }



})

export default MyProfile