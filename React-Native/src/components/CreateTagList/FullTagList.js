import React, { memo } from 'react';
import { Text } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';

const FullTagList = (props) => {
    const {
        data,
        callback
    } = props;

    return data.map((item, index) => {
        return (
            <Text
                style={styles.text}
                onPress={() => {
                    if (item.id == -111) return;
                    callback(item.id);
                }}
                key={index}
            >
                {data.length == 1
                    ? data[index].fullName
                    : data.length - 1 <= index
                        ? `and ${data[index].fullName}`
                        : `${data[index].fullName}, `}
            </Text>
        );
    });
}

export default memo(FullTagList);

const styles = {
    text: {
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
        fontSize: 12,
        color: CONSTANTS.Colors.fontColor,
    },
};
