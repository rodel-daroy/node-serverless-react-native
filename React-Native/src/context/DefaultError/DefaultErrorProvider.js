import React, { useContext } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';

import { errorOutputByMessage } from '../../common/CommonMessageHandler';
import PopupContext from '../Popup/PopupContext';
import DefaultErrorContext from './DefaultErrorContext';

const DefaultErrorProvider = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const defaultError = (err) => {
    if (Object.keys(err).indexOf('response') > 0) {
      alert({title:"Uh-oh", main: err.response.data.message});
      if (err.response.data.status === 403) {
        props.dispatch({ type: 'USER_LOGOUT' });
        props.dispatch({ type: 'LOGOUT_MENU' });
        props.user.reactNavigation.navigate('Welcome');
      }
    } else if (
      err.message == 'User denied access to location services.'
    ) {
      props.dispatch({
        type: 'UPDATE_HAVELOCATION_PROPS',
        data: {
          haveLocation: false,
        },
      });
      alert({
        title: 'Uh-oh',
        main: 'Without permission to access to your location, the app funtionality will be limited.',
        button: [
          {
            text: 'Go to settings',
            onPress: () => {
              alert("");
              Linking.openURL('app-settings:');
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              alert("");
            },
          }
        ],
      });
    } else if (err.message == 'Unable to fetch location within 10.0s.') {
    } else {
      const errorMessage = Object.keys(err).indexOf('response') > 0 && errorOutputByMessage(err.response.data.message);
      errorMessage == false
        ? alert({ title: "Uh-oh", main: 'General error : ' + Object.keys(err).indexOf('response') > 0 ? err.response.data.message : '' })
        : alert({ title: "Uh-oh", main: errorMessage });
    }
  }

  return (
    <DefaultErrorContext.Provider value={{
      defaultError
    }}
    >
      {props.children}
    </DefaultErrorContext.Provider>
  );
};

const mapStateToProps = store => ({
  user: store.user,
});
const DefaultErrorProviderWrapper = connect(mapStateToProps)(DefaultErrorProvider);
export default DefaultErrorProviderWrapper;
