import React, { memo, useState } from 'react';

import { createCommentOnAPost } from '../../../actions/userActions';
import CONSTANTS from '../../../common/PeertalConstants';
import ReplyInput from './ReplyInput';

const ReplyInputContainer = (props) => {

  const [text, setText] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const onCommentAction = () => {
    let commentData = {
      content: text,
      objectId: props.postId,
      isIncognito: props.user.incognitoMode,
      parentCommentId: props.commentId || 0,
      objectType: 'POST',
    };
    createCommentOnAPost(props.user.accessToken, commentData, res => {
      if (props.callback) {
        props.callback();
        return;
      }
    }, (err) => { props.defaultError(err) });
    setText('');
  }

  const user = props.user;
  const avatarUrl = props.user.incognitoMode
    ? CONSTANTS.INCOGNITO_AVATAR
    : user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  return (
    <ReplyInput
      {...props}
      text={text}
      setText={setText}
      onCommentAction={onCommentAction}
      avatarUrl={avatarUrl}
      focusedInput={focusedInput}
      setFocusedInput={setFocusedInput}
    />
  );
}

export default memo(ReplyInputContainer);
