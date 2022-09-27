import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geolocation1 from 'react-native-geolocation-service';
import axios from 'axios';
import CONSTANTS from '../common/PeertalConstants';
import ContactObject from '../models/ContactObject';

export const getPageInfo = (
  pageCode = 'about',
  callBackSuccess,
  callBackError,
) => {
  const serverHost = CONSTANTS.SERVER_API + 'page/' + pageCode;
  axios.get(serverHost)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};

export const getLocationAtDiscover = (
  callBackSuccess,
  callBackError = () => { },
  options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 10000
  }
) => {
  if (CONSTANTS.OS == 'android') {
    PermissionsAndroid.requestMultiple(['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION'])
      .then(() => {
        Geolocation1.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
        // navigator.geolocation.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
      })
      .catch(e => callBackError(e));
  } else {
    Geolocation.setRNConfiguration({ authorizationLevel : "whenInUse" });
    Geolocation.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
  }
};

export const getCurrentLocation = (
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
  options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 10000
  }
) => {
  if (CONSTANTS.OS == 'android') {
    PermissionsAndroid.requestMultiple(['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION'])
      .then(() => {
        Geolocation1.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
      })
      .catch(e => callBackError(e));
  } else {
    Geolocation.setRNConfiguration({ authorizationLevel : "whenInUse" });
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(position => callBackSuccess(position), callBackError, options);
  }
};
export const getLocationPermission = async () => {
  if (CONSTANTS.OS == 'android') {
    return await PermissionsAndroid.requestMultiple(['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION']);
  } else {
    return await navigator.geolocation.requestAuthorization();
  }
};

export const getAddressFromLocation = (
  lat,
  long,
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
  const serverHost = 'https://maps.googleapis.com/maps/api/geocode/json?';
  const host = serverHost + 'key=' + CONSTANTS.GOOGLE_API_KEY + '&latlng=' + lat + ',' + long;
  axios.get(host)
    .then(res => {
      if (res.data.status == 'OK') callBackSuccess(res);
      else {
        callBackError(res);
      }
    })
    .catch(err => {
      callBackError(err);
    });
};

export const reportAProblem = (
  accessToken,
  contactData = new ContactObject(),
  callBackSuccess,
  callBackError = CONSTANTS.DEFAULT_ERROR_CALL_BACK,
) => {
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      'access-token': accessToken,
    },
  };
  axios.post(CONSTANTS.SERVER_API + 'contact', contactData, postConfig)
    .then(res => callBackSuccess(res))
    .catch(err => callBackError(err));
};
