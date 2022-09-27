import React, { memo, useState, useContext } from 'react';
import { Keyboard } from 'react-native';

import { deleteComment, editComment } from '../../actions/postActions';
import { voteToPost } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import PostsContext from '../../context/Posts/PostsContext';
import CommentItem from './CommentItem';

const CommentItemContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { hiddenCommentId, setHiddenCommentId } = useContext(PostsContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isReply, setIsReply] = useState(false);

  const onDeleteComment = (commentId) => {
    alert('');
    if (!isCommentOwner) {
      alert({ title: 'Uh-oh', main: 'This is not your comment.' });
      return;
    }
    props.setIsLoading(true);
    deleteComment(
      props.user.accessToken,
      commentId,
      (result) => {
        setHiddenCommentId([...hiddenCommentId, commentId]);
        props.callback();
      },
      () => {
        alert({ title: 'Uh-oh', main: 'Something went wrong.' });
        props.setIsLoading(false);
      },
    );
  };

  const onEditComment = (text = 'sss') => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    if (text === '') {
      return;
    }
    let commentData = {
      content: text,
      objectId: props.postData.id,
      isIncognito: props.user.incognitoMode,
      parentCommentId: 0,
      objectType: 'POST',
    };
    props.setIsLoading && props.setIsLoading(true);
    editComment(
      props.user.accessToken,
      commentData,
      (res) => {
        let newCommentObject = res.data.data;
        let updatedPost = {
          ...props.postData,
        };
        updatedPost.comments.push(newCommentObject);
        props.dispatch({
          type: 'UPDATE_COMMENTS_ONE_POST',
          data: { post: updatedPost },
        });
        props.setIsLoading && props.setIsLoading(false);
      },
      (err) => {
        props.setIsLoading && props.setIsLoading(false);
      },
    );
    Keyboard.dismiss();
  };

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
          onPress: () => onDeleteComment(commentId),
        },
      ],
    });
  };

  const handleVoteButton = () => {
    voteToPost(
      props.user.accessToken,
      { id: props.data.id, value: 'LIKE', type: 'COMMENT' },
      (res) => {
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
            data: { post: newPostData },
          });
        } else {
          alert(response.message);
        }
      },
      (err) => defaultError(err),
    );
  };

  const handleDislikeButton = () => {
    voteToPost(
      props.user.accessToken,
      { id: props.data.id, value: 'DISLIKE', type: 'COMMENT' },
      (res) => {
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
            data: { post: newPostData },
          });
        } else {
          alert(response.message);
        }
      },
      (err) => defaultError(err),
    );
  };

  const data = props.data;
  const userId = props.user.userId;
  const commentUserId = data.user.id;
  const votedNo = data.voteData.total;
  const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);
  let fullName, avatarUrl;
  fullName = data.user.fullName;
  avatarUrl =
    commentUserId == '-999'
      ? CONSTANTS.INCOGNITO_AVATAR
      : data.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  //calculate status of like/dislike...
  const likeButtonEnabled = data.voteData.upData.active === true;
  const dislikeButtonEnabled = data.voteData.downData.active === true;
  const content = data.content;
  const commentId = data.id;
  const postId = props.postId;
  const isCommentOwner = data.isOwner;

  return (
    <CommentItem
      {...props}
      isReply={isReply}
      setIsReply={setIsReply}
      _onLongPress={_onLongPress}
      handleVoteButton={handleVoteButton}
      handleDislikeButton={handleDislikeButton}
      userId={userId}
      commentUserId={commentUserId}
      votedNo={votedNo}
      timeAgo={timeAgo}
      fullName={fullName}
      likeButtonEnabled={likeButtonEnabled}
      dislikeButtonEnabled={dislikeButtonEnabled}
      content={content}
      commentId={commentId}
      postId={postId}
      isCommentOwner={isCommentOwner}
      avatarUrl={avatarUrl}
      defaultError={defaultError}
    />
  );
};
export default CommentItemContainer;
