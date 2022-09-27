import React, { memo } from "react";
import { View, TouchableOpacity, ImageBackground, ScrollView, TextInput } from "react-native";
import { Text, OverlayLoading } from "../../components/CoreUIComponents";
import CONSTANTS from "../../common/PeertalConstants";
import { Icon } from "native-base";

const BankAccountScreen = (props) => {

  const {
    isLoading,
    accountData,
    alert,
    deleteBank
  } = props;

  return (
    <View style={{ flexDirection: "column", height: "100%" }}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: "center",
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: "white",
          justifyContent: "flex-start",
          flexDirection: "row"
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrowleft"
            type="AntDesign"
            style={{ marginLeft: 15 }}
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: "black"
            }}
          >
            {accountData.account_holder_name}'s BANK
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require("../../assets/xd/background/Login-bg.png")}
        style={{
          width: "100%",
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
        }}
      >
        <View style={{ marginHorizontal: 36.4, marginTop: CONSTANTS.TOP_PADDING, height: 175, }}>
          <ImageBackground
            source={require("../../assets/xd/background/wallet_info_bg.png")}
            style={{
              position: 'relative',
              width: "100%",
              height: "100%"
            }}
          >
            <Icon name="bank" type="FontAwesome" style={{
              position: 'absolute',
              right: 20.5,
              top: 14.5,
              color: '#2699FB',
              fontSize: 22
            }} />
            <View style={{
              position: 'absolute',
              left: 15.5,
              bottom: 45.5,
            }}>
              <Text style={{ fontSize: 14 }}>{accountData.account_holder_name}</Text>
              <Text style={{ fontSize: 14 }}>{accountData.account_number}</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={{
          marginHorizontal: 30,
          marginTop: 45,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Type</Text>
          <Text style={{ fontSize: 14 }}>Checking</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            alert({
              title: 'Delete',
              main: 'Do you really want to delete your bank account?',
              button: [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => {
                    alert("");
                    deleteBank(accountData.id);
                  },
                },
              ],
            });
          }}
          style={{
            marginHorizontal: 30,
            marginTop: 30,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{ paddingLeft: 1, backgroundColor: CONSTANTS.MY_BLUE, width: 19, height: 19, borderRadius: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              name="minus"
              type="AntDesign"
              style={{ fontSize: 15, color: '#ffffff' }}
            />
          </View>
          <Text style={{ marginLeft: 12, fontSize: 14, color: CONSTANTS.MY_BLUE, lineHeight: 18 }}>Remove Bank Account</Text>
        </TouchableOpacity>
      </ImageBackground>
      {isLoading ? <OverlayLoading /> : null}
    </View>
  );
}

export default memo(BankAccountScreen);
