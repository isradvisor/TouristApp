import React, { useEffect, useState } from 'react'
import { Icon, SocialIcon } from 'react-native-elements'
import { Image, ImageBackground, Platform, StyleSheet, Text, View, Linking, ActivityIndicator, Button,TouchableOpacity } from 'react-native';
import { sendEmail } from "../components/SendEmail";
import { FontAwesome} from '@expo/vector-icons';
export default function GuideProfile({ route, navigation: { goBack } }) {

    const guide = route.params.guide;
    const linksApi = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Link/';
    const [FacebookLink, setFacebookLink] = useState(null);
    const [TwitterLink, setTwitterLink] = useState(null);
    const [InstagramLink, setInstagramLink] = useState(null);
    const [LinkedlnLink, setLinkedlnLink] = useState(null);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        getGuidesLinksFromSQL();
    })

    const getGuidesLinksFromSQL = () => {
        fetch(linksApi + guide.gCode, {
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
                    if (result !== null) {
                        for (let i = 0; i < result.length; i++) {
                            const element = result[i];
                            if (element.LinksCategoryLCode == 1) {
                                setInstagramLink(element.linkPath)
                            }
                            else if (element.LinksCategoryLCode == 2) {
                                setFacebookLink(element.linkPath)
                            }
                            else if (element.LinksCategoryLCode == 3) {
                                setTwitterLink(element.linkPath)
                            }
                            else if (element.LinksCategoryLCode == 4) {
                                setLinkedlnLink(element.linkPath)
                            }

                        }
                        setLoader(true)
                    }
                    else {
                        setLoader(true)
                    }

                },
                (error) => {
                    console.warn("err post=", error);
                });
    }

    const send = () => {
        sendEmail(
            guide.Email,
            '',
            ''
        ).then(() => {
            console.log('Our email successful provided to device mail ');
        });
    }


    const dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${' + guide.Phone + '}';
        }
        else {
            phoneNumber = 'telprompt:${' + guide.Phone + '}';
        }

        Linking.openURL(phoneNumber);
    };




    if (!loader) {
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
    } else {
        return (
            <View style={styles.headerContainer}>
                <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={{
                        uri: 'data:image/jpeg;base64,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',
                    }}
                >
                
                    <TouchableOpacity onPress={() => goBack()}>
                        <View style ={{marginLeft:20,marginTop:10}}>
                        <FontAwesome name='arrow-left' size={22} color='white'/>
                        </View>
                    </TouchableOpacity>
                    
                    
                   
                    <View style={styles.headerColumn}>
                        {guide.ProfilePic !== "" ?
                            <Image
                                style={styles.userImage}
                                source={{
                                    uri: guide.ProfilePic
                                }}
                            /> :
                            <Image
                                style={styles.userImage}
                                source={{uri:"http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png"}}

                            />
                        }
                        <Text style={styles.userNameText}>{guide.FirstName} {guide.LastName}</Text>
                        <View style={styles.userAddressRow}>
                            <View>
                                <Icon
                                    name="place"
                                    underlayColor="transparent"
                                    iconStyle={styles.placeIcon}
                                />
                            </View>
                            <View style={styles.userCityRow}>
                                <Text style={styles.userCityText}>
                                    Israel
                             </Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                {guide.Phone !== "" &&
                    <View style={styles.contactRow}>
                        <View style={styles.contactColumn}>
                            <Icon
                                name="call"
                                underlayColor="transparent"
                                iconStyle={styles.contactIcon}
                                onPress={dialCall}
                            />
                            <Text style={styles.contactText}>{guide.Phone}</Text>
                        </View>
                        <View style={styles.contactNameColumn}>
                            <Text style={styles.contactNameText}>work</Text>
                        </View>
                        <View style={styles.separator} />

                    </View>
                }
                <View style={styles.contactRow}>
                    <View style={styles.contactColumn}>
                        <Icon
                            name="email"
                            underlayColor="transparent"
                            iconStyle={styles.contactIcon}
                            onPress={send}
                        />
                        <Text style={styles.contactText}>{guide.Email}</Text>
                    </View>
                    <View style={styles.contactNameColumn}>
                        <Text style={styles.contactNameText}>personal</Text>
                    </View>
                </View>
                {guide.DescriptionGuide !== "" &&
                    <View>
                        <View style={styles.separator} />
                        <View style={styles.aboutMeRow}>
                            <View>
                                <Text style={styles.AboutMeTitle}>ABOUT ME:</Text>
                            </View>
                        </View>
                        <View style={styles.aboutMeRow}>
                            <View>
                                <Text style={styles.AboutMeText}>{guide.DescriptionGuide}</Text>
                            </View>
                        </View>
                    </View>

                }
                <View style={styles.separator} />
                {FacebookLink !== null || InstagramLink !== null || LinkedlnLink !== null || TwitterLink !== null ?
                    <View style={styles.socialMediaRow}>
                        <Text style={styles.AboutMeTitle}>find me on social media:</Text>
                    </View>
                    : null}
                <View style={styles.socialMediaRow}>
                    {TwitterLink !== null ? <SocialIcon type='twitter' onPress={() => { Linking.openURL(TwitterLink) }} /> : null}
                    {FacebookLink !== null ? <SocialIcon type='facebook' onPress={() => { Linking.openURL(FacebookLink) }} /> : null}
                    {InstagramLink !== null ? <SocialIcon type='instagram' onPress={() => { Linking.openURL(InstagramLink) }} /> : null}
                    {LinkedlnLink !== null ? <SocialIcon type='linkedin' onPress={() => { Linking.openURL(LinkedlnLink) }} /> : null}
                </View>
            </View>
        );
    }


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
        height: 170,
        marginBottom: 15,
        marginTop: 30,
        width: 170,
    },
    userNameText: {
        color: '#FFF',
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
