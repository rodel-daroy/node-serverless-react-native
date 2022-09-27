import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import CONSTANTS from '../../common/PeertalConstants';

import { Text } from '../CoreUIComponents';

const Footer = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 5,
      }}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Discover')}
        style={{
          width: '20%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 5,
        }}>
        <Icon
          name="newspaper"
          type="MaterialCommunityIcons"
          style={{
            color: props.activeData == 'conversation' ? CONSTANTS.MY_BLUE : 'black',
          }}
        />
        <Text style={{ fontSize: 10 }}>Conversation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('PeopleList')}
        style={{
          width: '20%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 5,
        }}>
        <Icon
          style={{ color: props.activeData == 'people' ? CONSTANTS.MY_BLUE : 'black' }}
          name="people"
          type="MaterialIcons"
        />
        <Text style={{ fontSize: 10 }}>People</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (props.user.loggedStatus == 'guest') {
            props.navigation.navigate('Welcome');
            return;
          }
          props.navigation.navigate('CreatePost', {
            params: props.callback
          })
        }}
        style={{
          width: '20%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            style={{
              color: 'white',
              textAlign: 'center',
              paddingTop: CONSTANTS.OS == 'ios' ? 0.5 : 0,
            }}
            name="plus"
            type="Entypo"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (props.user.loggedStatus == 'guest') {
            props.navigation.navigate('Welcome');
          } else props.navigation.navigate('Notification');
        }}
        style={{
          width: '20%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 5,
        }}>
        <Icon
          name="bell"
          type="MaterialCommunityIcons"
          style={{ color: props.activeData == 'notification' ? CONSTANTS.MY_BLUE : 'black' }}
        />
        <Text style={{ fontSize: 10 }}>Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('MapView');
        }}
        style={{
          width: '20%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 5,
        }}>
        <Icon
          name="map"
          type="MaterialCommunityIcons"
          style={{ color: props.activeData == 'mapView' ? CONSTANTS.MY_BLUE : 'black' }}
        />
        <Text style={{ fontSize: 10 }}>Map View</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Footer;
