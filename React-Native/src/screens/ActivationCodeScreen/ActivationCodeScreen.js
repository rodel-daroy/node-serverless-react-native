import React, { memo } from 'react';
import { ImageBackground, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { Icon } from 'native-base';

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';

const ActivationCodeScreen = (props) => {
  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon
              name="arrowleft"
              type="AntDesign"
              style={{ marginTop: CONSTANTS.SPARE_HEADER, marginLeft: 15 }}
            />
          </TouchableOpacity>
          <View
            style={{
              marginTop: (120 / 812) * CONSTANTS.HEIGHT,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 36,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              Activation Code
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_LIGHT,
              }}>
              {props.type === 'phone' ? "WAS SENT TO YOUR MOBILE" : "WAS SENT TO YOUR EMAIL"}
            </Text>
          </View>
          <View
            style={{
              maxWidth: CONSTANTS.WIDTH - 100,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ textAlign: 'center' }}>Enter the code below</Text>
          </View>
          <View>
            <View
              style={{
                paddingLeft: 15,
                alignItems: 'center',
                marginTop: 30,
                flexDirection: 'row',
              }}>
              <Icon
                type='AntDesign'
                name='lock'
                style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }}
              />
              <Text style={{ fontSize: 14, alignSelf: 'center' }}>
                Security Code
              </Text>
            </View>
              <View
                  style={{
                      marginLeft: 15,
                      marginRight: 15,
                      marginTop: 10,
                      borderColor: props.borderColor,
                      borderWidth: 1,
                      alignItems: 'flex-start',
                      borderRadius: 10,
                  }}>
                  <TextInput
                      onFocus={e => {
                          props.setBorderColor(CONSTANTS.MY_FOCUSED_BORDER_COLOR);
                      }}
                      onBlur={e => {
                          props.setBorderColor(CONSTANTS.MY_UNFOCUSED_BORDER_COLOR);
                      }}
                      autoFocus={true}
                      onSubmitEditing={props.onJoinSubmit}
                      returnKeyType="done"
                      textContentType={'oneTimeCode'}
                      keyboardType={'number-pad'}
                      placeholder="security code"
                      secureTextEntry={true}
                      style={{
                          fontSize: 14,
                          marginVertical: 10,
                          marginHorizontal: 10,
                          width: CONSTANTS.WIDTH - 20,
                          // width: CONSTANTS.WIDTH - 30
                          fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                      }}
                      onChangeText={text =>
                          props.setTxtCode(text)
                      }
                      value={props.txtCode}
                  />
              </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                disabled={props.isLoading}
                onPress={props.onJoinSubmit}
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                  marginRight: 15,
                  width: CONSTANTS.WIDTH - 20,
                  padding: 10,
                  marginVertical: 10,
                }}>
                <Icon
                  type='AntDesign'
                  name='lock'
                  style={{
                    color: 'white',
                    fontSize: 22,
                    marginRight: 6,
                    marginLeft: 2,
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    alignSelf: 'center',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {props.isLoading ? <OverlayLoading /> : null}
      </ImageBackground>
    </ScrollView>
  );
}
export default memo(ActivationCodeScreen);