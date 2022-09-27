import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from "react-navigation";
import CONSTANTS, { COLORS, SIZES } from '../../../common/PeertalConstants';


const SetPincodeScreen = (props) => {

  const { firstPincode, secondPincode, nextStep, isMatched, onWillFocus, onBack, onClickNumber, onDeleteNumber } = props;

  const [focusNumber, setFocusNumber] = useState('');


  const onPressIn = (number) => {
    setFocusNumber(number);
  }

  const onPressOut = () => {
    setFocusNumber('');
  }


  return (
    <View>
      <NavigationEvents onWillFocus={onWillFocus} />
      <ImageBackground source={require('../../../assets/xd/background/Login-bg.png')} style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <View style={styles.header} >
            <TouchableOpacity onPress={onBack}>
              <MaterialCommunityIcons name='arrow-left' size={32} color={CONSTANTS.MY_BLACK_BORDER} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.topSection}>
              <FontAwesome name='lock' size={20} color={CONSTANTS.Colors.fontColor} />
              <Text style={styles.title}>Enter your</Text>
              <Text style={styles.bigTitle}>PIN Code</Text>
              <View style={{ height: 30 }}>
                {
                  isMatched ?
                    <Text style={styles.tryResult}>Pincode is successfully set</Text>
                    :
                    !nextStep && secondPincode.length === 4 ?
                      <Text style={styles.tryResult}>Pincodes aren't matched</Text>
                      :
                      <View />
                }
              </View>
            </View>
            <View style={styles.processSection}>
              <View style={styles.dotsGroup}>
                {
                  nextStep ?
                    [0, 1, 2, 3].map((item) => (
                      <View key={item}>
                        {
                          item < secondPincode.length ?
                            <View style={styles.circleFilled} />
                            :
                            <View style={styles.circle} />
                        }
                      </View>
                    ))
                    :
                    [0, 1, 2, 3].map((item) => (
                      <View key={item}>
                        {
                          item < firstPincode.length ?
                            <View style={styles.circleFilled} />
                            :
                            <View style={styles.circle} />
                        }
                      </View>
                    ))
                }
              </View>
            </View>
            <View style={styles.panSection}>
              <View style={styles.panRow}>
                {['1', '2', '3'].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={isMatched}
                    style={item === focusNumber ? styles.numberButtonFocused : styles.numberButton}
                    onPressIn={() => onPressIn(item)}
                    onPressOut={() => onPressOut()}
                    onPress={() => onClickNumber(item)}>
                    <Text style={item === focusNumber ? styles.numberTextFocused : styles.numberText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.panRow}>
                {['4', '5', '6'].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={isMatched}
                    style={item === focusNumber ? styles.numberButtonFocused : styles.numberButton}
                    onPressIn={() => onPressIn(item)}
                    onPressOut={() => onPressOut()}
                    onPress={() => onClickNumber(item)}>
                    <Text style={item === focusNumber ? styles.numberTextFocused : styles.numberText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.panRow}>
                {['7', '8', '9'].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={isMatched}
                    style={item === focusNumber ? styles.numberButtonFocused : styles.numberButton}
                    onPressIn={() => onPressIn(item)}
                    onPressOut={() => onPressOut()}
                    onPress={() => onClickNumber(item)}>
                    <Text style={item === focusNumber ? styles.numberTextFocused : styles.numberText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.panRow}>
                <View style={{ width: 64 }}></View>
                <TouchableOpacity
                  disabled={isMatched}
                  style={'0' === focusNumber ? styles.numberButtonFocused : styles.numberButton}
                  onPressIn={() => onPressIn('0')}
                  onPressOut={() => onPressOut()}
                  onPress={() => onClickNumber('0')}>
                  <Text style={'0' === focusNumber ? styles.numberTextFocused : styles.numberText}>{'0'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isMatched}
                  style={'10' === focusNumber ? styles.numberButtonFocused : styles.numberButton}
                  onPressIn={() => onPressIn('10')}
                  onPressOut={() => onPressOut()}
                  onPress={onDeleteNumber}>
                  <MaterialIcons name='reply' size={24} color={'10' === focusNumber ? CONSTANTS.Colors.white : CONSTANTS.Colors.fontColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.footer} />
        </View>
      </ImageBackground>
    </View>
  );
}


export default SetPincodeScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  statusBar: {
    height: CONSTANTS.SPARE_HEADER
  },
  header: {
    height: SIZES.header,
    paddingHorizontal: SIZES.size_20,
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    paddingVertical: SIZES.size_20,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  topSection: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    marginTop: SIZES.size_20,
    fontSize: SIZES.font_20,
    color: COLORS.blurFontColor
  },
  bigTitle: {
    fontSize: SIZES.font_32,
    color: COLORS.fontColor
  },
  tryResult: {
    color: COLORS.blurFontColor
  },
  forgotResult: {
    color: COLORS.blurBule,
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.blurBule
  },
  processSection: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  dotsGroup: {
    width: SIZES.windowWidth * 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  circle: {
    width: SIZES.size_12,
    height: SIZES.size_12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.size_6,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.blurBule
  },
  circleFilled: {
    width: SIZES.size_12,
    height: SIZES.size_12,
    backgroundColor: COLORS.blue,
    borderRadius: SIZES.size_6,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.blurBule
  },
  panSection: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  panRow: {
    width: SIZES.windowWidth * 0.8,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  numberButton: {
    width: 64,
    height: 64,
    borderRadius: SIZES.size_32,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.lightBorderColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  numberButtonFocused: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.blue,
    borderRadius: SIZES.size_32,
    borderWidth: SIZES.size_1,
    borderColor: COLORS.lightBorderColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  numberText: {
    fontSize: SIZES.font_24,
    color: COLORS.fontColor
  },
  numberTextFocused: {
    fontSize: SIZES.font_24,
    color: COLORS.white
  },
  footer: {
    height: CONSTANTS.SPARE_FOOTER
  }
});