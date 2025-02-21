import {Image, ScrollView, StyleSheet, Text, View, ViewBase} from 'react-native';
import React, {useEffect, useState} from 'react';
import useLectureStore from '../components/store/useLectureStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors, fonts} from '../assets/constants';
import moment from 'moment';

const LectureDetails = props => {
  const data = useLectureStore(state => state.data);
  const [classData, setClassData] = useState();
  const [today, setToday] = useState();
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
  const [lectureAvailable,setLectureAvailable] = useState(false);

  useEffect(() => {
    if (props.item && data) {
      let todayLower = props.item;
      todayLower = todayLower.toLowerCase();
      console.log(todayLower);
      setToday(todayLower);
      if(todayLower in data.lectures){
        setClassData(data.lectures[todayLower])
        setLectureAvailable(true);
      }
      else{
        console.log("no lecture today")
        setLectureAvailable(false)
      }
    }

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(moment().format('HH:mm'));
    }, 60000);

    return () => clearInterval(interval);
  }, [props.item,data]);

  // Function to check if a lecture is ongoing
  const isLectureOngoing = lecture => {
    const startTime = moment(lecture.time, 'HH:mm');
    const endTime = moment(lecture.end_time, 'HH:mm');
    const now = moment(currentTime, 'HH:mm');

    return now.isSameOrAfter(startTime) && now.isBefore(endTime);
  };

  // Function to render different components based on lecture type
  const renderLectureComponent = lecture => {
    if (lecture.lecture_name === 'LUNCH BREAK' || lecture.lecture_name === 'TEA BREAK')
      return <BreakComponent item={lecture} />;
    
    if(lecture.lecture_name.length > 50) {
      return <LongLengthLecture item={lecture} />
    }
    const ongoing = isLectureOngoing(lecture);

    return (
      <View style={{marginBottom: wp(6)}}>
        <View style={{flexDirection: 'row', marginTop: wp(2)}}>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Text
              style={{
                fontFamily: fonts.meduim,
                color: 'black',
                fontSize: wp(4.5),
              }}>
              {lecture.time}
            </Text>
            <Text
              style={{
                fontFamily: fonts.meduim,
                fontSize: wp(4),
                marginTop: wp(-2),
                color: colors.lightGrey,
              }}>
              {lecture.end_time}
            </Text>
          </View>

          <View
            style={{
              marginLeft: wp(4),
              backgroundColor: ongoing ? colors.primary : colors.lightGrey, // Highlight ongoing lecture
              flex: 4,
              padding: wp(4),
              borderRadius: wp(4),
            }}>
            <Text style={{ fontFamily: fonts.semiBold, color: ongoing?colors.white:'black', fontSize: wp(4.5) }}>
              {lecture.lecture_name}
            </Text>


            <View style={{flexDirection:'row'}}>
              <View style={{marginTop:wp(0.4)}}>
              <Image style={{ height: wp(5), width: wp(5),}} source= {ongoing?require("../assets/images/pin_white.png"):require("../assets/images/pin_grey.png")}/>
              <Image
                style={{height: wp(3.5), width: wp(3.5),marginTop:wp(3),marginLeft:wp(0.5)}}
                source={ongoing?require("../assets/images/user-profile-white.png"):require("../assets/images/user-profile-grey.png")}
              />
              </View>

              <View style={{marginLeft:wp(3)}}>
              <Text style={{ color: ongoing?colors.white:'black', fontSize: wp(4), fontFamily: fonts.meduim }}>
                {lecture.venue}
              </Text>
              <Text style={{ color: ongoing?colors.white:'black', fontSize: wp(4), fontFamily: fonts.meduim ,marginTop:wp(0.5) }}>
                {lecture.faculty}
              </Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{marginTop: wp(3), marginHorizontal: wp(6), flex: 1}}>

      {lectureAvailable ? <>
        <ScrollView
        contentContainerStyle={{paddingBottom: wp(20)}}
        showsVerticalScrollIndicator={false}>
        {classData &&
          classData.map((lecture, index) => (
            
            <React.Fragment key={index}>
              {renderLectureComponent(lecture)}
            </React.Fragment>
          ))}
      </ScrollView>
      </> : <>
      <View
          style={{
            backgroundColor: colors.orange,
            flex: 4,
            padding: wp(4),
            borderRadius: wp(4),
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: wp(8.5),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              textTransform:'capitalize',
              color: colors.white,
              fontSize: wp(7),
            }}>
            No Lecture Available
          </Text>
        </View>
      </>}
     
      <View style={{paddingBottom: wp(70)}}></View>
    </View>
  );
};
const LongLengthLecture = props => {
  const[lecture,setLecture] = useState(props.item);

  return (
    <View style={{marginBottom: wp(6)}}>
      <View style={{flexDirection: 'row', marginTop: wp(2)}}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text
            style={{
              fontFamily: fonts.meduim,
              color: 'black',
              fontSize: wp(4.5),
            }}>
            {lecture.time}
          </Text>
          <Text
            style={{
              fontFamily: fonts.meduim,
              fontSize: wp(4),
              marginTop: wp(-2),
              color: colors.lightGrey,
            }}>
            {lecture.end_time}
          </Text>
        </View>

        <View
          style={{
            marginLeft: wp(4),
            backgroundColor: colors.lightGrey,
            flex: 4,
            padding: wp(4),
            borderRadius: wp(4),
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: wp(4),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              textTransform:'capitalize',
              color: colors.text,
              fontSize: wp(4),
            }}>
            {lecture.lecture_name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const BreakComponent = props => {
  const [lecture, setLecture] = useState(props.item);

  return (
    <View style={{marginBottom: wp(6)}}>
      <View style={{flexDirection: 'row', marginTop: wp(2)}}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text
            style={{
              fontFamily: fonts.meduim,
              color: 'black',
              fontSize: wp(4.5),
            }}>
            {lecture.time}
          </Text>
          <Text
            style={{
              fontFamily: fonts.meduim,
              fontSize: wp(4),
              marginTop: wp(-2),
              color: colors.lightGrey,
            }}>
            {lecture.end_time}
          </Text>
        </View>

        <View
          style={{
            marginLeft: wp(4),
            backgroundColor: colors.orange,
            flex: 4,
            padding: wp(4),
            borderRadius: wp(4),
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: wp(8.5),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              textTransform:'capitalize',
              color: colors.white,
              fontSize: wp(7),
            }}>
            {lecture.lecture_name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LectureDetails;

const styles = StyleSheet.create({
  breakContainer: {
    backgroundColor: '#FFD700', // Yellow color for break
    padding: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    marginBottom: wp(4),
  },
  breakText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: 'black',
  },
});
