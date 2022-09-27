import React, { memo } from 'react';
import { Text } from 'react-native';
import CONSTANTS from '../../common/PeertalConstants';

const NoTagged = (props) => {

  return <Text style={styles.text}>No tagged</Text>;
}

export default memo(NoTagged);

const styles = {
  text: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    color: CONSTANTS.Colors.fontColor,
  },
};
