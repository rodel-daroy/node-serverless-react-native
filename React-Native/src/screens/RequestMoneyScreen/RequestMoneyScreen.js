import React, { memo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Icon } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import { Text } from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';
import RoundButton from '../../components/CoreUIComponents/RoundButton';

const RequestMoneyScreen = (props) => {
  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };

  const {
    myRequestTab,
    _loadData,
    _selectTab,
    _renderItems,
    isLoading,
    sortBy,
    setSortBy,
    options,
  } = props;

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <NavigationEvents onWillFocus={_loadData} />
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: 'black',
            }}>
            REQUEST MONEY
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require('../../assets/xd/background/Login-bg.png')}
        style={{
          width: '100%',
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          // flex: 1
        }}>
        <ScrollView
          horizontal
          style={{
            flexDirection: 'row',
            marginTop: CONSTANTS.TOP_PADDING,
            maxHeight: 50,
            flex: 0.1,
            left: myRequestTab ? 17 * CONSTANTS.WIDTH_RATIO : null,
            right: !myRequestTab ? 35 * CONSTANTS.WIDTH_RATIO : null,
          }}>
          <TouchableOpacity
            onPress={() => _selectTab(true)}
            style={{ maxHeight: 50 }}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                fontSize: 24,
                marginBottom: 20,
                color: '#414042',
                opacity: myRequestTab ? 1 : 0.2,
              }}>
              My Payment Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ maxHeight: 50 }}
            onPress={() => _selectTab(false)}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                fontSize: 24,
                marginBottom: 20,
                color: '#414042',
                opacity: !myRequestTab ? 1 : 0.2,
                marginLeft: 20 * CONSTANTS.WIDTH_RATIO,
              }}>
              Received
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            showActionSheet();
          }}
          style={{
            marginLeft: 18,
            marginTop: 38,
            marginBottom: 10,
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Text style={{ fontSize: 12, marginRight: 10 }}>Filter by</Text>
          <View>
            <Icon name="filter" type="FontAwesome" style={{ fontSize: 14 }} />
          </View>
        </TouchableOpacity>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={_loadData} />
          }
          style={{ marginVertical: 10, minHeight: 200, flex: 0.6 }}>
          {_renderItems()}
        </ScrollView>
        <View style={{ flex: 0.3, marginHorizontal: 15 }}>
          <RoundButton
            text={'Request Money'}
            onPress={() => props.navigation.navigate('SendRequestMoney')}
          />
        </View>
      </ImageBackground>
      <ActionSheet
        ref={refActionSheet}
        options={options}
        destructiveButtonIndex={1}
        cancelButtonIndex={props.options.length - 1}
        onPress={(index) => {
          switch (index) {
            case 0:
              setSortBy('All');
              break;
            case 1:
              setSortBy('complete');
              break;
            case 2:
              setSortBy('pend');
              break;
            default:
          }
        }}
      />
    </View>
  );
};

export default memo(RequestMoneyScreen);
