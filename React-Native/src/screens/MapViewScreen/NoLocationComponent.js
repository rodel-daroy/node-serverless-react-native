import React from 'react';
import { ImageBackground, TouchableOpacity, View, Linking } from 'react-native';

import { getCurrentLocation } from '../../actions/commonActions';
import CONSTANTS from '../../common/PeertalConstants';

const NoLocationComponent = (props) => {
  const defaultError = props.defaultError;
  const alert = props.setPopup;
  const { handleLoadData } = props;

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

      <TouchableOpacity
        onPress={() => {
          getCurrentLocation(position => {
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
            handleLoadData(
              position.coords.longitude,
              position.coords.latitude,
            )
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
          }, (err) => {
            defaultError(err);
          });
        }}>
        <ImageBackground
          source={require('../../assets/xd/DefaultMapViewImage.png')}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default NoLocationComponent;