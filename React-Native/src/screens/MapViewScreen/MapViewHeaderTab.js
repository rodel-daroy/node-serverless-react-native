import React from 'react';
import { Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';

const MapViewHeaderTab = (props) => {
    const {
        selectedTab,
        _selectTab,
    } = props;
    return (
        <View
            style={{ height: 68, justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => _selectTab('people')}
                style={{
                    flexDirection: 'row',
                    height: 68,
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                }}>
                <Text
                    style={{
                        ...styles.header,
                        color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                        opacity: selectedTab == 'people' ? 1 : 0.2,
                    }}>
                    People
          </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => _selectTab('conversation')}
                style={{
                    flexDirection: 'row',
                    height: 68,
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                }}>
                <Text
                    style={{
                        ...styles.header,
                        color: CONSTANTS.MY_HEAD_TITLE_COLOR,
                        opacity: selectedTab == 'conversation' ? 1 : 0.2,
                    }}>
                    Conversation
          </Text>
            </TouchableOpacity>
        </View>
    );
}

export default MapViewHeaderTab;

const styles = {
    header: {
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
        fontSize: 24,
    },
};