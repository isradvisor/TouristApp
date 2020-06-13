import firebase from 'firebase'
import '@firebase/firestore'
import uuid from 'uuid'
import { AsyncStorage } from 'react-native';

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
        this.state={
            groupID:""
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
            // firebase.firestore().settings({
            //     timestampsInSnapshots: true
            // })
        } else {
            console.log("firebase apps already running...")
        }
      
        this.removeListener = null
        this.listMessage = []
        this.groupChatId = null

    }

    componentWillUnmount(){
        if (this.removeListener) {
            this.removeListener()
        }
    }

    authData = (email) => {
        firebase
            .database()
            .ref('users')
            .orderByChild('emailAddress')
            .equalTo(email)
            .once('value', snap => console.log('this is authantcation data==> ' + snap.val()))
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
                                console.log(doc.id);
                                asyTour = user.uid
                                const currentdata = doc.data()
                                console.log("--------------")
                                console.log(currentdata.guideEmail)
                                console.log("--------------")
                                let guideEmail = currentdata.guideEmail;
                                firebase.firestore().collection('users').get()
                                    .then((res) => {
                                         //AsyncStorage.removeItem('messagesTourist');
                                             AsyncStorage.removeItem('idChatTourist');
                                             AsyncStorage.removeItem('GuideUser');
                                             AsyncStorage.removeItem('idChatGuide');
                                        console.log("Start Search guideUID")
                                        for (let i = 0; i < res.docs.length; i++) {
                                            const element = res.docs[i];
                                            if (element.data().email == guideEmail) {
                                                console.log("Found GuideUID")
                                                console.log("First")
                                                console.log(element.data().id)
                                                 GuideUser = {
                                                    _id: element.data().id,
                                                    name: element.data().name,
                                                    avatar: ""
                                                }
                                                guideID = element.data().id
                                            }
                                        }
                                        console.log("GUIDEID",guideID);
                                        console.log("GuideDetails",GuideUser);
                                        console.log("TouristID",asyTour);
                                        AsyncStorage.setItem('idChatTourist',JSON.stringify(asyTour))
                                        AsyncStorage.setItem('GuideUser',JSON.stringify(GuideUser))
                                        AsyncStorage.setItem('idChatGuide',JSON.stringify(guideID))
                                    })
                            })
                        })
                }
            })
    }


    addDetailsToChat = (touristUID, guideEmail) => {
        //console.log("guideEmail",guideEmail);


      

    }

    loginData = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log("user: ", user);
                    resolve(user)
                    // User is signed in.
                } else {
                    // No user is signed in.
                }
            })
        })
    }

    observeAuth = () => {
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }
    onAuthStateChanged = user => {
        if (!user) {
            try {
                this.login(user);
            } catch ({ message }) {
                console.log("Failed:" + message)
            }
        } else {
            console.log("Reusing auth...");
        }
    }


    createAccount = async (user, guide) => {
        try {
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
                    var userf = firebase.auth().currentUser;
                    userf.updateProfile({ displayName: user.name })
                        .then(function () {
                            firebase.firestore().collection("users").add({
                                name: user.name,
                                id: pass.user.uid,
                                email: user.email,
                                password: user.password,
                                URL: "",
                                type: "Tourist",
                                guideEmail: guide.Email,
                                messages: [{ notificationId: "", number: 0 }]
                            })
                                .then(function () {
                                    firebase.firestore().collection('users').get()
                                    .then( (res) => {
                                        console.log("Start Search guideUID")
                                        for (let i = 0; i < res.docs.length; i++) {
                                            const element = res.docs[i];
                                            if (element.data().email == guideEmail) {
                                                console.log("Found GuideUID")
                                                console.log(element.data().id)
                                                let GuideUser = {
                                                    _id:element.data().id,
                                                    name:element.data().name,
                                                    avatar:""
                                                }
                                                AsyncStorage.setItem('GuideUser',JSON.stringify(GuideUser));
                                                 AsyncStorage.setItem('idChatGuide',JSON.stringify(element.data().id));
                                            }
                                        }
                                    })
                                })
                                    console.log("Document successfully written!");
                                    _storeData = async () => {
                                        try {
                                            await AsyncStorage.setItem(
                                                'idChatTourist',
                                                JSON.stringify(pass.user.uid)
                                            );
                                        } catch (error) {
                                            // Error saving data
                                        }
                                    };
                                })
                                .catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            alert("User " + user.name + " was created successfully. Please login.")
                        }, function (error) {
                            console.warn("Error update displayName.");
                        });
                }, function (error) {
                    console.error("got error:" + typeof (error) + " string:" + error.message);
                    alert("Create account failed. Error: " + error.message);
                })
        }
    

    usersData = () => {
        let all = []
        return new Promise((resolve, reject) => {
            var docRef = firebase.firestore().collection("messages")
            docRef.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    all.push(doc.data())
                }, resolve(all))
            })
            console.log("all",all);
        })
    }

    onLogout = user => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
        }).catch(function (error) {
            console.log("An error happened when signing out");
        });
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get ref() {
        return firebase.database().ref('chat_messages');
    }

    refOn = () => {
        return new Promise((resolve, reject) => {
            let cData = []
            this.ref.on('child_added', function (snapshot) {
                const { timestamp: numberStamp, text, user, name, femail, fid } = snapshot.val();
                const { key: id } = snapshot;
                const { key: _id } = snapshot;
                const timestamp = new Date(numberStamp);
                const message = {
                    femail,
                    fid,
                    text,
                    timestamp,
                    user
                };
                cData.push(message)
                resolve(cData)
            })
        })
    }

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    sendMessages=(groupChatId,timestamp,itemMessage)=>{
        firebase.firestore()
        .collection('messages')
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timestamp)
        .set(itemMessage)
    }

    getMessages=(groupChatId)=>{
        console.log('groupchatID',groupChatId);
        firebase.firestore().collection('messages').doc(groupChatId).collection(groupChatId).get()
        .then((res)=>{
            res.forEach((item)=>{
                console.log("item",item);

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




    getListHistory = async(touristID,guideID) => {
        let arr = [];
        console.log("tour",touristID);
        console.log("guide",guideID);
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        if (
            this.hashString(touristID) <=
            this.hashString(guideID)
        ) {
            this.groupChatId = `${touristID}-${guideID}`
        } else {
            this.groupChatId = `${guideID}-${touristID}`
        }
        console.log("ddddddddddd",this.groupChatId);
        // Get history and listen new data added
        this.removeListener = firebase.firestore()
            .collection('messages')
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            arr.push(change.doc.data())
                        }
                    })
                     AsyncStorage.setItem(
                        'messagesTourist',
                        JSON.stringify(arr)
                    );
                },
                err => {
                    //this.props.showToast(0, err.toString())
                }
            )
    }
}





const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;