import firebase from 'firebase'
import { Alert } from 'react-native'
import '@firebase/firestore'
import uuid from 'uuid'
import AsyncStorage from '@react-native-community/async-storage';
const config = {
    apiKey: "AIzaSyCrJVguRveC8yoNDJVRulEmHZNJJKO5pZ8",
    authDomain: "isravisor-app.firebaseapp.com",
    databaseURL: "https://isravisor-app.firebaseio.com",
    projectId: "isravisor-app",
    storageBucket: "isravisor-app.appspot.com",
    messagingSenderId: "905156749666",
    appId: "1:905156749666:web:2ece46477ad313d15be43b",
    measurementId: "G-9HKQNSD4JY"

}


class FirebaseSvc {
    constructor() {
        this.state = {
            groupID: ""
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(config);

        } else {
            console.log("firebase apps already running...")
        }

        this.removeListener = null
        this.listMessage = []
        this.groupChatId = null

    }


    connect = () => {
        return firebase.firestore()

    }

    login = async (user) => {
        let guideID = '';
        let asyTour = '';
        let GuideUser = '';
        const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(async result => {
                let user = result.user;
                if (user) {
                    await firebase.firestore().collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                asyTour = user.uid
                                const currentdata = doc.data()
                                let guideEmail = currentdata.guideEmail;
                                firebase.firestore().collection('users').get()
                                    .then(async (res) => {
                                        await AsyncStorage.removeItem('idChatTourist');
                                        await AsyncStorage.removeItem('GuideUser');
                                        await AsyncStorage.removeItem('idChatGuide');
                                        for (let i = 0; i < res.docs.length; i++) {
                                            const element = res.docs[i];
                                            if (element.data().email == guideEmail) {
                                                GuideUser = {
                                                    _id: element.data().id,
                                                    name: element.data().name,
                                                    avatar: element.data().URL
                                                }
                                                guideID = element.data().id
                                            }
                                        }
                                        await AsyncStorage.setItem('idChatTourist', JSON.stringify(asyTour))
                                        await AsyncStorage.setItem('GuideUser', JSON.stringify(GuideUser))
                                        await AsyncStorage.setItem('idChatGuide', JSON.stringify(guideID))
                                    })
                            })
                        })
                }
            })
    }


    createAccount = async (user, GuideEmail) => {
        let asyGuide = '';
        let asyTour = '';
        let URL = user.URL;
        if (URL == "" || URL == null) {
            URL = "http://proj.ruppin.ac.il/bgroup10/PROD/Images/Default-welcomer.png"
        }
        try {
            await AsyncStorage.removeItem('messagesTourist');
            await AsyncStorage.removeItem('idChatTourist');
            await AsyncStorage.removeItem('GuideUser');
            await AsyncStorage.removeItem('idChatGuide');
        } catch (error) {
            // Error removing
        }
        return new Promise((resolve, reject) => {
            firebase.auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then(function (pass) {

                    firebase.firestore().collection("users").add({
                        name: user.name,
                        id: pass.user.uid,
                        email: user.email,
                        password: user.password,
                        URL: URL,
                        type: "Tourist",
                        guideEmail: GuideEmail,
                        messages: [{ notificationId: "", number: 0 }]
                    })
                        .then(function () {
                            firebase.firestore().collection('users').get()
                                .then((res) => {
                                    for (let i = 0; i < res.docs.length; i++) {
                                        const element = res.docs[i];
                                        if (element.data().email == GuideEmail) {
                                            let GuideUser = {
                                                _id: element.data().id,
                                                name: element.data().name,
                                                avatar: element.data().URL
                                            }
                                            asyGuide = element.data().id
                                            asyTour = pass.user.uid
                                            AsyncStorage.setItem('GuideUser', JSON.stringify(GuideUser));
                                            AsyncStorage.setItem('idChatGuide', JSON.stringify(element.data().id));
                                        }
                                    }
                                })
                        })
                    AsyncStorage.setItem(
                        'idChatTourist',
                        JSON.stringify(pass.user.uid)
                    );


                    Alert.alert(
                        'chat alert',
                        'The chat functionality is now open!',
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    )
                }, function (error) {
                });
        }, function (error) {
            console.error("got error:" + typeof (error) + " string:" + error.message);
            alert("Create account failed. Error: " + error.message);
        })
    }

    onLogout = user => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
        }).catch(function (error) {
            console.log("An error happened when signing out");
        });
    }


    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    sendMessages = async (guideNotifications, guideDocumentID, guideID, touristID, groupChatId, timestamp, itemMessage) => {
        console.log('guideNotifications', guideNotifications);
        console.log('guideDocumentID', guideDocumentID);
        console.log('touristID', touristID);

        let notificationMessages = [];

        await firebase.firestore()
            .collection('messages')
            .doc(groupChatId)
            .collection(groupChatId)
            .doc(timestamp)
            .set(itemMessage)

        if (guideNotifications.length > 0) {
            guideNotifications.map((item) => {
                if (item.notificationId != touristID) {
                    notificationMessages.push(
                        {
                            notificationId: item.notificationId,
                            number: item.number
                        }
                    )
                }
            })
        }
        notificationMessages.push({
            notificationId: touristID,
            number: 1
        })
        console.log('notificationMessages', notificationMessages);


        await firebase.firestore()
            .collection('users')
            .doc(guideDocumentID)
            .update(
                {
                    messages: notificationMessages
                }
            )
            .then((data) => { console.log("Suceess") })
            .catch(err => {

            })
    }

    UpdatePassword = (result) => {
        let email = result.TouristEmail;
        let oldPassword = result.OldPassword;
        let newPassword = result.NewPassword;
        firebase.auth().signInWithEmailAndPassword(email, oldPassword)
            .then(async res => {
                var user = firebase.auth().currentUser;
                    console.warn(res);
                if (user) {
                    await firebase.firestore().collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                const currentdata = doc.data()
                                user.updatePassword(newPassword).then(function () {
                                    firebase.firestore().collection("users").doc(doc.id).update({
                                        password: newPassword
                                        // Update successful.
                                    }).catch(function (error) {
                                        // An error happened.
                                    });
                                })
                            })
                        })
                }


            }).catch(function(error){})
    }


    updateProfilePictureFirebase = async (result) => {
        var user = firebase.auth().currentUser;
        if (user) {
            await firebase.firestore().collection('users')
                .where('id', "==", user.uid)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const currentdata = doc.data()
                        firebase.firestore().collection("users").doc(doc.id).update({
                            URL: result
                            // Update successful.
                        }).catch(function (error) {
                            // An error happened.
                        });
                    })
                })
        }
    }

    updateNameFirebase = async (result) => {
        var user = firebase.auth().currentUser;
        if (user) {
            await firebase.firestore().collection('users')
                .where('id', "==", user.uid)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const currentdata = doc.data()
                        firebase.firestore().collection("users").doc(doc.id).update({
                            name: result
                            // Update successful.
                        }).catch(function (error) {
                            // An error happened.
                        });
                    })
                })
        }
    }

    getMessages = (groupChatId) => {
        console.log('groupchatID', groupChatId);
        firebase.firestore().collection('messages').doc(groupChatId).collection(groupChatId).get()
            .then((res) => {
                res.forEach((item) => {
                    console.log("item", item);

                })

            })
    }

    send = (fid, femail, text, uid, uemail, uname) => {
        firebase.database().ref('chat_messages/').push({
            'fid': fid,
            'femail': femail,
            'text': text,
            user: {
                'uid': uid,
                'uemail': uemail,
                'uname': uname
            }

        }).then((data) => {
            console.log('data ', data)
        }).catch((error) => {
            console.log('error ', error)
        })
    }

    refOff() {
        this.ref.off();
    }

    hashString = (str) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    static get ref() {
        return firebase.firestore().collection('messages').doc(this.state.groupID).collection(this.state.groupID);
    }

    on = callback => Fire.ref().onSnapshot(snapshot => {
        console.log(snapshot);
        snapshot.docChanges().forEach(change => {
            console.log(change)
            if (change.type === 'added') {
                callback(this.parse(change.doc))
            }
        })
    });


    getListHistory = async (touristID, guideID) => {
        let arr = [];
        if (
            this.hashString(touristID) <=
            this.hashString(guideID)
        ) {
            this.groupChatId = `${touristID}-${guideID}`
        } else {
            this.groupChatId = `${guideID}-${touristID}`
        }
        // Get history and listen new data added
        let d = await firebase.firestore()
            .collection('messages')
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .onSnapshot(
                async (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            arr.push(change.doc.data())
                            this.listMessage.push(change.doc.data())
                        }
                    })
                    AsyncStorage.setItem(
                        'messagesTourist',
                        JSON.stringify(arr)
                    );
                    console.log("555666")
                }
            )
            .then(async (r) => console.log('f', this.listMessage))
    }
}



const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;