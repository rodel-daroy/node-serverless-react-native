import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from 'native-base';
import { css } from '@emotion/native';
import { NavigationEvents } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import {
    ScrollView,
    TouchableOpacity,
    View,
    RefreshControl,
    Linking
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ParsedText from 'react-native-parsed-text';

import CONSTANTS from '../../common/PeertalConstants';
import CommentInputItem from '../../components/CommentInputItem';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';
import GroupAvatars from '../../components/GroupAvatars';
import LikeDislikeButton from '../../components/LikeDislikeButton';
import PeertalMediaCarousel from '../../components/PeertalMediaCarousel';
import { getPostRewards } from "../../actions/postActions";
import PostRewardModal from "../../components/PostRewardModal";

const PostDetailsScreen = (props) => {
    const alert = props.setPopup;
    const refActionSheet = useRef(null);
    const [youtubeAddress, setYoutubeAddress] = useState('');
    const [onRewardPress, setOnRewardPress] = useState(false);
    const [postRewardData, setPostRewardData] = useState([]);
    const [isPostRewardLoaded, setIsPostRewardLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        renderVoteUpButton,
        renderVoteDownButton,
        reward,
        defaultError,
    } = props;

    const handleUrlPress = (url, matchIndex = 0) => {
        Linking.openURL(url);
    };

    const handleHashTagPress = (hashTag) => {
        let hashTagWithoutSharp = '';
        if (hashTag[0] === '#') {
            hashTagWithoutSharp = hashTag.replace('#', '');
        }
        props.navigation.navigate('HashTagPost', {
            hashTag: hashTagWithoutSharp,
        });
    };

    const renderText = useMemo((matchingString = '') => {
        if (matchingString = '') return;

        let pattern = /(?:https?:\/\/|www\.|m\.|^)youtu(?:be\.com\/watch\?(?:.*?&(?:amp;)?)?v=|\.be\/)([\w‌​\-]+)(?:&(?:amp;)?[\w\?=]*)?/;
        let match = matchingString.match(pattern);

        if (match && match.length > 0) {
            !youtubeAddress && match[1] && setYoutubeAddress(match[1]);
        }

        return matchingString;
    }, [youtubeAddress, setYoutubeAddress]);

    const showActionSheet = () => {
        if (refActionSheet.current) {
            refActionSheet.current.show();
        }
    };

    const isPostOwner = useMemo(() => {
        return props?.postData?.isOwner;
    }, [props?.postData?.isOwner]);

    const onRewardPressed = useCallback(() => {
        if (props?.postData?.total_rewards || isPostOwner) {
            setOnRewardPress(true);
        } else {
            reward();
        }
    }, [props, isPostOwner, reward]);

    useEffect(() => {
        if (onRewardPress) {
            setIsPostRewardLoaded(false);
            setIsLoading(true);
            const postId = props.postData.id;

            getPostRewards(
                props.user.accessToken,
                postId,
                (res) => {
                    setPostRewardData(res.data.data);
                    setIsPostRewardLoaded(true);
                    setIsLoading(false);
                },
                (err) => {
                    setIsPostRewardLoaded(false);
                    defaultError(err);
                    setIsLoading(false);
                },
            );
        }

        return () => {
            setIsPostRewardLoaded(false);
        }
    }, [props.postData, getPostRewards, props.user, onRewardPress]);

    const isRewardPopUp = useMemo(() => {
        if (onRewardPress && isPostRewardLoaded) {
            return true;
        } else {
            return false;
        }
    }, [onRewardPress, isPostRewardLoaded])

    return (
        <View
            style={{
                marginTop: CONSTANTS.SPARE_HEADER,
                flexDirection: 'column',
                marginBottom: CONSTANTS.SPARE_FOOTER,
                flex: 1,
            }}>
            <NavigationEvents
                onWillFocus={() => {
                    props._loadData();
                }}
            />
            <View
                style={{
                    height: 46,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 0.1,
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{
                            // alignSelf: "flex-start",
                            marginLeft: 10,
                        }}>
                        <Icon name="arrowleft" type="AntDesign"/>
                    </TouchableOpacity>
                    <Text
                        style={{
                            marginLeft: 10,
                            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                        }}>
                        {props.postTitle}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    showActionSheet();
                }}>
                    <Icon
                        name="dots-three-vertical"
                        type="Entypo"
                        style={{
                            fontSize: 16,
                            fontWeight: '200',
                            marginRight: 10,
                            marginTop: 10,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={props.isLoading}
                        onRefresh={props._loadData}
                    />
                }
                style={{flex: 0.8}}
            >
                <View style={{marginHorizontal: 12, marginVertical: 12}}>
                    <ParsedText
                        parse={[
                            {
                                type: 'url',
                                style: {
                                    color: CONSTANTS.MY_BLUE,
                                    textDecorationLine: 'underline',
                                },
                                onPress: handleUrlPress,
                                renderText: renderText,
                            },
                            {
                                pattern: /#(\w+)/,
                                style: {
                                    color: CONSTANTS.MY_BLUE,
                                },
                                onPress: handleHashTagPress,
                            },
                        ]}
                        childrenProps={{allowFontScaling: false}}>
                        {props.postData.content}
                    </ParsedText>
                </View>
                <PeertalMediaCarousel data={props.postData.media}/>

                <View style={iconRowStyle}>
                    {renderVoteUpButton()}
                    <Text style={{marginHorizontal: 8, fontSize: 14}}>{props.votedNo}</Text>
                    {renderVoteDownButton()}

                    <LikeDislikeButton
                        type="comment"
                        active={true}
                        style={{marginLeft: 20, paddingTop: 1}}
                    />
                    <Text style={{marginHorizontal: 8, fontSize: 14}}>{props.commentNo}</Text>

                    {!CONSTANTS.HIDE_POSTREWARD_FOR_IOS && (
                        <TouchableOpacity
                            style={{ marginTop: -4, marginLeft: 12 }}
                            onPress={onRewardPressed}
                        >
                            {props.postData.user.id !== -999 && (
                                <View style={rewardContainerStyle}>
                                    <Icon
                                        name="dollar-bill"
                                        type="Foundation"
                                        style={{ fontSize: 26, color: CONSTANTS.MY_GREY }}
                                    />
                                    <Text style={{
                                        marginHorizontal: 8,
                                        fontSize: 14
                                    }}>{props?.postData?.total_rewards ?? 0}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    <View style={shareButtonAndGroupAvatarContainerStyle}>
                        <LikeDislikeButton
                            type="share"
                            onPress={props.handleShareButton}
                            active={true}
                            style={{marginRight: 30}}
                        />
                        {/* <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{props.shareNo}</Text> */}

                        <GroupAvatars data={props.groupAvatar}/>
                    </View>
                </View>

                <View>{props._renderCommentItem()}</View>
                <View style={{minHeight: 80, backgroundColor: 'white'}}/>
            </ScrollView>
            {props.focus == '' && CONSTANTS.OS == 'ios' ? (
                <KeyboardSpacer topSpacing={-55}/>
            ) : null}
            <View
                style={{
                    flex: 0.1,
                    marginBottom:
                        props.focus == 'comment' && CONSTANTS.OS == 'android'
                            ? 31
                            : 10,
                }}>
                <CommentInputItem
                    postID={props.postData.id}
                    data={props.postData}
                    callback={props._loadData}
                    setIsLoading={props.setIsLoading}
                    onFocus={() => {
                        if (props.user.loggedStatus === 'guest') {
                            props.navigation.navigate('Welcome');
                            return;
                        }
                        props.setFocus('comment');
                    }}
                    onBlur={() => props.setFocus('')}
                    navigation={props.navigation}
                />
            </View>

            {/* Hide wallet and money transfer feature for ios */}
            {CONSTANTS.IS_HIDE_WALLET_FEATURE ? (
                props.user.userId == props.postData.user.id ?
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
                                    props.navigation.navigate('UpdatePost', {
                                        postData: props.postData,
                                    });
                                    break;
                                default:
                            }
                        }}
                    /> :
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
                                    alert({
                                        title: 'Report',
                                        main: 'How would you like this content to be reported?',
                                        button: [
                                            {
                                                text: '+18',
                                                onPress: () => {
                                                    props._handleAction('nsfw');
                                                },
                                            },
                                            {
                                                text: 'Delete',
                                                onPress: () => {
                                                    props._handleAction('report');
                                                },
                                            },
                                            {
                                                text: 'Cancel',
                                                style: 'cancel',
                                            },
                                        ],
                                    });
                                    break;
                                case 1:
                                    if (props.options[1] == 'Edit') {
                                        props.navigation.navigate('UpdatePost', {
                                            postData: props.postData,
                                        });
                                    }
                                    break;
                                default:
                            }
                        }}
                    />
            ) : (
                props.user.userId == props.postData.user.id ?
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
                                    if (props.options[0] == 'Edit') {
                                        props.navigation.navigate('UpdatePost', {
                                            postData: props.postData,
                                        });
                                    }
                                    break;
                                default:
                            }
                        }}
                    />
                    : props.postData.user.id == '-999' ?
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
                                        alert({
                                            title: 'Report',
                                            main: 'How would you like this content to be reported?',
                                            button: [
                                                {
                                                    text: '+18',
                                                    onPress: () => {
                                                        props._handleAction('nsfw');
                                                    },
                                                },
                                                {
                                                    text: 'Delete',
                                                    onPress: () => {
                                                        props._handleAction('report');
                                                    },
                                                },
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                },
                                            ],
                                        });
                                        break;
                                    default:
                                }
                            }}
                        />
                        :
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
                                        alert({
                                            title: 'Report',
                                            main: 'How would you like this content to be reported?',
                                            button: [
                                                {
                                                    text: '+18',
                                                    onPress: () => {
                                                        props._handleAction('nsfw');
                                                    },
                                                },
                                                {
                                                    text: 'Delete',
                                                    onPress: () => {
                                                        props._handleAction('report');
                                                    },
                                                },
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                },
                                            ],
                                        });
                                        break;
                                    case 1:
                                        props.navigation.navigate('SendMoney', {
                                            tagList: [props.userData],
                                        });
                                        break;
                                    default:
                                }
                            }}
                        />
            )}

            {props.focus == 'comment' && CONSTANTS.OS == 'ios' ? (
                <KeyboardSpacer/>
            ) : null}

            <PostRewardModal
                showUp={isRewardPopUp}
                onClose={() => setOnRewardPress(false)}
                postRewardData={postRewardData}
                reward={reward}
                isPostOwner={isPostOwner}
            />

            {isLoading ? <OverlayLoading/> : null}
        </View>
    );
}

export default memo(PostDetailsScreen);

const rewardContainerStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const iconRowStyle = css`
    flex-direction: row;
    margin-left: 12px;
    height: 30px;
`;

const shareButtonAndGroupAvatarContainerStyle = css`
    position: absolute;
    right: 16px;
    bottom: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;