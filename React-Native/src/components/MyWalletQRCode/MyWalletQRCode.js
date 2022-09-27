import React, { memo, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { css } from '@emotion/native';

import { Text } from '../CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';
import { Icon } from 'native-base';

const MyWalletQRCode = (props) => {
  const {
    showUp,
    onClose,
    avatarUrl,
    walletAddress,
    walletName,
    description,
    qrImageUrl,
    Clipboard,
    identityStatus,
    verifiedDesc,
    verifyingDesc,
    unverifiedDesc,
    unverifiedLink,
    rejectedDesc,
    navigation,
  } = props;

  return (
    <Modal animationType="slide" transparent={false} visible={showUp}>
      <View style={{ flexDirection: 'column', height: '100%' }}>
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
          <TouchableOpacity onPress={() => onClose()}>
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
            alignItems: 'center',
          }}>
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 100, height: 100, borderRadius: 50, marginTop: 20 }}
          />
          <Text
            style={{ marginTop: 20, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
            {walletName}
          </Text>
          <View style={qrcodeAndLoadingContainerStyle}>
            <View style={qrcodeContainerStyle}>
              <Image
                style={qrcodeStyle}
                source={{ uri: qrImageUrl }}
              />
            </View>
            <Image
              style={loadingProcessStyle}
              source={require("../../assets/icon/apploading.gif")}
              style={{
                width: 66,
                height: 66,
                opacity: 0.8
              }}
            />
          </View>
          <Text
            style={{ marginTop: 30, textAlign: 'center', marginHorizontal: 15 }}>
            {description}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(walletAddress);
            }}
            style={{
              width: '70%',
              height: 50,
              borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
              marginTop: 30,
              backgroundColor: CONSTANTS.MY_BLUE,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                fontSize: 14,
              }}>
              Copy Wallet Address
            </Text>
          </TouchableOpacity>

          {identityStatus === 'unverified' && (
            <View>
              <Text
                style={{
                  marginTop: 30,
                  textAlign: 'center',
                  marginHorizontal: 15,
                }}>
                {unverifiedDesc}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  navigation.navigate('AddPersonalInformation');
                }}>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    marginHorizontal: 15,
                    color: CONSTANTS.MY_BLUE,
                  }}>
                  {unverifiedLink}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {identityStatus === 'rejected' && (
            <View>
              <Text
                style={{
                  marginTop: 30,
                  textAlign: 'center',
                  marginHorizontal: 15,
                }}>
                {rejectedDesc}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  navigation.navigate('AddPersonalInformation');
                }}>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    marginHorizontal: 15,
                    color: CONSTANTS.MY_BLUE,
                  }}>
                  {unverifiedLink}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {identityStatus === 'verified' && (
            <View>
              <Text
                style={{
                  marginTop: 30,
                  textAlign: 'center',
                  marginHorizontal: 15,
                  color: CONSTANTS.MY_BLUE,
                }}>
                {verifiedDesc}
              </Text>
            </View>
          )}

          {identityStatus === 'verifying' && (
            <View>
              <Text
                style={{
                  marginTop: 30,
                  textAlign: 'center',
                  marginHorizontal: 15,
                }}>
                {verifyingDesc}
              </Text>
            </View>
          )}
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default memo(MyWalletQRCode);

const qrcodeAndLoadingContainerStyle = css`
  margin: 40px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const qrcodeContainerStyle = css`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  z-index: 1;
`;

const loadingProcessStyle = css`
  position: absolute;
`;

const qrcodeStyle = css`
  width: 100%;
  height: 100%;
`;