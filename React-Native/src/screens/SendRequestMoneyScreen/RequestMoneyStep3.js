import React, { memo } from "react";
import { View } from "react-native";

import { Text, RoundButton } from "../../components/CoreUIComponents";
import GroupAvatars from '../../components/GroupAvatars';
import CONSTANTS from "../../common/PeertalConstants";

const RequestMoneyStep3 = props => {
    const {
        listUsers,
        fee,
        amountText,
        description,
        handleSendMoney,
        avatarUrlList
    } = props;
    return (
        <View style={{ marginLeft: 20, marginRight: 15 }}>
            <Text style={{ marginTop: 40, color: CONSTANTS.MY_BLUE }}>Step 3</Text>
            <Text
                style={{
                    marginTop: 0,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                    color: CONSTANTS.MY_BLUE,
                    fontSize: 18
                }}
            >
                Finish
        </Text>
            <View
                style={{
                    marginTop: 30,
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    ...CONSTANTS.MY_SHADOW_STYLE,
                }}>
                <View
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#D1D3D4',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingVertical: 16,
                    }}
                >
                    <GroupAvatars data={avatarUrlList} />
                    <View style={{ paddingLeft: 10, width: '82%' }}>
                        <Text style={styles.blueTitle}>Send to</Text>
                        <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }} >
                            {listUsers}
                        </Text>
                    </View>
                </View>
                <View style={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    paddingTop: 10,
                    paddingBottom: 25,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}>
                    <Text style={styles.blueTitle}>Amount</Text>
                    <Text style={{ fontSize: 18, marginBottom: 14 }} >{amountText}</Text>
                    {/* <Text style={styles.blueTitle}>Fee</Text>
                    <Text style={{ fontSize: 18, marginBottom: 14 }}>{fee}</Text> */}
                    <Text style={styles.blueTitle}>Payment Request Info</Text>
                    <Text style={{ fontSize: 18 }} >
                        {description}
                    </Text>
                </View>
                <RoundButton
                    text="Send a Payment Request"
                    type="blue"
                    style={{ width: 250 * CONSTANTS.WIDTH_RATIO, marginBottom: 30 }}
                    onPress={handleSendMoney}
                />
            </View>
        </View >
    )
}

export default memo(RequestMoneyStep3);

const styles = {
    step: {
        marginVertical: 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CONSTANTS.MY_BLUE,
        marginLeft: -40,
        alignItems: "center",
        justifyContent: "center"
    },
    stepText: {
        color: "white",
        marginLeft: 35,
        fontSize: 22,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
    },
    stepNoActive: {
        marginVertical: 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: CONSTANTS.MY_GRAYBG,
        marginLeft: -40,
        alignItems: "center",
        justifyContent: "center"
    },
    stepNoActiveText: {
        color: CONSTANTS.MY_GREY,
        marginLeft: 35,
        fontSize: 22,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
    },
    textInput: {
        padding: 5,
        width: "100%",
        borderRadius: 5,
        // minHeight: 50,
        backgroundColor: "white",
        borderWidth: 1,
        borderBottomColor: "black",
        marginTop: 10,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
    },
    dollarInput: {
        // padding: 5,
        width: "50%",
        textAlign: "right"
        // marginTop: 10
    },
    dollarBox: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        borderRadius: 5,
        justifyContent: "space-between",
        borderRadius: 5,
        minHeight: 50,
        backgroundColor: "white",
        borderWidth: 1,
        borderBottomColor: "black",
        paddingHorizontal: 10
    },
    blueTitle: {
        fontSize: 12,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
        color: CONSTANTS.MY_BLUE,
        marginTop: 10
    }
};
