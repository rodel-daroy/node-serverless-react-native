import React, { memo } from "react";
import { View, TouchableOpacity, ImageBackground, } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Icon } from "native-base";

import { Text, OverlayLoading } from "../../components/CoreUIComponents";
import CONSTANTS from "../../common/PeertalConstants";

const SendMoneyScreen = (props) => {
  const {
    currentStep,
    isLoading,
    _setStep,
    _renderStep1,
    _renderStep2,
    _renderStep3,
    _initData,
    checkSteps
  } = props;
  return (
    <View>
      <NavigationEvents onWillFocus={_initData} />
      <View style={{ flexDirection: "column", height: "100%" }}>
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
          }}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }} />
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
              SEND MONEY
              </Text>
          </View>
        </View>
        <ImageBackground
          source={require("../../assets/xd/background/Login-bg.png")}
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
            flexDirection: "row"
          }}
        >
          <View style={{ width: 40, height: "100%" }}>
            <TouchableOpacity
              onPress={() => _setStep(1)}
              style={
                currentStep == 1
                  ? styles.step
                  : styles.stepNoActive
              }
            >
              <Text
                style={
                  currentStep == 1
                    ? styles.stepText
                    : styles.stepNoActiveText
                }
              >
                1
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => checkSteps(1)}
              style={
                currentStep == 2
                  ? styles.step
                  : styles.stepNoActive
              }
            >
              <Text
                style={
                  currentStep == 2
                    ? styles.stepText
                    : styles.stepNoActiveText
                }
              >
                2
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => checkSteps(2)}
              style={
                currentStep == 3
                  ? styles.step
                  : styles.stepNoActive
              }
            >
              <Text
                style={
                  currentStep == 3
                    ? styles.stepText
                    : styles.stepNoActiveText
                }
              >
                3
                </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: CONSTANTS.WIDTH - 40, height: "100%" }}>
            {currentStep == 1
              ? _renderStep1()
              : currentStep == 2
                ? _renderStep2()
                : _renderStep3()}
          </View>
        </ImageBackground>
        {isLoading ? <OverlayLoading /> : null}
      </View>
    </View>
  );
}

export default memo(SendMoneyScreen);

const styles = {
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepText: {
    color: "white",
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  textInput: {
    padding: 5,
    width: "100%",
    borderRadius: 5,
    // minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    marginTop: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
    textAlign: "right"
    // marginTop: 10
  },
  dollarBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    paddingHorizontal: 10
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  }
};