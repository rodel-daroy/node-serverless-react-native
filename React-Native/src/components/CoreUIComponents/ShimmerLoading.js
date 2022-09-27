import React from 'react';
import { View, Image } from 'react-native';
import Shimmer from './Shimmer';
import CONSTANTS from '../../common/PeertalConstants';

const ShimmerLoading = (props) => {
  const isAutoRun = props.isAutoRun;
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
        <Image
          source={require('../../assets/xd/DiscoverLoadingImage1.png')}
          style={{ width: 60, height: 150 }}
        />
        <View style={{ marginHorizontal: 15, flexDirection: 'column' }}>
          <Shimmer
            autoRun={isAutoRun}
            duration={2600}
            style={{ marginTop: 20, width: 140, height: 10 }}></Shimmer>
          <Shimmer
            autoRun={isAutoRun}
            duration={3000}
            style={{ marginTop: 10, width: 70, height: 10 }}></Shimmer>
          <Shimmer
            autoRun={isAutoRun}
            duration={3300}
            style={{ marginTop: 30, width: 180, height: 10 }}></Shimmer>
          <Shimmer
            autoRun={isAutoRun}
            duration={3000}
            style={{ marginTop: 14, width: 140, height: 10 }}></Shimmer>
          <Shimmer
            autoRun={isAutoRun}
            duration={2200}
            style={{ marginTop: 14, width: 55, height: 10 }}></Shimmer>
        </View>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Shimmer
          autoRun={isAutoRun}
          duration={1800}
          style={{
            marginTop: 14,
            width: CONSTANTS.WIDTH - 30,
            height: 10,
          }}></Shimmer>
        <Shimmer
          autoRun={isAutoRun}
          duration={4000}
          style={{
            marginTop: 14,
            width: CONSTANTS.WIDTH - 30,
            height: 10,
          }}></Shimmer>
      </View>
      <View style={{ marginTop: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          resizeMode={'contain'}
          source={require('../../assets/xd/DiscoverLoadingImage2.png')}
          style={{ width: CONSTANTS.WIDTH, height: 420 }}
        />
      </View>
    </View>
  );
}

export default ShimmerLoading;
