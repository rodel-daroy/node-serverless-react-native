import React , {memo} from "react";
import { Icon } from "native-base";
import { View, TouchableOpacity } from "react-native";

import { Text } from "./CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";

const BankAccountItem = ({ data, navigation, isFromWalletInformation }) => {

  return (
    <TouchableOpacity
      onPress={() =>
        isFromWalletInformation ? navigation.navigate("BankAccount", { data: data }) : navigation.navigate("CashOutAction", { data: data })
      }
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 15,
        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
        backgroundColor: "white",
        width: CONSTANTS.WIDTH - 30,
        padding: 15,
        ...CONSTANTS.MY_SHADOW_STYLE
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <Icon name="bank" type="FontAwesome" />
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
            {data.account_holder_name}
          </Text>
          <Text style={{ fontSize: 12 }}>{data.account_number}</Text>
        </View>
      </View>
      <Icon name="ios-arrow-forward" style={{ fontSize: 16 }} />
    </TouchableOpacity>
  );
}

export default memo(BankAccountItem);
