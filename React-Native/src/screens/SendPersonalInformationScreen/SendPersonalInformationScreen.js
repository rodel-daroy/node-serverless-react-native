import React from 'react';
import {Icon} from 'native-base';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import {RoundButton} from '../../components/CoreUIComponents';

const SendPersonalInformationScreen = (props) => {
  const {text, data, imageResize, requestVerification} = props;

  return (
    <View style={{flexDirection: 'column', height: '100%'}}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{marginLeft: 15}} />
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
              color: 'black',
            }}>
            ADD PERSONAL INFORMATION
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{
          width: '100%',
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
        }}>
        <View style={{marginTop: 52, display: 'flex', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
            }}>
            {text.desc1}
          </Text>
          <Text
            style={{
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              color: '#414042',
              marginTop: 14,
            }}>
            {text.desc2}
          </Text>
        </View>
        <View
          style={{
            marginTop: 39,
            width: 375 * CONSTANTS.WIDTH_RATIO,
            height: 230,
            position: 'relative',
          }}>
          <Image
            source={{uri: data.url}}
            style={{width: '100%', height: '100%'}}
          />
          <Image
            source={require('../../assets/xd/top-left-frame.png')}
            style={{position: 'absolute', left: 0, top: 0}}
          />
          <Image
            source={require('../../assets/xd/top-right-frame.png')}
            style={{position: 'absolute', right: 0, top: 0}}
          />
          <Image
            source={require('../../assets/xd/bottom-left-frame.png')}
            style={{position: 'absolute', left: 0, bottom: 0}}
          />
          <Image
            source={require('../../assets/xd/bottom-right-frame.png')}
            style={{position: 'absolute', right: 0, bottom: 0}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 52,
            width: '100%',
          }}>
          <RoundButton
            text="Cancel"
            type="gray"
            style={{width: 102}}
            onPress={() => {
              props.navigation.goBack();
            }}
          />
          <RoundButton
            text="Resize"
            style={{width: 102, marginLeft: 20}}
            onPress={() => {
              imageResize();
            }}
          />
          <RoundButton
            text="Next"
            style={{width: 102, marginLeft: 20}}
            onPress={() => {
              requestVerification();
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default SendPersonalInformationScreen;
