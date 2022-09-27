import { Icon } from 'native-base';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading } from '../../components/CoreUIComponents';

const TandCScreen = (props) => {
  const {
    isLoading,
    title,
    pageName1,
    pageName2,
    body,
    mounted
  } = props;
  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          shadowColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          ...CONSTANTS.TOP_SHADOW_STYLE
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }} />
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
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON
            }}>
            {title}
          </Text>
        </View>
      </View>
      <ImageBackground
        style={{
          width: '100%',
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../../assets/xd/header/TandC_header.png')}>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {pageName1}
        </Text>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {pageName2}
        </Text>
      </ImageBackground>
      {mounted && <ScrollView style={{
        paddingLeft: 15,
        paddingRight: 17.3
      }}>
        <HTMLView
          value={body}
          stylesheet={htmlstyles}
        />
        <View style={{ width: '100%', height: 100 }}></View>
      </ScrollView>}
      {isLoading ? <OverlayLoading /> : null}
    </View>
  );
}

export default TandCScreen;

let htmlstyles = StyleSheet.create({
  p: {
    fontSize: 14,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    color: '#414042',
    marginBottom: -16,
  },
  strong: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
    fontSize: 18,
    color: '#0477FF'
  },
  h3: {
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    color: '#0075FF'
  },
  header: {
    fontSize: 14,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    color: '#0477FF'
  }
})