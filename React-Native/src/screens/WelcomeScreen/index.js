import JwtDecode from 'jwt-decode';
import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-community/google-signin';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { loginViaSocial, getDeviceFirebaseToken } from '../../actions/userActions';
import WelcomeScreen from './WelcomeScreen';
import { refreshDiscoverPosts } from "../../actions/postActions";

const WelcomeScreenContainer = (props) => {

  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      // webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    props.dispatch({
      type: 'UPDATE_REACT_NAVIGATION_PROPS',
      data: { navigation: props.navigation },
    });
    getDeviceFirebaseToken(token => {
      props.dispatch({
        type: 'GET_DEVICE_TOKEN',
        data: { deviceFirebaseToken: token }
      });
    }, (err) => defaultError(err));
  }, [])

  const onAppleButtonPress = async () => {
    try {
      // logout first to not get null value;
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      // get current authentication state for user
      let appleProfile = {
        ...appleAuthRequestResponse,
        email: appleAuthRequestResponse.email,
        name: appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName
      };
      if (appleAuthRequestResponse.email) {
        props.dispatch({
          type: 'UPDATE_APPLE_SIGN_IN',
          data: {
            user: appleAuthRequestResponse.user,
            email: appleAuthRequestResponse.email,
            fullName: appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName
          },
        });
      } else {
        const decoded = JwtDecode(appleAuthRequestResponse.identityToken);
        appleProfile = {
          email: decoded.email,
          // fullName: props.user.appleSignInUser.fullName
        };
      }
      _loginProceed(appleAuthRequestResponse.identityToken, 'Apple', { ...appleProfile });
      // use credentialState response to ensure the user is authenticated
    } catch (e) {
      if (error.code === '1001') { return } else {
        alert('Login apple error');
      }
    }
  }
  const _loginProceed = (token, provider, profile) => {
    const profileData = {
      ...profile,
      fullName: profile.name,
      username: profile.email,
    };
    loginViaSocial(token, provider, profileData, props.user.deviceFirebaseToken,
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
              email: profileData.email
            },
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
          props.dispatch({ type: 'LOGGED_MENU' });

          props.navigation.navigate('Discover');
        } else {
          alert(response.message);
        }
      },
      (err) => defaultError(err)
    );
  }

  const _signInWithGG = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      const tok = await GoogleSignin.getTokens();

      if (userInfo !== null) {
        _loginProceed(tok.accessToken, 'Google', { ...userInfo.user });
      }
    } catch (error) {
      if (error.code === '-5') { return } else {
        alert('error at GG login');
      }
    }
  };

  const _loginWithFacebook = () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['email'])
      .then(result => {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken()
            .then(data => {
              const tokenF = data.accessToken;
              const requestConfig = {
                parameters: {
                  fields: { string: 'email,name,picture' },
                  access_token: { string: tokenF.toString() },  // put your accessToken here
                },
              };
              // after login
              const infoRequest = new GraphRequest('/me', requestConfig,
                (error, result) => {
                  if (error) {
                    console.log('Error fetching data: ' + error.toString());
                  } else {
                    if(result?.email) {
                      _loginProceed(tokenF, 'facebook', result);
                    } else {
                      alert("Please set up email with your account");
                    }
                    // login success

                  }
                },
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .catch(err => {
              alert('error getCurrentAccessToken() ' + JSON.stringify(err));
            });
        }
      })
      .catch(error => {
        alert('Login fail with error: ' + JSON.stringify(error));
      });
  }
  return (
    <WelcomeScreen
      {...props}
      isLoading={isLoading}
      _loginWithFacebook={_loginWithFacebook}
      _signInWithGG={_signInWithGG}
      onAppleButtonPress={onAppleButtonPress}
    />
  );
}

const MapStateToProps = store => ({ user: store.user });
const WelcomeContainerWrapper = connect(MapStateToProps)(WelcomeScreenContainer);
export default WelcomeContainerWrapper;