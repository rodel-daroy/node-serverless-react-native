import { ThemeProvider } from '@emotion/react';
import notifee from '@notifee/react-native';
import storage from '@react-native-community/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import React, { Component } from 'react';
import { AppState, Linking, LogBox } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { withIAPContext } from 'react-native-iap';
import { createAppContainer } from 'react-navigation';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';

import RootStack from './common/RootStack';
import OverlayLoading from './components/CoreUIComponents/OverlayLoading';
import GlobalContext from './context/GlobalContext';
import navigationService from './NavigationService';
import RootReducer from './reducers';
import theme from './theme';


// LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'new NativeEventEmitter']);

const StackContainer = createAppContainer(RootStack);

const BLACKLIST = Platform.OS === 'ios' ? ['posts', 'people'/* , 'user' */] : ['posts', 'people'];
const persistConfig = {
  key: 'root',
  storage,
  blacklist: BLACKLIST
};
const persistedReducer = persistReducer(persistConfig, RootReducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);


export class App extends Component {

  state = { appState: AppState.currentState };

  componentDidMount() {

    crashlytics().setCrashlyticsCollectionEnabled(true);
    Linking.addEventListener('url', this.handleDeepLink);

    this.appStateSubscription = AppState.addEventListener('change', nextAppState => {
      let loginStatus = store.getState().user.loggedStatus;
      // this.checkSensorAvailable();
      if (loginStatus === 'logged') {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          // this.biometricAuthenticate();
          // navigationService.navigateAndReset('LandingPincode');
        } else {
          FingerprintScanner.release();
        }
      }
      this.setState({ appState: nextAppState });
    });

    messaging().onMessage(async remoteMessage => {
      this.displayNotification(remoteMessage.notification);
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleDeepLink);
    FingerprintScanner.release();
  }

  checkSensorAvailable() {
    FingerprintScanner.isSensorAvailable().then(() => { }).catch(() => { });
  }

  biometricAuthenticate() {
    FingerprintScanner.authenticate({ title: 'Log in with Biometrics' })
      .then(() => { })
      .catch((err) => {
        if (err.name === 'UserCancel') {
          store.dispatch({ type: 'USER_LOGOUT' });
          store.dispatch({ type: 'LOGOUT_MENU' });
        }
      });
  }

  handleDeepLink(e) {
    const linkRoute = e.url.replace(/.*?:\/\//g, '');
    if (linkRoute.includes('loginCode')) {
      let rawParams = linkRoute.split('/')[1];
      let stringParams = rawParams.split('&');
      let josnParams = {};
      for (let param of stringParams) {
        josnParams[param.split('=')[0]] = param.split('=')[1];
      }
      navigationService.navigateAndReset('ActivationCode', {
        loginId: josnParams.email,
        type: 'email',
        loginCode: josnParams.loginCode
      });
    }
  }

  displayNotification = async (notification) => {

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher'
      },
    });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<OverlayLoading />} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <GlobalContext>
              <StackContainer ref={(navigationRef) => navigationService.setNavigator(navigationRef)} />
            </GlobalContext>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default withIAPContext(App);
