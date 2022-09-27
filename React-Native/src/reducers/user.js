import CONSTANTS from '../common/PeertalConstants';
import Settings from '../models/SettingsObject';
import FilterFriendsSettings from '../models/FilterFriendsSetting';

const _fullName = 'Guest';
const _email = 'Guest@email.com';
const _phoneNumber = '';
const _loggedMethod = 'email';
const _loggedStatus = 'guest';
const _isLoading = 'false';
const _avatar = CONSTANTS.DEFAULT_AVATAR;
const _photoFile = '';
const _registerStatus = 'NOT_STARTED';
const _accessToken = 'b7ec648b3faed30fc12051ef98703600';
const _deviceFirebaseToken = '';
const guestUser = {
  userId: 0,
  fullName: 'Guest',
  email: 'Guest@email.com',
  phoneNumber: '',
  loggedMethod: 'email',
  loggedStatus: 'guest',
  isLoading: 'false',
  avatarUrl: CONSTANTS.DEFAULT_AVATAR,
  backgroundUrl: CONSTANTS.DEFAULT_BG,
  photoFile: '',
  registerStatus: 'NOT_STARTED',
  accessToken: 'MTU1NTE1NDQ2MQ==NEAxNTU1MTU0NDYxQC1rdWt5+kuky2019===',
  deviceFirebaseToken: 'preset_firebase',
  score: 4,
  longitude: 174.7835969, // for now, this data is also used for confirming if a user has logged-in before. If not, user.location will be 'null'.
  latitude: -41.2333075,
  settings: new Settings(),
  filterFriends: new FilterFriendsSettings(),
  reactNavigation: null,
  haveLocation: false,
  incognitoMode: false,
  identityStatus: 'unverified',
  // appleSignInUser: {
  //   user: null,
  //   email: null,
  //   fullName: null,
  // },
};
const user = (state = guestUser, action) => {
  switch (action.type) {
    case 'UPDATE_INCOGNITOMODE_PROPS':
      return { ...state, incognitoMode: action.data.incognitoMode };
    case 'UPDATE_IDENTITY_STATUS_PROPS':
      return { ...state, identityStatus: action.data.identityStatus };
    case 'UPDATE_IDENTITY_KEY_PROPS':
      return { ...state, identityAccessKey: action.data.identityAccessKey };
    case 'UPDATE_HAVELOCATION_PROPS':
      return { ...state, haveLocation: action.data.haveLocation };
    case 'UPDATE_REACT_NAVIGATION_PROPS':
      return { ...state, reactNavigation: action.data.navigation };
    case 'GET_DEVICE_TOKEN':
      return { ...state, deviceFirebaseToken: action.data.deviceFirebaseToken };
    case 'USER_RECEIVE_LOG_IN_SUCCESSFULLY': {
      return {
        ...state,
        userId: action.data.user_data.id,
        accessToken: action.data.accessToken,
        email: action.data.email,
        loggedStatus: 'logged',
        score: action.data.user_data.score,
        fullName: action.data.user_data.fullName,
        occupation: action.data.user_data.occupation,
        avatarUrl: action.data.user_data.avatarUrl || CONSTANTS.DEFAULT_AVATAR,
        backgroundUrl:
          action.data.settings.backgroundUrl || CONSTANTS.RANDOM_IMAGE,
        settings: action.data.settings,
      };
    }
    case 'INIT_USER_DATA': {
      if (action.data.user_data) {
        return {
          ...state,
          accessToken: action.data.accessToken,
          email: action.data.user_data.email,
          loggedStatus: 'logged',
          phoneNumber: '0123453443',
          score: action.data.user_data.score,
          fullName: action.data.user_data.name,
          avatarUrl: action.data.user_data.avatar,
        };
      } else {
        return state;
      }
    }
    case 'UPDATE_LONG_LAT': {
      // alert(action.data.longitude + " " + action.data.latitude);
      return {
        ...state,
        longitude: action.data.longitude,
        latitude: action.data.latitude,
      };
    }
    case 'UPDATE_APPLE_SIGN_IN': {
      // alert(action.data.longitude + " " + action.data.latitude);
      return {
        ...state,
        appleSignInUser: action.data,
      };
    }
    case 'USER_LOGOUT': {
      return { ...state, ...guestUser };
    }
    case 'USER_SET_EMAIL': {
      return {
        ...state,
        email: action.data.email,
      };
    }
    case 'RECEIVE_LOGIN':
      return {
        ...state,
        fullName: action.data.full_name,
        avatarLink: action.data.avatar,
        loggedStatus: 'authenticated',
        isLoading: false,
      };
    case 'REGISTER_USER_VIA_EMAIL':
      return {
        ...state,
        fullName: action.data.fullName,
        email: action.data.email,
        photoFile: action.data.photoFile,
        registerStatus: 'IN_PROGRESS',
      };
    case 'REQUEST_REGISTER_USER_VIA_EMAIL':
      return { ...state, isLoading: true };
    case 'UPDATE_MY_SETTINGS':
      return {
        ...state,
        ...action.data,
      };
    case 'UPDATE_FILTER_FRIENDS_SETTINGS':
      return {
        ...state,
        filterFriends: action.data,
      };
    case 'RECEIVE_REGISGER_USER_VIA_EMAIL': {
      return {
        ...state,
        isLoading: false,
        registerStatus: action.data.registerStatus,
      };
    }
    default:
      return state;
  }
};
export default user;
