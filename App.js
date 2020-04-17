import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import firstTimeInIsrael from '../IsraVisor/funnel/screens/1-firstTimeInIsrael';
import TripType from '../IsraVisor/funnel/screens/2-tripType';
import FlightsDates from '../IsraVisor/funnel/screens/3-FlightsDates'
import Budget from '../IsraVisor/funnel/screens/4-Budget'
import Interest from '../IsraVisor/funnel/screens/5-Interests'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
} from '../IsraVisor/login/src/screens';

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    Dashboard,
    firstTimeInIsrael,
    TripType,
    FlightsDates,
    Budget,
    Interest
  },
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
