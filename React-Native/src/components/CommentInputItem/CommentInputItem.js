import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import CONSTANTS from '../../common/PeertalConstants';

const CommentInputItem = (props) => {
  const {
    text,
    setText,
    onCommentAction,
    onFocus,
    onBlur,
    borderColor,
    setBorderColor,
  } = props;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      }}>
      <View
        style={{
          width: CONSTANTS.WIDTH - 32 - 40,
          marginLeft: 12,
          minHeight: 42,
          maxHeight: 200,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 21,
        }}>
        <AutoGrowingTextInput
          onFocus={(e) => {
            setBorderColor(CONSTANTS.MY_FOCUSED_BORDER_COLOR);
            if (onFocus) {
              onFocus();
            }
          }}
          onBlur={(e) => {
            setBorderColor(CONSTANTS.MY_UNFOCUSED_BORDER_COLOR);
            if (onBlur) {
              onBlur();
            }
          }}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="Leave a comment..."
          //onSubmitEditing={Keyboard.dismiss}
          style={{
            color: 'gray',
            marginTop: 8,
            marginLeft: 14,
            marginBottom: 8,
            paddingRight: 14,
            paddingTop: CONSTANTS.OS === 'android' ? 10 : 0,
            fontSize: 14,
            minWidth: 200,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
          }}
        />
      </View>
      <TouchableOpacity
        style={{ marginTop: 10, marginRight: 16 }}
        onPress={onCommentAction}>
        <Image source={require('../../assets/xd/Icons/sent-mail.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default CommentInputItem;
