// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
// import moment from 'moment';
// import LectureDetails from '../../screens/LectureDetails';
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
//   } from 'react-native-responsive-screen';
// import { colors,fonts } from '../../assets/constants';


// const CustomCalendar = () => {
//   const [selectedDate, setSelectedDate] = useState(moment()); // Default to today
//   const flatListRef = useRef(null);

//   // Generate dates from previous 30 days to next 30 days
//   const generateDates = () => {
//     let dates = [];
//     for (let i = -30; i <= 30; i++) {
//       dates.push(moment().add(i, 'days')); // Generate dates dynamically
//     }
//     return dates;
//   };

//   const dates = generateDates();
//   const todayIndex = dates.findIndex(date => date.isSame(moment(), 'day'));

//   useEffect(() => {
//     // Scroll to today's date when the component mounts
//     if (flatListRef.current) {
//       setTimeout(() => {
//         flatListRef.current.scrollToIndex({ index: todayIndex, animated: true });
//       }, 100);
//     }
//   }, []);

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     console.log('Selected Day:', date.format('dddd')); // Logs the selected day (e.g., Monday)
//   };

//   return (
//     <View style={styles.container}>
//       {/* Horizontal Scrollable Date List */}
      
//       <FlatList
//         ref={flatListRef}
//         data={dates}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item, index) => index.toString()}
//         initialScrollIndex={todayIndex} // Ensures today is visible on first render
//         getItemLayout={(data, index) => ({
//           length: 70, // Width of each item
//           offset: 70 * index,
//           index,
//         })}
//         renderItem={({ item }) => {
//           const isSelected = item.isSame(selectedDate, 'day');
//           return (
//             <TouchableOpacity onPress={() => handleDateSelect(item)} >  

//                 <View style={[
//                 styles.dateContainer,
//                 isSelected && styles.selectedDateContainer, // Apply purple background when selected
//               ]}>
//                     <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
//                     {item.format('ddd')} {/* Show short day name (Mon, Tue) */}

//                     </Text >
//                     <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
//                     {item.format('DD')} {/* Show day number */}
//                     </Text>
//                 </View>
              
              
//             </TouchableOpacity>
//           );
//         }}
//       />

//       {/* Show Selected Day Name */}
//       <View style={{marginTop: wp(3), marginHorizontal: wp(6), flexDirection:'row'}}>
//               <Text style={{fontFamily: fonts.meduim, color: colors.lightGrey}}>
//                 Time
//               </Text>
//               <Text
//                 style={{
//                   fontFamily: fonts.meduim,
//                   marginLeft: wp(11),
//                   color: colors.lightGrey,
//                 }}>
//                 Lectures
//               </Text>
//       </View>
//       <ScrollView>
//         <LectureDetails item={selectedDate.format('dddd')}/>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       marginTop:wp(10),
//       backgroundColor: '#f5f5f5',
//     },
//     dateContainer: {
//       marginHorizontal:wp(3),
//       justifyContent:'center',
//       alignItems:"center",
//       padding:wp(2)
//     },
//     selectedDateContainer: {
//       backgroundColor: colors.primary, // Selected date background
//       borderRadius: wp(2), // Keep it rectangular
//     },
//     dateText: {
//       fontSize: 18,
//       color: 'black',
//       fontFamily:fonts.meduim,
      
//     },
//     dayText: {
//       fontSize: 14,
//       color:colors.grey,
//       fontFamily:fonts.semiBold
//     },
//     selectedDateText: {
//       color:colors.white, // Selected date text color
//     },
//     selectedDayText: {
//       marginTop: 20,
//       fontSize: 18,
//       fontWeight: 'bold',
//       textAlign: 'center',
//     },
//   });
  

// export default CustomCalendar;


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';
import LectureDetails from '../../screens/LectureDetails';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors, fonts ,todayTime} from '../../assets/constants';

const ITEM_WIDTH = wp(15); // Adjust this width as needed

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const flatListRef = useRef(null);
  const [isFlatListReady, setIsFlatListReady] = useState(false);
  const [timming,setTimming] = useState(todayTime)

  const generateDates = () => {
    let dates = [];
    for (let i = -30; i <= 30; i++) {
      dates.push(moment().add(i, 'days'));
    }
    return dates;
  };

  const dates = generateDates();
  const todayIndex = dates.findIndex(date => date.isSame(moment(), 'day'));

  useEffect(() => {
    if (isFlatListReady && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: todayIndex,
        animated: true,
        viewPosition: 0.5, // Centers the selected date
      });
    }

  }, [isFlatListReady]);



  const handleDateSelect = (date, index) => {
    setSelectedDate(date);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // Centers the selected date
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',marginHorizontal:wp(5),alignItems:'center'}}>

      <View style={{}}>
        <Text style={{fontFamily:fonts.semiBold,fontSize:wp(12),color:colors.primary}}>
        {timming.day}
      </Text>
        </View>
    
      <View style={{marginTop:wp(-2),marginLeft:wp(2)}}>
      <Text style={{fontFamily:fonts.meduim,marginBottom:wp(-1),color:colors.orange}} >
        {timming.todayName}
      </Text>
      <Text style={{fontFamily:fonts.meduim,color:colors.orange}} >
        {timming.month} {timming.year}
      </Text>
      </View>

      </View>
      <View style={{marginTop:wp(-2),marginHorizontal:wp(6)}}>

      <FlatList
        ref={flatListRef}
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        initialScrollIndex={todayIndex}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onLayout={() => setIsFlatListReady(true)}
        renderItem={({ item, index }) => {
          const isSelected = item.isSame(selectedDate, 'day');
          return (
            <TouchableOpacity onPress={() => handleDateSelect(item, index)} >
              <View style={[styles.dateContainer, isSelected && styles.selectedDateContainer]}>
                <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                  {item.format('ddd')}
                </Text>
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                  {item.format('DD')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
      
      <ScrollView>
        <LectureDetails item={selectedDate.format('dddd')} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:wp(2)
  },
  dateContainer: {
    width: ITEM_WIDTH, // Ensures proper spacing
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(2)
  },
  selectedDateContainer: {
    backgroundColor: colors.primary,
    borderRadius: wp(2),
  },
  dateText: {
    fontSize: 18,
    color: 'black',
    fontFamily: fonts.meduim,
    fontSize:wp(4)
  },
  dayText: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: fonts.semiBold,
    textTransform:'uppercase'
  },
  selectedDateText: {
    color: colors.white,
  },
});

export default CustomCalendar;
