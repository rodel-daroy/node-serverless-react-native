import { Alert, Dimensions, Linking, Platform } from 'react-native';
import { store } from '../App';
import { alert, errorOutputByMessage } from './CommonMessageHandler';

const countries = [
  { name: 'Vietnam', code: '+84', language: 'Vietnamese' },
  { name: 'Australia', code: '+61', language: 'English' },
  { name: 'China', code: '+86', language: 'Chinese' },
  { name: 'New Zealand', code: '+64', language: 'English' },
  { name: 'United States', code: '+1', language: 'English' },
];
const HIDE_WALLET_FEATURE = 'neither';    // 'ios' or 'android' or 'all' or 'neither'
const CONSTANTS = {
  ButtonTexts: {
    send: 'SEND',
    reward: 'REWARD',
    pincode: 'PIN Code',
    faceId: 'Face ID',
    cancel: 'Cancel',
    scan: 'Scan my face'
  },
  Sizes: {
    header: 56,
    bigTitle: 32,
    title: 24,
    smallTitle: 20,
    buttonText: 20,
    descripton: 16,
    border2: 2,
    border1: 1,
    margin20: 20,
    margin16: 16,
    margin12: 12,
    margin8: 8,
    margin4: 4,
    padding50: 50,
    padding20: 20,
    padding16: 16,
    padding8: 8,
  },
  Colors: {
    white: '#ffffff',
    fontColor: '#414042',
    blurFontColor: '#41404288',
    blue: '#0075FF',
    blurBule: '#0075FF88',
    lightBorderColor: '#cccccc'
  },
  Months: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Opt', 'Nov', 'Dec'
  ],
  HIDE_POSTREWARD_FOR_IOS: false,
  IS_HIDE_WALLET_FEATURE: HIDE_WALLET_FEATURE == 'all' || Platform.OS == HIDE_WALLET_FEATURE ? true : false,
  INCOGNITO_AVATAR: require('../assets/xd/incognito.png'),
  INCOGNITO_BACKGROUND: require('../assets/xd/header/Incognito_header.png'),
  SEND_BIRD: {
    APP_ID: '19DAE590-E41F-4652-B9FF-D0C763C78C5C',
    API_TOKEN: 'be3bd2652bf68c099a9c0130792c1ba67dde31a4',
    API_URL: 'https://api-19DAE590-E41F-4652-B9FF-D0C763C78C5C.sendbird.com',
  },
  GOOGLE_API_KEY: 'AIzaSyCqH6xofkpworUvIQ2Qgpsm_JefqjLxsqY',    // 'AIzaSyAkZBki5wLgZ0rhtjtnGTyvXuvVP5ZZshY' (expired)

  // live
  SERVER_API: 'https://api.kuky.com/',
  STRIPE_KEY: 'pk_live_S8X3MD6014Q3VPWQ4KZZgIHr00aO7wTDle',
  PASSBASE_KEY: 'xDIgLNyRJhIuUxM2X2nJOVWamLVN9qIERpKJXxOjNSkVxjT3aPAjUdOIdvzhZgJN',

  // test
  // SERVER_API: 'https://dev.api.kuky.com/',
  // STRIPE_KEY: 'pk_test_NFqgmMsheCTWWeYrnB1td0F900sj7CUpTm',
  // PASSBASE_KEY: 'eSpULue7LdWxCG8tkrR9G0J3gwD7O6vqGG0pDbKQ4WQkewwokqYzibESY6e3zUmf',

  DEFAULT_AVATAR: 'https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/default-avatar.png',
  DEFAULT_VIDEO_ICON: 'https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/video_player.png',
  DEFAULT_BG: 'https://s3-ap-southeast-2.amazonaws.com/test.kuky.com/media/side_bg.png',
  RANDOM_IMAGE: 'https://picsum.photos/200',
  GENERATE_QR_CODE_API: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=',
  OS: Platform.OS,
  OS_VERSION: Platform.Version,
  HEIGHT: Dimensions.get('window').height,
  WIDTH: Dimensions.get('window').width,
  WIDTH_RATIO: Dimensions.get('window').width / 375,
  PENDING_VERIFICATION_MSG: 'Thank you for submitting your details for verification. We are currently reviewing and will get back to you as soon as we can',
  getTimeDifference: timeDifference,
  MY_SHADOW_STYLE: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
  },
  TOP_SHADOW_STYLE: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  BLUE_BUTTON_SHADOW_STYLE: {
    shadowColor: '#0075FF',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 7,
  },
  SELECT_SHADOW_STYLE: {
    shadowColor: '#0477FF',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 7,
  },
  TOP_PADDING: 23,
  MARGIN_LEFT_FOR_BACK_ICON: (17 * Dimensions.get('window').width) / 375,
  BUTTON_BORDER_RADIUS: 10,
  LOGIN_BUTTON_BORDER_RADIUS: 6,
  CARD_BORDER_RADIUS: 10,
  MY_FOCUSED_BORDER_COLOR: '#414042',
  MY_UNFOCUSED_BORDER_COLOR: '#BCBEC0',
  MY_CANCEL_BORDER_COLOR: '#E1E1E1',
  MY_CANCEL_BG_COLOR: '#F3F4F4',
  MY_BLUE: '#0075FF',
  MY_PURPLE: '#5918E8',
  MY_GRAYBG: '#F3F4F4',
  MY_GREY: '#939598',
  MY_DARK_GREY: '#2F4F4F',
  MY_PINK: '#E657EB',
  MY_HEAD_TITLE_COLOR: '#000000',
  MY_BLACK_BORDER: '#414042',
  MY_FONT_SIZE_NORMAL: 14,
  MY_FONT_SIZE_NORMAL_2: 18,
  MY_FONT_FAMILY_BOLD: 'Montserrat-Bold',
  MY_FONT_FAMILY_SEMIBOLD: 'Montserrat-SemiBold',
  MY_FONT_FAMILY_LIGHT: 'Montserrat-Light',
  MY_FONT_FAMILY_DEFAULT: 'Montserrat-Regular',
  MY_FONT_FAMILY_MEDIUM: 'Montserrat-Medium',
  MY_FONT_HEADER_1_SIZE: 36,
  MY_FONT_HEADER_2_SIZE: 22,
  MY_FONT_HEADER_1_WEIGHT: 200,
  MY_FONT_HEADER_2_WEIGHT: 400,
  CLICK_DELAY: 500,
  CLICK_EFFECT: 'pulse',
  COUNTRY_LIST: countries,
  CARD_LOGOS: {
    visa: require('../assets/xd/Icons/visa.png'),
    mastercard: require('../assets/xd/Icons/mastercard.png'),
    jcb: require('../assets/xd/Icons/jcb.png'),
    maestro: require('../assets/xd/Icons/mastertro.png'),
    discover: require('../assets/xd/Icons/Discover.png'),
    'american-express': require('../assets/xd/Icons/american-express.png'),
  },
  SPARE_HEADER: (Dimensions.get('window').height == 812 || Dimensions.get('window').height == 844 || Dimensions.get('window').height == 896 || Dimensions.get('window').height == 926) && Platform.OS == 'ios' ? 44 : 22,
  SPARE_FOOTER: (Dimensions.get('window').height == 812 || Dimensions.get('window').height == 844 || Dimensions.get('window').height == 896 || Dimensions.get('window').height == 926) && Platform.OS == 'ios' ? 34 : 0,
  renderListPeople: (people) => {
    let result = '';
    if (people.length == 0) {
      return 'Nobody';
    }
    if (people.length > 0) {
      people.forEach((element, index) => {
        if (index < 2 && index != people.length - 1) {
          result = result + element + ', ';
        }
        if (index < 2 && index == people.length - 1) {
          result = result + element + ' ';
        }
        if (index === 2) {
          result = result + 'and ' + (people.length - 2).toString() + ' others';
        }
      });
    }
    return result;
  },
  DEFAULT_ERROR_CALL_BACK: (err) => {
    const state = store.getState();   // connect to global store of redux
    if (err.response) {
      alert(err.response.data.message);
      if (err.response.data.status === 403) {
        // need to go to login if 403
        store.dispatch({ type: 'USER_LOGOUT' });
        store.dispatch({ type: 'LOGOUT_MENU' });
        state.user.reactNavigation.navigate('Welcome');
      }
    } else if (err.message == 'User denied access to location services.') {
      store.dispatch({
        type: 'UPDATE_HAVELOCATION_PROPS',
        data: {
          haveLocation: false,
        },
      });
      Alert.alert(
        'Uh-oh',
        'Without permission to access to your location, the app funtionality will be limited.',
        [
          {
            text: 'Go to settings',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              const state = store.getState();
              state.user.reactNavigation.navigate('Discover');
              store.dispatch({
                type: 'SELECT_SORT_TYPE',
                data: {
                  sortType: 'TIMELINE',
                },
              });
            },
          },
        ],
      );
    } else if (err.message == 'Unable to fetch location within 10.0s.') {
    } else {
      const errorMessage = errorOutputByMessage(err.message);
      errorMessage == false ? alert('General error : ' + err.message) : alert(errorMessage);
    }
  },
  GENERATE_RANDOM: (max) => Math.floor(Math.random() * Math.floor(max)),
  replaceAll: (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
  },
};
export default CONSTANTS;

function timeDifference(previous, currentTime = Date.now()) {
  current = currentTime;
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;
  let elapsed;
  if (Number.isInteger(previous)) {
    elapsed = current - previous;
  } else {
    elapsed = current - Date.parse(previous);
  }

  if (elapsed < msPerMinute) {
    return 'now';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' ' + (Math.round(elapsed / msPerMinute) == 1 ? "min" : "mins");
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' ' + (Math.round(elapsed / msPerHour) == 1 ? "hour" : "hours");
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' ' + (Math.round(elapsed / msPerDay) == 1 ? "day" : "days");
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' ' + (Math.round(elapsed / msPerMonth) == 1 ? "month" : "months");
  } else {
    return Math.round(elapsed / msPerYear) + ' ' + (Math.round(elapsed / msPerYear) == 1 ? "year" : "years");
  }
}


export const SIZES = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  header: 56,
  size_64: 64,
  size_56: 56,
  size_50: 50,
  size_48: 48,
  size_44: 44,
  size_40: 40,
  size_36: 36,
  size_32: 32,
  size_28: 28,
  size_24: 24,
  size_20: 20,
  size_18: 18,
  size_16: 16,
  size_14: 14,
  size_12: 12,
  size_10: 10,
  size_8: 8,
  size_6: 6,
  size_4: 4,
  size_2: 2,
  size_1: 1,
  font_32: 32,
  font_28: 28,
  font_24: 24,
  font_20: 20,
  font_18: 18,
  font_16: 16,
  font_14: 14,
  font_12: 12,
  font_10: 10
}

export const COLORS = {
  white: '#ffffff',
  black: '#000000',
  blue: '#0075FF',
  darkGrey: '#2F4F4F',
  fontColor: '#414042',
  blurFontColor: '#41404288',
  blurBule: '#0075FF88',
  lightBorderColor: '#cccccc',
  focusedBorder: '#414042',
  unFocusedBorder: '#BCBEC0'
}

export const TEXTS = {
  send: 'SEND',
  reward: 'REWARD',
  pincode: 'PIN Code',
  faceId: 'Face ID',
  cancel: 'Cancel',
  scan: 'Scan my face'
}

