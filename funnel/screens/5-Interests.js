import React, {useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet,  TouchableOpacity, Alert,TouchableHighlight, Image} from 'react-native';
import * as Font from 'expo-font';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import ImageView from 'react-native-image-view';
import { Button } from 'react-native-elements';
import {MaterialIcons, AntDesign} from '@expo/vector-icons'
import Modal from 'react-native-modal';

//Fade in animation
const FadeInView = (props) => {

  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  useEffect(() =>{

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
      }
    ).start();
  }, [])
 
  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}


// You can then use your `FadeInView` in place of a `View` in your components:
export default ({navigation}) => {

  const profile = navigation.getParam('profile');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [expertiseList, setExpertiseList] = useState([]);
  const [hobbyList, setHobbyList] = useState([]);
  const  [chosenExpertis, setChosenExpertis] = useState([]);
  const [chosenHobbies, setChosenHobbies] = useState([]);
  const [imageViewer, setImageViewer] = useState([{source: {uri: '', title: '', Type: ''}}])
  const currentProgressPer = 82;
  const numsExp = [0];
  const numsHobb = [0];
  const temp = [];
  const tempHobb = [];
  const idHobbiesListForDB = [];
  const idExpertiseListForDB = [];

  const apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Tourist/Interest'
  const apiUrlExpertise = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Expertise'
  const apiUrlHobby = 'http://proj.ruppin.ac.il/bgroup10/PROD/api/Hobby'


//load the font before loading the whole page
  useEffect(() => {
    async function loadFont() {
      loadContent();
      
    };
      loadFont();

   setImageViewer(imageViewer.filter((image) => image.source.uri !== ''))   
   getFromDB(apiUrlExpertise);
   getFromDB(apiUrlHobby); 
   
    }, [])
    
    //font load
    const loadContent =  () =>{
      
      Font.loadAsync({
        'ComicNeue-Bold': require('../fonts/ComicNeue-Bold.ttf')
      }).then(() => setFontLoaded(true))

    }

    //get Function from DB
  const getFromDB = (apiUrl) =>{
    fetch(apiUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
      
    })
      .then(res => {
      // console.warn('res=', JSON.stringify(res));
        return res.json()
      })
      .then(
        (result) => {
        //console.warn("fetch POST= ", JSON.stringify(result));
          const Type = result[0].Type == 'Hobby'? "Hobby": "Expertise";
          switch(Type){
            case 'Expertise':
              setExpertiseList(result)
              break;

            case 'Hobby':
              setHobbyList(result)
              break;
          }
         },
        (error) => {
          console.warn("err post=", error);
        });
  }
  
  //random Id function for Expertise
  const randomPictureExpertise = () =>{
    //random Id from the list
    const IdNumber = Math.floor(Math.random() * (expertiseList.length - 1) ) + 1

      for (let i = 0; i < numsExp.length; i++) {
        //if the id of image has been already shown on screen
        if(numsExp[i] == IdNumber){
          
          temp.push(1);
        }
      }
      //if the id of image hasn't been shown on screen yet
        if(temp.length <= 0){
          numsExp.push(IdNumber)
        return expertiseList[IdNumber]
        }
        else{
          temp.pop();
        }
        

  }

  //random Id function for Hobby
  const randomPictureHobby = () =>{
    
   //random Id from the list
   const IdNumber = Math.floor(Math.random() * (hobbyList.length - 1) ) + 1

   for (let i = 0; i < numsHobb.length; i++) {
     //if the id of image has been already shown on screen
     if(numsHobb[i] == IdNumber){
       
      tempHobb.push(1);
     }
   }
   //if the id of image hasn't been shown on screen yet
     if(tempHobb.length <= 0){
      numsHobb.push(IdNumber)
     return hobbyList[IdNumber]
     }
     else{
      tempHobb.pop();
     }
     

}
  //if the fetch succeeded, callBackFunc automaticaly start
  const callBackFunc = (Type) =>{
    
    //random of expertise
    if(Type == 'Expertise'){

      const expertise = randomPictureExpertise()
    
    //if expertise object wasnt recognized
    if(expertise == undefined){
      //turn to another loop to get Id that not showed yet
      return expertiseList.length > 0 && callBackFunc('Expertise');

    }
    else{
      const { NameE, Picture } = expertise;
      return(
        
        <TouchableOpacity disabled={(imageViewer.length == 10  || expertiseList.length - 4 == 0) && true} onPress={() =>addExpertise(expertise)}>
          <Image
                        source={{uri: Picture}}
                        style={styles.imageStyle}
                        containerStyle={{borderRadius: 50}}
                        placeholderStyle={{borderRadius: 50}}
          />
          <Text style={styles.textImages}> {NameE}</Text>
          </TouchableOpacity>

      )
    }
  }
  //random of Hobby
  else{
    const Hobby = randomPictureHobby()
    
    //if Hobby object wasnt recognized
    if(Hobby == undefined){
      //turn to another loop to get Id that not showed yet
      return hobbyList.length > 0 && callBackFunc('Hobby');
    }
    else{
      const {  HName, Picture } = Hobby;
      return(
      
        <TouchableOpacity disabled={(imageViewer.length == 10  || hobbyList.length - 4 == 0) && true} onPress={() =>addHobby(Hobby)}>
          <Image
                        source={{uri: Picture}}
                        style={styles.imageStyle}
                        containerStyle={{borderRadius: 50}}
                        placeholderStyle={{borderRadius: 50}}
          />
          <Text style={styles.textImages}> {HName}</Text>
          </TouchableOpacity>
      )
    }
  }
  }
  //when expertise pressed => add to new list and delete from the old list
  const addExpertise = (exp) =>{
    chosenExpertis.push(exp);
    setImageViewer([...imageViewer, { source: {uri: exp.Picture, title: exp.NameE, Type: exp.Type}} ])
    setExpertiseList(expertiseList.filter((expertise) => expertise.Code !== exp.Code))
    maximumImagesAlert()
  }

    //when Hobby pressed => add to new list and delete from the old list
    const addHobby = (hob) =>{
      chosenHobbies.push(hob);
      setImageViewer([...imageViewer, { source: {uri: hob.Picture, title: hob.HName, Type: hob.Type}} ])
      setHobbyList(hobbyList.filter((hobby) => hobby.HCode !== hob.HCode))
      maximumImagesAlert();
    }

    //delete image from the gallery and from the list that goes to DB
    const deleteImageFromGallery = (element) =>{
        //delete from the images gallery
        setImageViewer(imageViewer.filter((expertise) => expertise.source.title !== element.source.title))
        switch(element.source.Type){
          case 'Expertise':
            
            //delete from the list that goes to DB
            setChosenExpertis(chosenExpertis.filter((expertise) => expertise.NameE !== element.source.title))
            break;
          case 'Hobby':
            
            //delete from the list that goes to DB
            setChosenHobbies(chosenHobbies.filter((hobby) => hobby.HName !== element.source.title))
            break;
        }
        setIsImageViewVisible(false)

    }

    //if user marked 10 images - alert will shown
    const maximumImagesAlert = () =>{
      if(imageViewer.length == 9){
        {Alert.alert(
          '',
          'You already marked up 10 images, please delete from the gallery on the bottom, or continue to next page.',
          [
            
            {text: 'OK'},
            
          ],
          {cancelable: false},
        );}
      }
    }

    //fetch and continue function
    const fetchAndContinue = () =>{
      //place all the chosen expertises id into new array that will send to the DB
      for (let j = 0; j < chosenExpertis.length; j++) {
        idExpertiseListForDB.push(chosenExpertis[j].Code);
 
      }
      //place all the chosen hobbies id into new array that will send to the DB
      for (let i = 0; i < chosenHobbies.length; i++) {
        idHobbiesListForDB.push(chosenHobbies[i].HCode);
      }

      const user = {
        Email: profile.Email,
        Hobbies: idHobbiesListForDB,
        Expertises : idExpertiseListForDB
      }
      

      fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })
        
      })
        .then(res => {
         console.warn('res=', JSON.stringify(res));
          return res.json()
        })
        .then(
          (result) => {
          console.warn("fetch POST= ", JSON.stringify(result));
    
  
           },
          (error) => {
            console.warn("err post=", error);
          });


          //need to complete: navigation to the last page
     }
    
  return (
    <View style={styles.container}>
             
        <View style={styles.viewProgress}>

        <AnimatedProgressWheel 
          size={120} 
          width={15} 
          color={'#0080ff'}
          progress={currentProgressPer}
          backgroundColor={'#E0E0E0'}
          animateFromValue={0}
          duration={2500}
          />

        </View>
        <FadeInView style={styles.fadeTitle}>
          {fontLoaded && <Text style={styles.title}>Tell us what most interest you?</Text> }
        </FadeInView>
        <FadeInView style={styles.fadeButtons}>

        {hobbyList.length > 0 && callBackFunc('Hobby')}
        {expertiseList.length > 0 && callBackFunc('Expertise')}

        </FadeInView>
        <FadeInView style={styles.fadeButtons}>

        {expertiseList.length > 0 && callBackFunc('Expertise')}
        {hobbyList.length > 0 && callBackFunc('Hobby')}

        </FadeInView>
        <FadeInView style={styles.fadeButtons}>

        {hobbyList.length > 0 && callBackFunc('Hobby')}
        {expertiseList.length > 0 && callBackFunc('Expertise')}

        </FadeInView>
        
        {imageViewer.length > 0 && <ImageView
            images={imageViewer}
            imageIndex={0}
            animationType='fade'
            glideAlways={true}
            controls={{next: true, prev: true}}
            isVisible={isImageViewVisible}
            isSwipeCloseEnabled={true}
             renderFooter={(currentImage) => {return(
              <View style={styles.ViewOfDeleteIcon}>
                <Button
                    icon={
                      <AntDesign
                        name="delete"
                        size={50}
                        color="white"
                      />
                    }
                    onPress={() => {Alert.alert(
                      '',
                      'Are you sure you want to delete this image?',
                      [
                        
                        {text: 'Yes', onPress: () => deleteImageFromGallery(currentImage)},
                        {text: 'No', }
                      ],
                      {cancelable: false},
                    );}}
                    buttonStyle={{backgroundColor: 'transparent'}}
                  />
                  <View style={styles.galleryTitleView}>
                  <Text style={styles.galleryTitle}>{currentImage.source.title}
                  </Text>
                  </View>
             
              </View>
             )}}
            onClose={() => setIsImageViewVisible(false)}
        />}
        
        <View style={styles.bottomView}>
        {imageViewer.length > 0 && 
        <View style={{justifyContent: 'flex-start'}}>
        <Button
          icon={
            <MaterialIcons
              name="view-carousel"
              size={50}
              color="black"
            />
             }
          onPress={() => setIsImageViewVisible(true)}
          containerStyle={{ marginLeft: '3%',}}
          buttonStyle={styles.galleryBtn}
        />
        </View>
       }
        
      {imageViewer.length >= 4 && <View style={{flex: 1,}}>
        <Button
            title="Continue"
            type="outline"
            buttonStyle={styles.continueBtn}
            titleStyle={{color: 'white'}}
            onPress={fetchAndContinue}
            containerStyle={{marginRight: '24%'}}
        /> 
        </View>}
        

     
        </View>
       
        <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        animationInTiming={2000}
        animationOut={'slideOutDown'}
        animationOutTiming={2000}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Mark up to 10 and minimum 4 photos - that attract you the most!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
              
      
    </View>
    
</View>
       
  )
}

const styles = StyleSheet.create({

  container:{
  flex: 1,
   alignItems: 'center'

},

viewProgress:{
  marginTop: '15%',

},

fadeTitle:{
  width: 350,
  marginTop: 50,
},

fadeButtons:{
  
  flexDirection: 'row',  
  marginTop: 20
},

title: {
    fontSize: 28, 
    textAlign: 'center', 
    fontFamily: 'ComicNeue-Bold'
  },

textImages:{
  textAlign: 'center', 
  fontFamily: 'ComicNeue-Bold'
},

  continueBtn: {
    backgroundColor: '#ade6d8', 
    width: 140, 
    height: 50, 
    borderColor: '#ade6d8', 
    borderRadius: 10,
    alignSelf: 'center',

  },

  imageStyle: {
    width: 120, 
    height: 120,  
    marginLeft: '5%', 
    marginRight: '5%', 
    borderRadius: 20, 
    alignSelf: 'center',
    borderWidth: 1 ,
    borderColor: '#999999',
    
    
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modalView: {
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
    elevation: 2
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  ViewOfDeleteIcon: {
    flexDirection: 'row',  
    flex: 1, 
    justifyContent: 'flex-start', 
    direction: 'ltr'
  },

  galleryTitleView:{
    flex: 1, 
    justifyContent: 'center'
  },

  galleryTitle:{
    color: 'white', 
    fontSize: 22,  
    fontFamily: 'ComicNeue-Bold', 
    marginBottom: '45%', 
    alignSelf: 'center' 
  },

  bottomView: {
    width: '100%', 
    flexDirection: 'row',  
    marginTop: 40
  },

  galleryBtn: {
    backgroundColor: 'white', 
    alignSelf: 'flex-start'
  },
})


