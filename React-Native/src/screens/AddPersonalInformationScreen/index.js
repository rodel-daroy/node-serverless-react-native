import React, { memo, useState, useContext } from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import { connect } from 'react-redux';
import * as ReactNativeImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

import { uploadMediaToPeertal } from '../../actions/userActions';
import { PhotoEditorWithImage } from '../../common/PhotoEditorHandler';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import AddPersonalInformationScreen from './AddPersonalInformationScreen';

const AddPersonalInformationScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);

  const textForFirstUser = {
    desc1: 'Please proceed your verification process',
    desc2: 'for Wallet Menu',
    desc3: 'We keep your information details secure',
  };

  const textForDeclinedUser = {
    desc1: 'Declined verification',
    desc2: 'Please proceed your verification process',
    desc3: 'We keep your information details secure',
  };

  const handleIosCamera = () => {
    const options = {
      noData: true,
      width: 800,
      height: 800,
      quality: 0.7,
      maxHeight: 800,
      maxWidth: 800,
    };
    ReactNativeImagePicker.launchCamera(options, (response) => {
      if (response.uri) {
        PhotoEditorWithImage(response.uri, (result) => {
          response.uri &&
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
                    props.navigation.navigate('SendPersonalInformation', {
                      data: response.data,
                    });
                  } else {
                    alert(response.message);
                  }
                },
                (err) => {
                  //alert('error some where');
                  alert(err.response.data.message);
                  setIsLoading(false);
                },
            );
          }),
              (error) => {
                setIsLoading(false);
              };
        });
      }
    });
  };

  const handleAndroidCamera = () => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(async (response) => {
      if (response) {
        const options = {
          noData: true,
          width: 800,
          height: 800,
          quality: 0.7,
          maxHeight: 800,
          maxWidth: 800,
        };
        ReactNativeImagePicker.launchCamera(options, (response) => {
          if (response.uri) {
            PhotoEditorWithImage(response.uri, (result) => {
              response.uri && RNFS.readFile(result.image, 'base64').then((base64data) => {
                setIsLoading(true);
                uploadMediaToPeertal(props.user.accessToken, `data:${'image/jpeg'};base64,` + base64data, 'post', (res) => {
                      let response = res.data;
                      if (response.status === 200) {
                        setIsLoading(false);
                        props.navigation.navigate('SendPersonalInformation', { data: response.data });
                      } else {
                        alert(response.message);
                      }
                    },
                    (err) => {
                      alert(err.response.data.message);
                      setIsLoading(false);
                    },
                );
              }),
                  (error) => setIsLoading(false)
            });
          }
        });
      } else {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const options = {
            noData: true,
            width: 800,
            height: 800,
            quality: 0.7,
            maxHeight: 800,
            maxWidth: 800,
          };
          ReactNativeImagePicker.launchCamera(options, (response) => {
            if (response.uri) {
              PhotoEditorWithImage(response.uri, (result) => {
                response.uri && RNFS.readFile(result.image, 'base64').then((base64data) => {
                  setIsLoading(true);
                  uploadMediaToPeertal(props.user.accessToken, `data:${'image/jpeg'};base64,` + base64data, 'post', (res) => {
                        let response = res.data;
                        if (response.status === 200) {
                          setIsLoading(false);
                          props.navigation.navigate('SendPersonalInformation', { data: response.data });
                        } else {
                          alert(response.message);
                        }
                      },
                      (err) => {
                        //alert('error some where');
                        alert(err.response.data.message);
                        setIsLoading(false);
                      },
                  );
                }),
                    (error) => setIsLoading(false)
              });
            }
          });
        } else {
          console.log("Camera permission denied");
        }
      }
    })

  };

  const handleUploadPhoto = (mediaType = 'photo') => {
    const options = {
      noData: true,
      mediaType: mediaType,
      width: 800,
      height: 800,
      maxHeight: 800,
      maxWidth: 800,
    };

    ReactNativeImagePicker.launchImageLibrary(options, (response) => {
      response.type == 'image/gif' || !response.type
          ? response.uri &&
          RNFS.readFile(response.uri, 'base64').then((base64data) => {
            setIsLoading(true);
            uploadMediaToPeertal(
                props.user.accessToken,
                `data:${'image/jpeg'};base64,` + base64data,
                'post',
                (res) => {
                  let response = res.data;
                  if (response.status === 200) {
                    setIsLoading(false);
                    props.navigation.navigate('SendPersonalInformation', {
                      data: response.data,
                    });
                  } else {
                    alert(response.message);
                  }
                },
                (err) => {
                  //alert('error some where');
                  alert(err.response.data.message);
                  setIsLoading(false);
                },
                (event) => {
                  /* setLoadingPercent(event) */
                },
            );
          })
          : ImageResizer.createResizedImage(response.uri, 800, 800, 'JPEG', 70)
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
                              props.navigation.navigate(
                                  'SendPersonalInformation',
                                  { data: response.data },
                              );
                            } else {
                              alert(response.message);
                            }
                          },
                          (err) => {
                            alert(err.response.data.message);
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
    });
  };

  return (
    <AddPersonalInformationScreen
      {...props}
      textForFirstUser={textForFirstUser}
      textForDeclinedUser={textForDeclinedUser}
      handleUploadPhoto={handleUploadPhoto}
      handleCamera={Platform.OS === 'ios'? handleIosCamera : handleAndroidCamera}
      isLoading={isLoading}
    />
  );
};

const mapStateToProps = (store) => ({
  user: store.user,
});
const AddPersonalInformationScreenContainerWrapper = connect(mapStateToProps)(
    AddPersonalInformationScreenContainer,
);
export default memo(AddPersonalInformationScreenContainerWrapper);
