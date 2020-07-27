import React, { useState, useCallback } from 'react';
import { Container, Header, Content, Thumbnail, Text, Left, Right, Card, Button, CardItem, Subtitle, Title, View, Body, Icon } from 'native-base';
import { Alert, ImageBackground, StyleSheet, Button as B, ScrollView, Modal, TouchableHighlight, Linking, Dimensions, FlatList } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import createOpenLink from 'react-native-open-maps';





const hotels = ({ route, navigation }) => {
    const myApiData = route.params.myApiData;
    const [MapVisible, setMapVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentElement, setCurrentElement] = useState('');
    const [supportedURL, setsupportedURL] = useState('');

    //if the following resturant have a website, we will send him there
    const goToWebsite = (item) => {
        let isExsist = false
        let website_link = "";
        for (let index = 0; index < item.properties.length; index++) {
            const element = item.properties[index];
            if (element.key == 'website') {
                isExsist = true
                website_link = element.value
            }

        }
        if (isExsist) {
            return website_link
        }
        else {
            return "";
        }
    }

    const showModal = (element) => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>{element.name}</Text>
                            <Text style={styles.modalText}>{element.location_id}</Text>
                            <Text style={styles.modalMainText}>{element.intro}</Text>
                            <OpenURLButton url={goToWebsite(element)}>Open Website</OpenURLButton>
                            <B onPress={() => setMapVisible(true)} title="show map" />
                        </ScrollView>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Exit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    const abcd = (element) => {
        setCurrentElement(element)
        setModalVisible(true)
    }

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // if (url == "") {
            //     Alert.alert('Error,There is no such a website')

            // } else {
            // Checking if the link is supported for links with custom URL scheme.

            if (url == "") {
                Alert.alert('Error,There is no such a website')
            } else {
                const supported = await Linking.canOpenURL(url);

                if (supported) {
                    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                    // by some browser in the mobile
                    await Linking.openURL(url);
                } else {
                    Alert.alert(`Don't know how to open this URL: ${url}`);
                }
            }


        }, [url]);

        return <B title={children} onPress={handlePress} />;
    };
    //const yosemite= = { latitude: 37.865101, longitude: -119.538330 };

    const openYosemiteZoomedOut =(lat,long)=>{ createOpenLink({latitude:lat,longitude:long,zoom:30 });}

  
    if (MapVisible) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Feather style={{ position: 'absolute', left: 10, top: 40 }} name='x' size={28} color='#000000' onPress={() => setMapVisible(false)} />
                <MapView
                    style={{ flex: 0.8, width: Dimensions.get('window').width }}
                    region={{
                        latitude: currentElement.coordinates.latitude,
                        longitude: currentElement.coordinates.longitude,
                        latitudeDelta: 0.122,
                        longitudeDelta: 0.121,
                    }} >
                    <Marker
                        onPress={() => openYosemiteZoomedOut(currentElement.coordinates.latitude,currentElement.coordinates.longitude)}
                        coordinate={{
                            latitude: currentElement.coordinates.latitude,
                            longitude: currentElement.coordinates.longitude,
                        }}
                    //image={require('../assets/icon.png')}
                    />
                </MapView>
            </View>

        );
    } else {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => navigation.navigate('MainExplore')}>
                            <Icon name='arrow-back' />
                            <Text>Back</Text>
                        </Button>
                    </Left>
                    <Title>
                        Resturants
                 </Title>
                    <Right />

                </Header>
                {modalVisible ? showModal(currentElement) : null}
                <FlatList
                    data={myApiData}
                    renderItem={({ item }) => {
                        return (
                            <Card>
                                <CardItem button>
                                    <Left>
                                        {item.images[0] == undefined ?

                                            <Thumbnail
                                                source={require('../../assets/noPicture.png')}
                                                style={{ width: 80, height: 60, borderRadius: 10, marginRight: 5 }} />
                                            :
                                            <Thumbnail
                                                source={{
                                                    uri: item.images[0].sizes.thumbnail.url

                                                }
                                                }
                                                style={{ width: 80, height: 60, borderRadius: 10, marginRight: 5 }} />

                                        }


                                        <View style={{ alignItems: 'flex-start', top: -10 }}>
                                            <Title>{item.name}</Title>

                                            {item.tags[0] == undefined ?

                                                <Subtitle style={{ marginTop: 5 }}>type : unknown</Subtitle>
                                                :
                                                <Subtitle style={{ marginTop: 5 }}>
                                                    type : {item.tags[0].tag.name}
                                                </Subtitle>

                                            }

                                            <Subtitle style={{ marginTop: 5 }}>
                                                <FontAwesome name="star" color='#ffcc00' size={18} />
                                                <Subtitle>{item.score.toFixed(2)} out of 10 </Subtitle>
                                            </Subtitle>


                                        </View>

                                    </Left>
                                    <Right>
                                        <B title='View' transparent onPress={() => abcd(item)}>
                                        </B>
                                    </Right>
                                </CardItem>
                            </Card>
                        );
                    }
                    }
                    keyExtractor={(item) => { return item.id.toString() }}
                />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 50

    },
    MainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10

    },
    UserGreet: {
        fontSize: 38,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 100
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: 300,
        height: 500,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
        textAlign: "center"
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalText: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold'
    },
    modalMainText: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
        fontSize: 12,
    },
    viewProgress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
export default hotels