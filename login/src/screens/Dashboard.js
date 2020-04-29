import React, {memo, useState} from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
 import * as Animatable from 'react-native-animatable';

 const slides = [
  {
    key: '1',
    title: 'Discover',
    text: 'Experienced local guides will help you personalise the entire trip and also help you out with finding the best deals',
    image: require('../../images/man.png'),
    backgroundColor: '#ccd4dc',
  },
  {
    key: '2',
    title: 'Travel Plan',
    text: 'Expert guide will build with your wishes step by step your dream trip to Israel!',
    image: require('../../images/wishlist.png'),
    backgroundColor: '#ccd4dc',
  },
  {
    key: '3',
    title: 'Chat',
    text: 'Chat with your guide from everywhere!',
    image: require('../../images/talk.png'),
    backgroundColor: '#ccd4dc',
  },
  {
    key: '4',
    title: 'Your Preference',
    text: "We'll ask you a few questions to understand your needs.\n\n Let's get started!",
    image: require('../../images/info.png'),
    backgroundColor: '#ccd4dc',
  }
];

const Dashboard = ({ navigation }) => {

  
  const profile = navigation.getParam('profile');
  const [showRealApp, setShowRealApp]= useState(false)

 const _renderItem = ({ item }) => {
    return (
      <View  style={ {backgroundColor: item.backgroundColor, flex: 1, alignItems: 'center', justifyContent: 'space-around',}}>
        <Animatable.Text useNativeDriver={true} style={{marginTop: 70}}animation="bounceIn" iterationCount={1} direction="alternate"><Text style={styles.title}>{item.title}</Text></Animatable.Text>
        <Animatable.Text useNativeDriver={true} delay={250} animation="bounceInDown" iterationCount={1} direction="alternate"><Image key={item.key} source={item.image} style={styles.image} /></Animatable.Text>
        <Animatable.Text useNativeDriver={true} style={{marginBottom: 40, marginLeft: '1.5%', marginRight: '1.5%'}}animation="bounceInLeft" iterationCount={1} direction="alternate"><Text style={styles.text}>{item.text}</Text></Animatable.Text>
        
      </View>
    );
  }
const  _onDone = () => {
    
    // navigation or simply by controlling state
      navigation.navigate('firstTimeInIsrael', {profile: profile})
    setShowRealApp(true);
  }
  
    if (showRealApp) {
      return null;
    } else {
      return <AppIntroSlider 
      renderItem={_renderItem} 
      data={slides} 
      onDone={_onDone}
      showSkipButton={true}
      onSkip={() => navigation.navigate('firstTimeInIsrael', {profile: profile})}
      />
    }
  }


const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  text: {
    color: '#347ef1',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 22,
    
   
  },
  title: {
    fontSize: 40,
    color: '#347ef1',
    backgroundColor: 'transparent',
    textAlign: 'center',
    
  },
  mainContent: {
    flex: 1,
    
  },
})

export default memo(Dashboard);
