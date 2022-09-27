import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import {
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'native-base';
import CountryPicker from 'react-native-country-picker-modal';

import { useSetState } from '../../common/Hooks';
import PopupContext from '../../context/Popup/PopupContext';
import { getDeviceFirebaseToken, loginViaEmailOrSMS } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';

const DEFAULT_STATE = {
  yourPhone: '',
  isLoading: false,
  country: 'AU',
  currentCode: '+61',
  devicePushToken: '',
  isSelectCountryModal: false,
  focusedInput: '',
};

const LoginViaSMSScreenContainer = (props) => {
  const [state, setState] = useSetState(DEFAULT_STATE);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  useEffect(() => {
    getDeviceFirebaseToken(devicePushToken => {
      setState({ devicePushToken })
    });
  }, []);

  const onLoginSubmit = () => {
    if (state.isLoading) return;
    //request get access Token of firebase
    setState({ isLoading: true });
    const myPhone =
      state.currentCode.toString() + state.yourPhone.toString();
    loginViaEmailOrSMS(
      myPhone,
      'phone',
      state.devicePushToken,
      res => {
        setState({ isLoading: false });

        if (res.data.data.account_type == 'existed')
          props.navigation.navigate('ActivationCode', {
            loginId: state.currentCode + state.yourPhone,
            type: 'phone',
          });
        else
          props.navigation.navigate('FirstTimeUser', {
            loginId: state.currentCode + state.yourPhone,
            type: 'phone',
          });
      },
      err => {
        alert(err.response?.data?.message ?? err);
        setState({ isLoading: false });
      },
    );
  }

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
          <Text style={{ fontSize: 22, fontWeight: '200' }}>
            PROVIDE US YOUR
          </Text>
          <Text style={{ fontSize: 36, fontFamily: 'Montserrat-SemiBold' }}>
            Phone Number
          </Text>
        </View>
        <View
          style={{
            maxWidth: CONSTANTS.WIDTH - 100,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ textAlign: 'center' }}>
            We will send a code that you can start contributing to the
            community
          </Text>
        </View>
        <View style={{}}>
          <View
            style={{
              paddingLeft: 15,
              alignItems: 'flex-start',
              marginTop: 30,
              flexDirection: 'row',
            }}>
            <Icon
              name={'phone'}
              type={'MaterialIcons'}
              style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }}
            />
            <Text style={{ fontSize: 14, alignSelf: 'center' }}>
              Your Phone
            </Text>
          </View>
          <View>
            <View
              style={{
                marginTop: 10,
                marginLeft: 15,
                marginRight: 15,
                borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
                borderWidth: 1,
                alignItems: 'flex-start',
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setState({ isSelectCountryModal: true })
                }}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View style={{
                  width: '85%',
                  alignItems: 'center',
                  borderRadius: 10,
                  flexDirection: 'row',
                  paddingLeft: 8,
                }}>
                  <CountryPicker
                    {...{
                      countryCode: state.country,
                      withFilter: true,
                      withFlag: true,
                      withCountryNameButton: true,
                      withAlphaFilter: true,
                      withCallingCode: true,
                      withEmoji: true,
                      onSelect: (country) => {
                        setState({ country: country.cca2, currentCode: "+" + country.callingCode[0] })
                      },
                    }}
                    visible={state.isSelectCountryModal}
                    onClose={() => setState({ isSelectCountryModal: false })}
                  />
                </View>
                <View
                  style={{
                    fontSize: 14,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    width: '100%',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  }}>
                  <Icon name="arrow-down" style={{ fontSize: 19, fontWeight: 'bold' }} />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 10,
                marginLeft: 15,
                marginRight: 15,
                borderColor: state.focusedInput == 'phone' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
                borderWidth: 1,
                alignItems: 'center',
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <Text style={{ alignSelf: 'center', marginLeft: 10 }}>
                {state.currentCode}
              </Text>
              <TextInput
                autoFocus={true}
                onFocus={e => {
                  setState({ focusedInput: 'phone' })
                }}
                onBlur={e => {
                  setState({ focusedInput: '' })
                }}
                onSubmitEditing={onLoginSubmit}
                textContentType={'telephoneNumber'}
                keyboardType={'phone-pad'}
                placeholder="your phone number"
                style={{
                  fontSize: 14,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  width: CONSTANTS.WIDTH - 120,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                }}
                onChangeText={text => setState({ yourPhone: parseInt(text) })}
                value={state.yourPhone}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              disabled={state.isLoading}
              onPress={onLoginSubmit}
              style={{
                flex: 1,
                backgroundColor: CONSTANTS.MY_BLUE,
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                justifyContent: 'center',
                flexDirection: 'row',
                maxWidth: '100%',
                padding: 10,
                marginVertical: 10,
                marginLeft: 15,
                marginRight: 15,
              }}>
              <Icon
                name={'phone'}
                type={'MaterialIcons'}
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
                Send me code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {state.isLoading ? <OverlayLoading /> : null}
    </ImageBackground>
  );
}

const MapStateToProps = store => ({ user: store.user });
const LoginViaSMSScreenContainerWrapper = connect(MapStateToProps)(LoginViaSMSScreenContainer);
export default LoginViaSMSScreenContainerWrapper;