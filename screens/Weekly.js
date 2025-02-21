import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import {colors, fonts } from '../assets/constants';
import CustomCalendar from '../components/store/CustomCalendar';


const Weekly = () => {

      return (
        <CustomCalendar/>
      );
}

export default Weekly

const styles = StyleSheet.create({
    container: { flex: 1 }
  });

//   daySelectionAnimation={{type:'background', duration: 200, borderWidth: 1, borderHighlightColor: 'white',highlightColor:'green'}}
