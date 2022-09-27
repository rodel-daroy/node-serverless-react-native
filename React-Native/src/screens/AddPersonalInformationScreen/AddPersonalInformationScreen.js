import React, { memo, useContext, useEffect, useMemo } from 'react';
import { Icon } from 'native-base';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
  NativeEventEmitter,
} from 'react-native';
import { css } from '@emotion/native';

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading } from '../../components/CoreUIComponents';
import { postUserVerification } from '../../actions/userActions';
import { PassbaseSDK, PassbaseButton } from '@passbase/react-native-passbase';
import Button from '../../components/CoreUIComponents/Button';
import SuccessMessageObject from '../../models/SuccessMessageObject';
import UserContext from '../../context/User/UserContext';

const AddPersonalInformationScreen = (props) => {
  const {
    textForFirstUser,
    textForDeclinedUser,
    handleCamera,
    handleUploadPhoto,
    isLoading,
  } = props;

  const { verificationStatus, setVerificationStatus } = useContext(UserContext);

  const text =
    verificationStatus === 2 ? textForDeclinedUser : textForFirstUser;

  const initPassbase = async () => {
    const res = await PassbaseSDK.initialize(CONSTANTS.PASSBASE_KEY);

    if (res && res.success) {
      // Do your stuff here, you have successfully initialized.
      console.log(res);
    } else {
      // check res.message for the error message
      console.log(res.message);
    }
  };

  const requestVerification = (passbaseKey) => {
    postUserVerification(
      props.user.accessToken,
      passbaseKey,
      (res) => {
        setVerificationStatus(0);

        const messageSuccess = new SuccessMessageObject(
          'ADD PERSONAL INFORMATION',
          'Thank you!',
          '',
          '',
          '',
          '',
          'You’ll be notified in 48 hours if your account is verified or if we need any additional supporting documents.',
        );

        props.navigation.navigate('SuccessAction', {
          data: messageSuccess,
        });
      },
      (err) => console.log(err),
    );
  };

  useEffect(() => {
    initPassbase();

    const subscription = new NativeEventEmitter(PassbaseSDK);
    subscription.addListener('onError', (event) => {
      console.log('onError');
    });

    subscription.addListener('onFinish', (event) => {
      console.log('Identity Access Key completed with: ', event.identityAccessKey);
      /* props.dispatch({
        type: 'UPDATE_IDENTITY_KEY_PROPS',
        data: {
          identityAccessKey: event.identityAccessKey,
        },
      }); */
      /* props.dispatch({
        type: 'UPDATE_IDENTITY_STATUS_PROPS',
        data: {
          identityStatus: 'verifying',
        },
      }); */

      requestVerification(event.identityAccessKey);
    });

    subscription.addListener('onStart', (event) => console.log('onStart with', props.user.email));

    return () => {
      if (subscription) {
        subscription.removeListener('onError', (event) => { });
        subscription.removeListener('onFinish', (event) => { });
        subscription.removeListener('onStart', (event) => { });
      }
    };
  }, []);

  const passbassBtnHandler = async () => {
    const res = await PassbaseSDK.startVerification();
    PassbaseSDK.setPrefillUserEmail(props.user.email);
    PassbaseSDK.setPrefillCountry('au');
  };

  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: 'black',
            }}>
            ADD PERSONAL INFORMATION
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{
          width: '100%',
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
        }}>
        <View style={{ marginTop: 52, display: 'flex', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
            }}>
            {text.desc1}
          </Text>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
              marginTop: 10,
            }}>
            {text.desc2}
          </Text>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              color: '#414042',
              marginTop: 14,
            }}>
            {text.desc3}
          </Text>
        </View>
        <View style={passbaseButtonContainerStyle}>
          {/* <PassbaseButton style={{ backgroundColor: 'white' }} /> */}
          <TouchableOpacity onPress={passbassBtnHandler}>
            <Button>Start Verification</Button>
          </TouchableOpacity>
        </View>
        {/* <View style={{ marginTop: 42.8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { handleCamera(); }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: 90.18, height: 90.18
              }}
              source={require('../../assets/xd/Icons/camera.png')} />
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, color: '#414042', marginTop: 14 }}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { handleUploadPhoto(); }} style={{ marginLeft: 56.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: 90.18, height: 90.18
              }}
              source={require('../../assets/xd/Icons/photo.png')} />
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, color: '#414042', marginTop: 14 }}>Camera Roll</Text>
          </TouchableOpacity>
        </View> */}
      </ImageBackground>
      <View
        style={{
          position: 'absolute',
          left: CONSTANTS.WIDTH / 2,
          top: '40%',
        }}>
        {isLoading ? <OverlayLoading /> : null}
      </View>
    </View>
  );
};

const passbaseButtonContainerStyle = css`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const passBaseButtonStyle = css`
  width: 100px;
  height: 100px;
  background: yellow;
`;

export default memo(AddPersonalInformationScreen);
