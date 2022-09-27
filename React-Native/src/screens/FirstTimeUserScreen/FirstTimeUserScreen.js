import { Icon } from 'native-base';
import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading } from '../../components/CoreUIComponents';

const FirstTimeUserScreen = (props) => {
  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{ width: '100%', height: '100%' }}>
        <TouchableOpacity
          style={{ marginTop: CONSTANTS.SPARE_HEADER, marginLeft: 15 }}
          onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: 150 - CONSTANTS.SPARE_HEADER,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '400',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              First Time User
              </Text>
            <Text style={{ fontSize: 22, fontWeight: '200' }}>
              Looks Like you're new to Kuky
              </Text>
          </View>
          <View
            style={{
              maxWidth: CONSTANTS.WIDTH - 100,
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
              }}>
              It would be great if we could put a new name and avatar to the account
              </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{ minHeight: 126, minWidth: 126 }}
              onPress={props.onCameraButtonPress}>
              <Image
                style={{ height: 126, borderRadius: 126 / 2 }}
                source={props.avatarSource}
              />
            </TouchableOpacity>
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
                name={'person'}
                style={{ fontSize: 22, marginRight: 6, marginLeft: 2 }}
              />
              <Text style={{ fontSize: 14, alignSelf: 'center' }}>
                Your full name
                </Text>
            </View>
            <View
              style={{
                marginLeft: 15,
                marginRight: 15,
                borderColor: props.focused == 'name' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
                borderWidth: 1,
                alignItems: 'flex-start',
                borderRadius: 10,
              }}>
              <TextInput
                autoFocus={true}
                onFocus={e => {
                  props.setFocused('name');
                }}
                onBlur={e => {
                  props.setFocused('');
                }}
                textContentType={'emailAddress'}
                placeholder="enter your name"
                style={{
                  fontSize: 14,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  width: CONSTANTS.WIDTH - 20,

                  // width: CONSTANTS.WIDTH - 30
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                }}
                onChangeText={text =>
                  props.setYourFullName(text)
                }
                value={props.yourFullName}
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
                onPress={props.onJoinAction}
                style={{
                  flex: 1,
                  backgroundColor: CONSTANTS.MY_BLUE,
                  borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  maxWidth: '100%',
                  height: 40,
                  padding: 10,
                  marginVertical: 10,
                  marginHorizontal: 15,
                }}>
                {/* <Icon name={'mail'} style={{ color: 'white', fontSize: 22, marginRight: 6, marginLeft: 2 }} /> */}
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    alignSelf: 'center',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  Join
                  </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                maxWidth: CONSTANTS.WIDTH - 100,
                alignSelf: 'center',
                justifyContent: 'center',

                marginTop: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                }}>
                By pressing "Join" you agree to our
                </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('TandC')}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                    fontWeight: 'bold',
                  }}>
                  Terms and Conditions
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

export default FirstTimeUserScreen;