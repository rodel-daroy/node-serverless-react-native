import React, { memo, useState, useContext, useEffect, useMemo } from 'react';
import { Icon } from 'native-base';
import { Image, PermissionsAndroid, TouchableOpacity, View, Platform } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import * as ReactNativeImagePicker from 'react-native-image-picker';

import PostsContext from '../../context/Posts/PostsContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {
    shareFullPost,
    uploadMediaToPeertal,
    uploadBigFileToS3,
} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import {
    getAddressFromLocation,
    getCurrentLocation,
} from '../../actions/commonActions';
import { PhotoEditorWithImage } from '../../common/PhotoEditorHandler';
import { useAsyncState } from '../../common/Hooks';
import CreatePostScreen from './CreatePostScreen';
import UserContext from '../../context/User/UserContext';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';

const CreatePostScreenContainer = (props) => {
    const {defaultError} = useContext(DefaultErrorContext);
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;
    const {verificationStatus} = useContext(UserContext);
    const {setCreatedPost} = useContext(PostsContext);

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

    const [params, setParams] = useState(props.navigation.getParam('params'));
    const [callback, setCallback] = useState(props.navigation.getParam('callback'));

    const [postContent, setPostContent] = useState('');
    const [tagList, setTagList] = useState([]);
    const [address, setAddress] = useState('Here you are');
    const [isLoading, setIsLoading] = useState(false);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [incognitoMode, setIncognitoMode] = useState(props.user.incognitoMode);
    const [isLocation, setIsLocation] = useAsyncState(true);
    const [sendMoneyPostModal, setSendMoneyPostModal] = useState(false);
    const [payment, setPayment] = useState({
        coinAmount: 0,
        currency: 'USD',
        dollarAmount: 0,
    });

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

    useEffect(() => {
        if (params) {
            setTagList(params.tagList);
        }
        if (props.user.haveLocation) {
            getCurrentLocation((position) => {
                props.dispatch({
                    type: 'UPDATE_LONG_LAT',
                    data: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                    },
                });
                props.dispatch({
                    type: 'UPDATE_HAVELOCATION_PROPS',
                    data: {haveLocation: true},
                });
                getAddressFromLocation(position.coords.latitude, position.coords.longitude, (res) => {
                    setAddress(res.data.results[0].formatted_address);
                });
            }, (err) => {
                Alert.alert('Geolocation error', JSON.stringify(err));
            });
        }
        if (!props.user.haveLocation) {
            getCurrentLocation(
                (position) => {
                    props.dispatch({
                        type: 'UPDATE_LONG_LAT',
                        data: {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude,
                        },
                    });
                    props.dispatch({
                        type: 'UPDATE_HAVELOCATION_PROPS',
                        data: {haveLocation: true},
                    });
                    getAddressFromLocation(position.coords.latitude, position.coords.longitude, (res) => {
                        setAddress(res.data.results[0].formatted_address);
                    });
                },
                (err) => {
                    Alert.alert('Geolocation error', JSON.stringify(err));
                    defaultError(err)
                },
            );
        }
    }, []);

    const updateTagList = (list) => {
        setTagList(list);
    };

    const handleSharePost = () => {
        if (isOverlayLoading) return;

        if (!postContent) {
            alert('Please write your content.');
            return;
        }

        props.dispatch({
            type: 'SELECT_SORT_TYPE',
            data: {
                sortType: 'TIMELINE',
            },
        });

        setIsOverlayLoading(true);
        let hashTagsArr = getHashTags(postContent);
        let currentLocation = {
            lon: props.user.longitude,
            lat: props.user.latitude,
        };
        let postData = {
            content: postContent,
            medias: photoList.map((item) => item.id),
            tags: tagList.map((item) => item.id),
            hashTags: hashTagsArr,
            isPublic: isPublic,
            isIncognito: incognitoMode,
            location: isLocation ? currentLocation : null,
            payment: payment.coinAmount,
        };

        shareFullPost(
            props.user.accessToken,
            postData,
            (res) => {
                if (res.data.status === 200) {
                    setCreatedPost([{...res.data.data, isOwner: true, created_by: props.user.userId}]);
                }
                setPostContent('');
                setTagList([]);
                setPhotoList([]);
                setIsPublic(true);
                setIncognitoMode(false);
                hashTagsArr = [];
                if (callback) {
                    callback();
                    setIsOverlayLoading(false);
                    props.navigation.navigate('Discover');
                }
                ;
                props.navigation.navigate('Discover');
            },
            (err) => {
                setIsOverlayLoading(false);
                alert({
                    title: 'Alert',
                    main: err.response?.data?.message ?? 'Error',
                    button: [
                        {
                            text: 'OK',
                            onPress: () => {
                                alert('');
                                props.navigation.navigate('Discover');
                            },
                        },
                    ],
                });
            },
        );
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
                                    setPhotoList(photoList.concat(response.data));
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
                            setIsLoading(false);
                        };
                });
            }
        });
    };

    const handleAndroidCamera = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(async(response) => {
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
                                            setPhotoList(photoList.concat(response.data));
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
                                                setPhotoList(photoList.concat(response.data));
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
                        setPhotoList(
                            photoList.concat({
                                ...res.data.data,
                                url: CONSTANTS.DEFAULT_VIDEO_ICON,
                            }),
                        );
                    },
                    (err) => alert('upload video error :' + err.response?.data?.message),
                    (progressEvent) => setLoadingPercent(progressEvent),
                );
            })
            .catch((err) => {
                // alert("wrong with" + err.message);
                setIsLoading(false);
            });
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
                                setPhotoList(photoList.concat(response.data));
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
                                                setPhotoList(photoList.concat(response.data));
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

    const _removePhoto = (index) => {
        var newPhoto = photoList;
        newPhoto.splice(index, 1);
        setPhotoList([...newPhoto]);
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

    const _renderPhotos = () => {
        const renderData = photoList.map((d, index) => ({
            key: `item-${index}`,
            label: index,
            id: d.id,
            url: d.url,
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
                            return {id: item.id, url: item.url};
                        });
                        setPhotoList(photoListSorted);
                    }}
                />
            </View>
        );
    };

    const modalFooterHeight = 128;
    const avatar = incognitoMode
        ? CONSTANTS.INCOGNITO_AVATAR
        : props.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    const fullName = incognitoMode ? 'Incognito' : props.user.fullName;
    const timeAgo = 'now';
    const tagListData = CONSTANTS.renderListPeople(
        tagList.map((item) => item.fullName),
    );
    const locationAddress = isLocation ? address : 'Your location is hidden';
    const preferredCurrency = useMemo(() => {
        if (props.user?.preferredCurrency) {
            return props.user?.preferredCurrency;
        } else {
            return "USD";
        }
    }, [props.user?.preferredCurrency]);

    const postMoney = getCurrencySymbol(preferredCurrency) + ' ' + monetaryDigitsFormatter(payment.dollarAmount.toString()) + ' ' + preferredCurrency;

    return (
        <CreatePostScreen
            {...props}
            postContent={postContent}
            setPostContent={(postContentData) => setPostContent(postContentData)}
            setAddress={setAddress}
            isLoading={isLoading}
            isOverlayLoading={isOverlayLoading}
            loadingPercent={loadingPercent}
            incognitoMode={incognitoMode}
            setIncognitoMode={(incognitoModeData) =>
                setIncognitoMode(incognitoModeData)
            }
            isLocation={isLocation}
            setIsLocation={(isLocationData) => setIsLocation(isLocationData)}
            sendMoneyPostModal={sendMoneyPostModal}
            openSendMoneyPostModal={openSendMoneyPostModal}
            setSendMoneyPostModal={setSendMoneyPostModal}
            setPayment={(paymentData) => setPayment(paymentData)}
            updateTagList={updateTagList}
            handleSharePost={handleSharePost}
            handleCamera={Platform.OS === 'ios' ? handleIosCamera : handleAndroidCamera}
            handleUploadVideo={handleUploadVideo}
            handleUploadPhoto={handleUploadPhoto}
            _renderPhotos={_renderPhotos}
            modalFooterHeight={modalFooterHeight}
            fullName={fullName}
            avatar={avatar}
            timeAgo={timeAgo}
            locationAddress={locationAddress}
            tagList={tagListData}
            postMoney={postMoney}
            setPopup={setPopup}
            defaultError={defaultError}
        />
    );
};
const MapStateToProps = (store) => ({user: store.user});
const CreatePostScreenContainerWrapper = connect(MapStateToProps)(
  CreatePostScreenContainer,
);
export default memo(CreatePostScreenContainerWrapper);
