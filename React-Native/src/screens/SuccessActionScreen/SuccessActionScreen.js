import React, {memo} from 'react';
import {ImageBackground, View} from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import {RoundButton, Text} from '../../components/CoreUIComponents';

const SuccessActionScreen = (props) => {
  const {
    title,
    headline,
    firstLine,
    mainNumber,
    mainCurrency,
    secondLine,
    message,
  } = props;
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
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
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
            {title}
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
        <Text style={styles.title}>{headline}</Text>
        <Text style={styles.normal}>{firstLine}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.mainCurrency}>{mainCurrency}</Text>
          <Text style={styles.mainNumber}>{mainNumber}</Text>
        </View>
        <Text style={styles.normal}>{secondLine}</Text>
        <View style={styles.blackLine} />

        <Text style={styles.normal}>{message}</Text>
        <RoundButton
          text="Done"
          style={{width: '40%', marginTop: 20}}
          onPress={() => props.navigation.navigate('MainFlow')}
        />
      </ImageBackground>
    </View>
  );
};

export default memo(SuccessActionScreen);

const styles = {
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: 'white',
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  blackLine: {
    width: '30%',
    marginVertical: 20,
    borderBottomColor: CONSTANTS.MY_GREY,
    borderBottomWidth: 1,
  },
  mainNumber: {
    fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE + 10,
    color: CONSTANTS.MY_BLUE,
  },
  mainCurrency: {
    marginHorizontal: 10,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10,
  },
  normal: {
    marginVertical: 10,
    fontSize: 14,
    maxWidth: '80%',
  },
  title: {
    fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    // color: CONSTANTS.MY_BLUE,
    marginTop: 50,
  },
};
