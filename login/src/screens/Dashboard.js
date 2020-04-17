import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';


const Dashboard = ({ navigation }) => {

  
  const profile = navigation.getParam('profile');
  
return(
<Background>
    <Logo/>
<Header>Hello {profile.FirstName}!</Header>
    <Paragraph>
      Ready to plan your trip to Israel?
    </Paragraph>
    <Button 
      style={{ backgroundColor: '#4b9fd6', color: 'white'}}
      mode="outlined" 
      onPress={() => navigation.navigate('firstTimeInIsrael', { profile: profile })}
    >
      Let's Start
    </Button>
    <Button mode="outlined" onPress={() => navigation.navigate('HomeScreen')}>
      Logout
    </Button>
  </Background>
)
  
};

export default memo(Dashboard);
