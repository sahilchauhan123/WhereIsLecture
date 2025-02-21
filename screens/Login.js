import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation, CommonActions} from '@react-navigation/native';
import useAuthStore from '../components/store/useAuthStore';
import firestore from '@react-native-firebase/firestore';
import {create} from 'zustand';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors, fonts} from '../assets/constants';
import messaging from '@react-native-firebase/messaging';
import useLectureStore from '../components/store/useLectureStore';
import Internet from '../components/store/Internet';
import NetInfo from '@react-native-community/netinfo'

const Login = () => {
  const setUser = useAuthStore(state => state.setUser);
  const navigation = useNavigation();
  const setClassThroughLogin = useLectureStore(state => state.setClassThroughLogin);
  const [userInfo, setUserInfo] = useState(null);
  const [loader,setLoader] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '565391947322-siocmt9pm6cebm5qjalu6htsoubneqtp.apps.googleusercontent.com', // Replace with your Web Client ID
      offlineAccess: true,
    });
  }, []);

  const getInternetStatus = async () => {
    try {
      const status = await NetInfo.fetch();
      // console.log("internet status is : ",status.isInternetReachable);
      return status.isInternetReachable ?? false;
    } catch (error) {
      console.error("Error fetching internet status:", error);
      return false;
    }
  };

  async function getToken() {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('in login ', token);
    return token;
  }

  const uploadUserToFirestore = async user => {
    try {
      await firestore().collection('Users').doc(user.data.user.email).set({
        email: user.data.user.email,
        firstName: user.data.user.givenName,
        lastName: user.data.user.familyName,
        photo: user.data.user.photo,
        class: null,
      });
      console.log('User  added to Firestore!');

      const token = await getToken();

      await firestore()
        .collection('Users')
        .doc(user.data.user.email)
        .update({
          deviceTokens: firestore.FieldValue.arrayUnion(token),
        });

      console.log('device token added');
      return true;
    } catch (error) {
      console.error('Error uploading user to Firestore:', error);
      return false;
    }
  };

  const signIn = async () => {
    try {
      setLoader(true)
      
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();

      if (user != null) {
        setUser(user);
        setUserInfo(user);
        // console.log('reached there ')
        //check user in firestore
        const userDoc = await firestore()
          .collection('Users')
          .where('email', '==', user.data.user.email)
          .get();

        if (userDoc.empty) {
          const uploadSuccess = await uploadUserToFirestore(user);
          console.log('----------------------');
          if (uploadSuccess) {
            navigation.navigate('SelectClass');
          }
        } else {
          console.log('User  already exists in Firestore.');
          uploadSuccess = false;

          await firestore()
            .collection('Users')
            .doc(user.data.user.email)
            .get()
            .then(documentSnapshot => {
              console.log('User exists: ', documentSnapshot.exists);

              if (documentSnapshot.exists) {
                const userData = documentSnapshot.data();
                console.log(
                  'User data: ***********************',
                  userData.class,
                );
                if(userData.class){
                  setClassThroughLogin(userData.class);
                  navigation.navigate('NavigatewithTabs');
                } else {
                  console.error('Error: "class" property is missing in user document');
                }
                
              }
            });
        }
      }
      // Update Zustand store
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setLoader(false);
      setClassThroughLogin(null);
      setUser(null);
    }
  };
  
  return (
    <View
      style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
      <View style={{justifyContent:"center",alignItems:'center'}}>

      <Image
        source={require('../assets/images/sahillogo.png')}
        style={styles.image}
      />
      <Text
        style={{
          color: colors.orange,
          fontFamily: fonts.semiBold,
          fontSize: wp(6),
          textAlign:'center',
          marginTop:wp(-8)
        }}>
        Get Notified 5 minutes before Lectures
      </Text>
      </View>

        {
          loader ? <>
          <View style={{backgroundColor:colors.primary,borderRadius:wp(10),width:wp(80)}}>
            <ActivityIndicator
            style={{marginVertical:wp(2.5)}}
            color={colors.white}
            size={30}
            />
          </View>

          </> :
          <>
          <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          padding: wp(0.5),
          alignItems: 'center',
          backgroundColor: colors.primary,
          width: wp(80),
          borderRadius: wp(10),
        }}
        onPress={signIn}>
        <Image
          style={{
            height: wp(12),
            width: wp(12),
            backgroundColor: 'white',
            borderRadius: wp(12),
          }}
          source={require('../assets/images/gmail-signin.png')}
        />
        <Text
          style={{
            fontSize: wp(5),
            color: colors.white,
            fontWeight: '600',
            marginLeft: wp(4),
            fontFamily: fonts.semiBold,
          }}>
          Continue With Google
        </Text>
      </TouchableOpacity>
          </>
        }
      
    </View>
  );
}


export default Login;

const styles = StyleSheet.create({
  image: {
    height: hp(20 * 2),
    width: wp(50 * 2),
  },
});
