import { Button, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';
import useAuthStore from '../components/store/useAuthStore';
import useLectureStore from '../components/store/useLectureStore';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';

const renderItem = (item) => {
  return (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );
};

const SelectClass = () => {
  const [classNames, setClassNames] = useState([]);
  const [value, setValue] = useState(null);
  const user = useAuthStore((state) => state.user);
  const { setClassName, className } = useLectureStore();
  const [batch, setBatch] = useState("");
  const navigation = useNavigation();
  const [next,setNext] = useState(false)
  // Fetch batch names from Firestore and sort them alphabetically



  async function getToken(){
  
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('in login ',token);
    return token;
  }

  const fetchBatchesName = async () => {
    try {
      const snapshot = await firestore().collection('test10').get();
      const documentNames = snapshot.docs
        .map(doc => ({
          label: doc.id,
          value: doc.id
        }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

      console.log('Document Names:', documentNames);
      setClassNames(documentNames);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updateClass = async (selectedClass) => {
    try {
      await firestore().collection('Users').doc(user.data.user.email)
        .update({ class: selectedClass })
        .then(() => {
          console.log('User updated!');
          // navigation.navigate("Home");
          setNext(true);
        });

        const token = await getToken();
        
        await firestore().collection("test10").doc(selectedClass)
        .update({
         deviceTokens: firestore.FieldValue.arrayUnion(token),
       });
       console.log('token updated')


    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const forNavigation= ()=>{
    navigation.navigate("NavigatewithTabs");
  }

  useEffect(() => {
    fetchBatchesName();
    setBatch(className);
  }, [className]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white',flex:1 }}>
      <View style={{ marginHorizontal: wp(5), backgroundColor: 'white' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{ height: wp(100 / 1.3), width: wp(100 / 1.3), marginTop: wp(7) }}
            source={require('../assets/images/select_screen_bg.png')}
          />
        </View>

        <View>
          <Text style={styles.title}>Select class</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={classNames} // Use sorted data
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select your class"
            searchPlaceholder="Search"
            value={value}
            renderItem={renderItem}
            onChange={async item => {
              setValue(item.value);
              await updateClass(item.value);
              setClassName(item.value);
            }}
          />
        </View>
        {
          next?
          <>
          <TouchableOpacity onPress={forNavigation}>
            <View style={{backgroundColor:'#392AAB',justifyContent:"center",padding:wp(3.5),borderRadius:wp(10),marginTop:hp(20)}}>
              <Text style={{fontSize:wp(3.5),color:'white',textAlign:'center',fontFamily:'Poppins-Medium'}}>
                NEXT
              </Text>
            </View>
          </TouchableOpacity>
         
          </>:
          <>
             <TouchableOpacity>
            <View style={{backgroundColor:'#392AAB',justifyContent:"center",padding:wp(3.5),borderRadius:wp(10),marginTop:hp(20),opacity:0.5}}>
              <Text style={{fontSize:wp(3.5),color:'white',textAlign:'center',fontFamily:'Poppins-Medium'}}>
                NEXT
              </Text>
            </View>
          </TouchableOpacity>
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default SelectClass;

const styles = StyleSheet.create({
  title: {
    fontSize: wp(8),
    fontFamily: 'Poppins-Bold',
    color: '#392AAB',
  },
  item: {
    padding:10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  dropdown: {
    marginTop:wp(2),
    height: hp(6),
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'gray',
    fontFamily: 'Poppins-Regular',

  },
  placeholderStyle: {
    fontSize: wp(3.5),
    color: 'gray',
    fontFamily: 'Poppins-Regular',

  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  inputSearchStyle: {
  
    fontSize: 12,
    textAlignVertical:'center',
    borderRadius: 10,
    color: 'black',
    fontFamily: 'Poppins-Regular',

  },
  text: {
    color: 'black',
    fontSize: wp(4),
    marginTop: 10,
    
  },
  emailText: {
    color: 'black',
    fontSize: wp(4),
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  textItem: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular', // Apply font to dropdown items
    color: 'black',
    marginLeft:wp(2)
  },
});
