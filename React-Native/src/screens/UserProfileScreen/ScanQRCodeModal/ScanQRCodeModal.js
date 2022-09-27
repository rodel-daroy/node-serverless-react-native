import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { css } from '@emotion/native';

import { Text } from '../../../components/CoreUIComponents';
import CONSTANTS from '../../../common/PeertalConstants';
import { Icon } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQRCodeModal = (props) => {

  const {
    myCodeTab,
    _setTab,
    getMyCodeTabName,
    onSuccess,
    showUp,
    onClose,
    description,
    qrImageUrl
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
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                color: '#414042',
              }}>
              SCAN QR CODE
            </Text>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white' }}>
          <TouchableOpacity onPress={() => _setTab(true)}>
            <Text
              style={
                myCodeTab
                  ? styles.activeTab
                  : styles.notActiveTab
              }>
              {getMyCodeTabName()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _setTab(false)}>
            <Text
              style={
                !myCodeTab
                  ? styles.activeTab
                  : styles.notActiveTab
              }>
              Scan Code
            </Text>
          </TouchableOpacity>
        </View>
        {myCodeTab ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={qrcodeAndLoadingContainerStyle}>
              <View style={qrcodeContainerStyle}>
                <Image
                  style={qrcodeStyle}
                  source={{ uri: qrImageUrl }}
                />
              </View>
              <Image
                style={loadingProcessStyle}
                source={require("../../../assets/icon/apploading.gif")}
                style={{
                  width: 66,
                  height: 66,
                  opacity: 0.8
                }}
              />
            </View>

            <Text
              style={{
                marginTop: 30,
                marginHorizontal: 10,
                textAlign: 'center',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
              }}>
              {description}
            </Text>
            <TouchableOpacity
              style={{
                width: CONSTANTS.WIDTH - 15 - 30 - 30,
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
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                  fontSize: 14,
                }}>
                Share {props.QRCodeUserName}'s code
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground
              source={require('../../../assets/xd/background/qrscan_bg.png')}
              style={{
                width: '100%',
                height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
                alignItems: 'center',
              }}>
              <QRCodeScanner
                onRead={onSuccess}
                topContent={
                  <View>
                    <Text
                      style={{
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                        fontSize: 14,
                        width: CONSTANTS.WIDTH - 15 - 30 - 30,
                        textAlign: 'center',
                        color: '#ffffff'
                      }}>{`Place the QR code in the center of the square to find the user`}</Text>
                    <Text style={{}}>{` `}</Text>
                  </View>
                }
                cameraStyle={{
                  height: 260,
                  width: 250,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: "#000000",
                  overflow: 'hidden',
                  borderRadius: 10,
                }}
              />
            </ImageBackground>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default ScanQRCodeModal;

const styles = {
  activeTab: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
    fontSize: 24,
    margin: 15,
    color: "#414042",
  },
  notActiveTab: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
    fontSize: 24,
    margin: 15,
    color: "#414042",
    opacity: 0.2,
  },
};

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