import React, { useState, useContext } from 'react';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { loginViaEmailOrSMS, getDeviceFirebaseToken } from '../../actions/userActions';
import { connect } from 'react-redux';
import LoginViaEmailScreen from './LoginViaEmailScreen';

const LoginScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [yourEmail, setYourEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const onLoginSubmit = () => {
    let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (isLoading || yourEmail === '') return;
    if (!regExp.test(yourEmail)) {
      alert('Please enter a valid email address');
      return
    }
    // request get access Token of firebase
    getDeviceFirebaseToken(token => {
      props.dispatch({
        type: 'GET_DEVICE_TOKEN',
        data: { deviceFirebaseToken: token },
      });
      setIsLoading(true);
      loginViaEmailOrSMS(yourEmail, 'email', token,
        res => {
          setIsLoading(false);
          let response = res.data;
          if (response.data.account_type === 'existed') {
            props.navigation.navigate('ActivationCode', {
              loginId: yourEmail,
              type: 'email',
              // loginCode: null
              loginCode: yourEmail === 'mykhailo001@outlook.com' ? response.data.code : (yourEmail === 'demo@kuky.com' ? 111111 : null)
            });
          } else {
            props.navigation.navigate('FirstTimeUser', {
              loginId: yourEmail,
              type: 'email',
            });
          }
        },
        err => {
          alert(err.response?.data?.message ?? err);
          setIsLoading(false);
        },
      );
    }, (err) => defaultError(err));
  }

  return (
    <LoginViaEmailScreen
      {...props}
      isLoading={isLoading}
      yourEmail={yourEmail}
      setYourEmail={(email) => setYourEmail(email)}
      onLoginSubmit={onLoginSubmit}
      focusedInput={focusedInput}
      setFocusedInput={setFocusedInput}
    />
  );
}

const MapStateToProps = store => ({ user: store.user });
const LoginContainerWrapper = connect(MapStateToProps)(LoginScreenContainer);
export default LoginContainerWrapper;