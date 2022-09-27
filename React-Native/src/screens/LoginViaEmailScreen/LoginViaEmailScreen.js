import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import { Icon } from 'native-base';
import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';

const LoginViaEmailScreen = (props) => {
  return (
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
          <Text style={{ fontSize: 22, fontFamily: 'Montserrat-Light' }}>
            PROVIDE US YOUR
          </Text>
          <Text style={{ fontSize: 36, fontFamily: 'Montserrat-SemiBold' }}>
            Email
          </Text>
        </View>
        <View
          style={{
            maxWidth: CONSTANTS.WIDTH - 100,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ textAlign: 'center' }}>
            We will send a code that you can start contributing to the community
          </Text>
        </View>
        <View style={{}}>
          <View
            style={{
              paddingLeft: 15,
              alignItems: 'center',
              marginTop: 30,
              flexDirection: 'row',
            }}>
            <Icon
              name={'mail'}
              style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }}
            />
            <Text style={{ fontSize: 14, alignSelf: 'center' }}>
              Your Email
            </Text>
          </View>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              borderColor: props.focusedInput == 'email' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
              borderWidth: 1,
              alignItems: 'flex-start',
              borderRadius: 10,
            }}>
            <TextInput
              accessibilityLabel="your-email"
              autoFocus={true}
              onFocus={e => { props.setFocusedInput('email') }}
              onBlur={e => { props.setFocusedInput('') }}
              onSubmitEditing={props.onLoginSubmit}
              returnKeyType="done"
              placeholder="enter your email"
              textContentType={'emailAddress'}
              style={{
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
                width: CONSTANTS.WIDTH - 20,

                // width: CONSTANTS.WIDTH - 30
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              }}
              onChangeText={text =>
                props.setYourEmail(text)
              }
              value={props.yourEmail}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              accessibilityLabel="send-me-code"
              disabled={props.isLoading}
              onPress={() => props.onLoginSubmit()}
              style={{
                flex: 1,
                backgroundColor: CONSTANTS.MY_BLUE,
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                justifyContent: 'center',
                flexDirection: 'row',
                maxWidth: '100%',
                padding: 10,
                height: 40,
                marginVertical: 10,
                marginLeft: 15,
                marginRight: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  alignSelf: 'center',
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                }}>
                Send me code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {props.isLoading ? <OverlayLoading /> : null}
    </ImageBackground>
  );
}

export default LoginViaEmailScreen;