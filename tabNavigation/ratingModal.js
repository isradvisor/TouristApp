import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons';

const ratingModal = (props) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [rating, setRating] = useState(3);
    const SendRatingToChat = () => {
        setModalVisible(false)
        console.warn('kosssss emek')
        props.sendReviewToSQL(rating)

    }
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
                    <FontAwesome style={{position:'absolute',left:15 ,top:5 }} onPress={()=>setModalVisible(false)} name='times' size={24} />
                    <Text style={styles.modalTitle}>How was your experience?</Text>
                    <AirbnbRating
                        onFinishRating={(e) => setRating(e)}
                    />
                    <TouchableOpacity
                        onPress={() => SendRatingToChat()}
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}>
                        <Text style={styles.textStyle} >Sumbit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );

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
        width: 320,
        height: 250,
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
        elevation: 2,
        marginTop: 20
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",

    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        marginTop:10
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
    }

});
export default ratingModal