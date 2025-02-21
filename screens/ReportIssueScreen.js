// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import firestore from '@react-native-firebase/firestore';
// import { colors, fonts } from '../assets/constants';
// import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const SUPABASE_URL = 'https://lywslcxfskqukzvrvhoi.supabase.co';
// const SUPABASE_BUCKET = 'app_downloading';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3NsY3hmc2txdWt6dnJ2aG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTAzNjA3MywiZXhwIjoyMDU0NjEyMDczfQ.Kw1H2Sq3cdHJqEP9Mnz49a-FJQIFs4J0hTVf2hbVCX0'; // Replace with your actual anon key

// const ReportIssueScreen = () => {
//   const [description, setDescription] = useState('');
//   const [subject, setSubject] = useState('');
//   const [screenshotUri, setScreenshotUri] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [loading, setLoading] = useState(false);  

//   const selectImage = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
//       if (response.didCancel) return;
//       if (response.assets) {
//         setScreenshotUri(response.assets[0].uri); // Get image URI
//       }
//     });
//   };

//   const uploadToSupabase = async (fileUri) => {
//     if (!fileUri) return null;
    
//     const fileName = `screenshot_${Date.now()}.jpg`;

//     try {
//       const file = {
//         uri: fileUri,
//         name: fileName,
//         type: 'image/jpeg',
//       };

//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch(
//         `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         console.error('Upload failed:', result);
//         return null;
//       }

//       return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     }
//   };

//   const submitIssue = async () => {
//     if (!description.trim() || rating === 0) {
//       Alert.alert('Error', 'Please enter feedback and select a rating.');
//       return;
//     }

//     setLoading(true);

//     try {
//       let screenshotUrl = null;

//       if (screenshotUri) {
//         screenshotUrl = await uploadToSupabase(screenshotUri);
//         if (!screenshotUrl) throw new Error('Image upload failed.');
//       }

//       const reportData = {
//         description,
//         rating,
//         subject,
//         timestamp: new Date().toISOString(),
//         screenshot: screenshotUrl || null,
//       };

//       await firestore().collection('issues').doc(subject).set(reportData);

//       Alert.alert('Success', 'Your feedback has been submitted.');
//       setDescription('');
//       setScreenshotUri(null);
//       setRating(0);
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }

//     setLoading(false);
//   };

//   return (
//     <View style={{ flex: 1, padding: wp(6), backgroundColor: 'white' }}>
//       <Text style={{ fontFamily: fonts.semiBold, fontSize: wp(5), marginBottom: wp(4) ,color:colors.primary}}>
//         Feedback & Support
//       </Text>

//       <Text style={{ fontFamily: fonts.meduim, fontSize: wp(4), marginBottom: wp(2) ,color:colors.primary}}>Rate Us:</Text>
//       <View style={{ flexDirection: 'row', marginBottom: wp(4) }}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <TouchableOpacity key={star} onPress={() => setRating(star)}>
//             <MaterialIcons
//               name={star <= rating ? 'star' : 'star-border'}
//               size={wp(8)}
//               color={colors.orange}
//             />
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Subject"
//         placeholderTextColor={colors.text}
//         multiline
//         value={subject}
//         onChangeText={setSubject}
//       />

//       <TextInput
//         style={[styles.input, { minHeight: wp(20) ,marginTop:wp(7),}]}
//         placeholder="Describe your issue or feedback..."
//         placeholderTextColor={colors.text}
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       {screenshotUri && (
//         <Text style={{ fontFamily: fonts.meduim, fontSize: wp(4), marginVertical: wp(3), color: colors.primary }}>
//           Screenshot Selected
//         </Text>
//       )}

//       <TouchableOpacity onPress={selectImage} style={styles.button}>
//         <Text style={styles.buttonText}>{screenshotUri ? 'Change Screenshot' : 'Select Screenshot'}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={submitIssue} disabled={loading} style={[styles.button, { backgroundColor: colors.orange }]}>
//         {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Submit Feedback</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     borderColor: colors.lightGrey,
//     borderRadius: wp(2),
//     paddingHorizontal: wp(4),
//     fontFamily: fonts.meduim,
//     fontSize: wp(4),
//     color: colors.text,
//   },
//   button: {
//     marginTop: wp(4),
//     backgroundColor: colors.primary,
//     padding: wp(4),
//     borderRadius: wp(15),
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontFamily: fonts.semiBold,
//     fontSize: wp(4),
//   },
// });

// export default ReportIssueScreen;



import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { colors, fonts } from '../assets/constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SUPABASE_URL = "https://lywslcxfskqukzvrvhoi.supabase.co";
const SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3NsY3hmc2txdWt6dnJ2aG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTAzNjA3MywiZXhwIjoyMDU0NjEyMDczfQ.Kw1H2Sq3cdHJqEP9Mnz49a-FJQIFs4J0hTVf2hbVCX0'; 
const BUCKET_NAME = "app_downloading";

const ReportIssueScreen = () => {
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotUri, setScreenshotUri] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Select image from gallery
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.assets) {
        const imageName = response.assets[0].fileName || `screenshot_${Date.now()}.jpg`;
        setScreenshot(imageName);
        setScreenshotUri(response.assets[0].uri);
      }
    });
  };

  // Upload image to Supabase
  const uploadImageToSupabase = async () => {
    if (!screenshotUri) return null;

    try {
      let fileExt = screenshot.split('.').pop();
      let fileName = `uploads/${Date.now()}.${fileExt}`;

      let formData = new FormData();
      formData.append('file', {
        uri: screenshotUri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      let response = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
    } catch (error) {
      console.error("Supabase Upload Error:", error);
      return null;
    }
  };

  // Submit Issue
  const submitIssue = async () => {
    if (!description.trim() || rating === 0) {
      showModal("Please enter feedback and select a rating.");
      return;
    }
    
    setLoading(true);
    let imageUrl = await uploadImageToSupabase();

    try {
      const reportData = {
        description,
        rating,
        subject,
        timestamp: new Date().toISOString(),
        screenshot: imageUrl || null,
      };

      await firestore().collection('issues').doc(subject).set(reportData);
      showModal("Your feedback has been submitted.");
      setDescription('');
      setScreenshot(null);
      setScreenshotUri(null);
      setRating(0);
    } catch (error) {
      showModal("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // Show modal message
  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback & Support</Text>

      <Text style={styles.label}>Rate Us:</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <MaterialIcons
              name={star <= rating ? 'star' : 'star-border'}
              size={wp(8)}
              color={colors.orange}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Subject"
        placeholderTextColor={colors.text}
        multiline
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { minHeight: wp(20) }]}
        placeholder="Describe your issue or feedback..."
        placeholderTextColor={colors.text}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {screenshot && <Text style={styles.imageName}>Selected Image: {screenshot}</Text>}

      <TouchableOpacity onPress={selectImage} style={styles.button}>
        <Text style={styles.buttonText}>{screenshot ? 'Change Screenshot' : 'Upload Screenshot'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={submitIssue} disabled={loading} style={[styles.button, { backgroundColor: colors.orange }]}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Submit Feedback</Text>}
      </TouchableOpacity>

      {/* Modal for messages */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: wp(6), backgroundColor: 'white' },
  title: { fontFamily: fonts.semiBold, fontSize: wp(5), marginBottom: wp(4) ,color:colors.primary},
  label: { fontFamily: fonts.meduim, fontSize: wp(4), marginBottom: wp(2) ,color:colors.primary},
  starContainer: { flexDirection: 'row', marginBottom: wp(4) },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    fontFamily: fonts.meduim,
    fontSize: wp(4),
    color: colors.text,
    marginBottom: wp(4),
  },
  imageName: { fontFamily: fonts.medium, fontSize: wp(4), marginVertical: wp(3), color: colors.primary },
  button: {
    backgroundColor: colors.primary,
    padding: wp(4),
    borderRadius: wp(10),
    alignItems: 'center',
    marginTop: wp(4),
  },
  buttonText: { color: 'white', fontFamily: fonts.semiBold, fontSize: wp(4) },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: wp(6), borderRadius: wp(2), alignItems: 'center' },
  modalText: { fontSize: wp(4), fontFamily: fonts.meduim, textAlign: 'center',color:colors.primary },
  modalButton: { marginTop: wp(4), backgroundColor: colors.orange, padding: wp(3), borderRadius: wp(2) },
  modalButtonText: { color: 'white', fontSize: wp(4), fontFamily: fonts.semiBold },
});

export default ReportIssueScreen;
