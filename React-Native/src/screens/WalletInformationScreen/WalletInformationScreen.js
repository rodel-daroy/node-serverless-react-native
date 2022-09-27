import { Icon } from 'native-base';
import React, { memo } from 'react';
import { Image, ImageBackground, TouchableOpacity, View, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';
import MyWalletQRCode from '../../components/MyWalletQRCode';

const WalletInformationScreen = (props) => {
  const {
    isLoading,
    isBankAccountLoading,
    isPaymentMethodsLoading,
    isWalletDetailLoading
  } = props;
  
  if (isLoading || isBankAccountLoading || isPaymentMethodsLoading || isWalletDetailLoading) {
    return (
      <View
        style={{
          position: 'absolute',
          left: CONSTANTS.WIDTH / 2,
          top: '40%',
        }}>
        <OverlayLoading />
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <NavigationEvents
        onWillFocus={() => {
          props._loadingData();
        }}
      />
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.TOP_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
            }}>
            WALLET INFORMATION
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{
          width: '100%',
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
        }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: 'white',
              width: 320 * CONSTANTS.WIDTH_RATIO, //corrected ratio
              height: 120,
              marginTop: CONSTANTS.TOP_PADDING,
              marginLeft: 18 * CONSTANTS.WIDTH_RATIO,
              marginBottom: 23,
              borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
              ...CONSTANTS.MY_SHADOW_STYLE
            }}>
            <Image style={{ position: 'absolute', right: 0, top: 0 }} source={require('../../assets/xd/wallet-right-border.png')} />
            <Text
              style={{
                marginTop: 25,
                marginLeft: 24 * CONSTANTS.WIDTH_RATIO,
                marginTop: 25,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
              }}>
              Current Balance
            </Text>
            <View style={{ flexDirection: 'row', marginLeft: 22 * CONSTANTS.WIDTH_RATIO, position: 'relative' }}>
              {/* <Icon
                name="attach-money"
                type="MaterialIcons"
                style={{
                  fontSize: 16,
                  color: CONSTANTS.MY_BLUE,
                  marginTop: 10,
                }}
              /> */}
              <Text style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }}>
                {monetaryDigitsFormatter(props.dollarNumber)}
              </Text>
              <Text
                style={{
                  color: CONSTANTS.MY_BLUE,
                  marginLeft: 7,
                  position: 'absolute',
                  bottom: 7,
                  fontSize: 14,
                }}>
                {props.currency}
              </Text>
            </View>
          </View>
          <View style={{
            width: (79 / 375) * CONSTANTS.WIDTH,
            height: 90,
            marginLeft: (18 / 375) * CONSTANTS.WIDTH,
            backgroundColor: 'white',
            borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
            ...CONSTANTS.MY_SHADOW_STYLE
          }} />
        </View>
        <ScrollView>
          <View
            style={{
              marginTop: 15,
              paddingVertical: 26.5,
              paddingHorizontal: 18 * CONSTANTS.WIDTH_RATIO,
              borderBottomWidth: 1,
              borderBottomColor: '#D1D3D4'
            }}>
            <TouchableOpacity
              onPress={() => props.setWalletModal(true)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <Text style={{ fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: "#414042" }}>My QR Code</Text>
              <Icon name="ios-arrow-forward" style={{ fontSize: 18, fontWeight: '800', color: "#414042" }} />
            </TouchableOpacity>
          </View>
          {props._renderBankAccount()}
          {props._renderCard()}
        </ScrollView>
      </ImageBackground>
      <MyWalletQRCode
        enabled={props.walletModal}
        onClose={() => props.setWalletModal(false)}
        data={props.walletData}
        user={props.user}
        navigation={props.navigation}
      />
    </View>
  );
}

export default memo(WalletInformationScreen);