import axios from 'axios';
import CONSTANTS from '../common/PeertalConstants';


const requestNotification = () => {
  return { type: 'REQUEST_NOTIFICATION_LIST' };
};

export const refreshNotification = (accessToken = '', callbackError) => {
  return dispatch => {
    dispatch(resetNotification());
    const host = CONSTANTS.SERVER_API + 'notification?from=0';
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json'
      }
    };
    return axios.get(host, getConfig)
      .then(response => {
        return dispatch(receiveNotification(response.data.data.users));
      })
      .catch(error => {
        callbackError(error);
        return [];
      });
  };
};

const resetNotification = () => {
  return { type: 'RESET_NOTIFICATION_LIST' };
};

export const fetchNotification = (startX = 0, accessToken = '', callbackError) => {
  return dispatch => {
    dispatch(requestNotification());
    const host = CONSTANTS.SERVER_API + 'notification?limit=10&from=' + startX;
    const getConfig = {
      headers: {
        'access-token': accessToken,
        'Content-Type': 'application/json'
      }
    };
    return axios.get(host, getConfig)
      .then(response => {
        return dispatch(receiveNotification(response.data.data.list));
      })
      .catch(error => {
        callbackError(error);
        return [];
      });
  };
};

const receiveNotification = data => {
  return { type: 'RECEIVE_NOTIFICATION_LIST', data: data };
};
