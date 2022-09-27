import React, { memo, useCallback, useMemo, useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { css } from '@emotion/native';
import Collapsible from 'react-native-collapsible';

import CONSTANTS from "../common/PeertalConstants";
import { monetaryDigitsFormatter } from "../common/includes/monetaryDigitsFormatter";
import TextTruncate from "./CoreUIComponents/TextTruncate";

const PostRewardModalItem = (props) => {
    const {
        item,
        avatarWidth,
        nameWidth,
        rewardAndCurrencyWidth,
        rewardWidth,
        currencyWidth,
        commentWidth,
        timeAgoWidth
    } = props;

    const [showDetail, setShowDetail] = useState(false);

    const onPressItem = useCallback(() => {
        setShowDetail(!showDetail)
    }, [showDetail]);

    const timeAgo = useMemo(() => {
        const date = new Date((item?.date ?? 0)*1000);
        const dateValue = CONSTANTS.getTimeDifference(date);
        const ago = dateValue === 'now' ? '' : ' ago';

        return dateValue + ago;
    }, [CONSTANTS.getTimeDifference, item]);

    const itemComment = useMemo(()=>{
        return item?.comment ?? '';
    },[item])

    return (
        <TouchableOpacity onPress={onPressItem} style={style}>
            <View style={containerStyle}>
                <View style={avatarContainerStyle(avatarWidth)}>
                    <Image
                        source={{uri: item?.userData?.avatarUrl || CONSTANTS.DEFAULT_AVATAR}}
                        style={avatarStyle(avatarWidth)}
                    />
                </View>
                <View style={nameContainerStyle(nameWidth)}>
                    <TextTruncate numberOfLines={1}>
                        <Text>{item?.userData?.fullName}</Text>
                    </TextTruncate>
                </View>
                <View style={rewardValueContainerStyle(rewardAndCurrencyWidth)}>
                    <TextTruncate
                        style={rewardValueStyle(rewardWidth)}
                        numberOfLines={1}
                    >
                        <Text>
                            {monetaryDigitsFormatter((item?.amount).toString())}
                        </Text>
                    </TextTruncate>

                    <View style={currencyStyle(currencyWidth)}>
                        <Text style={currencyTextStyle}>{item?.userData?.preferredCurrency}</Text>
                    </View>
                </View>
            </View>

            <Collapsible collapsed={!showDetail}>
                <View style={detailContainerStyle(avatarWidth + nameWidth + rewardAndCurrencyWidth)}>
                    <TextTruncate
                        style={commentStyle(commentWidth)}
                        numberOfLines={1}
                        key={Math.random()}
                    >
                        <Text>
                            {itemComment}
                        </Text>
                    </TextTruncate>

                    <View style={timeAgoContainerStyle(timeAgoWidth)}>
                        <Text style={timeAgoTextStyle}>
                            {timeAgo}
                        </Text>
                    </View>
                </View>
            </Collapsible>
        </TouchableOpacity>
    );
}

export default memo(PostRewardModalItem);

const style = css`
    margin-bottom: 10px;
`;

const containerStyle = css`
    display: flex;
    flex-direction: row;
    min-width: 100%;
    margin: 15px 0 5px;
`;

const avatarContainerStyle = avatarWidth => css`
    width: ${avatarWidth + 'px'};
`;

const avatarStyle = avatarWidth => css`
    width: ${avatarWidth + 'px'};
    height: ${avatarWidth + 'px'};
    border-radius: ${(avatarWidth * 0.5) + 'px'};
`;

const nameContainerStyle = nameWidth => css`
    width: ${nameWidth + 'px'};
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    justify-content: flex-start;
    padding: 0 10px;
`;

const rewardValueContainerStyle = rewardAndCurrencyWidth => css`
    min-width: ${rewardAndCurrencyWidth + 'px'};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

const rewardValueStyle = rewardWidth => css`
    max-width: ${rewardWidth + 'px'};
    font-size: 14px;
    color: ${CONSTANTS.MY_BLUE};
    font-weight: 500;
`;

const currencyStyle = currencyWidth => css`
    width: ${currencyWidth + 'px'};
    padding-left: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const currencyTextStyle = css`
    font-size: 11px;
`;

const detailContainerStyle = width => css`
    width: ${width + 'px'};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const commentStyle = commentWidth => css`
    width: ${commentWidth + 'px'};
    font-size: 14px;
    color: ${CONSTANTS.MY_BLUE};
`;

const timeAgoContainerStyle = timeAgoWidth => css`
    width: ${timeAgoWidth + 'px'};
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const timeAgoTextStyle = css`
    font-size: 12px;
`;

