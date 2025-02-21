// import { AppRegistry, Platform, PermissionsAndroid } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance } from '@notifee/react-native';

// // ✅ Request Notification Permission (Android 13+)
// async function requestNotificationPermission() {
//   if (Platform.OS === 'android' && Platform.Version >= 33) {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//     );
//     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('❌ Notification permission denied');
//     }
//   }
// }

// // ✅ Create Notification Channels
// async function setupNotifications() {
//   await notifee.createChannel({
//     id: 'high_importance_channel',
//     name: 'High Importance Notifications',
//     importance: AndroidImportance.HIGH, // 🔥 Ensures Heads-Up Notification
//     sound: 'default',
//   });

//   console.log('✅ Notification channel created');
// }

// // ✅ Start Foreground Service
// async function startForegroundService() {
//   if (Platform.OS !== 'android') return;

//   console.log("🚀 Starting foreground service...");

//   await notifee.createChannel({
//     id: 'foreground_service',
//     name: 'Foreground Service',
//     importance: AndroidImportance.HIGH,
//   });

//   // Start the foreground service
//   NativeModules.HeadlessJsTaskService.startService();
// }



// // ✅ Display Notification in All States (Foreground, Background, Killed)
// async function displayLocalNotification(remoteMessage) {
//   if (!remoteMessage?.data) return;

//   await notifee.displayNotification({
//     title: remoteMessage.data.title,
//     body: remoteMessage.data.body,
//     android: {
//       channelId: 'high_importance_channel',
//       importance: AndroidImportance.HIGH, // 🔥 Ensures Heads-Up Notification
//       sound: 'default',
//       pressAction: { id: 'default' },
//       bigText: remoteMessage.data.body, // Expandable notification
//     },
//   });


  
// }

// // ✅ Handle Background/Killed Notifications
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('📩 Background Message:', remoteMessage);
  
//   if (remoteMessage?.data) {  // ✅ Only handle `data` payload
//     await notifee.displayNotification({
//       title: remoteMessage.data.title,
//       body: remoteMessage.data.body,
//       android: {
//         channelId: remoteMessage.data.channelId || "high_importance_channel",
//         importance: AndroidImportance.HIGH,  // 🔥 Heads-Up Notification
//         sound: 'default',
//         pressAction: { id: 'default' },
//         bigText: remoteMessage.data.body, // Expandable notification
//       },
//     });
//   }
// });




// // ✅ Handle Notifications When the App is Opened from a Killed State
// messaging()
//   .getInitialNotification()
//   .then(remoteMessage => {
//     if (remoteMessage) {
//       console.log('📌 Opened from killed state:', remoteMessage);
//     }
//   });

// // ✅ Handle When a Notification is Tapped While the App is in Background
// messaging().onNotificationOpenedApp(remoteMessage => {
//   console.log('📌 Opened from background:', remoteMessage);
// });

// // ✅ Run Setup Functions
// setupNotifications();
// requestNotificationPermission();
// startForegroundService(); // 🔥 Keeps notifications working

// AppRegistry.registerComponent(appName, () => App);




import { AppRegistry, Platform, PermissionsAndroid, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

// ✅ Request Notification Permission (Android 13+)
async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('❌ Notification permission denied');
    }
  }
}

// ✅ Create Notification Channels
async function setupNotifications() {
  await notifee.createChannel({
    id: 'high_importance_channel',
    name: 'High Importance Notifications',
    importance: AndroidImportance.HIGH, // 🔥 Ensures Heads-Up Notification
    sound: 'default',
  });

  console.log('✅ Notification channel created');
}

// ✅ Start Foreground Service
async function startForegroundService() {
  if (Platform.OS !== 'android') return;

  console.log("🚀 Starting foreground service...");

  await notifee.createChannel({
    id: 'foreground_service',
    name: 'Foreground Service',
    importance: AndroidImportance.HIGH,
  });

  // Start the foreground service (if required)
  if (NativeModules.HeadlessJsTaskService) {
    NativeModules.HeadlessJsTaskService.startService();
  }
}

// ✅ Display Notification (Foreground, Background, Killed)
async function displayLocalNotification(remoteMessage) {
  if (!remoteMessage?.data) return;

  await notifee.displayNotification({
    title: remoteMessage.data.title,
    body: remoteMessage.data.body,
    android: {
      channelId: 'high_importance_channel',
      importance: AndroidImportance.HIGH, // 🔥 Heads-Up Notification
      sound: 'default',
      pressAction: { id: 'default' },
      style: {
        type: AndroidStyle.BIGTEXT, // ✅ Expandable Notification
        text: remoteMessage.data.body,
      },
    },
  });
}

// ✅ Handle Background/Killed Notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);
  
  if (remoteMessage?.data) {
    await notifee.displayNotification({
      title: remoteMessage.data.title,
      body: remoteMessage.data.body,
      android: {
        channelId: remoteMessage.data.channelId || "high_importance_channel",
        importance: AndroidImportance.HIGH,
        sound: 'default',
        pressAction: { id: 'default' },
        style: {
          type: AndroidStyle.BIGTEXT,
          text: remoteMessage.data.body,
        },
      },
    });
  }
});

// ✅ Handle Notification Click (When the App is Killed & Opened)
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('📌 Opened from killed state:', remoteMessage);
    }
  });

// ✅ Handle When a Notification is Tapped (App in Background)
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('📌 Opened from background:', remoteMessage);
});

// ✅ Listen for Foreground Notifications
messaging().onMessage(async remoteMessage => {
  console.log('📩 Foreground Message:', remoteMessage);
  displayLocalNotification(remoteMessage);
});

// ✅ Run Setup Functions
setupNotifications();
requestNotificationPermission();
startForegroundService(); // 🔥 Keeps notifications working

AppRegistry.registerComponent(appName, () => App);
