import React, { memo, useCallback, useMemo } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import Modal from 'react-native-modal';
import { Icon } from "native-base";
import { css } from '@emotion/native';

import CONSTANTS from "../common/PeertalConstants";
import PostRewardModalItem from "./PostRewardModalItem";

const PostRewardModal = (props) => {
    const {
        postRewardData,
        showUp,
        onClose,
        reward,
        isPostOwner,
    } = props;

    const onRewardPress = useCallback(()=>{
        onClose();
        reward();
    },[reward, onClose]);

    const [
        modalWidth,
        modalMarginHorizontal,
        avatarWidth,
        nameWidth,
        rewardAndCurrencyWidth,
        rewardWidth,
        currencyWidth,
        commentWidth,
        timeAgoWidth
    ] = useMemo(()=> {
        const modalWidth = CONSTANTS.WIDTH * 0.9 * 0.9;
        const modalMarginHorizontal = 30;
        const shadowPadding = 15;
        const avatarWidth = 35;
        const nameWidth = (modalWidth - avatarWidth - modalMarginHorizontal - shadowPadding) * 0.48;
        const rewardAndCurrencyWidth = (modalWidth - avatarWidth - modalMarginHorizontal - shadowPadding) * 0.52;
        const currencyWidth = 32;
        const rewardWidth = rewardAndCurrencyWidth - currencyWidth;
        const commentWidth = (modalWidth - modalMarginHorizontal - shadowPadding) * 0.71;
        const timeAgoWidth = (modalWidth - modalMarginHorizontal - shadowPadding) * 0.27;

        return [
            modalWidth,
            modalMarginHorizontal,
            avatarWidth,
            nameWidth,
            rewardAndCurrencyWidth,
            rewardWidth,
            currencyWidth,
            commentWidth,
            timeAgoWidth,
        ];
    },[CONSTANTS.WIDTH]);

    const renderReward = useMemo(() => {
        if (postRewardData?.length === 0) {
            return (
                <View style={noRewardContainerStyle}>
                    <Text style={noRewardText}>No Reward</Text>
                </View>
            );
        } else {
            return postRewardData.map((item, index) => {
                return (
                    <PostRewardModalItem
                        key={index}
                        item={item}
                        avatarWidth={avatarWidth}
                        nameWidth={nameWidth}
                        rewardAndCurrencyWidth={rewardAndCurrencyWidth}
                        rewardWidth={rewardWidth}
                        currencyWidth={currencyWidth}
                        commentWidth={commentWidth}
                        timeAgoWidth={timeAgoWidth}
                    />
                );
            });
        }
    }, [postRewardData]);

    return (
        <Modal
            isVisible={showUp}
            backdropOpacity={0.15}>
            <View
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    shadowColor: '#BCBEC0',
                    shadowOffset: {width: 10, height: 10},
                    shadowOpacity: 0.9,
                    shadowRadius: 20,
                    elevation: 1,
                }}>
                <View
                    style={{
                        width: modalWidth,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        paddingBottom: 20,
                    }}>
                    <View
                        style={{
                            width: '100%',
                            height: 60,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#D1D3D4',
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative'
                        }}
                    >
                        <Text style={{
                            color: "#414042",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>
                            Post Reward
                        </Text>
                        <TouchableOpacity
                            style={{position: "absolute", right: 9}}
                            onPress={() => {
                                onClose();
                            }}>
                            <Icon style={{fontSize: 20, color: "#D5D7D7"}} name="x" type="Feather"/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{marginHorizontal: modalMarginHorizontal / 2, marginVertical: 5, maxHeight: '80%'}}>
                        {renderReward}
                    </ScrollView>
                    <View style={bottomButtonContainerStyle}>
                        {!isPostOwner && (
                            <TouchableOpacity
                                onPress={onRewardPress}
                                style={buttonStyle("small")}
                            >
                                <Text style={buttonTextStyle("small")}>Reward</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={onClose}
                            style={buttonStyle("smallCancel", isPostOwner)}
                        >
                            <Text style={buttonTextStyle("smallCancel")}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default memo(PostRewardModal);

const noRewardContainerStyle = css`
    height: 47.6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`;

const noRewardText = css`
    font-size: 16px;
`;

const bottomButtonContainerStyle = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 15px;
    justify-content: center;
`;

const buttonStyle = (type, isPostOwner = false) => css`
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: #0477FF;
    min-width: 80px;
    min-height: 50px;
    border-radius: ${CONSTANTS.CARD_BORDER_RADIUS + 'px'};
    justify-content: center;
    align-items: center;

    ${type === 'cancel' && css`
      background-color: ${CONSTANTS.MY_CANCEL_BG_COLOR};
      border-width: 1px;
      border-color: ${CONSTANTS.MY_CANCEL_BORDER_COLOR};
    `};

    ${type === 'small' && css`
      padding-right: 10px;
      padding-left: 10px;
      max-width: 80px;
    `};

    ${type === 'smallCancel' && css`
      background-color: ${CONSTANTS.MY_CANCEL_BG_COLOR};
      border-width: 1px;
      border-color: ${CONSTANTS.MY_CANCEL_BORDER_COLOR};
      padding-right: 10px;
      padding-left: 10px;
      max-width: 80px;
      ${!isPostOwner && css`
        margin-left: 15px;
      `};
    `};
`;

const buttonTextStyle = (type) => css`
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 700;

    ${type === 'cancel' && css`
      color: #414042;
    `};

    ${type === 'smallCancel' && css`
      color: #414042;
      font-size: 13px;
    `};

    ${type === 'small' && css`
      font-size: 13px;
    `};
`;
