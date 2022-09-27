import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import { refreshDiscoverPosts } from '../../actions/postActions';
import { Text } from '../../components/CoreUIComponents';
import { getCurrentLocation } from '../../actions/commonActions';

const DiscoverNav = (props) => {
  const defaultError = props.defaultError;
  const alert = props.setPopup;

  const handleSelectType = (sType) => {
    if (props.sortType === sType) return;
    if (props.user.haveLocation == false && sType == 'LOCATION') {
      getCurrentLocation(
        position => {
          props.dispatch({
            type: 'UPDATE_LONG_LAT',
            data: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          });
          props.dispatch({
            type: 'UPDATE_HAVELOCATION_PROPS',
            data: {
              haveLocation: true,
            },
          });
        },
        err => {
          defaultError(err);
        }
      );
    }
    props.dispatch({
      type: 'SELECT_SORT_TYPE',
      data: {
        sortType: sType,
      },
    });
    props.dispatch(
      refreshDiscoverPosts(
        props.user.accessToken,
      props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
      props.user.loggedStatus === "logged" ? props.user.over18 : false,
        sType,
        props.user.longitude,
        props.user.latitude,
        100,
      ),
    );
  }

  const currentTab = props.sortType;
  return (
    <View
      style={{
        height: 68,
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        onPress={() => handleSelectType('TIMELINE')}
        activeOpacity={currentTab == 'TIMELINE' ? 1 : 0.2}
        style={{
          flexDirection: 'row',
          height: 68,
          marginLeft:
            currentTab == 'TIMELINE'
              ? 33
              : currentTab == 'LOCATION'
                ? -45
                : -9,
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...styles.header,
            color: CONSTANTS.MY_HEAD_TITLE_COLOR,
            opacity: currentTab == 'TIMELINE' ? 1 : 0.2,
          }}>
          Timeline
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleSelectType('POPULAR')}
        activeOpacity={currentTab == 'POPULAR' ? 1 : 0.2}
        style={{
          flexDirection: 'row',
          height: 68,
          marginLeft:
            currentTab == 'POPULAR' ? 39 : currentTab == 'LOCATION' ? 42 : 39,
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...styles.header,
            color: CONSTANTS.MY_HEAD_TITLE_COLOR,
            opacity: currentTab == 'POPULAR' ? 1 : 0.2,
          }}>
          Popular
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleSelectType('LOCATION')}
        activeOpacity={currentTab == 'LOCATION' ? 1 : 0.2}
        style={{
          flexDirection: 'row',
          height: 68,
          marginLeft: currentTab == 'LOCATION' ? 42 : 39,
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...styles.header,
            color: CONSTANTS.MY_HEAD_TITLE_COLOR,
            opacity: currentTab == 'LOCATION' ? 1 : 0.2,
          }}>
          Local
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default DiscoverNav;

const styles = {
  header: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 24,
  },
};
