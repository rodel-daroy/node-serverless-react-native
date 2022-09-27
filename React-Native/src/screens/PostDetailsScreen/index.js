import React, { memo, useState, useEffect, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import { Keyboard, Platform, Share, View, Image, TouchableOpacity } from 'react-native';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import UserObject from '../../models/UserObject';
import { getPostDetails, refreshDiscoverPosts } from '../../actions/postActions';
import { voteToPost, reportToPost, sharePostCount } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import PostObject from '../../models/PostObject';
import CommentItem from '../../components/CommentItem';
import PostDetailsScreen from './PostDetailsScreen';

const PostDetailsScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState(new PostObject());
  const [minInputToolbarHeight, setMinInputToolbarHeight] = useState(0);
  const [focus, setFocus] = useState('');
  const [likeButtonEnabled, setLikeButtonEnabled] = useState(props.navigation.getParam('likeButtonEnabled'));
  const [dislikeButtonEnabled, setDislikeButtonEnabled] = useState(props.navigation.getParam('dislikeButtonEnabled'));
  const [votedNo, setVotedNo] = useState(props.navigation.getParam('votedNo'));

  useEffect(() => {
    let keyboardDidShowListener;
    let keyboardDidHideListener;
    if (Platform.OS === 'ios') {
      keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        _keyboardDidShow,
      );
      keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        _keyboardDidHide,
      );
    }

    return () => {
      if (Platform.OS === 'ios') {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      }
    }
  }, [])

  const handleRefreshTimeLine = useCallback(() => {
    props.dispatch(
        refreshDiscoverPosts(
            props.user.accessToken,
            props.user.loggedStatus === "logged" ? props.user.subscribeToAdultContent : false,
            props.user.loggedStatus === "logged" ? props.user.over18 : false,
            props.sortType,
            props.user.longitude,
            props.user.latitude,
        ),
    );
  }, [
    props.isLoading,
    props.dispatch,
    refreshDiscoverPosts,
    props.user.accessToken,
    props.sortType,
    props.user.longitude,
    props.user.latitude,
    props.user.loggedStatus,
    props.user.subscribeToAdultContent,
    props.user.over18
  ]);

  const reward = () => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }

    props.navigation.navigate('SendMoney', {
      tagList: [postData.user],
      postId: postData.id,
      refreshPosts: handleRefreshTimeLine,
    });
  }

  const renderVoteUpButton = () => {
    return (
      <TouchableOpacity onPress={() => {
        if (props.user.loggedStatus === 'guest') {
          props.navigation.navigate('Welcome');
          return;
        }

        if (likeButtonEnabled) {
          setLikeButtonEnabled(false);
          setVotedNo(votedNo - 1);
        }

        if (!likeButtonEnabled) {
          setLikeButtonEnabled(true);
          if (dislikeButtonEnabled) {
            setDislikeButtonEnabled(false);
            setVotedNo(votedNo + 2);
          } else {
            setVotedNo(votedNo + 1);
          }
        }

        handleVoteButton();
      }}>
        <Image
          source={
            likeButtonEnabled ?
              require('../../assets/xd/Icons/active_arrow_up.png') :
              require('../../assets/xd/Icons/inactive_arrow_up.png')
          }
        />
      </TouchableOpacity>
    );
  }

  const renderVoteDownButton = () => {
    return (
      <TouchableOpacity onPress={() => {
        if (props.user.loggedStatus === 'guest') {
          props.navigation.navigate('Welcome');
          return;
        }

        if (dislikeButtonEnabled) {
          setDislikeButtonEnabled(false);
          setVotedNo(votedNo + 1);
        }

        if (!dislikeButtonEnabled) {
          setDislikeButtonEnabled(true);
          if (likeButtonEnabled) {
            setLikeButtonEnabled(false);
            setVotedNo(votedNo - 2);
          } else {
            setVotedNo(votedNo - 1);
          }
        }

        handleDislikeButton();
      }}>
        <Image
          source={
            dislikeButtonEnabled ?
              require('../../assets/xd/Icons/active_arrow_down.png') :
              require('../../assets/xd/Icons/inactive_arrow_down.png')
          }
        />
      </TouchableOpacity>
    );
  }

  const _handleAction = (action) => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    if (action == 'report' || action == 'nsfw') {
      reportToPost(
        props.user.accessToken,
        { id: postData.id, type: 'POST', value: action },
        res => {
          alert(
            'Thanks for helping to make this a better community. Your moderation and our algorithm will take care of this right away.',
          );
        }, (err) => defaultError(err)
      );
    }
  }

  const handleShareButton = () => {
    let reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    let regEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    let id = postData.id;
    let modifiedContent = postData.content;
    if (reg.test(modifiedContent)) {
      modifiedContent = modifiedContent.replace(reg, '');
    }
    if (regEmoji.test(modifiedContent)) {
      modifiedContent = modifiedContent.replace(regEmoji, '');
    }
    modifiedContent = modifiedContent.split(' ').join('-');
    modifiedContent = modifiedContent.substring(0, 25);

    const content = {
      title: postData.content,
      message:
        'https://web.kuky.com/discover/' +
        id +
        '/' +
        modifiedContent,
      url: 'https://web.kuky.com/discover/' + id + '/' + modifiedContent,
    };
    const options = {
      subject: 'share Kuky',
      dialogTitle: 'share Kuky',
    };

    sharePostCount(
        props.user.accessToken,
        postData.id,
        (res) => {}
    );
    Share.share(content, options);
  };

  const _keyboardDidShow = (e) => {
    let keyboardHeight = e.endCoordinates.height;
    setMinInputToolbarHeight(keyboardHeight + 45 - CONSTANTS.SPARE_FOOTER);
  };

  const _keyboardDidHide = () => {
    setMinInputToolbarHeight(45);
  };

  const _renderCommentItem = () => {
    if (postData.length == 0) return <View />;
    else {
      return postData.comments.map(item => (
        <View key={item.id}>
          <CommentItem
            data={item}
            user={props.user}
            callback={_loadData}
            setIsLoading={setIsLoading}
            postId={postData.id}
          />
        </View>
      ));
    }
  }

  const _loadData = () => {
    const postId = props.navigation.getParam('postId') || 100;
    setIsLoading(true);
    getPostDetails(props.user.accessToken, postId, res => {
      setPostData(res.data.data.post_data);
      setIsLoading(false);
    }, err => defaultError(err));
  }

  const handleVoteButton = () => {
    //if (isLoading) return;
    //setIsLoading(true);
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      props.user.accessToken,
      { id: postData.id, value: 'LIKE', type: 'POST' },
      res => {
       // _loadData();
       // setIsLoading(false);
       let response = res.data;
       if (response.status === 200) {
         let newPostData = postData;
         newPostData.voteData = res.data.data;
         props.dispatch({
           type: 'UPDATE_COMMENTS_ONE_POST',
           data: { post: newPostData },
         });
       } else {
         alert(response.message);
       }
      }, (err) => defaultError(err)
    );
  }

  const handleDislikeButton = () => {
   // if (isLoading) return;
   // setIsLoading(true);
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    voteToPost(
      props.user.accessToken,
      { id: postData.id, value: 'DISLIKE', type: 'POST' },
      res => {
       // _loadData();
       // setIsLoading(false);
       let response = res.data;
       if (response.status === 200) {
         let newPostData = postData;
         newPostData.voteData = res.data.data;
         props.dispatch({
           type: 'UPDATE_COMMENTS_ONE_POST',
           data: { post: newPostData },
         });
       } else {
         alert(response.message);
       }
      }, (err) => defaultError(err)
    );
  }

  //const votedNo = postData.voteData.total;
  let tagList = '';
  tagList = CONSTANTS.renderListPeople(
    postData.taggedUsers.map(item => item.fullName),
  );
  let votedList = '';
  if (postData.voteData != null) {
    votedList =
      'Voted by ' +
      CONSTANTS.renderListPeople(
        postData.voteData.votedUsers.map(item => item.fullName),
      );
  }
  const commentNo = postData.totalComments;
  const shareNo = 0;
  let fullName, avatarUrl;
  const userData = postData.user || new UserObject();
  fullName = userData.fullName;
  avatarUrl = userData.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  let groupAvatar = null;
  if (postData.voteData.votedUsers.length != null) {
    groupAvatar = postData.voteData.votedUsers.map(item => item.avatarUrl);
  }
  const postTitle = userData.fullName + " 's post";
  //calculate status of like/dislike...
  //const likeButtonEnabled = postData.voteData.upData.active === true;
  //const dislikeButtonEnabled = postData.voteData.downData.active === true;
  /* Hide wallet and money transfer feature for ios */
  let options = CONSTANTS.IS_HIDE_WALLET_FEATURE
    ? ['Report', 'Cancel']
    : postData.user.id == '-999' ? ['Report', 'Cancel'] : ['Report', 'Reward', 'Cancel'];
  if (props.user.userId == postData.user.id) {
    options = ['Edit', 'Cancel'];
  }

  return (
    <PostDetailsScreen
      {...props}
      options={options}
      likeButtonEnabled={likeButtonEnabled}
      dislikeButtonEnabled={dislikeButtonEnabled}
      postTitle={postTitle}
      groupAvatar={groupAvatar}
      userData={userData}
      shareNo={shareNo}
      commentNo={commentNo}
      votedNo={votedNo}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      postData={postData}
      focus={focus}
      setFocus={(focus) => setFocus(focus)}
      _handleAction={_handleAction}
      handleShareButton={handleShareButton}
      _renderCommentItem={_renderCommentItem}
      _loadData={_loadData}
      handleVoteButton={handleVoteButton}
      handleDislikeButton={handleDislikeButton}
      setPopup={setPopup}
      renderVoteUpButton={renderVoteUpButton}
      renderVoteDownButton={renderVoteDownButton}
      reward={reward}
      defaultError={defaultError}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const PostDetailsContainerWrapper = connect(mapStateToProps)(PostDetailsScreenContainer);
export default memo(PostDetailsContainerWrapper);
