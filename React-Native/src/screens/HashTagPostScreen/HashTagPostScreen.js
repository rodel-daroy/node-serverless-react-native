import React, { useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, SafeAreaView } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { NavigationEvents } from "react-navigation";

import CONSTANTS from '../../common/PeertalConstants';
import { DiscoverLoading } from '../../components/CoreUIComponents';

const HashTagPostScreen = (props) => {
  const {
    handleRefresh,
    _renderHeader,
    isMounted,
    postData,
    handleLoadMore,
  } = props;

  if (isMounted) {
    return (
      <View
        style={{
          marginTop: CONSTANTS.SPARE_HEADER,
          flexDirection: 'column',
          marginBottom: CONSTANTS.SPARE_FOOTER,
          flex: 1,
        }}>
        <NavigationEvents
          onWillFocus={() => {
          }}
        />
        {_renderHeader()}
        <View
          style={{
            flex: 0.9
          }}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            onRefresh={handleRefresh}
            refreshing={postData.length == 0}
            data={postData}
            initialNumToRender={10}
            keyExtractor={props._keyExtractor}
            renderItem={props._renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={() =>
              postData.length === 0 ? (
                <DiscoverLoading isAutoRun={true} />
              ) : null
            }
          />
        </View>
        {CONSTANTS.OS === 'android' ? null : (
          <KeyboardSpacer topSpacing={-50} />
        )}
      </View>
    );
  } else { return null }
}

export default HashTagPostScreen;
