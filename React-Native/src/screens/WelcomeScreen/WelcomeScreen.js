import { css } from '@emotion/native';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { Button, Icon } from 'native-base';
import React from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';


const WelcomeScreen = (props) => {

  return (
    <View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{ width: '100%', height: '100%', display: 'flex' }}
      >
        <View style={style}>
          <View style={headerContainerStyle}>
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => props.navigation.goBack()}>
              <Icon name="arrowleft" type="AntDesign" />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 140, flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ fontSize: 36, fontFamily: 'Montserrat-SemiBold' }}>
              Please sign in
            </Text>
            <Text style={{ fontSize: 22, fontFamily: 'Montserrat-Light' }}>
              TO DISCOVER MORE
            </Text>
          </View>

          <View style={{ width: '100%', marginTop: 40 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {CONSTANTS.OS === 'ios' ? (
                <AppleButton
                  style={appleButtonStyle}
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  onPress={props.onAppleButtonPress}
                />
              ) : null}

              <TouchableOpacity
                style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                onPress={props._loginWithFacebook}
              >
                <View style={facebookButtonStyle}>
                  <Icon name={'facebook'} type={'Entypo'} style={{ fontSize: 18, color: 'white' }} />
                  <Text style={socialLoginTextStyle}>
                    Sign in with Facebook
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: '100%' }} />
              <TouchableOpacity
                style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                onPress={props._signInWithGG}
              >
                <View style={googleButtonStyle}>
                  <Icon name={'google-plus'} type={'FontAwesome'} style={{ fontSize: 18, color: 'white' }} />
                  <Text style={socialLoginTextStyle}>
                    Sign in with Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'space-around', marginTop: 40 }}>
            <Text>Or you can log in by</Text>
          </View>

          <View style={buttonContainerStyle}>
            <Button
              accessibilityLabel="by-email"
              style={emailButtonStyle}
              onPress={() => props.navigation.navigate('LoginViaEmail')}
            >
              <Icon name={'mail'} style={{ color: 'white', fontSize: 22, marginRight: 6, marginLeft: 2 }} />
              <Text style={{ color: 'white', fontSize: 15, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD }}>
                By Email
              </Text>
            </Button>

            {/* <Button
              style={{
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                height: 50,
                flex: 1,
                backgroundColor: CONSTANTS.MY_PURPLE,
                flexDirection: 'row',
                justifyContent: 'center',
                maxWidth: '40%',
              }}
              onPress={() => {
                props.navigation.navigate('LoginViaSMS');
              }}>
              <Icon
                name={'phone'}
                type={'MaterialIcons'}
                style={{
                  color: 'white',
                  fontSize: 22,
                  marginRight: 2,
                  marginLeft: 2,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                }}>
                By SMS
              </Text>
            </Button> */}
          </View>
        </View>
      </ImageBackground>
      {props.isLoading ? <OverlayLoading /> : null}
    </View>
  );
}


export default WelcomeScreen;


const style = css`
    flex: 1;
    align-items: center;
    position: relative;
`;

const headerContainerStyle = css`
    margin-top: ${CONSTANTS.SPARE_HEADER + 'px'};
    position: absolute;
    top: 0;
    left: 0;
`;

const buttonContainerStyle = css`
    flex-direction: row;
    justify-content: space-evenly;
    margin: 20px 0 0 0;
    width: 70%;
`;

const emailButtonStyle = css`
    border-radius: ${CONSTANTS.LOGIN_BUTTON_BORDER_RADIUS + 'px'};
    height: 50px;
    flex: 1;
    background-color: ${CONSTANTS.MY_BLUE};
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 70%;
    min-width: 140px;
`;

const appleButtonStyle = css`
    width: 70%;
    min-width: 140px;
    height: 50px;
    margin-bottom: 20px;
`;

const googleButtonStyle = css`
    border-radius: ${CONSTANTS.LOGIN_BUTTON_BORDER_RADIUS + 'px'};
    height: 50px;
    background-color: #cf4332;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 70%;
    min-width: 140px;
`;

const facebookButtonStyle = css`
    border-radius: ${CONSTANTS.LOGIN_BUTTON_BORDER_RADIUS + 'px'};
    height: 50px;
    background-color: #3c66c4;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 70%;
    min-width: 140px;
    margin-bottom: 20px;
`;

const socialLoginTextStyle = css`
    margin-left: 5px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    transform: scaleY(1.2);
`;