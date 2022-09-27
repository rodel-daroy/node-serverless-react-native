import React, { memo } from 'react';
import { Icon } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import {
    Image,
    TouchableOpacity,
    View,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import CONSTANTS from '../../common/PeertalConstants';
import { Text, OverlayLoading } from '../../components/CoreUIComponents';
import SendMoneyPostModal from '../../components/SendMoneyPostModal';
import ProgressBar from '../../components/CoreUIComponents/ProgressBar';
import {
    getAddressFromLocation,
    getCurrentLocation,
} from '../../actions/commonActions';

const CreatePostScreen = (props) => {
    const alert = props.setPopup;
    const defaultError = props.defaultError;

    return (
        <View>
            <NavigationEvents
                onWillFocus={() => {
                    // props._onShow();
                }}
            />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                    style={{
                        flexDirection: 'column',
                        marginHorizontal: 16,
                    }}>
                    <View
                        style={{
                            marginTop: CONSTANTS.SPARE_HEADER,
                            flexDirection: 'row',
                            height: 48,
                            backgroundColor: 'white',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={() => props.navigation.goBack()}>
                            <View>
                                {!props.isOverlayLoading && <Icon name="arrowleft" type="AntDesign"/>}
                            </View>
                        </TouchableOpacity>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>CREATE POST</Text>

                        <TouchableOpacity
                            enabled={!props.isOverlayLoading}
                            onPress={() => props.handleSharePost()}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: props.isLoading ? 'white' : CONSTANTS.MY_BLUE,
                                }}
                            >
                                {!props.isOverlayLoading && 'Share'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderBottomColor: '#F3F4F4',
                            shadowColor: 'blue',
                        }}>
                        <View
                            style={{flexDirection: 'row', marginTop: 20}}>
                            <Image
                                source={
                                    typeof props.avatar === 'string'
                                        ? {uri: props.avatar}
                                        : props.avatar
                                }
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 48 / 2,
                                    backgroundColor: 'gray',
                                    alignSelf: 'flex-start',
                                }}
                            />
                            <View
                                style={{
                                    width: CONSTANTS.WIDTH - 86,
                                    paddingLeft: 12,
                                    backgroundColor: 'white',
                                    paddingTop: 6,
                                    flexDirection: 'column',
                                }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                    }}>
                                    {props.fullName}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '200',
                                        fontSize: 12,
                                        color: '#BCBEC0',
                                    }}>
                                    {props.timeAgo}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'column',
                                marginTop: 5,
                                marginLeft: 36,
                                borderStyle: 'dashed',
                                borderColor: 'gray',
                                borderWidth: 1,
                                minHeight: 40,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    minHeight: 43,
                                    marginRight: -1,
                                    marginBottom: -1,
                                    marginTop: -1,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 12,
                                        marginTop: 5,
                                    }}>
                                    <Image
                                        source={require('../../assets/xd/Icons/users.png')}
                                        style={{width: 14, height: 14}}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            textAlignVertical: 'center',
                                            marginLeft: 10,
                                        }}>
                                        {props.tagList}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 12,
                                        marginTop: 5,
                                    }}>
                                    <Image
                                        source={require('../../assets/xd/Icons/post_location.png')}
                                        style={{width: 14, height: 14}}
                                    />
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                textAlignVertical: 'center',
                                                marginLeft: 10,
                                            }}>
                                            {props.user.haveLocation
                                                ? props.locationAddress
                                                : 'Oops, we could not access your location information.'}
                                        </Text>
                                    </View>
                                </View>
                                {/* Hide wallet and money transfer feature for ios */}
                                {CONSTANTS.IS_HIDE_WALLET_FEATURE ? null : (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginLeft: 12,
                                            marginTop: 5,
                                        }}>
                                        <Image
                                            source={require('../../assets/xd/Icons/post_money.png')}
                                            style={{width: 14, height: 14}}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                textAlignVertical: 'center',
                                                marginLeft: 10,
                                            }}>
                                            {props.postMoney}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: CONSTANTS.MY_GRAYBG,
                                marginTop: 20,
                                borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                            }}>
                            <AutoGrowingTextInput
                                value={props.postContent}
                                onChangeText={(text) => props.setPostContent(text)}
                                placeholder="post your content here"
                                //onSubmitEditing={Keyboard.dismiss}
                                style={{
                                    minHeight: 40,
                                    margin: 10,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                                }}
                            />
                            {props._renderPhotos()}
                        </View>
                        {props.isOverlayLoading ? <OverlayLoading/> : null}

                        {props.isLoading ? (
                            <ProgressBar
                                data={
                                    props.loadingPercent.total
                                        ? (
                                            (props.loadingPercent.loaded * 100) /
                                            props.loadingPercent.total
                                        ).toFixed(0)
                                        : 5
                                }
                            />
                        ) : null}
                    </View>
                    {!props.isOverlayLoading && (
                        <View
                            style={{backgroundColor: 'white', height: props.modalFooterHeight}}>
                            {/* Hide wallet and money transfer feature for ios */}
                            {CONSTANTS.IS_HIDE_WALLET_FEATURE ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        marginTop: 16,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            props.navigation.navigate('TagPeople', {
                                                callback: props.updateTagList,
                                                withDone: true,
                                            })
                                        }
                                        style={{
                                            borderColor: 'gray',
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            width: '30%',
                                            height: 34,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                        }}>
                                        <Icon
                                            name="tag"
                                            type="FontAwesome5"
                                            style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                marginRight: 5,
                                            }}
                                        />
                                        <Text style={{fontSize: 12, color: 'gray'}}>Tag Friends</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            borderColor: 'gray',
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            width: '30%',
                                            height: 34,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                        }}>
                                        <Icon
                                            name="lock"
                                            type="FontAwesome5"
                                            style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                marginRight: 5,
                                            }}
                                        />
                                        <Text style={{fontSize: 12, color: 'gray'}}>Only Us</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 16,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            props.navigation.navigate('TagPeople', {
                                                callback: props.updateTagList,
                                                withDone: true,
                                            })
                                        }
                                        style={{
                                            borderColor: 'gray',
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            width: '30%',
                                            height: 34,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                        }}>
                                        <Icon
                                            name="tag"
                                            type="FontAwesome5"
                                            style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                marginRight: 5,
                                            }}
                                        />
                                        <Text style={{fontSize: 12, color: 'gray'}}>Tag Friends</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => props.openSendMoneyPostModal()}
                                        style={{
                                            borderColor: 'gray',
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            width: '30%',
                                            height: 34,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                        }}>
                                        <Icon
                                            name="wallet"
                                            type="FontAwesome5"
                                            style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                marginRight: 5,
                                            }}
                                        />
                                        <Text style={{fontSize: 12, color: 'gray'}}>Send Money</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            borderColor: 'gray',
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            width: '30%',
                                            height: 34,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                        }}>
                                        <Icon
                                            name="lock"
                                            type="FontAwesome5"
                                            style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                marginRight: 5,
                                            }}
                                        />
                                        <Text style={{fontSize: 12, color: 'gray'}}>Only Us</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 15,
                                }}>
                                <TouchableOpacity
                                    onPress={() => props.handleCamera()}>
                                    <Image
                                        source={require('../../assets/xd/Icons/camera.png')}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => props.handleUploadPhoto('any')}>
                                    <Image
                                        source={require('../../assets/xd/Icons/photo.png')}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => props.handleUploadVideo()}>
                                    <Image
                                        source={require('../../assets/xd/Icons/play_button.png')}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async() => {
                                        const currentIsLocation = await props.setIsLocation(
                                            !props.isLocation,
                                        );
                                        if (currentIsLocation && !props.user.haveLocations) {
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
                                                        data: {
                                                            haveLocation: true,
                                                        },
                                                    });
                                                    getAddressFromLocation(
                                                        position.coords.latitude,
                                                        position.coords.longitude,
                                                        (res) => {
                                                            props.setAddress(
                                                                res.data.results[0].formatted_address,
                                                            );
                                                        },
                                                    );
                                                },
                                                (err) => defaultError(err),
                                            );
                                        }
                                    }}>
                                    <Image
                                        source={require('../../assets/xd/Icons/tag_button.png')}
                                        style={{opacity: props.isLocation ? 1 : 0.2}}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        props.setIncognitoMode(!props.incognitoMode);
                                    }}>
                                    <Image
                                        source={require('../../assets/xd/Icons/incognito_button.png')}
                                        style={{opacity: props.incognitoMode ? 1 : 0.2}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
            <SendMoneyPostModal
                enabled={props.sendMoneyPostModal}
                onClose={() => props.setSendMoneyPostModal(false)}
                callback={(coin, dollar, currency) => {
                    const value = {
                        coinAmount: coin,
                        currency: currency,
                        dollarAmount: dollar,
                    };
                    props.setPayment(value);
                }}
            />
        </View>
    );
};

export default memo(CreatePostScreen);
