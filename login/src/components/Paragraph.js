import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../core/theme';
import * as Font from 'expo-font';

const Paragraph = ({ children }) => {
  
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
      {fontLoaded && <Text style={styles.text}>{children}</Text>}
    </View>
  )

}




const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 26,
    color: '#80b3ff',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 20,
    fontFamily: 'ComicNeue-Bold',
    textShadowColor:'#b3b3b3',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius: 4,
  },
});

export default memo(Paragraph);
