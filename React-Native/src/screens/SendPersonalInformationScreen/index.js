import React, {memo, useState, useContext, useEffect} from 'react';
import {connect} from 'react-redux';
import ReactNativeImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {Icon} from 'native-base';

import SuccessMessageObject from '../../models/SuccessMessageObject';
import {
  uploadMediaToPeertal,
  postUserVerification,
} from '../../actions/userActions';
import {PhotoEditorWithImage} from '../../common/PhotoEditorHandler';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import SendPersonalInformationScreen from './SendPersonalInformationScreen';

const SendPersonalInformationScreenContainer = (props) => {
  const {defaultError} = useContext(DefaultErrorContext);
  const {setPopup} = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(props.navigation.getParam('data', {}));

  const text = {
    desc1: 'Place and crop your photo to fit its size',
    desc2: 'Press Resize button to resize',
  };

  const imageResize = (mediaType = 'photo') => {
    const options = {
      noData: true,
      mediaType: mediaType,
      width: 800,
      height: 800,
      maxHeight: 800,
      maxWidth: 800,
    };

    ImageResizer.createResizedImage(photo.url, 800, 800, 'JPEG', 70)
      .then((resp) => {
        if (resp.uri) {
          PhotoEditorWithImage(resp.uri, (result) => {
            result.image &&
              RNFS.readFile(result.image, 'base64').then((base64data) => {
                setIsLoading(true);
                uploadMediaToPeertal(
                  props.user.accessToken,
                  `data:${'image/jpeg'};base64,` + base64data,
                  'post',
                  (res) => {
                    let response = res.data;
                    if (response.status === 200) {
                      setIsLoading(false);
                      setPhoto(response.data);
                    } else {
                      alert(response.message);
                    }
                  },
                  (err) => {
                    alert(err.response?.data?.message ?? 'Error');
                    setIsLoading(false);
                  },
                  (event) => {
                    /* setLoadingPercent(event) */
                  },
                );
              }),
              (error) => {
                setIsLoading(false);
                alert(error);
              };
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err);
      });
  };

  const requestVerification = () => {
    postUserVerification(
      props.user.accessToken,
      photo.id,
      (res) => {
        props.dispatch({
          type: 'UPDATE_IDENTITY_STATUS_PROPS',
          data: {
            identityStatus: 'verifying',
          },
        });

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
      (err) => defaultError(err),
    );
  };

  return (
    <SendPersonalInformationScreen
      {...props}
      text={text}
      data={photo}
      imageResize={imageResize}
      requestVerification={requestVerification}
    />
  );
};

const mapStateToProps = (store) => ({
  user: store.user,
});
const SendPersonalInformationScreenContainerWrapper = connect(mapStateToProps)(
  SendPersonalInformationScreenContainer,
);
export default memo(SendPersonalInformationScreenContainerWrapper);
