import firebase from '@react-native-firebase/app';
import React, { useEffect, useContext, useCallback, useMemo, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { NativeModules, AppState, Platform } from 'react-native';
import { initStripe } from '@stripe/stripe-react-native';

import { useSetState } from '../../common/Hooks';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {
  getLocationAtDiscover,
  getCurrentLocation,
} from '../../actions/commonActions';
import {
  fetchDiscoverPosts,
  refreshDiscoverPosts,
} from '../../actions/postActions';
import {
  requestToReceivePushPermission,
  goToLink,
  getUserVerification,
  getUserTokenVerification,
  getMaintenance,
  getMySettings,
} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import { DiscoverLoading } from '../../components/CoreUIComponents';
import PostItem from '../../components/PostItem';
import { initChatConnectionToSendBird } from '../../actions/chatActions';
import PostsContext from '../../context/Posts/PostsContext';
import UserContext from '../../context/User/UserContext';
import DiscoverHeader from './DiscoverHeader';
import DiscoverScreen from './DiscoverScreen';

const DEFAULT_STATE = {
  isMounted: false,
  isMaintenance: null,
  maintenanceMessage: '',
};

const DiscoverScreenContainer = (props) => {
  /* useLayoutEffect(() => {
    if (Platform.OS === 'ios') {
      props.dispatch({ type: 'USER_LOGOUT' });
      props.dispatch({ type: 'LOGOUT_MENU' });
    }
  },[]); */

  const [state, setState] = useSetState(DEFAULT_STATE);
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const { hiddenPostId, setCreatedPost } = useContext(PostsContext);
  const {
    haveCheckedLocation,
    setHaveCheckedLocation,
    verificationStatus,
    setVerificationStatus,
  } = useContext(UserContext);

  const handleMaintenance = useCallback(() => {
    getMaintenance(
      props.user.accessToken,
      (res) => {
        setState({ isMaintenance: res.data.data.maintenanceMode, maintenanceMessage: res?.data?.data?.maintenanceMessage ?? '' });
      },
      (err) => console.log(err),
    );
  }, []);

  useEffect(() => {
    handleMaintenance();
  }, []);

  useEffect(() => {
    if (state.isMaintenance) {
      alert({
        title: 'Uh-oh',
        main: state.maintenanceMessage && 'Sorry, we are currently under maintenance. We will be back with new and shiny features shortly.',
        button: [
          {
            text: 'OK',
            onPress: () => {
            },
          }
        ],
      });
    } else {
      alert("");
    }
  }, [state.isMaintenance]);

  const isGuest = useMemo(() => {
    if (props.user.loggedStatus === 'guest') {
      return true;
    } else {
      return false;
    }
  }, [props.user.loggedStatus]);

  const getUserVerificationStatus = useCallback(() => {
    if (isGuest) return;

    getUserVerification(
      props.user.accessToken,
      (res) => {
        res.data.data.length > 0 && setVerificationStatus(res.data.data[res.data.data.length - 1].status);
        !(res.data.data.length > 0) && setVerificationStatus(-1);
      },
      (err) => console.log(err),
    );
  }, [setVerificationStatus, props.user.accessToken, getUserVerification, isGuest]);

  const handleUserVerification = useCallback(() => {
    if (!isGuest) {
      getUserVerificationStatus();
      getUserTokenVerification(
        props.user.accessToken,
        res => {

        },
        err => {
          props.dispatch({ type: 'USER_LOGOUT' });
          props.dispatch({ type: 'LOGOUT_MENU' });
          props.user.reactNavigation.navigate('Welcome');
        }
      )
    }
  }, [isGuest, getUserVerificationStatus]);

  useEffect(() => {
    initStripe({
      publishableKey: CONSTANTS.STRIPE_KEY
    });
    handleUserVerification();
  }, []);

  const _onShow = () => {
    handleUserVerification();
    handleMaintenance();
  };

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
    }

    if (nextAppState === 'active') {
      Platform.OS === 'ios' && widgetDataHandler();
      handleMaintenance();
    }
  };

  useEffect(() => {
    if (haveCheckedLocation === true) {
      return;
    }

    if (props.user.loggedStatus === 'logged' && props.user.haveLocation === false) {
      getCurrentLocation(
        (position) => {
          props.dispatch({
            type: 'UPDATE_LONG_LAT',
            data: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          });
          props.dispatch({
            type: 'UPDATE_HAVELOCATION_PROPS',
            data: {
              haveLocation: true,
            },
          });
        },
        (err) => defaultError(err),
      );
      setHaveCheckedLocation(true);
    }
  }, [props.user.loggedStatus]);

  useEffect(() => {
    props.dispatch({
      type: 'UPDATE_REACT_NAVIGATION_PROPS',
      data: { navigation: props.navigation },
    });
    if (CONSTANTS.OS == 'android') {
      /*
      const channel = new firebase.notifications.Android.Channel(
        'kuky1',
        'kyky app',
        firebase.notifications.Android.Importance.Max,
      ).setDescription('Kuky app channel');
      firebase.notifications().android.createChannel(channel);
      */
    }

    if (props.user.loggedStatus === 'logged') {
      initChatConnectionToSendBird(
        props.user.userId.toString(),
        props.user.fullName,
        props.user.avatarUrl,
        (err) => alert(err),
      );
    }
    /*
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const notification = notificationOpen.notification;
      const data = notification.data;
      goToLink(props.navigation, data.link);
      if (CONSTANTS.OS == 'ios') {
        notification.ios.setBadge(0);
      }
    });
    */

    handleLoadMore();
    requestToReceivePushPermission((err) => alert(err));
    getLocationAtDiscover((position) => {
      props.dispatch({
        type: 'UPDATE_LONG_LAT',
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
      props.dispatch({
        type: 'UPDATE_HAVELOCATION_PROPS',
        data: {
          haveLocation: true,
        },
      });
    });

    AppState.addEventListener('change', _handleAppStateChange);
    setState({ isMounted: true });

    return () => {
      // notificationOpenedListener();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [props.user.loggedStatus]);

  const widgetDataHandler = () => {
    if (props.user.loggedStatus === 'logged') {
      Platform.OS === 'ios' &&
        NativeModules.WidgetHelper.UpdateNote(
          props.user.accessToken.toString(),
        );
    } else {
      Platform.OS === 'ios' &&
        NativeModules.WidgetHelper.UpdateNote('Please login');
    }
  };

  useEffect(() => {
    if (props.user.loggedStatus === 'logged') {
      getMySettings(
        props.user.accessToken,
        props.user.userId,
        res => {
          const settings = res.data.data;
          props.dispatch({
            type: 'UPDATE_MY_SETTINGS',
            data: {
              ...settings,
            },
          });
        }, (err) => console.log("Failed to getting settings", err)
      );
    }
  }, [props.user.userId, props.user.loggedStatus])

  const handleRefreshTimeLine = useCallback(() => {
    if (props.isLoading) {
      return;
    }

    setCreatedPost([]);

    props.dispatch(
      refreshDiscoverPosts(
        props.user.accessToken,
        props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
        props.user.loggedStatus === "logged" ? props.user.over18 : false,
        props.sortType,
        props.user.longitude,
        props.user.latitude,
      ),
    );
  }, [
    props.isLoading,
    props.dispatch,
    refreshDiscoverPosts,
    props.user.accessToken,
    props.sortType,
    props.user.longitude,
    props.user.latitude,
    props.user.loggedStatus,
    props.user.subscribeToAdultContent,
    props.user.over18,
  ]);

  const _renderHeader = useMemo(() => {
    if (props.user.loggedStatus === 'logged') {
      return null;
    }
    return <DiscoverHeader sortType={props.sortType} />;
  }, [DiscoverHeader, props.sortType, props.user.loggedStatus]);

  const _generateKey = useCallback((a, b) => {
    return a.toString() + b.toString();
  }, []);

  const handleLoadMore = useCallback(() => {
    if (props.isLoading == false) {
      setCreatedPost([]);

      props.dispatch(
        fetchDiscoverPosts(
          props.posts.length,
          props.user.accessToken,
          props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
          props.user.loggedStatus === "logged" ? props.user.over18 : false,
          props.posts.sortType,
          props.user.longitude,
          props.user.latitude,
        ),
      );
    }
    return;
  }, [
    props.dispatch,
    fetchDiscoverPosts,
    props.isLoading,
    props.posts.length,
    props.user.accessToken,
    props.posts.sortType,
    props.user.longitude,
    props.user.latitude,
    props.user.loggedStatus,
    props.user.subscribeToAdultContent,
    props.user.over18
  ]);

  const _renderItem = useCallback(({ item, index }) => {
    if (hiddenPostId.some((id) => id == item.id)) {
      return null;
    }

    return props.sortType == 'LOCATION' && !props.user.haveLocation ? (
      <DiscoverLoading isAutoRun={false} />
    ) : (
      <PostItem
        navigation={props.navigation}
        id={item.id}
        data={item}
        key={_generateKey(item.id, index)}
        handleRefreshTimeLine={handleRefreshTimeLine}
      />
    );
  }, [hiddenPostId, props.sortType, props.user.haveLocation, props.navigation]);

  const _keyExtractor = useCallback((item, index) => { return item.id.toString(); }, []);

  if (state.isMounted && !state.isMaintenance) {
    return (
      <DiscoverScreen
        {...props}
        isMounted={state.isMounted}
        handleRefreshTimeLine={handleRefreshTimeLine}
        _renderHeader={_renderHeader}
        handleLoadMore={handleLoadMore}
        _renderItem={_renderItem}
        _keyExtractor={_keyExtractor}
        setPopup={setPopup}
        defaultError={defaultError}
        _onShow={_onShow}
      />
    );
  } else {
    return null;
  }
};

const mapStateToProps = (store) => ({
  posts: store.posts.posts,
  postLen: store.posts.postLen,
  isLoading: store.posts.isLoading,
  sortType: store.posts.sortType,
  user: store.user,
});
const DiscoverScreenContainerWrapper = connect(mapStateToProps)(
  DiscoverScreenContainer,
);
export default DiscoverScreenContainerWrapper;
