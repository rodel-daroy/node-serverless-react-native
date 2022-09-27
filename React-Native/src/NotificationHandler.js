import messaging from '@react-native-firebase/messaging';


const NotificationHandler = async () => {
  await requestUserPermission();

  messaging().setBackgroundMessageHandler(async remoteMessage => { });

  messaging().onNotificationOpenedApp(remoteMessage => { });

  messaging().getInitialNotification().then(remoteMessage => { });
}

async function requestUserPermission() {

  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken()
  }
}

const getFcmToken = async () => {
  let fcmToken = await messaging().getToken();
}

export default NotificationHandler;
