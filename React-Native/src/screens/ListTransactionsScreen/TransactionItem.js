import React, { memo, useMemo, useCallback, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { css } from '@emotion/native';

import CONSTANTS from "../../common/PeertalConstants";
import { Text } from "../../components/CoreUIComponents";
import TransactionItemModal from "../../components/TransactionItemModal";
import UserObject from "../../models/UserObject";
import { monetaryDigitsFormatter } from "../../common/includes/monetaryDigitsFormatter";
import { capitalize } from "../../common/includes/capitalize";

const TransactionItem = (props) => {
    const {
        data,
        userAccessToken,
    } = props;

    const [popUp, setPopUp] = useState(false);

    const timeAgo = useCallback((createdAt) => {
        return CONSTANTS.getTimeDifference(createdAt);
    }, [CONSTANTS.getTimeDifference]);

    const userData = useMemo(() => {
        return (data.totalCoin < 0 ? data.receiver : data.sender) || new UserObject()
    }, [data, UserObject]);

    const avatarUrl = useMemo(() => {
        if (data.type === 'topup' || data.type === 'cashout') {
            return require("../../assets/icon/kuky.png");
        } else {
            return {uri: userData.avatarUrl || CONSTANTS.DEFAULT_AVATAR}
        }
    }, [data, userData, CONSTANTS.DEFAULT_AVATAR]);

    const amountValue = useMemo(() => {
        return monetaryDigitsFormatter((data.totalCoin * data.exchangeRate).toFixed(2)) + ' ' + data.currency;
    }, [monetaryDigitsFormatter, data]);

    const amount = useMemo(() => {
        return data.type === "receive" || data.type === "topup" ? "+" + amountValue : amountValue;
    }, [data, amountValue]);

    const status = useMemo(() => {
        return (capitalize(data.type));
    }, [data, capitalize]);

    return (
        <View
            style={style}
        >
            <Image source={avatarUrl} style={avatarStyle}/>

            <TouchableOpacity
                onPress={() => setPopUp(true)}
                style={{width: CONSTANTS.WIDTH - 30 - 80, paddingRight: 15}}
            >
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={{fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14}}>
                        {data.type === 'cashout' || data.type === 'topup' ? 'Kuky' : userData.fullName}
                    </Text>
                    <Text style={{
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                        fontSize: 14,
                        color: data.type === 'send' || data.type === 'cashout' ? "#FF1A53" : data.type === 'receive' || data.type === 'topup' ? "#0075FF" : "#939598"
                    }}>
                        {amount}
                    </Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text
                        style={{color: data.type === 'send' || data.type === 'cashout' ? "#FF1A53" : data.type === 'receive' || data.type === 'topup' ? "#0075FF" : "#939598"}}>
                        {status}
                    </Text>
                    <Text>{timeAgo(data.createdAt) === 'now' ? timeAgo(data.createdAt) : timeAgo(data.createdAt) + ' ago'}</Text>
                </View>
            </TouchableOpacity>
            <TransactionItemModal
                enabled={popUp}
                onClose={() => setPopUp(false)}
                data={data}
                userAccessToken={userAccessToken}
            />
        </View>
    );
}

export default memo(TransactionItem);

const style = {
    marginHorizontal: 18.1 * CONSTANTS.WIDTH_RATIO,
    marginTop: 20,
    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    ...CONSTANTS.MY_SHADOW_STYLE
}

const avatarStyle = css`
  width: 47.6px;
  height: 47.6px;
  border-radius: 23.8px;
  margin: 15px;
`;
