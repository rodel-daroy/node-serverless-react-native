import React, { memo } from 'react';
import { Image, Keyboard, TextInput, TouchableOpacity, View } from 'react-native';

import CONSTANTS from '../../../common/PeertalConstants';

const ReplyInput = (props) => {

  const {
    text,
    setText,
    onCommentAction,
    avatarUrl,
    focusedInput,
    setFocusedInput,
  } = props;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 15,
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={typeof avatarUrl == 'string' ? { uri: avatarUrl } : avatarUrl}
          style={{
            width: 24,
            height: 24,
            borderRadius: 24 / 2,
            alignSelf: 'flex-start',
          }}
        />
        <View
          style={{
            marginHorizontal: 15,
            height: 42,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            borderColor: focusedInput == 'reply' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
            borderWidth: 1,
            borderRadius: 20,
          }}>
          <TextInput
            onFocus={e => {
              setFocusedInput('reply');
            }}
            onBlur={e => {
              setFocusedInput('');
            }}
            placeholder="Leave a reply..."
            returnKeyType={'send'}
            onSubmitEditing={onCommentAction}
            onKeyPress={e => {
              if (e.nativeEvent.key == 'Enter') {
                Keyboard.dismiss();
                onCommentAction();
              }
            }}
            value={text}
            onChangeText={value =>
              setText(value)
            }
            style={{
              color: 'gray',
              marginLeft: 10,
              paddingTop: 0,
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              width: 200 * CONSTANTS.WIDTH_RATIO,
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{ marginTop: 10, marginRight: 16, width: 50, height: 35 }}
        onPress={onCommentAction}>
        <Image source={require('../../../assets/xd/Icons/sent-mail.png')} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(ReplyInput);
