import React from 'react';
import { Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';

const ReloadButton = (props) => {
    const { handleLoadData, longitude, latitude, selectedTab } = props;
    return (
        <TouchableOpacity
            onPress={() => handleLoadData(longitude, latitude, selectedTab)}
            style={{
                position: 'absolute',
                left: '50%',
                marginLeft: -76,
                marginTop: -10,
                width: 150,
                height: 50,
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: CONSTANTS.MY_BLUE,
            }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>Search this area</Text>
        </TouchableOpacity>
    );
}
export default ReloadButton;