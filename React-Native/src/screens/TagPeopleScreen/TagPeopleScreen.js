import { Icon } from 'native-base';
import React, {memo} from 'react';
import { ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationEvents } from "react-navigation";

import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';

const TagPeopleScreen = (props) => {

  const {
    searchText,
    setSearchText,
    peopleList,
    isLoading,
    setNoResults,
    _handleSearch,
    _renderItems,
    _renderNoResultsText,
    _resetCheck,
    title,
    onClose,
    rightButton,
    rightCallback,
    withDone,
    _cancelCheck
  } = props;

  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <NavigationEvents
        onWillFocus={() => {
          _handleSearch();
        }}
        onWillBlur={() => {
          setSearchText('');
          _resetCheck();
        }}
      />
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.TOP_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            _cancelCheck();
            onClose();
          }}>
          <Icon name="arrowleft" type="AntDesign" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 14,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: 'black',
          }}>
          {title}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (rightCallback) rightCallback();
            _resetCheck();
          }}
          disabled={!withDone}
          style={{ opacity: withDone ? 1 : 0 }}>
          <Text style={{ color: '#0075FF', fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM }}>Done</Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{
          width: '100%',
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 24,
            marginHorizontal: 10,
            borderRadius: 17,
            backgroundColor: "#F1F1F2",
            height: 34
          }}>
          <TextInput
            onFocus={() => setNoResults(false)}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            style={{
              fontSize: 12,
              color: 'gray',
              alignSelf: 'center',
              width: '86%',
              fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            }}
            placeholder={'Name'}
            placeholderTextColor="#BCBEC0"
            onSubmitEditing={_handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={_handleSearch}>
            <Icon
              name="search"
              type="EvilIcons"
              style={{ marginRight: 10, color: '#414042' }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text
            style={{
              marginTop: 20,
              marginHorizontal: 15,
              fontSize: 18,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
              color: '#414042'
            }}>
            My Network
              </Text>
          {!isLoading && peopleList.length === 0
            ? _renderNoResultsText()
            : _renderItems()}
        </ScrollView>
      </ImageBackground>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            left: CONSTANTS.WIDTH / 2,
            top: '40%',
          }}>
          <OverlayLoading />
        </View>
      ) : null}
    </View>
  );
}

export default memo(TagPeopleScreen);
