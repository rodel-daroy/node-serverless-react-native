import React, { memo } from 'react';
import { Text } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';

const TagList = (props) => {
  const {
    newUsersState,
    setIsFullUsers,
    callback,
    max
  } = props;

  return max === 1 ? (newUsersState.map((item, index) => {
    return (
      <Text
        style={styles.text}
        onPress={() => {
          if (item.id == -111) {
            setIsFullUsers(true);
            return;
          }
          callback(item.id);
        }}
        key={index}
      >
        {index < max ? item.fullName : item.fullName}
      </Text>
    );
  }))
    : (newUsersState.map((item, index) => {
      return (
        <Text
          style={styles.text}
          onPress={() => {
            if (item.id == -111) {
              setIsFullUsers(true);
              return;
            }
            callback(item.id);
          }}
          key={index}
        >
          {index == 0 ? item.fullName : index < max ? ', ' + item.fullName : item.fullName}
        </Text>
      );
    }));
}

export default memo(TagList);

const styles = {
  text: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    color: CONSTANTS.Colors.fontColor,
  },
};
