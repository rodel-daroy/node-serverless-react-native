import { Icon } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity, View, ScrollView, RefreshControl } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import CONSTANTS from '../../common/PeertalConstants';
import Footer from '../../components/Footer';
import { Text, Avatar } from '../../components/CoreUIComponents';
import SearchBar from '../../components/SearchBar';

const ChatControlScreen = (props) => {
  const {
    currentTab,
    setCurrentTab,
    tagList,
    isLoading,
    _loadChat,
    _handleSelectPersonCallback,
    _renderItems,
    setIsGroupchat,
  } = props;

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      <NavigationEvents onWillFocus={_loadChat} />
      <View
        style={{
          flex: 100 + CONSTANTS.SPARE_HEADER,
          flexDirection: 'column',
          height: 120,
          backgroundColor: 'white',
        }}>
        <View
          style={{ flexDirection: 'row', marginTop: CONSTANTS.SPARE_HEADER }}>
          <TouchableOpacity
            onPress={() => props.navigation.toggleDrawer()}>
            <Image
              source={{ uri: props.user.avatarUrl }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
          <SearchBar navigation={props.navigation} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginVertical: CONSTANTS.TOP_PADDING,
            // backgroundColor: "red"
          }}>
          <TouchableOpacity
            onPress={() => setCurrentTab('messages')}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                fontSize: 24,
                color: '#414042',
                opacity:
                  currentTab == 'messages'
                    ? 1
                    : 0.2
              }}>
              Messages
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentTab('groups')}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                fontSize: 24,
                color: '#414042',
                opacity:
                  currentTab !== 'messages'
                    ? 1
                    : 0.2
              }}>
              Groups
              </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex:
            CONSTANTS.HEIGHT -
            55 -
            100 -
            CONSTANTS.SPARE_FOOTER -
            CONSTANTS.SPARE_HEADER,
        }}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={_loadChat} />}
        >
          <Text
            style={{
              marginTop: 35,
              marginHorizontal: 15,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              fontSize: 14,
              color: '#414042'
            }}>
            {currentTab == 'messages' ? 'Start a new chat' : ' '}
          </Text>
          <ScrollView
            horizontal
            style={{ flexDirection: 'row', alignContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('TagPeople', {
                  title: currentTab === 'messages' ? 'FIND NEW CHAT' : 'CREATE GROUP',
                  callback: _handleSelectPersonCallback,
                  rightButton: currentTab === 'groups',
                  rightCallback: () => { setIsGroupchat(true) },
                  withDone: true
                })}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 12,
                  marginHorizontal: 16,
                  marginBottom: 12,
                  borderColor: CONSTANTS.MY_BLUE,
                  borderWidth: 1,
                  backgroundColor: 'white',
                  width: 48.92,
                  height: 48.92,
                  borderRadius: 24.46,
                }}>
                <Icon
                  name="plus"
                  type="AntDesign"
                  style={{ fontSize: 25, color: CONSTANTS.MY_BLUE }}
                />
              </TouchableOpacity>
              {currentTab == 'groups' && <Text style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                fontSize: 14,
                color: CONSTANTS.MY_BLUE
              }}>Create Group</Text>}
            </View>
            {tagList.map((item, index) => (
              <Avatar
                source={{ uri: item.avatarUrl }}
                text={item.fullName}
                key={index}
              />
            ))}
          </ScrollView>
          {/* <Text style={{ marginTop: 10, marginHorizontal: 15 }}>
            {isOverlayLoading ? 'loading' : 'current chat'}
          </Text> */}
          {_renderItems()}
        </ScrollView>
      </View>
      <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
        <Footer {...props} active="people" />
      </View>
    </View >
  );
}

export default ChatControlScreen;