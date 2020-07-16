import React, { memo, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../core/theme';
import * as Font from 'expo-font';




const Header = ({ children }) => {

  const [fontLoaded, setFontLoaded] = useState(false)

  //load the font before loading the whole page
useEffect(() => {
  async function loadFont() {
    loadContent();
    
  };
    loadFont();
  }, [])

  //font load
  const loadContent =  () =>{
    
    Font.loadAsync({
      'ComicNeue-Bold': require('../../../funnel/fonts/ComicNeue-Bold.ttf')
    }).then(() => setFontLoaded(true))

  }

  return(
    <View>
   {fontLoaded && <Text style={styles.header}>{children}</Text>} 
   </View>
  )
}



const styles = StyleSheet.create({
  header: {
    fontSize: 29,
    color: '#80b3ff',
    fontWeight: 'bold',
    paddingVertical: 6,
    fontFamily: 'ComicNeue-Bold',
    marginTop: 30,
    textShadowColor:'#b3b3b3',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius: 3,
    
  },
});

export default memo(Header);
