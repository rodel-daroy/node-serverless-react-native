import { Icon } from 'native-base';
import React, { memo, useState, useContext, useMemo, useEffect } from 'react';
import { Image, PermissionsAndroid, TouchableOpacity, View, Platform } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {
    uploadBigFileToS3,
    uploadMediaToPeertal,
    updatePost,
} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import * as ReactNativeImagePicker from 'react-native-image-picker';
import { PhotoEditorWithImage } from '../../common/PhotoEditorHandler';
import RNFS from 'react-native-fs';
import UpdatePostScreen from './UpdatePostScreen';
import UserContext from '../../context/User/UserContext';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';
import { useAsyncState } from "../../common/Hooks";
import PostsContext from "../../context/Posts/PostsContext";
import { refreshDiscoverPosts } from "../../actions/postActions";

const UpdatePostScreenContainer = (props) => {
    const {defaultError} = useContext(DefaultErrorContext);
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;
    const {verificationStatus} = useContext(UserContext);
    const {setUpdatedPost} = useContext(PostsContext);

    const existingData = props.navigation.getParam('postData', {});
    const identityStatus = useMemo(() => {
        if (verificationStatus === -1) {
            return 'unverified';
        }

        if (verificationStatus === 2) {
            return 'rejected';
        }

        if (verificationStatus === 1) {
            return 'verified';
        }

        if (verificationStatus === 0) {
            return 'verifying';
        }
    }, [verificationStatus]);

    const [content, setContent] = useState('');
    const [id, setId] = useState(0);
    const [isIncognito, setIsIncognito] = useState(props.user.incognitoMode);
    const [isPublic, setIsPublic] = useState(true);
    const [media, setMedia] = useState([]);
    const [money, setMoney] = useState({});
    const [moneyReceivers, setMoneyReceivers] = useState([]);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [address, setAddress] = useState('Here you are');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState({});
    const [isLocation, setIsLocation] = useAsyncState(existingData?.locationAddress || false);
    const [sendMoneyPostModal, setSendMoneyPostModal] = useState(false);
    const [taggedUsersUpdated, setTaggedUsersUpdated] = useState(false);
    const [payment, setPayment] = useState({
        coinAmount: 0,
        currency: 'USD',
        dollarAmount: 0,
    });

  const canSetIsLocation = useMemo(() => {
    if (existingData?.locationAddress) {
      return true;
    } else {
      return false;
    }
  }, [existingData?.locationAddress])

    const getHashTags = (string) => {
        const hashTagArr = [];
        string
            .split(/((?:^|\s)(?:#[a-z\d-]+))/gi)
            .filter(Boolean)
            .map((v, i) => {
                if (v.includes('#')) {
                    hashTagArr.push(v.replace(/^\s*/, ''));
                }
            });

        let deleteDuplicatesArr = [];
        hashTagArr.map((item) => {
            if (!deleteDuplicatesArr.includes(item)) {
                deleteDuplicatesArr.push(item);
            }
        });

        return deleteDuplicatesArr;
    };

    const updatetaggedUsers = (list) => {
        setTaggedUsersUpdated(true);
        setTaggedUsers([...list]);
    };

    const openSendMoneyPostModal = () => {
        if (identityStatus === 'verified') {
            setSendMoneyPostModal(true);
        }

        if (identityStatus === 'unverified' || identityStatus === 'rejected') {
            props.navigation.navigate('AddPersonalInformation');
        }

        if (identityStatus === 'verifying') {
            alert(CONSTANTS.PENDING_VERIFICATION_MSG);
        }
    };

    const handleSharePost = () => {
        if (isLoading) return;

        const existingData = props.navigation.getParam('postData', {});
        let hashTagsArr = getHashTags(content);
        let postData = {
            payment: payment,
            content: content,
            id: id,
            isIncognito: isIncognito,
            isPublic: isPublic,
            money: money,
            moneyReceivers: moneyReceivers,
            taggedUsers: taggedUsers,
            address: address,
            isLocation: isLocation,
            media: media.map((item) => item.id),
            tags: taggedUsers.map((item) => item.id),
            hashTags: hashTagsArr,
            location: existingData.location ? existingData.location : null,
        };

        setIsLoading(true);
        updatePost(
            props.user.accessToken,
            postData,
            (res) => {
                if (res.data.status === 200) {
                    setUpdatedPost({...existingData, ...postData, media});
                }
                setIsLoading(false);
            },
            (err) => {
                setIsLoading(false);
                defaultError(err);
            }
        );
        props.navigation.goBack();
    };

    const handleIosCamera = () => {
        let mediaType = 'photo';
        const options = {
            noData: true,
            mediaType: mediaType,
            width: 800,
            height: 800,
            quality: 0.7,
            maxHeight: 800,
            maxWidth: 800,
        };
        ReactNativeImagePicker.launchCamera(options, (response) => {
            if (response.uri) {
                PhotoEditorWithImage(response.uri, (result) => {
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
                                    setMedia(media.concat(response.data));
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
                        (error) => {
                            console.log(error);
                        };
                });
            }
        });
    };

    const handleAndroidCamera = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(async(response) => {
            if (response) {
                let mediaType = 'photo';
                const options = {
                    noData: true,
                    mediaType: mediaType,
                    width: 800,
                    height: 800,
                    quality: 0.7,
                    maxHeight: 800,
                    maxWidth: 800,
                };
                ReactNativeImagePicker.launchCamera(options, (response) => {
                    if (response.uri) {
                        PhotoEditorWithImage(response.uri, (result) => {
                            RNFS.readFile(result.image, 'base64').then((base64data) => {
                                setIsLoading(true);
                                uploadMediaToPeertal(props.user.accessToken, `data:${'image/jpeg'};base64,` + base64data, 'post', (res) => {
                                        let response = res.data;
                                        if (response.status === 200) {
                                            setIsLoading(false);
                                            setMedia(media.concat(response.data));
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
                                (error) => console.log(error)
                        });
                    }
                });
            } else {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    let mediaType = 'photo';
                    const options = {
                        noData: true,
                        mediaType: mediaType,
                        width: 800,
                        height: 800,
                        quality: 0.7,
                        maxHeight: 800,
                        maxWidth: 800,
                    };
                    ReactNativeImagePicker.launchCamera(options, (response) => {
                        if (response.uri) {
                            PhotoEditorWithImage(response.uri, (result) => {
                                RNFS.readFile(result.image, 'base64').then((base64data) => {
                                    setIsLoading(true);
                                    uploadMediaToPeertal(props.user.accessToken, `data:${'image/jpeg'};base64,` + base64data, 'post', (res) => {
                                            let response = res.data;
                                            if (response.status === 200) {
                                                setIsLoading(false);
                                                setMedia(media.concat(response.data));
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
                                    (error) => console.log(error)
                            });
                        }
                    });
                } else {
                    console.log("Camera permission denied");
                }
            }
        })

    };

    const handleUploadVideo = () => {
        let mediaType = 'video';
        ImagePicker.openPicker({
            mediaType: mediaType,
            includeBase64: true,
        })
            .then((image) => {
                setIsLoading(true);

                uploadBigFileToS3(
                    props.user.accessToken,
                    image,
                    (res) => {
                        setIsLoading(false);
                        setMedia(
                            media.concat({
                                ...res.data.data,
                                url: CONSTANTS.DEFAULT_VIDEO_ICON,
                            }),
                        );
                    },
                    (err) => alert(err.response?.data?.message ?? 'Error'),
                    (progressEvent) => setLoadingPercent(progressEvent),
                );
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };

    const handleUploadPhoto = (mediaType = 'photo') => {
        const options = {
            noData: true,
            mediaType: mediaType,
            width: 800,
            height: 800,
            //quality: 0.7,
            maxHeight: 800,
            maxWidth: 800,
        };

        ReactNativeImagePicker.launchImageLibrary(options, (response) => {
            response.type == 'image/gif' || !response.type
                ? PhotoEditorWithImage(response.uri, (result) => {
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
                                    setMedia(media.concat(response.data));
                                } else {
                                    alert(response.message);
                                }
                            },
                            (err) => {
                                alert(err.response.data.message);
                                setIsLoading(false);
                            },
                            (event) => setLoadingPercent(event),
                        );
                    }),
                        (error) => {
                            console.log(error);
                        };
                })
                : ImageResizer.createResizedImage(response.uri, 800, 800, 'JPEG', 70)
                    .then((resp) => {
                        if (resp.uri) {
                            PhotoEditorWithImage(resp.uri, (result) => {
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
                                                setMedia(media.concat(response.data));
                                            } else {
                                                alert(response.message);
                                            }
                                        },
                                        (err) => {
                                            alert(err.response.data.message);
                                            setIsLoading(false);
                                        },
                                        (event) => setLoadingPercent(event),
                                    );
                                }),
                                    (error) => {
                                        console.log(error);
                                    };
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
        });
    };

    const renderItem = ({item, index, drag, isActive}) => {
        return (
            <TouchableOpacity key={index} onLongPress={drag}>
                <Image
                    source={{uri: item.url}}
                    style={{
                        height: 40,
                        width: 40,
                        marginHorizontal: 5,
                        borderRadius: 5,
                    }}
                />
                <TouchableOpacity
                    onPress={() => {
                        _removePhoto(item.label);
                    }}>
                    <Icon
                        name="ios-close-circle"
                        style={{
                            marginTop: -40,
                            marginLeft: 28,
                            color: 'red',
                            fontSize: 20,
                        }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const _removePhoto = (index) => {
        var newPhoto = media;
        newPhoto.splice(index, 1);
        setMedia([...newPhoto]);
    };

    const _renderPhotos = () => {
        const renderData = media.map((d, index) => ({
            key: `item-${index}`,
            ...d
        }));
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginBottom: 5,
                }}>
                <DraggableFlatList
                    horizontal={true}
                    data={renderData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.key}`}
                    onDragEnd={({data}) => {
                        let photoListSorted = data.map((item) => {
                            return item;
                        });
                        setMedia(photoListSorted);
                    }}
                />
            </View>
        );
    };

    const _onShow = () => {
        if (taggedUsersUpdated) {
            return;
        }
        const postData = props.navigation.getParam('postData', {});
        setAddress(
            postData.locationAddress == ''
                ? 'Your location is hidden'
                : postData.locationAddress,
        );
        setContent(postData.content);
        setId(postData.id);
        setIsPublic(postData.isPublic);
        setMedia(postData.media);
        setMoney(postData.money);
        setMoneyReceivers(postData.moneyReceivers);
        setTaggedUsers(postData.taggedUsers);
        setIsIncognito(props.user.incognitoMode);
    };

    const preferredCurrency = props.user.settings.preferredCurrency;
    const modalFooterHeight = 128;
    const avatar = isIncognito
        ? CONSTANTS.INCOGNITO_AVATAR
        : props.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = isIncognito ? 'Incognito' : props.user.fullName;
    const timeAgo = 'now';
    const taggedUsersData = CONSTANTS.renderListPeople(
        taggedUsers.map((item) => item.fullName),
    );
    const locationAddress = isLocation ? address : 'Your location is hidden';
    const postMoney = getCurrencySymbol(preferredCurrency) + ' ' + payment.dollarAmount + ' ' + preferredCurrency;

    return (
        <UpdatePostScreen
            {...props}
            content={content}
            setContent={setContent}
            taggedUsersData={taggedUsersData}
            isLoading={isLoading}
            loadingPercent={loadingPercent}
            isIncognito={isIncognito}
            isLocation={isLocation}
            setIsLocation={(isLocationData) => setIsLocation(isLocationData)}
            canSetIsLocation={canSetIsLocation}
            setIsIncognito={setIsIncognito}
            sendMoneyPostModal={sendMoneyPostModal}
            setSendMoneyPostModal={setSendMoneyPostModal}
            openSendMoneyPostModal={openSendMoneyPostModal}
            setPayment={setPayment}
            updatetaggedUsers={updatetaggedUsers}
            handleSharePost={handleSharePost}
            handleCamera={Platform.OS === 'ios' ? handleIosCamera : handleAndroidCamera}
            handleUploadVideo={handleUploadVideo}
            handleUploadPhoto={handleUploadPhoto}
            _renderPhotos={_renderPhotos}
            _onShow={_onShow}
            modalFooterHeight={modalFooterHeight}
            avatar={avatar}
            fullName={fullName}
            timeAgo={timeAgo}
            locationAddress={locationAddress}
            postMoney={postMoney}
        />
    );
};

const MapStateToProps = (store) => ({user: store.user});
const UpdatePostScreenContainerWrapper = connect(MapStateToProps)(
  UpdatePostScreenContainer,
);
export default memo(UpdatePostScreenContainerWrapper);
