import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, Text, View, Image, ImageBackground, ScrollView,
    TouchableOpacity, FlatList, TextInput, ActivityIndicator, Animated, Alert, TouchableHighlight
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button, Badge } from 'react-native-elements';
import Modal from 'react-native-modal';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-community/async-storage';


//Fade in animation
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


const interestTemp = ({route,navigation}) => {

    const profile = route.params.profile;

    //const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Interest';
    const apiUrlExpertise = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Expertise';
    const apiUrlHobby = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Hobby';
    const [isLoaded, setisLoaded] = useState(false);
    const [listArr2, setlistArr2] = useState([]);
    const [listArr, setlistArr] = useState([]);
    const [listAdded, setlistAdded] = useState([]);
    const [modalVisible, setModalVisible] = useState(true);
    const [fontLoaded, setFontLoaded] = useState(false);
    const currentProgressPer = 82;
    const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Interest'

    let arr = [];
    let arr2 = [];
    useEffect(() => {
        async function loadFont() {
            loadContent();

        };
        loadFont();
        getHobbiesFromDB();
    }, [])

    const loadContent = () => {

        Font.loadAsync({
            'ComicNeue-Bold': require('../fonts/ComicNeue-Bold.ttf')
        }).then(() => setFontLoaded(true))

    }


    const check = (expertise, hobbies) => {
        if (expertise !== null && hobbies !== null) {
            expertise.map(item => { arr.push({ title: item.NameE, image: item.Picture, key: item.NameE, type: item.Type, code: item.Code, isPicked: false }) });
            hobbies.map(item => { arr.push({ title: item.HName, image: item.Picture, key: item.HName, type: item.Type, code: item.HCode, isPicked: false }) });
            console.warn(arr[arr.length - 1]);
            shuffleArray(arr);
            AddToNewArray(arr);
        }
    }

    const AddToNewArray = (arr) => {
        let arr2 = [];
        for (let i = 0; i <= arr.length - 1; i += 2) {
            const item1 = arr[i];
            const item2 = arr[i + 1]
            let item;
            if (i == arr.length - 1) {
                item = [item1];
            }
            else {
                item = [
                    item1, item2
                ]
            }

            arr2.push(item);
        }

        if (arr2.length > 0) {
            setlistArr2(arr2)
            setisLoaded(true)

        }
    }

    const shuffleArray = (array) => {
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        setlistArr(array)
    }


    //get Function from DB
    const getHobbiesFromDB = () => {
        fetch(apiUrlHobby, {
            method: 'GET',
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
                    getExpertiseFromDB(result);
                },
                (error) => {
                    console.warn("err post=", error);
                });
    }
    const getExpertiseFromDB = (hobbiesList) => {
        fetch(apiUrlExpertise, {
            method: 'GET',
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
                    // const Type = result[0].Type == 'Hobby' ? "Hobby" : "Expertise";
                    // switch (Type) {
                    //     case 'Expertise':
                    //         setExpertiseList(result)
                    //         break;

                    //     case 'Hobby':
                    //         setHobbyList(result)
                    //         break;
                    //}
                    check(result, hobbiesList);
                },
                (error) => {
                    console.warn("err post=", error);
                });
    }

    const maximumImagesAlert = (arr) => {
        if (arr.length == 9) {
            {
                Alert.alert(
                    '',
                    'You already marked up 10 images, please delete from the gallery on the bottom, or continue to next page.',
                    [

                        { text: 'OK' },

                    ],
                    { cancelable: false },
                );
            }
        }
    }


    CheckItem = (item) => {
        let arr = [];
        if (listAdded.length > 0) {
            for (let i = 0; i < listAdded.length; i++) {
                const element = listAdded[i];
                arr.push(element);
            }
        }
        if (arr.includes(item)) {
            arr = arr.filter(exp => exp.title !== item.title);
        }
        else {
            arr.push(item);
        }


        setlistAdded(arr);
        maximumImagesAlert(arr);
        item.isPicked = !item.isPicked;
        paintItem(item.isPicked)
    }
    paintItem = (isPicked) => {
        if (isPicked) {
            return (
                <FontAwesome name='circle' size={22} color='green' style={
                    { position: 'absolute', top: 5, right: 20, opacity: 0.6, borderColor: '#ffffff' }} />
            );

        } else {
            return (
                <FontAwesome name='circle' size={26} color='white' style={
                    { position: 'absolute', top: 5, right: 20, opacity: 0.6, borderColor: '#ffffff' }} />
            );

        }
    }
    fetchAndContinue = () => {
        let hobbiesArr = [];
        let expertisesArr = [];
        for (let i = 0; i < listAdded.length; i++) {
            const element = listAdded[i];
            if (element.type == 'Hobby') {
                hobbiesArr.push(element.code);
            }
            else{
                expertisesArr.push(element.code);
            }
        }

        const user = {
            Email: profile.Email,
            Hobbies: hobbiesArr,
            Expertises : expertisesArr
          }
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
              //results = row affected in DB & tourist ID
              (result) => {
               //console.warn("fetch POST= ", JSON.stringify(result));
               let ifExist = true;
               AsyncStorage.setItem('Interest',JSON.stringify(ifExist))
               navigation.navigate('MatchScreen', {TouristId: result[0], profile: profile})
      
               },
              (error) => {
                console.warn("err post=", error);
              });

    }


    // if (isLoaded) {
    //console.warn(arr2)
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.viewProgress}>

                <AnimatedProgressWheel
                    size={120}
                    width={15}
                    color={'#0080ff'}
                    progress={currentProgressPer}
                    backgroundColor={'#E0E0E0'}
                    animateFromValue={0}
                    duration={2500}
                />

            </View>
            <FadeInView style={styles.fadeTitle}>
                {fontLoaded && <Text style={styles.title}>Tell us what most interest you?</Text>}
            </FadeInView>
            <ScrollView>
                <FlatList
                    horizontal={true}
                    data={listArr2}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ flex: 0.4, marginTop: 20 }}>
                                <View style={{ paddingVertical: 20, paddingLeft: 16 }}>
                                    <TouchableOpacity onPress={() => CheckItem(item[0])}>

                                        <Image source={{ uri: item[0].image }} style={{
                                            width: 150,
                                            marginRight: 8, height: 150, borderRadius: 10
                                        }} />
                                        {paintItem(item[0].isPicked)}
                                        <View style={styles.imageOverlay}></View>
                                        <Text style={styles.imageText}>{item[0].title}</Text>
                                    </TouchableOpacity>
                                </View>
                                {item.length > 1 ?
                                    <View style={{ paddingVertical: 20, paddingLeft: 16 }}>
                                        <TouchableOpacity onPress={() => CheckItem(item[1])}>
                                            <Image source={{ uri: item[1].image }} style={{
                                                width: 150,
                                                marginRight: 8, height: 150, borderRadius: 10
                                            }} />
                                            {paintItem(item[1].isPicked)}
                                            <View style={styles.imageOverlay}></View>
                                            <Text style={styles.imageText}>{item[1].title}</Text>
                                        </TouchableOpacity>
                                    </View> : null}
                            </View>

                        )
                    }}
                />
            </ScrollView>
            <View style={styles.bottomView}>
                <View style={styles.bottomView}>
                {listAdded.length >= 4 ? <View style={{ flex: 1, }}>
                    <Button
                        title="Continue"
                        type="outline"
                        buttonStyle={styles.continueBtn}
                        onPress={fetchAndContinue}
                        containerStyle={{ marginRight: '5%' }}
                    />
                </View>:null}
                </View>
                    <View style={styles.bottomView} >
                {listAdded.length > 0 ?
                    <View style={{ justifyContent: 'flex-end' }}>
                        <Badge
                            value={listAdded.length}
                            status="primary"
                            textStyle={{ fontSize: 20, fontWeight: 'bold' }}
                            containerStyle={{ position: 'absolute', top: -4, right: -4, alignSelf: 'flex-end', marginRight: 20, marginTop: 13 }}
                            badgeStyle={{ height: 40, width: 40, borderRadius: 100, }}
                        />
                    </View>:null
                }
                </View>

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
                            <Text style={styles.modalText}>Mark up to 10 and minimum 4 photos - that attract you the most!</Text>

                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'rgba(56, 172, 236, 1)',
        borderWidth: 0,
        borderRadius: 20,
        width: 350,
        height: 210

    },
    time: {
        fontSize: 38,
        color: '#fff'
    },
    notes: {
        fontSize: 18,
        color: '#fff',
        textTransform: 'capitalize'
    },
    DarkOvelay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: 120,
        width: 150,
        backgroundColor: '#00004d',
        opacity: 0.5,
        borderRadius: 10
    },
    SearchContainer: {
        paddingTop: 100,
        paddingLeft: 16
    },
    UserGreet: {
        fontSize: 38,
        fontWeight: 'bold',
        color: 'white'
    },
    UserText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'white'
    },
    SearchBox: {
        marginTop: 16,
        backgroundColor: '#fff',
        paddingLeft: 24,
        padding: 12,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        width: '90%'

    },
    imageOverlay: {
        width: 150,
        height: 150,
        marginRight: 8,
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: '#000',
        opacity: 0.2
    },
    imageLocationIcon: {
        position: 'absolute',
        marginTop: 4,
        left: 10,
        bottom: 10
    },
    imageText: {
        position: 'absolute',
        color: 'white',
        marginTop: 4,
        fontSize: 14,
        left: 30,
        bottom: 10
    },
    container: {
        flex: 1,
        alignItems: 'center'

    },

    viewProgress: {
        marginTop: '15%',

    },

    fadeTitle: {
        width: 350,
        marginTop: 50,
    },

    fadeButtons: {

        flexDirection: 'row',
        marginTop: 20
    },

    title: {
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'ComicNeue-Bold'
    },

    textImages: {
        textAlign: 'center',
        fontFamily: 'ComicNeue-Bold'
    },

    continueBtn: {
        backgroundColor: '#ade6d8',
        width: 140,
        height: 50,
        borderColor: '#ade6d8',
        borderRadius: 10,
        alignSelf: 'center',

    },

    imageStyle: {
        width: 120,
        height: 120,
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#999999',


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

    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 24
    },

    ViewOfDeleteIcon: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        direction: 'ltr'
    },

    galleryTitleView: {
        flex: 1,
        justifyContent: 'center'
    },

    galleryTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'ComicNeue-Bold',
        marginBottom: '45%',
        alignSelf: 'center'
    },

    bottomView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40
    },

    galleryBtn: {
        backgroundColor: '#f2f2f2',
        alignSelf: 'flex-start',

    },

});

export default interestTemp;