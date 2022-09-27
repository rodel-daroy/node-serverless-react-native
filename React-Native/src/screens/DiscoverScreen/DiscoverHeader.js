import React from 'react';
import { ImageBackground } from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import { Text } from '../../components/CoreUIComponents';

const DiscoverHeader = (props) => {
    let headerPhoto = require('../../assets/xd/background/discover_bg.png');
    let title1 = 'Welcome!';
    let title2 = "Here's what new since your last visit";
    if (props.sortType == 'POPULAR') {
        headerPhoto = require('../../assets/xd/background/discover_popular_header.png');
        title1 = 'Welcome!';
        title2 = 'Discover trending conversations and people';
    }
    if (props.sortType == 'LOCATION') {
        headerPhoto = require('../../assets/xd/background/dicover_location_bg.png');
        title1 = 'Discover';
        title2 = 'local conversations and people';
    }

    return (
        <ImageBackground
            source={headerPhoto}
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                height: 180,
            }}>
            <Text
                style={{
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
                }}>
                {title1}
            </Text>
            <Text
                style={{
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL,
                }}>
                {title2}
            </Text>
        </ImageBackground>
    );
}

export default DiscoverHeader;