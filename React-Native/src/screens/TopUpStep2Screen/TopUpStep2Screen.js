import { Icon } from "native-base";
import React, { memo } from "react";
import { Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { monetaryDigitsFormatter } from "../../common/includes/monetaryDigitsFormatter";
import { removeCommaFromString } from "../../common/includes/removeCommaFromString";
import CONSTANTS, { COLORS, SIZES } from "../../common/PeertalConstants";
import { OverlayLoading, Text } from "../../components/CoreUIComponents";
import CurrencyIcon from "../../components/CurrencyIcon";


const TopUpStep2Screen = (props) => {

  const {
    amountDollar,
    setAmountDollar,
    isLoading,
    requestContracts,
    dollarNumber,
    currency,
    cardLogo,
    cardNumber,
    fullName,
    coinValue
  } = props;


  return (
    <View style={{ height: '100%', flexDirection: 'column' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AntDesign name='arrowleft' size={28} color={COLORS.fontColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TOP UP</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/xd/background/Login-bg.png')}
          style={{ width: '100%', height: SIZES.windowHeight - CONSTANTS.SPARE_HEADER - SIZES.header }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 320 * CONSTANTS.WIDTH_RATIO,
                height: 120,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.size_10,
                marginVertical: SIZES.size_24,
                marginLeft: 18 * CONSTANTS.WIDTH_RATIO,
                position: 'relative',
                ...CONSTANTS.MY_SHADOW_STYLE
              }}>
              <Image
                source={require('../../assets/xd/wallet-right-border.png')}
                style={{ position: 'absolute', top: 0, right: 0 }} />
              <Text style={{ marginTop: SIZES.size_24, marginLeft: 24 * CONSTANTS.WIDTH_RATIO, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD }}>
                Current Balance
              </Text>
              <View style={{ marginLeft: 22 * CONSTANTS.WIDTH_RATIO, flexDirection: 'row', position: 'relative' }}>
                <Text style={{ fontSize: 40, color: COLORS.blue }}>
                  {monetaryDigitsFormatter(props.dollarNumber)}
                </Text>
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: SIZES.font_14,
                    color: COLORS.blue,
                    position: 'absolute',
                    bottom: 7
                  }}>
                  {props.currency}
                </Text>
              </View>
            </View>
            <View style={{
              width: (79 / 375) * SIZES.windowWidth,
              height: 90,
              backgroundColor: COLORS.white,
              marginLeft: (18 / 375) * SIZES.windowWidth,
              borderRadius: SIZES.size_10,
              ...CONSTANTS.MY_SHADOW_STYLE
            }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 25.5,
              marginHorizontal: 15,
              alignSelf: "flex-start",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Image source={cardLogo} style={{ width: 50, height: 15, marginRight: 20 }} />
            <View>
              <Text style={styles.cardName}>{fullName}</Text>
              <Text style={styles.cardNumber}>{cardNumber}</Text>
            </View>
          </View>

          <View style={{ height: 1, borderBottomWidth: 1, borderBottomColor: "#D1D3D4", width: "100%" }} />

          <View style={{ width: "100%", paddingHorizontal: 15 }}>

            <View style={{ flexDirection: "row", marginTop: 20 }}>

              <Icon style={{ fontSize: 16 }} name="money" type="FontAwesome" />
              <Text style={{ marginLeft: 10, fontSize: 12 }}>Add the amount of money</Text>
            </View>
            <View
              style={{
                ...styles.dollarBox
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "black",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CurrencyIcon currency={currency} />
                </View>
                <Text style={{ marginLeft: 5 }}>{currency}</Text>
              </View>

              <TextInput
                autoFocus={true}
                autoCorrect={false}
                style={{ ...styles.dollarInput }}
                value={monetaryDigitsFormatter(amountDollar)}
                keyboardType="numeric"
                onChangeText={(value) => setAmountDollar(removeCommaFromString(value))}
                placeholder="0.00"
                onSubmitEditing={() => {
                  let decimal = amountDollar.indexOf('.');
                  let position = decimal < 0 ? decimal : (amountDollar.length - decimal - 1);
                  if (position === 0)
                    alert('Amount format error');
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={requestContracts}
            style={{
              height: 50,
              borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
              marginTop: 30,
              marginHorizontal: 15,
              width: CONSTANTS.WIDTH - 30,
              padding: 15,
              backgroundColor: CONSTANTS.MY_BLUE,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14 }}>
              Preview
            </Text>
          </TouchableOpacity>
          {isLoading && (
            <OverlayLoading />
          )}
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

export default memo(TopUpStep2Screen);

const styles = {
  header: {
    height: SIZES.header,
    marginTop: CONSTANTS.SPARE_HEADER,
    borderBottomWidth: SIZES.size_1,
    borderBottomColor: COLORS.white,
    paddingHorizontal: SIZES.size_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CONSTANTS.MY_SHADOW_STYLE
  },
  headerTitle: {
    fontSize: SIZES.font_20,
    fontWeight: '700',
    color: COLORS.fontColor
  },
  cardName: {
    color: COLORS.blue,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: SIZES.font_14
  },
  cardNumber: {
    color: COLORS.blue,
    fontSize: SIZES.font_12
  },
  dollarInput: {
    width: "50%",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    textAlign: "right"
  },
  dollarBox: {
    minHeight: SIZES.size_50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.size_10,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.unFocusedBorder,
    marginTop: SIZES.size_10,
    paddingHorizontal: SIZES.size_10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  inputBox: {
    minHeight: SIZES.size_50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.size_10,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.unFocusedBorder,
    marginTop: SIZES.size_20,
    paddingHorizontal: SIZES.size_10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
};
