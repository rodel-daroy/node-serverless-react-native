import React from 'react';
import { Text } from 'native-base';
import { Image, TouchableOpacity, View } from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';

const MapViewScreen = (props) => {

  const {
    isLoading,
    _renderHeaderTab,
    renderMapViewComponent
  } = props;

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
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
        {_renderHeaderTab()}
      </View>
      {renderMapViewComponent()}
      <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
        <Footer {...props} active="mapView" />
      </View>
      {isLoading ? <View
        style={{
          width: 100,
          position: 'absolute',
          bottom: '26%',
          left: '50%',
          marginLeft: -40,
        }}>
        <Text>Searching...</Text>
      </View> : null}
    </View>
  );
}

export default MapViewScreen;