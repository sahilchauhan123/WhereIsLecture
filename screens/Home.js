import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {colors, fonts,todayTime} from '../assets/constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useAuthStore from '../components/store/useAuthStore';
import useLectureStore from '../components/store/useLectureStore';
import LectureDetails from './LectureDetails';


const Home = () => {

  const user  = useAuthStore((state)=>state.user)
  const lecture = useLectureStore((state)=>state.data)
  const isInitialized = useLectureStore((state)=>state.isInitialized)

  const className = useLectureStore((state)=>state.className)
  const navigation = useNavigation();

  const [greeting, setGreeting] = useState('');
  const [userdata, setUserData] = useState(user);
  const [today,setToday] = useState();
  const [fullDate,setFullDate] = useState();
  const [batchName,setbatchName] = useState(className);
  const [lectureLength,setLectureLength] = useState(0)

  
  function updateGreeting() {
    var hours = new Date().getHours();
    if (hours >= 4 && hours <= 12) {
      setGreeting('Good Morning 👋');
    } else if (hours >= 13 && hours <= 15) {
      setGreeting('Good Afternoon 👋');
    } else if (hours >= 16 && hours <= 19) {
      setGreeting('Good Evening 👋');
    } else {
      setGreeting('Good Night 😴');
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let todayName = days[new Date().getDay()];
    setToday(todayName);
    console.log(todayName,"data of lecture getting from lecture store : ",lecture);
    const date = new Date();
    const day = date.getDate(); // 21
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()]; // "Jan"
    const year = date.getFullYear(); // 2025

    const formattedDate = `${day} ${month} ${year}`;
    console.log(formattedDate); // Example: "21 Jan 2025"
    setFullDate(formattedDate);

    function getLengthOfLectures(){
      var size = 0;
      if(todayName.toLowerCase() in lecture.lectures){
        size = lecture.lectures[todayName.toLowerCase()].length

        {
          lecture.lectures[todayName.toLowerCase()].map((data)=>{
            if(data.lecture_name === "LUNCH BREAK" || data.lecture_name === "TEA BREAK"){
                --size;
            }
          })
        }
        
      }else{
        console.log("Days is not present in lecture")
      }
  
      
      setLectureLength(size);
    }
    getLengthOfLectures();

  }

  useEffect(()=>{
    setbatchName(className);
    if(className,lecture != null){
      updateGreeting();
    }
  },[className,lecture])

  return (
    <SafeAreaView >
      
      <View style={{flexDirection: 'row', marginHorizontal: wp(6),marginTop:wp(2.5)}}>
        <View>
          <View style={{marginTop: wp(4)}}>
            <Text
              style={{
                color: colors.secondary,
                fontFamily: fonts.semiBold,
                fontSize: wp(4.2),
              }}>
              {greeting}
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontFamily: fonts.bold,
                fontSize: wp(6.5),
                textTransform:'capitalize'
              }}>
              {userdata.data.user.givenName}
            </Text>
          </View>
        </View>

        <View
          style={{alignItems: 'flex-end', flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate("Profile")}>

          <Image
            source={{uri: userdata.data.user.photo}}
            style={{
              height: wp(12),
              width: wp(12),
              borderRadius: wp(10),
              marginTop: wp(1),
            }}
          />
        </TouchableOpacity>

        </View>
      </View>

      <View style={{marginHorizontal: wp(6),backgroundColor: colors.primary,marginTop:wp(4),padding:wp(4),borderRadius:wp(6)}}>
        <View style={{flexDirection: 'row',marginHorizontal:wp(5),borderRadius:wp(2)}}>
          <View>
            <Text style={{fontFamily:fonts.semiBold,fontSize:wp(4),color:colors.white,justifyContent:'space-between'}}>
              {today}
            </Text>
            <Text style={{fontFamily:fonts.semiBold,fontSize:wp(4),color:colors.white}}>
              {fullDate}</Text>
          </View>
          <View style={{alignItems:'flex-end',flex:1}}>
            <Text style={{fontFamily:fonts.light,fontSize:wp(3.5),paddingRight:wp(0),color:'#D1D1D1',marginTop:wp(1)}}>
              Class
            </Text>
            <Text style={{fontFamily:fonts.semiBold,fontSize:wp(4),color:colors.white,textAlign:'left'}}>
              {batchName}
              
            </Text>
          </View>
        </View>
        <View style={{backgroundColor:colors.orange,paddingVertical:wp(0.5),marginTop:wp(2),borderRadius:wp(5)}}>
        <Text style={{fontFamily:fonts.meduim,color:colors.white,marginLeft:wp(5)}}>
          Today there are {lectureLength} lectures
        </Text>
        </View>
      </View>
    <View style={{marginTop: wp(3), marginHorizontal: wp(6), flexDirection:'row'}}>
              <Text style={{fontFamily: fonts.meduim, color: colors.lightGrey}}>
                Time
              </Text>
              <Text
                style={{
                  fontFamily: fonts.meduim,
                  marginLeft: wp(11),
                  color: colors.lightGrey,
                }}>
                Lectures
              </Text>
    </View>
           
      <ScrollView showsVerticalScrollIndicator={false} >
      <LectureDetails item={today} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});

