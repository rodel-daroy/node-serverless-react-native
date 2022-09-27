import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {css} from '@emotion/native';
import PropTypes from 'prop-types';
import CONSTANTS from '../../common/PeertalConstants';

const Button = ({children}) => {
  return (
    <View style={buttonStyle}>
      <Text style={buttonTextStyle}>{children}</Text>
    </View>
  );
};

Button.propTypes = {
  children: PropTypes.string,
};

const cancelButtonStyle = (theme) => css`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  background-color: ${CONSTANTS.MY_CANCEL_BG_COLOR};
  min-width: 80px;
  min-height: 50px;
  border-radius: ${theme.borderAndShadow.BUTTON_BORDER_RADIUS};
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${CONSTANTS.MY_CANCEL_BORDER_COLOR};
`;

const buttonStyle = css`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  background-color: #0477ff;
  min-width: 80px;
  min-height: 50px;
  border-radius: ${CONSTANTS.BUTTON_BORDER_RADIUS + 'px'};
  justify-content: center;
  align-items: center;
`;

const cancelButtonTextStyle = css`
  color: #414042;
  font-size: 15px;
  font-weight: 700;
`;

const buttonTextStyle = css`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

export default memo(Button);
