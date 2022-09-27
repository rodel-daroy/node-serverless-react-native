import React, {useState} from 'react';
import {Keyboard} from 'react-native';
import {connect} from 'react-redux';

import {createCommentOnAPost} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import CommentInputItem from './CommentInputItem';

const CommentInputItemContainer = (props) => {
  const [text, setText] = useState('');
  const [borderColor, setBorderColor] = useState(
    CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
  );

  const onCommentAction = () => {
    if (props.tempCommentInitCallback) {
      props.tempCommentInitCallback();
    }
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    if (text === '') {
      return;
    }
    let commentData = {
      content: text,
      objectId: props.data.id,
      isIncognito: props.user.incognitoMode,
      parentCommentId: 0,
      objectType: 'POST',
    };
    props.setIsLoading && props.setIsLoading(true);
    createCommentOnAPost(
      props.user.accessToken,
      commentData,
      (res) => {
        if (props.callback) {
          setText('');
          props.callback();
          props.showCommentOnce(res.data.data, props.data.id);
          return;
        }
        let newCommentObject = res.data.data;
        props.showCommentOnce(res.data.data, props.data.id);
        let updatedPost = {
          ...props.data,
          totalComments: props.data.totalComments + 1,
        };
        updatedPost.comments.push(newCommentObject);
        props.dispatch({
          type: 'UPDATE_COMMENTS_ONE_POST',
          data: {post: updatedPost},
        });
        props.setIsLoading && props.setIsLoading(false);
      },
      (err) => {
        props.setIsLoading && props.setIsLoading(false);
      },
    );
    Keyboard.dismiss();
    setText('');
  };

  const onFocus = props.onFocus;
  const onBlur = props.onBlur;

  return (
    <CommentInputItem
      {...props}
      text={text}
      setText={setText}
      onCommentAction={onCommentAction}
      onFocus={onFocus}
      onBlur={onBlur}
      borderColor={borderColor}
      setBorderColor={setBorderColor}
    />
  );
};

const MapStateToProps = (store) => ({user: store.user});
const CommentInputItemContainerWrapper = connect(MapStateToProps)(
  CommentInputItemContainer,
);
export default CommentInputItemContainerWrapper;
