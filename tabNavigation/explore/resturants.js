import React from 'react';
import { Container, Header, Content, Thumbnail, Text, Left, Body, Right, Button, Card, CardItem, Subtitle, Title, View } from 'native-base';
import { FlatList,Linking,Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';



const resturants = ({ route, navigation }) => {
    const myApiData = route.params.myApiData;

    //if the following resturant have a website, we will send him there
    const goToWebsite = (item) =>{
        let isExsist = false
        let website_link ="";
        for (let index = 0; index < item.properties.length; index++) {
            const element = item.properties[index];
            if (element.key=='website') {
                isExsist=true
                website_link=element.value
            } 
            
        }
        if (isExsist) {
            Linking.openURL(website_link)
        } else {
            Alert.alert('Error',item.name+ ' does not have an offical website')
        }
    }

    return (
        <Container>
            <Header>
                <Left>
                    <Button hasText transparent onPress={() => navigation.navigate('CityExplore')}>
                        <Text>Back</Text>
                    </Button>
                </Left>
                <Title>
                    Resturants
                 </Title>
                <Right>

                </Right>
            </Header>
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

                                            <Subtitle style={{marginTop: 5}}>
                                                <FontAwesome name="star" color='#ffcc00' size={18} />
                                                <Subtitle>{item.score.toFixed(2)} out of 10 </Subtitle>
                                            </Subtitle>


                                        </View>

                                    </Left>
                                    <Right>
                                        <Button transparent onPress={() => goToWebsite(item)}>
                                            <Text>View</Text>
                                        </Button>
                                    </Right>
                                </CardItem>
                            </Card>
                        );
                    }
                    }
                    keyExtractor={item => item.id.toString()}

                />
        </Container>
    );
}
export default resturants