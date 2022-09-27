import React, { memo, useContext, useEffect, useState, } from 'react';
import { connect } from 'react-redux';

import CONSTANTS from '../../common/PeertalConstants';
import PopupContext from '../../context/Popup/PopupContext';
import { loginCodeInput } from '../../actions/userActions';
import ActivationCodeScreen from './ActivationCodeScreen';
import { refreshDiscoverPosts } from "../../actions/postActions";

const ActivationCodeScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [txtCode, setTxtCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginId = props.navigation.getParam('loginId');
  const type = props.navigation.getParam('type');
  const loginCode = props.navigation.getParam('loginCode');

  const [borderColor, setBorderColor] = useState(CONSTANTS.MY_UNFOCUSED_BORDER_COLOR);


  useEffect(() => {
    if (loginCode) {
      setTxtCode(loginCode);
      setIsLoading(true);
      loginCodeInput(loginId, loginCode,
        res => {
          let response = res.data;
          setIsLoading(false);

          if (response.status === 200) {
            props.dispatch({
              type: 'USER_RECEIVE_LOG_IN_SUCCESSFULLY',
              data: {
                user_data: response.data.user_data,
                accessToken: response.data.user_data.token,
                settings: response.data.settings,
                email: email,
              },
            });
            props.dispatch({ type: 'LOGGED_MENU' });

            props.dispatch(
                refreshDiscoverPosts(
                    props.user.accessToken,
                    props.user.subscribeToAdultContent,
                    props.user.over18,
                    props.sortType,
                    props.user.longitude,
                    props.user.latitude,
                ),
            );
            props.navigation.navigate('Discover');
          } else {
            setIsLoading(false);
            alert(response.message);
          }
        },
        err => {
          setIsLoading(false);
          if (err.response.data.status === 400) {
            alert('Please check verification code again');
          } else {
            alert(err.response.data.message);
          }
        },
      );
    }
  }, [loginId, loginCode])

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const email = validateEmail(loginId) ? loginId.toLowerCase() : null;

  const onJoinSubmit = () => {
    if (isLoading || txtCode === '') {
      return;
    }
    setIsLoading(true);
    loginCodeInput(
      loginId,
      txtCode,
      res => {
        let response = res.data;
        setIsLoading(false);

        if (response.status === 200) {
          props.dispatch({
            type: 'USER_RECEIVE_LOG_IN_SUCCESSFULLY',
            data: {
              user_data: response.data.user_data,
              accessToken: response.data.user_data.token,
              settings: response.data.settings,
              email: email,
            },
          });
          props.dispatch({
            type: 'LOGGED_MENU',
          });

          props.dispatch(
              refreshDiscoverPosts(
                  props.user.accessToken,
                  props.user.subscribeToAdultContent,
                  props.user.over18,
                  props.sortType,
                  props.user.longitude,
                  props.user.latitude,
              ),
          );
          props.navigation.navigate('Discover');
        } else {
          setIsLoading(false);
          alert(response.message);
        }
      },
      err => {
        setIsLoading(false);
        if (err.response.data.status === 400) {
          alert('Please check verification code again');
        } else {
          alert(err.response.data.message);
        }
      },
    );
  }

  return (
    <ActivationCodeScreen
      {...props}
      onJoinSubmit={onJoinSubmit}
      txtCode={txtCode}
      setTxtCode={(text) => setTxtCode(text)}
      isLoading={isLoading}
      borderColor={borderColor}
      setBorderColor={setBorderColor}
      type={type}
    />
  )
}

const MapStateToProps = store => ({ user: store.user });
const ActivationCodeScreenContainerWrapper = connect(MapStateToProps)(ActivationCodeScreenContainer);
export default memo(ActivationCodeScreenContainerWrapper);