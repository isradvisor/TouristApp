import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import React, { useState, useEffect, useRef } from 'react';

const watingToChat = () => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        readUserData();
    }, [])

    const readUserData = async () => {
        try {
            await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
                if (value == null) {
                    await AsyncStorage.getItem('googleFacebookAccount').then((value) => {
                        data = JSON.parse(value);
                        setProfile(data);

                    })
                } else {
                    data = JSON.parse(value);
                    setProfile(data);


                }

            }).then(() => {
                _notificationSubscription = Notifications.addListener(_handleNotification);
            });
        }
        catch (e) {
            console.warn('failed to fetch data')

        }

    }
    if (profile !== null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello {profile.FirstName}</Text>
                <Text>The Chat functionality will start as soon as the guide will approve your request!</Text>
            </View>
        );

    } else {
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
export default watingToChat;