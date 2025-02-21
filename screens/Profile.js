import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../components/store/useAuthStore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import useLectureStore from '../components/store/useLectureStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors, fonts} from '../assets/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation,CommonActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Profile = () => {

  const {user, setUser, isInitialized} = useAuthStore(state => state);
  const logout = useLectureStore(state => state.logout);
  const [userData, setUserData] = useState(user);
  const navigation = useNavigation();

  // Fetch user data from AsyncStorage
  const signOut = async () => {
    try {
      setUser(null);
      // setUserData(null);
      logout();
      await GoogleSignin.signOut();
      console.log('User signed out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Change 'HomeScreen' to your initial screen
        })
      );

      // navigation.navigate('Login');
      console.log('going to login ')
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
    
  };

  useEffect(() => {
  
    GoogleSignin.configure({
      webClientId:
        '565391947322-siocmt9pm6cebm5qjalu6htsoubneqtp.apps.googleusercontent.com', // Replace with your Web Client ID
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    setUserData(user);
  }, [user, isInitialized]);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {
        userData?
        <>
      <View
        style={{
          marginTop: wp(15),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: userData.data.user.photo}}
          style={{height: wp(40), width: wp(40), borderRadius: wp(20)}}
        />
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: wp(7),
            color: colors.primary,
            marginTop: wp(5),
            textTransform:'capitalize'
          }}>
          {userData.data.user.name}
        </Text>
        <Text
          style={{
            fontFamily: fonts.meduim,
            fontSize: wp(4),
            color: '#ABABAB',
            marginTop: wp(-1),
          }}>
          {userData.data.user.email}
        </Text>
      </View>

      <View style={{marginTop: wp(13)}}>
        {/* for change class */}
        <TouchableOpacity onPress={() => navigation.navigate('SelectClass')}>
          <View style={{marginTop: wp(3)}}>
            <View
              style={{
                height: wp(0.4),
                backgroundColor: colors.grey,
                width: wp(90),
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(4),
                marginTop: wp(2),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Icon name="enter-outline" size={wp(9)} color={colors.grey} />
              <Text style={{fontFamily: fonts.semiBold, fontSize: wp(5),color:colors.grey}}>
                Change Class
              </Text>
              <Icon name="chevron-forward" size={30} color={colors.grey} />
            </View>
          </View>
        </TouchableOpacity>

        {/* for help */}
        <TouchableOpacity onPress={() => navigation.navigate("ReportIssueScreen")}>
          <View style={{marginTop: wp(3)}}>
            <View
              style={{
                height: wp(0.4),
                backgroundColor: colors.grey,
                width: wp(90),
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(4),
                marginTop: wp(2),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Icon name="help-circle-outline" size={wp(9)} color={colors.grey} />
              <Text style={{fontFamily: fonts.semiBold, fontSize: wp(5),color:colors.grey}}>
                Feedback
              </Text>
              <Icon name="chevron-forward" size={30} color={colors.grey} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={signOut}>
          <View style={{marginTop: wp(3)}}>
            <View
              style={{
                height: wp(0.4),
                backgroundColor: colors.grey,
                width: wp(90),
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(4),
                marginTop: wp(2),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <AntDesign name="logout" size={wp(7)} color={colors.grey} />
              <Text style={{fontFamily: fonts.semiBold, fontSize: wp(5),color:colors.grey}}>
              Logout
              </Text>
              <Icon name="chevron-forward" size={30} color={colors.grey} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: wp(0.4),
          backgroundColor: colors.grey,
          width: wp(90),
          marginTop: wp(2),
        }}></View>
        </>
      :
      <></>
      }
    </View>
  );
};

export default Profile;
{
  /* <Button
          title='sign out'
          onPress={signOut}
          /> */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
});
