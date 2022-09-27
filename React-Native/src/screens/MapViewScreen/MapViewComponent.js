import React from 'react';
import { Icon, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import MapView from "react-native-map-clustering";

import CONSTANTS from '../../common/PeertalConstants';

const MapViewComponent = (props) => {

  const {
    selectedTab,
    longitude,
    latitude,
    _goBackToCurrentRegion,
    handleRegionChange,
    handleLoadData,
    _renderPeopleMarkers,
    _renderPostMarkers,
    myMapView,
    renderReloadButton,
  } = props;

  return (
    <View
      style={{
        flex:
          CONSTANTS.HEIGHT -
          55 -
          100 -
          CONSTANTS.SPARE_FOOTER -
          CONSTANTS.SPARE_HEADER,
      }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={myMapView}
          style={{ height: '100%', width: '100%' }}
          initialRegion={{
            latitude: props.user.latitude,
            longitude: props.user.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled={true}
          zoomTapEnabled={true}
          scrollEnabled={true}
          showsMyLocationButton={false}
          showsUserLocation={false}
          followsUserLocation={false}
          // tracksViewChanges={true}
          // spiralEnabled={false}
          // animationEnabled={false}
          // tracksViewChanges={true}
          /* userLocationAnnotationTitle={'You are here'} */
          /* onRegionChange={handleRegionChange} */
          onRegionChangeComplete={(region) => {
            handleRegionChange(region);
          }}
        // loadingEnabled={true}
        >
          {selectedTab === 'conversation'
            ? _renderPostMarkers()
            : _renderPeopleMarkers()}
        </MapView>
        <View
          style={{
            marginTop: -60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
          <TouchableOpacity
            onPress={_goBackToCurrentRegion}
            style={{
              marginLeft: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: CONSTANTS.MY_BLUE,
            }}>
            <Icon
              name="location-arrow"
              type="FontAwesome5"
              style={{ fontSize: 18, color: 'white' }}></Icon>
          </TouchableOpacity>
          {renderReloadButton()}
          <View>
          </View>
          <TouchableOpacity
            disabled={selectedTab === 'conversation'}
            onPress={() =>
              props.navigation.navigate('FilterProfile')
            }
            style={{
              marginRight: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: CONSTANTS.MY_BLUE,
              opacity: selectedTab !== 'conversation' ? 1 : 0,
            }}>
            <Icon
              name="filter"
              type="FontAwesome5"
              style={{ fontSize: 18, color: 'white' }}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default MapViewComponent;
