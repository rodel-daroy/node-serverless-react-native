import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';
import GroupAvatars from '../../components/GroupAvatars';

const PersonChatItem = (props) => {

  const {
    data,
    callback,
    chatTitle,
    unreadCount,
    message,
    timeAgo,
    currentTab
  } = props;

  let groupAvatar = null;
  if (data) {
    groupAvatar = data.members.map(item => item.profileUrl);
  }

  return (
    <TouchableOpacity
      onPress={callback}
      style={{
        //flex to be square
        backgroundColor: 'white',
        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
        flexDirection: 'row',
        margin: 15,
        padding: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        ...CONSTANTS.MY_SHADOW_STYLE,
      }}>

      <GroupAvatars data={groupAvatar} />
      <View style={{ marginHorizontal: 10, width: CONSTANTS.WIDTH - 100 }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              width: currentTab == "messages" ? CONSTANTS.WIDTH - 120 : CONSTANTS.WIDTH - 140,
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: 14,
                  marginRight: 10,
                  color: '#414042',
                  maxWidth: currentTab == "messages" ? CONSTANTS.WIDTH - 184 : CONSTANTS.WIDTH - 204,
                }}>
                {chatTitle}
              </Text>
              {unreadCount > 0 ? (
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: '#FF1A53',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
                    }}>
                    {unreadCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, fontSize: 12, color: '#BCBEC0' }}>
              {timeAgo}
            </Text>
          </View>
          <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, color: '#939598', fontSize: 14 }}>{message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default PersonChatItem;

