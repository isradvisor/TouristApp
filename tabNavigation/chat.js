import React, { Component } from 'react';
import moment from 'moment'
import { GiftedChat } from 'react-native-gifted-chat'

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    Button,
    AsyncStorage
} from 'react-native';
import firebaseSvc from '../services/firebaseSDK'
import { ThemeConsumer } from 'react-native-elements';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            guideID: '',
            touristID: '',
            messages: [],
            ProfileTourist:""
        }
    }
    componentDidMount() {

        // this.setState({
        //   messages: [
        //     {
        //       _id: 1,
        //       text: 'Hello developer',
        //       createdAt: new Date(),
        //       user: {
        //         _id: 2,
        //         name: 'React Native',
        //         avatar: 'https://placeimg.com/140/140/any',
        //       },
        //     },
        //   ],
        // })

    }
    componentWillMount(){
        this.retrieveData()
    }



    GetMessages = async () => {
        const tour = await AsyncStorage.getItem('ProfileTourist');
        let ProfileTourist = JSON.parse(tour);
        this.setState({
            ProfileTourist:ProfileTourist
        })
        const messages2 = await AsyncStorage.getItem('messagesTourist');
        console.log("2",messages2);
        console.log(this.state.guideID);
        console.log(this.state.touristID);
        firebaseSvc.getListHistory(this.state.touristID, this.state.guideID);
        const messagesStore = await AsyncStorage.getItem('messagesTourist');
        console.log("1",messagesStore);
        let messagesParse = JSON.parse(messagesStore)
        const GuideUser = await AsyncStorage.getItem('GuideUser');
        let GuideUserParse = JSON.parse(GuideUser);
        let mes = [];
        if (messagesParse !== null) {
            for (let i = messagesParse.length - 1; i >= 0; i--) {
                const element = messagesParse[i];
                let g = moment(Number(element.timestamp)).format('ll')
                let item = '';
                if (element.idFrom == this.state.touristID) {
                    item = {
                        _id: element.idFrom,
                        text: element.content,
                        createdAt: g,
                        user: {
                            _id: element.idTo,
                            avatar: GuideUserParse.avatar,
                            name: GuideUserParse.name
                        }
                    }
                }
                else {
                    item = {
                        _id: element.idFrom,
                        text: element.content,
                        createdAt: g,
                        user: {
                            _id: element.idTo,
                            avatar: "",
                            name: ProfileTourist.FirstName + ' ' + ProfileTourist.LastName
                        }
                    }
                }
    
                mes.push(item);
            }
            this.setState({
                messages: mes
            })
        }
        else{

        }
      

    }
    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('idChatTourist');
            const value2 = await AsyncStorage.getItem('idChatGuide');

            if (value !== null || value2 !== null) {
                // We have data!!
                this.setState({
                    guideID: JSON.parse(value2),
                    touristID: JSON.parse(value)
                })
                this.GetMessages();
            }
        } catch (error) {
            // Error retrieving data
        }
    };



    onSendMessage = (content) => {
        if (content.trim() === '') {
            return
        }
        const timestamp = moment()
            .valueOf()
            .toString()
        const itemMessage = {
            idFrom: this.state.touristID,
            idTo: this.state.guideID,
            timestamp: timestamp,
            content: content.trim(),
            type: 0
        }
        let groupChatId = `${this.state.guideID}-${this.state.touristID}`;
        firebaseSvc.sendMessages(groupChatId, timestamp, itemMessage);
    }


    onSend(messages = []) {
        let m = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            const element = this.state.messages[i];
            m.push(element)
        }
        m.push(messages);

        console.log('all', m);
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                createdAt: this.timestamp,
            };
            console.log('one', this.timestamp)
            this.onSendMessage(message.text)
        }
        this.GetMessages();


    }


    render() {
        return (
            <GiftedChat
            isAnimated
                messages={this.state.messages}
                placeholder
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.state.touristID,
                    id: this.state.touristID,
                    name: this.state.ProfileTourist.FirstName + ' ' + this.state.ProfileTourist.LastName
                }}
            />
        )
    }
}