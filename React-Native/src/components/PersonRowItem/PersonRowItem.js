import React, { useRef } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import ActionSheet from 'react-native-actionsheet';

import { Text } from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';

const PersonRowItem = (props) => {

  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };

  const {
    personData,
    handleTouchOnAvatar,
    create1To1Chat,
    _handleReport,
    avatarSource,
    fullName,
    occupation,
    locationAddress,
    introduction,
    options
  } = props;

  return (
    <View
      style={{
        //flex to be square
        backgroundColor: 'white',
        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
        flexDirection: 'row',
        margin: 15,
        padding: 16,
        justifyContent: 'flex-start',
        ...CONSTANTS.MY_SHADOW_STYLE
      }}>
      <TouchableOpacity onPress={handleTouchOnAvatar}>
        <Image
          source={{ uri: avatarSource }}
          style={{ width: 47.6, height: 47.6, borderRadius: 23.8 }}
        />
      </TouchableOpacity>
      <View style={{ marginLeft: 10, width: CONSTANTS.WIDTH - 30 - 50 - 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14, color: '#414042' }}>{fullName}</Text>
          <TouchableOpacity onPress={showActionSheet}>
            <Icon
              name="dots-three-vertical"
              type="Entypo"
              style={{ fontSize: 14, paddingRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 3 }}>
          <Icon
            name="ios-briefcase"
            style={{
              fontSize: 14,
              color: "#BCBEC0",
              width: 16,
              textAlign: 'center'
            }}
          />
          <Text
            style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, marginLeft: 10, color: "#BCBEC0", fontSize: 12 }}>
            {occupation}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 1
          }}>
          <Icon
            name="location-on"
            type="MaterialIcons"
            style={{
              fontSize: 14,
              color: "#BCBEC0",
              width: 16,
              textAlign: 'center'
            }}
          />
          <Text
            style={{
              marginLeft: 10,
              color: "#BCBEC0",
              maxWidth: '90%',
              fontSize: 12,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
            }}>
            {locationAddress}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              color: "#939598"
            }}>
            {introduction}
          </Text>
        </View>
      </View>
      <ActionSheet
        ref={refActionSheet}
        title={'Which action do you like to do?'}
        options={options}
        cancelButtonIndex={options.length - 1}
        destructiveButtonIndex={1}
        onPress={index => {
          /* do something */
          switch (index) {
            case 0:
              if (props.user.loggedStatus === 'guest') {
                props.navigation.navigate('Welcome');
                return;
              }
              props.navigation.navigate('CreatePost', {
                params: { tagList: [{ ...personData }] }
              })
              break;
            case 1:
              if (props.user.loggedStatus === 'guest') {
                props.navigation.navigate('Welcome');
                return;
              }
              create1To1Chat([personData]);
              break;
            case 2:
              if (props.user.loggedStatus === 'guest') {
                props.navigation.navigate('Welcome');
                return;
              }
              _handleReport();
              break;
            default:
          }
        }}
      />
    </View >
  );
}

export default PersonRowItem;