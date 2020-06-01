import React, { useState } from 'react';
import {
    StyleSheet, Text, View, Image, ImageBackground, ScrollView,
    TouchableOpacity, FlatList, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Divider } from 'react-native-elements';





const MainExplore = ({ navigation }) => {

    const image = {
        uri: 'https://cdn.pixabay.com/photo/2016/12/10/14/20/landscape-1897362_960_720.jpg'
    }

    //list of cities in israel
    const [gallery, setgallery] = useState([
        {
            image: {
                uri:
                    'https://c0.wallpaperflare.com/preview/880/329/104/human-pedestrian-person-tel-aviv.jpg'
            }, title: 'Tel-Aviv', key: '1',
            description: 'Tel Aviv is one of the most vibrant cities in the world. Titled the ‘Mediterranean Capital of Cool’ by the New York Times, this is a 24 hour city with a unique pulse, combining sandy Mediterranean beaches with a world-class nightlife, a buzzing cultural scene, incredible food, UNESCO recognized architecture, and an international outlook. Don’t miss it!',
            cityNameApi: 'Tel_Aviv'


        },
        {
            image: {
                uri:
                    'https://c0.wallpaperflare.com/preview/14/607/599/jerusalem-dome-of-the-rock-kudus-kubbet-us-sahra.jpg'
            }, title: 'Jerusalem', key: '2',
            description: 'Jerusalem is the religious and historical epicenter of the world. A surreal and vibrant city, holy to Jews, Muslims, and Christians – over one-third of all the people on earth. Jerusalem is as unique as she is special. Beyond her religious and historic significance, Jerusalem is the capital of modern-day Israel and an advanced, dynamic city. Jerusalem has to be seen to be believed. Exploring Jerusalem solo is fantastic, and if it is your first time visiting this glorious place, a tour is simply a must. With so much to see and know, having an experienced guide with you is indispensable and worth every penny.',
            cityNameApi: 'Jerusalem'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Haifa%2C_Israel_-_panoramio.jpg/640px-Haifa%2C_Israel_-_panoramio.jpg'
            }, title: 'Haifa', key: '3',
            description: 'Haifa is Israel’s third largest city, beautifully set on the slopes of Mount Carmel facing the Mediterranean Sea, likened by some as ‘Israel’s San Francisco’.  Although traditionally a working city, there are a number of great things to do in Haifa that you must cross off your Haifa bucket list, including the Bahai Gardens, German Colony, as well as a number of top museums. The city is also known across Israel for its mixed population of Jews and Arabs who peacefully coexist and the result is some amazing fusions of Arabic and Jewish cultures across the city.',
            cityNameApi: 'Haifa'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TIBERIAS_-_GALILEE_%287723477802%29.jpg/800px-TIBERIAS_-_GALILEE_%287723477802%29.jpg'
            }, title: 'Tiberias', key: '4',
            description: 'Tiberias is one of the four Jewish Holy cities, and the capital of the Galilee. It has a long history since it was established in the early Roman period. It was a religious, administrative and culture center of the Jewish nation after the loss  of Jerusalem for 500 years until the Persian and Arab conquest. Many of the most important post-bible books (Mishna, Talmud) have been composed in the city which was the home of many Jewish scholars.',
            cityNameApi: 'Tiberias'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/%D7%A2%D7%9B%D7%95_%D7%9E%D7%9E%D7%A2%D7%95%D7%A3_%D7%94%D7%A6%D7%99%D7%A4%D7%95%D7%A8.jpg/1024px-%D7%A2%D7%9B%D7%95_%D7%9E%D7%9E%D7%A2%D7%95%D7%A3_%D7%94%D7%A6%D7%99%D7%A4%D7%95%D7%A8.jpg'
            }, title: 'Acre', key: '5',
            description: 'Akko (Acre) represents tumultuous the history of the Land of Israel possibly better than any other city in the country. Akko is a city that has been shaped by the Romans, Ottomans, Crusaders, Mamelukes, Byzantines, and British, and fittingly is today home to a brilliantly coexistent mixed population of Jews, Christians and Muslims. The Old City of Akko is a UNESCO World Heritage Site and one of the oldest ports in the world, and the city is also home to part of the Bahai World Center (the other part being in Haifa, just down the road), another UNESCO World Heritage Site. There are regular tours to Akko from Tel Aviv and Jerusalem.',
            cityNameApi: 'Acre2C_Israel'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Gulf_of_Eilat.jpg/640px-Gulf_of_Eilat.jpg'
            }, title: 'Eilat', key: '6',
            description: 'Eilat is definitely one of Israels most unique cities! Bordering with Jordan and Egypt and defined as Israels Tourism Capital, Eilat offers a warm and dry desert climate that harmoniously merges with the spectacular Red Sea and dramatic backdrop of majestic mountains is the optimal choice for vacationers and sun seekers The city offers a fantastic range of hotels suitable for any budget, excellent restaurants, amazing beaches and a variety of attractions and activities.',
            cityNameApi: 'Eilat'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/%D7%A9%D7%A8%D7%99%D7%93%D7%99_%D7%A0%D7%9E%D7%9C_%D7%A7%D7%99%D7%A1%D7%A8%D7%99%D7%94_%D7%91%D7%A1%D7%A2%D7%A8%D7%94.jpg/640px-%D7%A9%D7%A8%D7%99%D7%93%D7%99_%D7%A0%D7%9E%D7%9C_%D7%A7%D7%99%D7%A1%D7%A8%D7%99%D7%94_%D7%91%D7%A1%D7%A2%D7%A8%D7%94.jpg'
            }, title: 'Caesarea', key: '7',
            description: 'Caesarea is a magnificent site, a national park where amazing ancient harbor ruins, beautiful beaches, and impressive modern residences sit side by side. Named by Travel & Leisure as the best tourist spot in the Middle East in 2020, Caesarea is originally an ancient Herodian port city located on Israel’s Mediterranean Coast about halfway between Tel Aviv and Haifa. ',
            cityNameApi: 'Caesarea'
        },
        {
            image: {
                uri:
                    'https://p1.pxfuel.com/preview/873/5/168/dead-sea-earth-hour-sea-nature-romantic-israel.jpg'
            }, title: 'Dead Sea', key: '8',
            description: 'The Dead Sea, known in Hebrew as Yam Ha-Melakh (the Sea of Salt) is the lowest point on earth, surrounded by the stunning landscape of the Negev Desert. The shores of the Dead Sea are the lowest point on the surface of the earth, and the saline water of the lake give lead to the name because no fish can survive in the salty waters. The other result of the salty water is their renowned health and healing properties and the unique feature that one can float naturally in them.',
            cityNameApi: 'Dead_Sea'
        },
        {
            image: {
                uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/%D7%A0%D7%A6%D7%A8%D7%AA_%D7%9B%D7%A0%D7%A1%D7%99%D7%AA_%D7%94%D7%91%D7%A9%D7%95%D7%A8%D7%94.jpg/640px-%D7%A0%D7%A6%D7%A8%D7%AA_%D7%9B%D7%A0%D7%A1%D7%99%D7%AA_%D7%94%D7%91%D7%A9%D7%95%D7%A8%D7%94.jpg'
            }, title: 'Nazareth', key: '9',
            description: 'Nazareth is described by some as ‘the Forgotten Son’ of Israeli tourism. Nazareth, located in Israel’s Galilee region not only has over a dozen important Christian sites, but as Israel’s largest Arab city, has some fascinating cultural sites and experiences to savor. The Pope came to Israel in early 2009, and Nazareth was one of the areas given big government grants to improve its tourism infrastructure for this. As a result, Nazareth has been given a push back onto Israel’s tourism map – and with its importance as the childhood home of Jesus, as the largest Arab city in Israel, and its stunning location right in the middle of the Lower Galilee (about 15 miles west of the Sea of Galilee), it’s a fascinating place.',
            cityNameApi: 'Nazareth'
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
                        Top Cities
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
                <View>
                <Card containerStyle={styles.card}>
				<Text style={styles.notes}>haifa</Text>
				
				<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
					<Image style={{width:100, height:100}} source={{uri:'https://cdn3.iconfinder.com/data/icons/symbol-1-1/36/12-512.png'}} />
					<Text style={styles.time}>10:00</Text>
				</View>

				<Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
				
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					<Text style={styles.notes}>light rain</Text>
					<Text style={styles.notes}>15.5&#8451;</Text>
				</View>
			</Card>
              
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
    card:{
		backgroundColor:'rgba(56, 172, 236, 1)',
		borderWidth:0,
		borderRadius:20
	},
	time:{
		fontSize:38,
		color:'#fff'
	},
	notes: {
		fontSize: 18,
		color:'#fff',
		textTransform:'capitalize'
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
