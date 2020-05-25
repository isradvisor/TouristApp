import React, { useState,useEffect } from 'react';
import {
    StyleSheet, Text, View, Image, ImageBackground, ScrollView,
    TouchableOpacity, FlatList, TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import $ from "jquery";




const MainExplore = ({ route,navigation }) => {
 


    // $.ajax({
    //     uri:'https://www.triposo.com/api/20200405/poi.json?location_id=Haifa&fields=all&count=100&account=ZZR2AGIH&token=lq24f5n02dn276wmas9yrdpf9jq7ug3p%27',
    //     dataType:'json',
    //     success:this.success
    // });
    //   success=(res)=>{
    //       console.warn(res);
    //   }

    const image = {
        uri: 'https://cdn.pixabay.com/photo/2016/12/10/14/20/landscape-1897362_960_720.jpg'
    }


    const [gallery, setgallery] = useState([
        {
            image: {
                uri:
                    'https://c0.wallpaperflare.com/preview/880/329/104/human-pedestrian-person-tel-aviv.jpg'
            }, title: 'Tel-Aviv', key: '1',
            description: 'Tel Aviv is one of the most vibrant cities in the world. Titled the ‘Mediterranean Capital of Cool’ by the New York Times, this is a 24 hour city with a unique pulse, combining sandy Mediterranean beaches with a world-class nightlife, a buzzing cultural scene, incredible food, UNESCO recognized architecture, and an international outlook. Don’t miss it!'
        },
        {
            image: {
                uri:
                    'https://c0.wallpaperflare.com/preview/14/607/599/jerusalem-dome-of-the-rock-kudus-kubbet-us-sahra.jpg'
            }, title: 'Jerusalem', key: '2',
            description: 'Jerusalem is the religious and historical epicenter of the world. A surreal and vibrant city, holy to Jews, Muslims, and Christians – over one-third of all the people on earth. Jerusalem is as unique as she is special. Beyond her religious and historic significance, Jerusalem is the capital of modern-day Israel and an advanced, dynamic city. Jerusalem has to be seen to be believed. Exploring Jerusalem solo is fantastic, and if it is your first time visiting this glorious place, a tour is simply a must. With so much to see and know, having an experienced guide with you is indispensable and worth every penny.'
        },
        {
            image: {
                uri:
                   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Haifa%2C_Israel_-_panoramio.jpg/640px-Haifa%2C_Israel_-_panoramio.jpg'
            }, title: 'Haifa', key: '3',
            description: 'Haifa is Israel’s third largest city, beautifully set on the slopes of Mount Carmel facing the Mediterranean Sea, likened by some as ‘Israel’s San Francisco’.  Although traditionally a working city, there are a number of great things to do in Haifa that you must cross off your Haifa bucket list, including the Bahai Gardens, German Colony, as well as a number of top museums. The city is also known across Israel for its mixed population of Jews and Arabs who peacefully coexist and the result is some amazing fusions of Arabic and Jewish cultures across the city.'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TIBERIAS_-_GALILEE_%287723477802%29.jpg/800px-TIBERIAS_-_GALILEE_%287723477802%29.jpg'
            }, title: 'Tiberia', key: '4',
            description: '   Tiberias is one of the four Jewish Holy cities, and the capital of the Galilee. It has a long history since it was established in the early Roman period. It was a religious, administrative and culture center of the Jewish nation after the loss  of Jerusalem for 500 years until the Persian and Arab conquest. Many of the most important post-bible books (Mishna, Talmud) have been composed in the city which was the home of many Jewish scholars.'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/%D7%A2%D7%9B%D7%95_%D7%9E%D7%9E%D7%A2%D7%95%D7%A3_%D7%94%D7%A6%D7%99%D7%A4%D7%95%D7%A8.jpg/1024px-%D7%A2%D7%9B%D7%95_%D7%9E%D7%9E%D7%A2%D7%95%D7%A3_%D7%94%D7%A6%D7%99%D7%A4%D7%95%D7%A8.jpg'
            }, title: 'Acre', key: '5',
            description: 'Akko (Acre) represents tumultuous the history of the Land of Israel possibly better than any other city in the country. Akko is a city that has been shaped by the Romans, Ottomans, Crusaders, Mamelukes, Byzantines, and British, and fittingly is today home to a brilliantly coexistent mixed population of Jews, Christians and Muslims. The Old City of Akko is a UNESCO World Heritage Site and one of the oldest ports in the world, and the city is also home to part of the Bahai World Center (the other part being in Haifa, just down the road), another UNESCO World Heritage Site. There are regular tours to Akko from Tel Aviv and Jerusalem.'
        },
    ])
    return (
        <View>
            <View>
                <ImageBackground
                    source={image}
                    style={{ width: '100%', height: 270 }}
                    imageStyle={{ borderBottomRightRadius: 65 }}
                >
                    <View style={styles.DarkOvelay}></View>
                    <View style={styles.SearchContainer}>
                        <Text style={styles.UserGreet}>Hi Neil</Text>
                        <Text style={styles.UserText}>Where would you like to go today</Text>
                    </View>
                    <View>
                        <TextInput
                            style={styles.SearchBox}
                            placeholder='Search Destination'
                            placeholderTextColor='#666'
                        >
                        </TextInput>
                        <Feather name='search' size={22} color='#666' style={
                            { position: 'absolute', top: 25, right: 60, opacity: 0.6 }} />
                    </View>
                  

                </ImageBackground>
            </View>


            <ScrollView>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                        Top Trending
               </Text>
                </View>
                <View>
                    <FlatList
                        horizontal={true}
                        data={gallery}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ paddingVertical: 20, paddingLeft: 16 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('CityExplore', { item: item })}>
                                        <Image source={item.image} style={{
                                            width: 150,
                                            marginRight: 8, height: 320, borderRadius: 10
                                        }} />
                                        <View style={styles.imageOverlay}></View>
                                        <Feather name='map-pin' size={16} color='white'
                                            style={styles.imageLocationIcon} />
                                        <Text style={styles.imageText}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>

            </ScrollView>
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
    DarkOvelay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: 270,
        backgroundColor: '#000',
        opacity: 0.5,
        borderBottomRightRadius: 65
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
        height: 320,
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
    }

});
export default MainExplore;
