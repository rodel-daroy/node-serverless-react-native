import React, { useState, useEffect, useContext } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {
  getDeviceFirebaseToken,
  registerWithBase64,
} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import FirstTimeUserScreen from './FirstTimeUserScreen';

const FirstTimeUserScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [yourFullName, setYourFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState(require('../../assets/xd/Icons/RegisterAvatar.png'));
  const [devicePushToken, setDevicePushToken] = useState('');
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    getDeviceFirebaseToken(token => {
      setDevicePushToken(token);
    }, (err) => defaultError(err));
  }, [])

  const onCameraButtonPress = () => {
    // alert('hello')
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperChooseText: 'Choose',
      cropperToolbarTitle: 'Crop your photo here',
      includeExif: true,
      mediaType: 'any',
      forceJpg: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      includeBase64: true,
    }).then(image => {
      setAvatarSource({ uri: image.path });
      setAvatarBase64('data:image/png;base64, ' + image.data);
    });
  };

  const onJoinAction = () => {
    if (isLoading) return;
    if (yourFullName == '') {
      alert({ title: 'Uh-oh', main: 'Please enter your name.' });
      return;
    }

    let loginId = props.navigation.getParam('loginId', 'noemail');

    let type = props.navigation.getParam('type', 'notype');
    const userData = {
      full_name: yourFullName,
      username: loginId,
      device_token: devicePushToken,
      device_type: CONSTANTS.OS,
      device_version: CONSTANTS.OS_VERSION,
      type: type,
      avatarBase64: avatarBase64,
    };
    setIsLoading(true);
    registerWithBase64(
      userData,
      res => {
        setIsLoading(false);
        props.navigation.navigate('ActivationCode', { loginId: loginId });
      },
      err => {
        setIsLoading(false);
        props.navigation.navigate('ActivationCode', { loginId: loginId });
      },
    );
  }

  return (
    <FirstTimeUserScreen
      {...props}
      yourFullName={yourFullName}
      setYourFullName={(fullName) => setYourFullName(fullName)}
      isLoading={isLoading}
      avatarSource={avatarSource}
      onCameraButtonPress={onCameraButtonPress}
      onJoinAction={onJoinAction}
      focused={focused}
      setFocused={setFocused}
    />
  );
}

export default FirstTimeUserScreenContainer;