import React, { Component, useRef, useState, useEffect } from 'react';
import moment from 'moment'
import { GiftedChat } from 'react-native-gifted-chat'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebaseSvc from '../services/firebaseSDK'
import WatingToChat from './watingToChat';
import { Container, Header, Content, Text, Thumbnail, Left, Right, Button, Card, CardItem, Subtitle, Title, Body, Icon } from 'native-base';
import RatingModal from './ratingModal'
import { Notifications } from 'expo';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const chat = ({ navigation }) => {
    ;
    const [Guide, setGuide] = useState('')
    const [inputValue, setinputValue] = useState('')
    const [guideNotifications, setguideNotifications] = useState([])
    const [guideDocumentID, setguideDocumentID] = useState('')
    const [guideID, setguideID] = useState('')
    const [touristID, settouristID] = useState('')
    const [messages, setmessages] = useState([])
    const [ProfileTourist, setProfileTourist] = useState('')
    const [chatStatus, setchatStatus] = useState('')
    const [showRating, setshowRating] = useState(false)
    const apiUrlRating = "http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide_Tourist"

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // let num = 0;
            // AsyncStorage.setItem('NumNotification',JSON.stringify(num))
            // The screen is focused
            // Call any action
            readUserData();
            retrieveData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        getGuideFromAsync();
    }, [Guide])


    const readUserData = async () => {
        try {
            await AsyncStorage.getItem('ChatStatus').then(async (value) => {
                console.warn('2 status', value);
                if (value == 'Start Chat') {
                    setchatStatus('Start Chat')
                }
                else if (value == 'send request') {
                    setchatStatus('send request')
                }
                else if (value == 'Decline Chat') {
                    setchatStatus('Decline Chat')
                }
            })
        }
        catch (e) {
            console.warn('failed to fetch data')
        }
    }

    const retrieveData = async () => {
        console.warn('retrieveData')
        try {
            const value = await AsyncStorage.getItem('idChatTourist');
            const value2 = await AsyncStorage.getItem('idChatGuide');
            console.warn(value, value2);
            if (value !== null && value2 !== null) {
                // We have data!!
                setguideID(JSON.parse(value2));
                settouristID(JSON.parse(value));
                GetMessages(JSON.parse(value), JSON.parse(value2));
            }
        } catch (error) {
            // Error retrieving data
            console.warn(error)
        }
    };
    const check = async (toursit, guide) => {
        let arr = [];
        let groupChatId = `${guide}-${toursit}`
        console.warn('groupchat', groupChatId)
        let d = firebaseSvc.connect();
        d.collection('messages')
            .doc(groupChatId)
            .collection(groupChatId).onSnapshot(
                async (snapshot) => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            arr.push(change.doc.data())
                        }
                    })

                    await AddMessages(arr, guide);
                }
            )
    }
    const GetMessages = async (toursit, guide) => {
        let tour = await AsyncStorage.getItem('ProfileTourist');
        console.warn('inChat', tour)
        let ProfileTourist = JSON.parse(tour);
        setProfileTourist(ProfileTourist)
        await check(toursit, guide);
    }
    const AddMessages = async (array, guide) => {
        let messagesParse = array
        console.warn(array)

        const GuideUser = await AsyncStorage.getItem('GuideUser');
        let GuideUserParse = JSON.parse(GuideUser);
        let mes = [];
        if (messagesParse !== null) {
            for (let i = 0; i < messagesParse.length; i++) {
                const element = messagesParse[i];
                let g = moment(Number(element.timestamp)).format('LLL')
                let item = '';
                if (element.idFrom !== touristID) {
                    item = {
                        _id: i,
                        text: element.content,
                        createdAt: g,
                        user: {
                            _id: element.idFrom,
                            avatar: GuideUserParse.avatar,
                            name: GuideUserParse.name
                        }
                    }
                }
                else {
                    item = {
                        _id: i,
                        text: element.content,
                        createdAt: g,
                        user: {
                            _id: element.idFrom,
                            avatar: "",
                            name: ""
                        }
                    }
                }
                mes.push(item);
            }
            setmessages(mes)

        }
        await CheckNotificationsGuide(guide);

    }

    const CheckNotificationsGuide = async (guide) => {
        let notificationMessages = [];
        let d = firebaseSvc.connect();
        await d.collection('users')
            .where('id', "==", guide)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    setguideDocumentID(doc.id)
                    if (doc.data().messages.length > 0) {
                        doc.data().messages.map((item) => {
                            if (item.notificationId != guide) {
                                notificationMessages.push(
                                    {
                                        notificationId: item.notificationId,
                                        number: item.number
                                    }
                                )
                            }
                        })
                        d.collection('users')
                            .doc(doc.id)
                            .update(
                                {
                                    messages: notificationMessages
                                }
                            )
                            .then((data) => { setguideNotifications(notificationMessages) })
                            .catch(err => {
                            })
                    }
                })
            })
    }

   

    const onSendMessage = (content) => {
        if (content.trim() === '') {
            return
        }
        const itemMessage = {
            idFrom: touristID,
            idTo: guideID,
            timestamp: moment().valueOf().toString(),
            content: content.trim(),
            type: 0
        }
        let groupChatId = `${guideID}-${touristID}`;
        firebaseSvc.sendMessages(guideNotifications, guideDocumentID, guideID, touristID, groupChatId, moment().valueOf().toString(), itemMessage);
    }
    const onSend = (messages = []) => {
        let m = [];
        let message = '';
        for (let i = 0; i < messages.length; i++) {
            const element = messages[i];
        }
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            message = {
                text,
                user,
                createdAt: moment().valueOf().toString()
            };
            onSendMessage(message.text)
        }
    }

    const getGuideFromAsync = async () => {
        await AsyncStorage.getItem('Guide').then(async (value) => {
            if (value !== null) {
                let tempGuide = JSON.parse(value);
                setGuide(tempGuide);
            }
        })
    }

    const sendReviewToSQL = (rating) => {
        console.warn('im here', rating, new Date().toLocaleDateString('en-US'))
        let rank = {
            DateOfRanking: new Date().toLocaleDateString('en-US'),
            guidegCode: Guide.gCode,
            TouristId: ProfileTourist.TouristID,
            Rank: rating
        }
        console.warn(rank)
        fetch(apiUrlRating, {
            method: 'POST',
            body: JSON.stringify(rank),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })

        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.warn(result)
                },

                (error) => {
                    console.warn("err post=", error);
                });
    }
    if (chatStatus == 'Start Chat' && Guide !== "") {
        return (
            <Container>
                {showRating ? <RatingModal sendReviewToSQL={sendReviewToSQL} /> : null}
                <Header>
                    <Left />
                    <Body>
                        <Text onPress={() => navigation.navigate('GuideProfile', { guide: Guide })} style={{ fontSize: 16, fontWeight: 'bold' }}>{Guide.FirstName + ' ' + Guide.LastName}</Text>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => { setshowRating(!showRating) }}>
                            <Text>Rate me!</Text>
                        </Button>
                    </Right>
                </Header>
                <GiftedChat
                    scrollToBottom={true}
                    showAvatarForEveryMessage={true}
                    //scrollToBottomOffset={0}
                    inverted={false}
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: touristID,
                        name: ProfileTourist.FirstName + ' ' + ProfileTourist.LastName
                    }}
                />

            </Container>

        );
    }
    else if (chatStatus == 'send request' || chatStatus == 'Accept Request') {

        return (
            <WatingToChat />
        );

    }
    else if (chatStatus == 'Decline Chat') {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text onPress={() => navigation.navigate('MatchScreen')}>Choose a diffrent Guide</Text>
            </View>
        );
    }
    else if(touristID == null || guideID==null) {
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
    }
    else{
        console.warn('guide:',Guide)
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
    }
}
export default chat;



// export default class Chat extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             inputValue: '',
//             guideID: '',
//             touristID: '',
//             messages: [],
//             ProfileTourist: "",
//             chatStatus: '',
//             showRating: false
//         }
//         this.apiUrlRating = "http://proj.ruppin.ac.il/bgroup10/PROD/api/Guide_Tourist"


//     }


//     componentDidMount() {

//         // this.setState({
//         //   messages: [
//         //     {
//         //       _id: 1,
//         //       text: 'Hello developer',
//         //       createdAt: new Date(),
//         //       user: {
//         //         _id: 2,
//         //         name: 'React Native',
//         //         avatar: 'https://placeimg.com/140/140/any',
//         //       },
//         //     },
//         //   ],
//         // })
//         this.readUserData();
//         //this.check();

//     }
//     readUserData = async () => {
//         try {
//             await AsyncStorage.getItem('ChatStatus').then(async (value) => {
//                 if (value == 'Start Chat') {
//                     this.setState({
//                         chatStatus: 'Start Chat'
//                     })
//                     this.retrieveData()
//                 }
//                 else if (value == 'send request') {
//                     this.setState({
//                         chatStatus: 'send request'
//                     })
//                 }
//             })
//         }
//         catch (e) {
//             console.warn('failed to fetch data')
//         }
//     }


//     check = async () => {
//         let arr = [];
//         let groupChatId = `${this.state.guideID}-${this.state.touristID}`
//         let d = firebaseSvc.connect();
//         d.collection('messages')
//             .doc(groupChatId)
//             .collection(groupChatId).onSnapshot(
//                 async (snapshot) => {
//                     snapshot.docChanges().forEach(change => {
//                         if (change.type === 'added') {
//                             arr.push(change.doc.data())
//                         }
//                     })

//                     await this.AddMessages(arr);
//                 }
//             )
//     }
//     GetMessages = async () => {
//         let tour = await AsyncStorage.getItem('ProfileTourist');
//         console.warn('inChat', tour)
//         if (tour == undefined || tour == null) {
//             tour = await AsyncStorage.getItem('googleFacebookAccount');
//             console.warn('googlefacebook')
//         }
//         else {
//             console.warn('login')
//         }
//         let ProfileTourist = JSON.parse(tour);
//         this.setState({
//             ProfileTourist: ProfileTourist
//         })
//         await this.check();
//     }


//     AddMessages = async (array) => {
//         let messagesParse = array

//         const GuideUser = await AsyncStorage.getItem('GuideUser');
//         let GuideUserParse = JSON.parse(GuideUser);
//         let mes = [];
//         if (messagesParse !== null) {
//             for (let i = 0; i < messagesParse.length; i++) {
//                 const element = messagesParse[i];
//                 let g = moment(Number(element.timestamp)).format('LLL')
//                 let item = '';
//                 if (element.idFrom !== this.state.touristID) {
//                     item = {
//                         _id: i,
//                         text: element.content,
//                         createdAt: g,
//                         user: {
//                             _id: element.idFrom,
//                             avatar: GuideUserParse.avatar,
//                             name: GuideUserParse.name
//                         }
//                     }
//                 }
//                 else {
//                     item = {
//                         _id: i,
//                         text: element.content,
//                         createdAt: g,
//                         user: {
//                             _id: element.idFrom,
//                             avatar: "",
//                             name: ""
//                         }
//                     }
//                 }
//                 mes.push(item);
//             }
//             this.setState({
//                 messages: mes
//             })

//         }
//         else {

//         }
//     }
//     retrieveData = async () => {
//         console.warn('retrieveData')
//         try {
//             const value = await AsyncStorage.getItem('idChatTourist');
//             const value2 = await AsyncStorage.getItem('idChatGuide');
//             console.warn(value, value2);
//             if (value !== null || value2 !== null) {
//                 // We have data!!
//                 this.setState({
//                     guideID: JSON.parse(value2),
//                     touristID: JSON.parse(value)
//                 })
//                 this.GetMessages();
//             }
//         } catch (error) {
//             // Error retrieving data
//         }
//     };



//     onSendMessage = (content) => {
//         if (content.trim() === '') {
//             return
//         }
//         const timestamp = moment()
//             .valueOf()
//             .toString()
//         const itemMessage = {
//             idFrom: this.state.touristID,
//             idTo: this.state.guideID,
//             timestamp: timestamp,
//             content: content.trim(),
//             type: 0
//         }
//         let groupChatId = `${this.state.guideID}-${this.state.touristID}`;
//         firebaseSvc.sendMessages(groupChatId, timestamp, itemMessage);
//     }


//     onSend(messages = []) {
//         let m = [];
//         let message = '';
//         for (let i = 0; i < this.state.messages.length; i++) {
//             const element = this.state.messages[i];
//             m.push(element)
//         }

//         for (let i = 0; i < messages.length; i++) {
//             const { text, user } = messages[i];
//             message = {
//                 text,
//                 user,
//                 createdAt: this.timestamp,
//             };
//             this.onSendMessage(message.text)
//             m.push(message);
//         }
//         this.setState({
//             messages: m
//         })
//         // this.setState(previousState => ({
//         //     messages: GiftedChat.append(previousState.messages, message),
//         //   }))

//         //this.GetMessages();


//     }
//     sendReviewToSQL = (rating) => {
//         console.warn('im here', rating, new Date().toLocaleDateString('en-US'))
//         let rank = {
//             DateOfRanking: new Date().toLocaleDateString('en-US'),
//             guidegCode: 106,
//             TouristId: this.state.ProfileTourist.TouristID,
//             Rank: rating
//         }
//         console.warn(rank)
//         fetch(this.apiUrlRating, {
//             method: 'POST',
//             body: JSON.stringify(rank),
//             headers: new Headers({
//                 'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
//             })

//         })
//             .then(res => {
//                 return res.json()
//             })
//             .then(
//                 (result) => {
//                     console.warn(result)
//                 },

//                 (error) => {
//                     console.warn("err post=", error);
//                 });
//     }


//     render() {
//         if (this.state.chatStatus == 'Start Chat') {
//             return (
//                 <Container>
//                     {this.state.showRating ? <RatingModal sendReviewToSQL={this.sendReviewToSQL} /> : null}
//                     <Header>
//                         <Left />
//                         <Body>
//                             <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.ProfileTourist.FirstName + ' ' + this.state.ProfileTourist.LastName}</Text>
//                         </Body>
//                         <Right>
//                             <Button transparent onPress={() => { this.setState({ showRating: !this.state.showRating }) }}>
//                                 <Text>Rate me!</Text>
//                             </Button>
//                         </Right>
//                     </Header>
//                     <GiftedChat
//                         scrollToBottom={true}
//                         showAvatarForEveryMessage={true}
//                         //scrollToBottomOffset={0}
//                         inverted={false}
//                         messages={this.state.messages}
//                         onSend={messages => this.onSend(messages)}
//                         user={{
//                             _id: this.state.touristID,
//                             name: this.state.ProfileTourist.FirstName + ' ' + this.state.ProfileTourist.LastName
//                         }}
//                     />

//                 </Container>

//             );
//         }
//         else if (this.state.chatStatus == 'send request') {
//             return (
//                 <WatingToChat />
//             );

//         }
//         else {
//             return (
//                 <ActivityIndicator
//                     animating={true}
//                     style={{
//                         flex: 1,
//                         alignItems: 'center',
//                         justifyContent: 'center',

//                         height: 80
//                     }}
//                     size="large"
//                 />
//             );
//         }

//     }
// }