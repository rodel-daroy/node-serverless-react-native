import React, { memo, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import CONSTANTS from "../../common/PeertalConstants";
import { Text } from "../../components/CoreUIComponents";

const TransactionItems = (props) => {

    const [extended, setExtended] = useState(false);

    const data = props.data;
    const {receiver, sender, amount, createdAt, status, type, reason, exchangeRate} = data;
    const user = type == "send" ? receiver : sender;
    const dateValue = new Date(createdAt).toLocaleString("en-GB", {dateStyle: "full"});
    const ago = dateValue === 'now' ? '' : ' ago';
    const newDate = CONSTANTS.getTimeDifference(dateValue) + ago;
    //const dollarAmount = (amount * exchangeRate).toFixed(2);
    const dollarAmount = amount + " " + props.user.preferredCurrency;
    return (
        <View>
            <View
                style={{
                    marginHorizontal: 18.1 * CONSTANTS.WIDTH_RATIO,
                    marginTop: 20,
                    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                    backgroundColor: "white",
                    ...CONSTANTS.MY_SHADOW_STYLE
                }}
            >
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Image
                        source={{uri: user.avatarUrl || CONSTANTS.DEFAULT_AVATAR}}
                        style={{width: 47.6, height: 47.6, borderRadius: 23.8, margin: 16}}
                    />
                    <TouchableOpacity
                        onPress={() => setExtended(!extended)}
                        style={{width: CONSTANTS.WIDTH - 30 - 80, paddingRight: 15}}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text style={{fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD}}>{user.fullName}</Text>
                            <Text style={{fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD}}>{dollarAmount}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text>{status}</Text>
                            <Text>{newDate}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {extended ? (
                    <View style={{alignItems: "center", margin: 15}}>
                        <Text>{reason}</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

export default memo(TransactionItems);
