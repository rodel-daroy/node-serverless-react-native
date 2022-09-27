import React, {memo, useContext} from 'react';
import {View} from 'react-native';

import {deleteComment} from '../../../actions/postActions';
import {voteToPost} from '../../../actions/userActions';
import CONSTANTS from '../../../common/PeertalConstants';
import DefaultErrorContext from '../../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../../context/Popup/PopupContext';
import ReplyItem from './ReplyItem';

const ReplyItemContainer = props => {
  const {setPopup, clearPopup} = useContext(PopupContext);
  const alert = setPopup;
  const {defaultError} = useContext(DefaultErrorContext);

  const _onLongPress = (isCommentOwner, commentId) => {
    if (!isCommentOwner) {
      return;
    }
    alert({
      title: 'Delete',
      main: 'Do you want to delete this comment?',
      button: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            alert('');
            if (!isCommentOwner) {
              alert({title: 'Uh-oh', main: 'This is not your comment.'});
              return;
            }
            props.setIsLoading(true);
            deleteComment(
              props.user.accessToken,
              commentId,
              result => {
                props.callback();
              },
              () => {
                alert({title: 'Uh-oh', main: 'Something went wrong.'});
                props.setIsLoading(false);
              },
            );
          },
        },
      ],
    });
  };

  const handleVoteButton = () => {
    voteToPost(
      props.user.accessToken,
      {id: props.data.id, value: 'LIKE', type: 'COMMENT'},
      res => {
        if (props.callback) {
          props.callback();
          return;
        }
        // alert('Liked ' + res.data.data.total);
        let response = res.data;
        if (response.status === 200) {
          let newPostData = props.data;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          props.dispatch({
            type: 'UPDATE_COMMENTS_ONE_POST',
            data: {post: newPostData},
          });
        } else {
          alert(response.message);
        }
      },
      err => {
        defaultError(err);
      },
    );
  };

  const handleDislikeButton = () => {
    voteToPost(
      props.user.accessToken,
      {id: props.data.id, value: 'DISLIKE', type: 'COMMENT'},
      res => {
        if (props.callback) {
          props.callback();
          return;
        }
        let response = res.data;
        if (response.status === 200) {
          let newPostData = props.data;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          props.dispatch({
            type: 'UPDATE_COMMENTS_ONE_POST',
            data: {post: newPostData},
          });
        } else {
          alert(response.message);
        }
      },
      err => {
        defaultError(err);
      },
    );
  };

  const data = props.data;
  const commentUserId = data.user.id;
  const votedNo = data.voteData.total;
  const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);
  let fullName, avatarUrl;
  fullName = data.user.fullName;
  avatarUrl =
    commentUserId == '-999'
      ? CONSTANTS.INCOGNITO_AVATAR
      : data.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const likeButtonEnabled = data.voteData.upData.active === true;
  const dislikeButtonEnabled = data.voteData.downData.active === true;
  const callback = props.callback;
  const content = data.content;
  const commentId = data.id;
  const isCommentOwner = data.isOwner;

  return (
    <View key={data.id}>
      <ReplyItem
        {...props}
        _onLongPress={_onLongPress}
        handleVoteButton={handleVoteButton}
        handleDislikeButton={handleDislikeButton}
        votedNo={votedNo}
        timeAgo={timeAgo}
        fullName={fullName}
        avatarUrl={avatarUrl}
        likeButtonEnabled={likeButtonEnabled}
        dislikeButtonEnabled={dislikeButtonEnabled}
        callback={callback}
        content={content}
        commentId={commentId}
        isCommentOwner={isCommentOwner}
      />
    </View>
  );
};

export default memo(ReplyItemContainer);
