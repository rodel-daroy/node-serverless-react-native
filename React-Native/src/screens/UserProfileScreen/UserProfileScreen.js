import React, {useCallback, useContext, useMemo, useRef} from 'react';
import {Icon} from 'native-base';
import {Image, ImageBackground, ScrollView, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {OverlayLoading} from '../../components/CoreUIComponents';
import {Text} from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';
import ScanQRCodeModal from './ScanQRCodeModal';
import UserContext from '../../context/User/UserContext';

const UserProfileScreen = (props) => {
    const {verificationStatus} = useContext(UserContext);

    const refActionSheet = useRef(null);
    const showActionSheet = () => {
        if (refActionSheet.current) {
            refActionSheet.current.show();
        }
    };

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

    const reward = useCallback(() => {
        if (identityStatus === 'verified') {
            props.navigation.navigate('SendMoney', {
                tagList: [props.userData],
            });
        }

        if (identityStatus === 'unverified' || identityStatus === 'rejected') {
            props.navigation.navigate('AddPersonalInformation');
        }

        if (identityStatus === 'verifying') {
            alert(CONSTANTS.PENDING_VERIFICATION_MSG);
        }
    }, [identityStatus, props.navigation, props.userData]);

    return (
        props.isOverlayLoading ? <OverlayLoading/> :
            <SafeAreaView style={{flexDirection: 'column', height: '100%'}}>
                <ScrollView>
                    <NavigationEvents
                        onWillFocus={() => {
                            props.handleLoadingData();
                        }}
                    />
                    <ImageBackground
                        style={{
                            width: '100%',
                            height: 200,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            backgroundColor: CONSTANTS.MY_GRAYBG,
                        }}
                        source={
                            typeof props.backgroundUrl == 'string'
                                ? {uri: props.backgroundUrl}
                                : props.backgroundUrl
                        }>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: CONSTANTS.WIDTH,
                                marginTop: CONSTANTS.SPARE_HEADER,
                            }}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                                <Icon
                                    name="arrowleft"
                                    type="AntDesign"
                                    style={{marginLeft: 15, color: 'white'}}
                                />
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={showActionSheet}>
              <Icon
                name="dots-three-vertical"
                type="Entypo"
                style={{
                  fontSize: 16,
                  fontWeight: '200',
                  marginRight: 10,
                  marginTop: 10,
                  color: 'white',
                }}
              />
            </TouchableOpacity> */}
                        </View>
                    </ImageBackground>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={
                                typeof props.avatarUrl === 'string' ? {uri: props.avatarUrl} : props.avatarUrl
                            }
                            style={{
                                height: 100,
                                width: 100,
                                marginLeft: 18,
                                marginTop: -36,
                                borderColor: 'white',
                                borderWidth: 5,
                                borderRadius: 50,
                                backgroundColor: CONSTANTS.MY_GREY,
                            }}
                        />
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD
                            }}> {props.fullName}</Text>
                            <Text style={{fontSize: 12, color: '#939598'}}>{props.email}</Text>
                        </View>
                    </View>
                    {props.navigation.getParam('userId') == -999 ? null : (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginTop: 20,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                    onPress={() => props.setIsScanQRModal(true)}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        backgroundColor: CONSTANTS.MY_BLUE,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        ...CONSTANTS.BLUE_BUTTON_SHADOW_STYLE
                                    }}>
                                    <Icon
                                        name="qrcode"
                                        type="AntDesign"
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            textAlign: 'center',
                                            paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                                            paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text style={{marginTop: 12}}>Scan Code</Text>
                            </View>
                            {props.isOwner ? (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => props.navigation.navigate('CreatePost', {
                                            params: {tagList: [{...props.userData}]}
                                        })}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25,
                                            backgroundColor: CONSTANTS.MY_BLUE,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...CONSTANTS.BLUE_BUTTON_SHADOW_STYLE
                                        }}>
                                        <Icon
                                            name="plus"
                                            type="AntDesign"
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                textAlign: 'center',
                                                paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                                                paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{marginTop: 12}}>Create post</Text>
                                </View>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => props.create1To1Chat([props.userData])}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25,
                                            backgroundColor: CONSTANTS.MY_BLUE,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...CONSTANTS.BLUE_BUTTON_SHADOW_STYLE
                                        }}>

                                        <Icon
                                            name="message-processing"
                                            type="MaterialCommunityIcons"
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                textAlign: 'center',
                                                paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                                                paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{marginTop: 12}}>Message</Text>
                                </View>
                            )}

                            {props.isOwner ? (
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                props.navigation.navigate('EditProfile', {
                                                    userId: props.user.userId,
                                                })
                                            }
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 25,
                                                backgroundColor: CONSTANTS.MY_BLUE,
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                ...CONSTANTS.BLUE_BUTTON_SHADOW_STYLE
                                            }}>
                                            <Icon
                                                name="edit"
                                                type="AntDesign"
                                                style={{
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    textAlign: 'center',
                                                    paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                                                    paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{marginTop: 12}}>Edit Profile</Text>
                                    </View>
                                ) :
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                        onPress={reward}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25,
                                            backgroundColor: CONSTANTS.MY_BLUE,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...CONSTANTS.BLUE_BUTTON_SHADOW_STYLE
                                        }}>
                                        <Icon
                                            name="dollar-bill"
                                            type="Foundation"
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                textAlign: 'center',
                                                paddingLeft: CONSTANTS.OS == 'ios' ? 1 : 0,
                                                paddingTop: CONSTANTS.OS == 'ios' ? 3.5 : 0,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{marginTop: 12}}>Send Money</Text>
                                </View>
                            }
                        </View>
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            marginTop: 35,
                            marginBottom: 15,
                        }}>
                        <TouchableOpacity onPress={() => props.handleTouchTab('Posts')}>
                            <Text
                                style={{
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    fontSize: 24,
                                    color: "#414042",
                                    opacity: props.defaultTab == 'Posts' ? 1 : 0.2,
                                }}>
                                Posts
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.handleTouchTab('About')}>
                            <Text
                                style={{
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    fontSize: 24,
                                    color: "#414042",
                                    opacity: props.defaultTab == 'About' ? 1 : 0.2,
                                }}>
                                About
                            </Text>
                        </TouchableOpacity>
                        {props.navigation.getParam('userId') == -999 ? null : (
                            <TouchableOpacity onPress={() => props.handleTouchTab('Network')}>
                                <Text
                                    style={{
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                        fontSize: 24,
                                        color: "#414042",
                                        opacity: props.defaultTab == 'Network' ? 1 : 0.2,
                                    }}>
                                    Network
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* //render content under tab here */}
                    {props.defaultTab == 'About'
                        ? props._renderAbout()
                        : props.defaultTab == 'Network'
                            ? props._renderNetwork()
                            : props._renderPosts()}
                    <View style={{height: 100, width: '100%'}}/>
                </ScrollView>
                <ScanQRCodeModal
                    navigation={props.navigation}
                    QRCodeUserName={props.fullName}
                    QRCodeUserId={props.userId}
                    enabled={props.isScanQRModal}
                    onClose={() => props.setIsScanQRModal(false)}
                />
                {/* Hide wallet and money transfer feature for ios */}
                {
                    CONSTANTS.IS_HIDE_WALLET_FEATURE ? (
                        <ActionSheet
                            ref={refActionSheet}
                            title={'Which action do you like to do?'}
                            options={props.options}
                            cancelButtonIndex={props.options.length - 1}
                            destructiveButtonIndex={1}
                            onPress={index => {
                                /* do something */
                                switch (index) {
                                    case 0:
                                        props._handleReport();
                                        break;
                                    case 1:
                                        props._handleBlock();
                                        break;
                                    default:
                                }
                            }}
                        />
                    ) : props.userId == -999 ?
                        (
                            <ActionSheet
                                ref={refActionSheet}
                                title={'Which action do you like to do?'}
                                options={props.options}
                                cancelButtonIndex={props.options.length - 1}
                                destructiveButtonIndex={1}
                                onPress={index => {
                                    /* do something */
                                    switch (index) {
                                        case 0:
                                            props._handleReport();
                                            break;
                                        case 1:
                                            props._handleBlock();
                                            break;
                                        default:
                                    }
                                }}
                            />
                        )
                        :
                        (
                            <ActionSheet
                                ref={refActionSheet}
                                title={'Which action do you like to do?'}
                                options={props.options}
                                cancelButtonIndex={props.options.length - 1}
                                destructiveButtonIndex={1}
                                onPress={index => {
                                    /* do something */
                                    switch (index) {
                                        case 0:
                                            props._handleReport();
                                            break;
                                        case 1:
                                            props.navigation.navigate('SendMoney', {
                                                tagList: [props.userData],
                                            });
                                            break;
                                        case 2:
                                            props._handleBlock();
                                            break;
                                        default:
                                    }
                                }}
                            />
                        )
                }
                {CONSTANTS.OS == 'ios' ? <KeyboardSpacer/> : null}
            </SafeAreaView>
    );
}
export default UserProfileScreen;
