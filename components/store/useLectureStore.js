import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const getInternetStatus = async () => {
  try {
    const status = await NetInfo.fetch();
    return status.isInternetReachable ?? false;
    console.log(); // Use `?? false` to handle undefined values
  } catch (error) {
    console.error('Error fetching internet status:', error);
    return false;
  }
};

const useLectureStore = create(
  persist(
    (set, get) => ({
      className: null,
      data: null,
      isInitialized: false,

      setInitialized: () => set({isInitialized: true}),

      setData: async () => {
        const internetStatus = await getInternetStatus();
        const classNames = get().className;

        if (internetStatus && classNames != null) {
          await firestore()
            .collection('test10')
            .doc(classNames)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
                console.log('🔥 Data fetched from Firestore:', documentSnapshot.data(),'of this class',classNames);
                // console.log(
                //   '🔥 Data fetched from Firestore:',
                //   JSON.stringify(documentSnapshot.data(), null, 2),
                //   'of this class:',
                //   classNames,
                // );
                set({data: documentSnapshot.data()});
                set({className: classNames});
              }
            });
        } else {
          console.log('classname Is empty');
        }
      },
      logout: () => {
        set({data: null, className: null});
      },

      setClassName: async name => {
        const classNames = get().className;

        if (classNames) {
          async function unsubscribe() {
            await messaging()
              .unsubscribeFromTopic(classNames)
              .then(() =>
                console.log('Unsubscribed fom the topic!', classNames),
              );
          }
          unsubscribe();
        }

        set({className: name});

        try {
            await messaging()
              .subscribeToTopic(name)
              .then(() => console.log('Subscribed to topic!',name));
          
        } catch (error){
            console.log(error)
        }

        console.log('class updated in store to : ', name);
        get().setData(name); // ✅ Fetch data when className updates
      },

    setClassThroughLogin :  async name =>{
        set({className:name});
        get().setData(name);

        await messaging()
        .subscribeToTopic(name)
        .then(() => console.log('Subscribed to topic!',name));

        console.log('class updated in store to : ', name);
    },
    }),
    {
      name: 'user-lecture-data',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          setTimeout(() => {
            state.setInitialized();
            state.setData(); // ✅ Fetch data after rehydration
          }, 0);
        }
      },
    },
  ),
);

export default useLectureStore;
