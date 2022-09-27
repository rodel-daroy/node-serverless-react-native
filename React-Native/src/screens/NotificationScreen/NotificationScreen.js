import React, { useRef } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Icon } from "native-base";
import ActionSheet from "react-native-actionsheet";

import CONSTANTS from "../../common/PeertalConstants";
import Footer from "../../components/Footer";

const NotificationScreen = (props) => {

  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  }

  const {
    isLoading,
    notificationList,
    onHandleAction,
    _loadData,
    _keyExtractor,
    _renderItem,
  } = props;
  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => {
          _loadData();
        }}
      />
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          shadowColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          ...CONSTANTS.TOP_SHADOW_STYLE,
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrowleft"
            type="AntDesign"
            style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }}
          />
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
              color: '#414042',
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON,
            }}>
            NOTIFICATION
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: CONSTANTS.MY_GRAYBG,
          flex: CONSTANTS.HEIGHT - 50 - 55 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER
        }}
      >
        <FlatList
          onRefresh={_loadData}
          refreshing={isLoading}
          data={notificationList}
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
        />
      </View>

      <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
        <Footer {...props} active="notification" />
      </View>
      {/* {isLoading ? <OverlayLoading /> : null} */}
      <ActionSheet
        ref={refActionSheet}
        title={"More actions"}
        options={["Delete all", "cancel"]}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        onPress={onHandleAction}
      />
    </View>
  );
}

export default NotificationScreen;
