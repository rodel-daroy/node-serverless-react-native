import React, { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS, { COLORS, SIZES } from "../common/PeertalConstants";
import { Text } from "./CoreUIComponents";


const CreditCardItem = (props) => {

  const { cardLogo, data, user, walletData, isFromWalletInformation } = props;

  const bank = user?.fullName || "Full Name";
  const cardType = data?.card?.brand || "visa";
  const cardNumber = "***" + data?.card?.last4 || "checking ***1293";


  return (
    <TouchableOpacity
      style={{
        width: SIZES.windowWidth * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.size_10,
        marginTop: SIZES.size_20,
        marginHorizontal: SIZES.size_16,
        padding: SIZES.size_16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...CONSTANTS.MY_SHADOW_STYLE
      }}
      onPress={() => isFromWalletInformation ?
        props.navigation.navigate('Card', { data: data, cardLogo: cardLogo })
        :
        props.navigation.navigate('TopUpStep2', { user: user, data: data, walletData: walletData })
      }>
      <View style={{ width: SIZES.size_64, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={cardLogo[cardType]} style={{ width: SIZES.size_50, height: SIZES.size_16 }} />
      </View>
      <View style={{ flex: 1, paddingRight: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>{bank}</Text>
          <Text style={{ fontSize: SIZES.font_12, color: COLORS.blurFontColor }}>{cardNumber}</Text>
        </View>
        <MaterialIcons name='arrow-forward' size={16} color={COLORS.fontColor} />
      </View>
    </TouchableOpacity >
  );
}

export default memo(CreditCardItem);