import { css } from '@emotion/native';
import { Icon } from 'native-base';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Image, Linking, Share, TouchableOpacity, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { deleteAPost, getPostDetails, getPostRewards } from '../../actions/postActions';
import { goToProfile, reportToPost, sharePostCount, voteToPost } from '../../actions/userActions';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';
import CONSTANTS from '../../common/PeertalConstants';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import PostsContext from '../../context/Posts/PostsContext';
import UserContext from '../../context/User/UserContext';
import UserObject from '../../models/UserObject';
import CommentItem from '../CommentItem';
import { OverlayLoading, Text } from '../CoreUIComponents';
import TextTruncate from '../CoreUIComponents/TextTruncate';
import CreateTagList from '../CreateTagList';
import GroupAvatars from '../GroupAvatars';
import LikeDislikeButton from '../LikeDislikeButton';
import NewRewardListModal from '../NewRewardListModal';
import NewRewardModal from '../NewRewardModal';
import PeertalMediaCarousel from '../PeertalMediaCarousel';
import TempComment from './TempComment';


const PostItem = (props) => {

  const { verificationStatus } = useContext(UserContext);
  const { defaultError } = useContext(DefaultErrorContext);
  const { hiddenPostId, setHiddenPostId, hiddenCommentId, updatedPost } = useContext(PostsContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [tempCommentData, setTempCommentData] = useState(null);
  const [tempContentId, setTempContentId] = useState(null);
  const [tempCommentLike, setTempCommentLike] = useState(false);
  const [tempCommentDislike, setTempCommentDislike] = useState(false);
  const [tempCommentTotal, setTempCommentTotal] = useState(0);
  const [likeButtonEnabled, setLikeButtonEnabled] = useState(props.data.voteData.upData.active);
  const [dislikeButtonEnabled, setDislikeButtonEnabled] = useState(props.data.voteData.downData.active);
  const [votedNo, setVotedNo] = useState(props.data.voteData.total);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);
  const [postData, setPostData] = useState(props.data);
  const [key, setKey] = useState(Math.random());
  const [onRewardPress, setOnRewardPress] = useState(false);
  const [postRewardData, setPostRewardData] = useState([]);
  const [isPostRewardLoaded, setIsPostRewardLoaded] = useState(false);
  const [isNewRewardModal, setIsNewRewardModal] = useState(false);

  const identityStatus = useMemo(() => {
    if (verificationStatus === -1) {
      return 'unverified';
    }

    if (verificationStatus === 2) {
      return 'rejected';
    }

    if (verificationStatus === 1) {
      return 'verified';
    }

    if (verificationStatus === 0) {
      return 'verifying';
    }
  }, [verificationStatus]);

  useEffect(() => {
    return () => {
      tempCommentInit();
    };
  }, []);

  useEffect(() => {
    if (postData.id === updatedPost.id) {
      setPostData(updatedPost);
    }
  }, [updatedPost]);

  const _onShow = useCallback(() => {
    tempCommentInit();
    setLikeButtonEnabled(postData.voteData.upData.active);
    setDislikeButtonEnabled(postData.voteData.downData.active);
    setVotedNo(postData.voteData.total);
    setKey(Math.random());
  }, [tempCommentInit, postData]);

  const doReward = () => {
    setOnRewardPress(false);
    setTimeout(() => {
      reward()
    }, 1000);
  };

  const reward = useCallback(() => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }

    if (identityStatus === 'verified') {
      /*
      props.navigation.navigate('SendMoney', {
          tagList: [postData.user],
          postId: postData.id,
          refreshPosts: props.handleRefreshTimeLine,
      });
      */
      setIsNewRewardModal(true);
    }

    if (identityStatus === 'unverified' || identityStatus === 'rejected') {
      props.navigation.navigate('AddPersonalInformation');
    }

    if (identityStatus === 'verifying') {
      alert(CONSTANTS.PENDING_VERIFICATION_MSG);
    }
  }, [identityStatus, props.navigation, postData, props.handleRefreshTimeLine]);

  const isPostOwner = useMemo(() => {
    return props?.data?.isOwner;
  }, [props?.data?.isOwner]);

  const renderVoteUpButton = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
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
          source={likeButtonEnabled
            ? require('../../assets/xd/Icons/active_arrow_up.png')
            : require('../../assets/xd/Icons/inactive_arrow_up.png')
          }
        />
      </TouchableOpacity>
    );
  }, [props.user, props.navigation, likeButtonEnabled, dislikeButtonEnabled, votedNo]);

  const renderVoteDownButton = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
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
          source={dislikeButtonEnabled
            ? require('../../assets/xd/Icons/active_arrow_down.png')
            : require('../../assets/xd/Icons/inactive_arrow_down.png')
          }
        />
      </TouchableOpacity>
    );
  }, [props.user, props.navigation, likeButtonEnabled, dislikeButtonEnabled, votedNo]);

  const renderExpandor = useCallback(() => {
    return <Text style={seeLessMoreStyle}>{'see more'}</Text>;
  }, [seeLessMoreStyle]);

  const renderCollapsar = useCallback(() => {
    return <Text style={seeLessMoreStyle}>{'see less'}</Text>;
  }, [seeLessMoreStyle]);

  const handleShareButton = useCallback(() => {

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
      message: 'https://web.kuky.com/discover/' + id + '/' + modifiedContent,
      url: 'https://web.kuky.com/discover/' + id + '/' + modifiedContent
    };

    const options = {
      subject: 'share Kuky',
      dialogTitle: 'share Kuky',
    };

    sharePostCount(props.user.accessToken, postData.id, (res) => { });
    Share.share(content, options);
  }, [Share, postData]);

  const handleTouchOnContent = useCallback(() => {
    props.navigation.navigate('PostDetails', {
      postId: postData.id,
      likeButtonEnabled: postData.voteData.upData.active,
      dislikeButtonEnabled: postData.voteData.downData.active,
      votedNo: postData.voteData.total,
    });
  }, [props.navigation, postData]);

  const handleTouchOnTag = useCallback((id) => {
    goToProfile(props.navigation, id);
  }, [props.navigation, goToProfile]);

  const _handleAction = useCallback((action) => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }

    if (action == 'report' || action == 'nsfw') {
      reportToPost(props.user.accessToken, { id: postData.id, type: 'POST', value: action },
        (res) => {
          alert('Thanks for helping to make this a better community. Your moderation and our algorithm will take care of this right away.');
        },
        (err) => defaultError(err),
      );
    }
  }, [props.user, props.navigation, postData, reportToPost]);

  const handleVoteButton = useCallback(() => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }

    setIsBackgroundLoading(true);

    voteToPost(props.user.accessToken, { id: postData.id, value: 'LIKE', type: 'POST' },
      (res) => {
        let response = res.data;
        if (response.status === 200) {
          let newPostData = postData;
          newPostData.voteData = res.data.data;
          props.dispatch({ type: 'UPDATE_COMMENTS_ONE_POST', data: { post: newPostData } });
          setIsBackgroundLoading(false);
        } else {
          alert(response.message);
          setIsBackgroundLoading(false);
        }
      },
      (err) => {
        setIsBackgroundLoading(false);
        defaultError(err);
      },
    );
  }, [props.user, props.navigation, voteToPost, postData]);

  const handleTouchOnAvatar = useCallback(() => {
    goToProfile(props.navigation, postData.user.id);
  }, [postData, props.navigation, goToProfile]);

  const handleDislikeButton = useCallback(() => {
    if (props.user.loggedStatus === 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }

    setIsBackgroundLoading(true);

    voteToPost(props.user.accessToken, { id: postData.id, value: 'DISLIKE', type: 'POST' },
      (res) => {
        let response = res.data;
        if (response.status === 200) {
          let newPostData = postData;
          newPostData.voteData = res.data.data;
          props.dispatch({ type: 'UPDATE_COMMENTS_ONE_POST', data: { post: newPostData } });
          setIsBackgroundLoading(false);
        } else {
          setIsBackgroundLoading(false);
          alert(response.message);
        }
      },
      (err) => {
        setIsBackgroundLoading(false);
        defaultError(err);
      },
    );
  }, [props.user, props.navigation, postData, voteToPost]);

  const tempCommentHandler = useCallback((data, contentId) => {
    setTempContentId(contentId);
    setTempCommentData(data);
    setTempCommentLike(false);
    setTempCommentDislike(false);
    setTempCommentTotal(0);
  }, []);

  const tempCommentInit = useCallback(() => {
    setTempCommentData(null);
    setTempContentId(null);
    setTempCommentLike(false);
    setTempCommentDislike(false);
    setTempCommentTotal(0);
  }, []);

  const handleTempCommentVoteButton = useCallback(() => {
    voteToPost(props.user.accessToken, { id: tempCommentData.id, value: 'LIKE', type: 'COMMENT' },
      (res) => {
        if (props.callback) {
          props.callback();
          return;
        }
        let response = res.data;
        if (response.status === 200) {
          let newPostData = tempCommentData;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          props.dispatch({ type: 'UPDATE_COMMENTS_ONE_POST', data: { post: newPostData } });
          setTempCommentLike(res.data.data.upData.active);
          setTempCommentDislike(res.data.data.downData.active);
          setTempCommentTotal(res.data.data.total);
        } else {
          alert(response.message);
        }
      },
      (err) => defaultError(err),
    );
  }, [props.user, tempCommentData, voteToPost]);

  const handleTempCommentDislikeButton = useCallback(() => {
    voteToPost(props.user.accessToken, { id: tempCommentData.id, value: 'DISLIKE', type: 'COMMENT' },
      (res) => {
        if (props.callback) {
          props.callback();
          return;
        }
        let response = res.data;
        if (response.status === 200) {
          let newPostData = tempCommentData;
          newPostData.voteData.VOTE_LIKE_POST = res.data.data;
          props.dispatch({ type: 'UPDATE_COMMENTS_ONE_POST', data: { post: newPostData } });
          setTempCommentLike(res.data.data.upData.active);
          setTempCommentDislike(res.data.data.downData.active);
          setTempCommentTotal(res.data.data.total);
        } else {
          alert(response.message);
        }
      },
      (err) => defaultError(err),
    );
  }, [props.user, tempCommentData, voteToPost]);

  const renderTempComment = useCallback(() => {
    return (
      <TempComment
        {...props}
        hiddenCommentId={hiddenCommentId}
        tempCommentData={tempCommentData}
        tempContentId={tempContentId}
        tempCommentLike={tempCommentLike}
        tempCommentDislike={tempCommentDislike}
        tempCommentTotal={tempCommentTotal}
        timeAgoForTempComment={timeAgoForTempComment}
        tempCommentHandler={tempCommentHandler}
        tempCommentInit={tempCommentInit}
        handleTempCommentVoteButton={handleTempCommentVoteButton}
        handleTempCommentDislikeButton={handleTempCommentDislikeButton}
        callback={_loadData}
      />
    );
  }, [
    props,
    hiddenCommentId,
    tempCommentData,
    tempContentId,
    tempCommentLike,
    tempCommentDislike,
    tempCommentTotal,
    timeAgoForTempComment,
    tempCommentHandler,
    tempCommentInit,
    handleTempCommentVoteButton,
    handleTempCommentDislikeButton,
    _loadData
  ]);

  const _renderCommentItem = useCallback(() => {
    const commentsArr = postData.comments.length > 3
      ? [postData.comments[postData.comments.length - 3], postData.comments[postData.comments.length - 2], postData.comments[postData.comments.length - 1]]
      : [...postData.comments];

    if (postData.comments.length == 0) {
      return <View />;
    } else {
      return commentsArr.map((item) => {
        return (
          <View key={item.id}>
            <CommentItem
              postData={postData}
              data={item}
              user={props.user}
              callback={_loadData}
              postId={postData.id}
              setIsLoading={() => {
              }}
            />
          </View>
        );
      });
    }
  }, [postData, CommentItem, props.user, _loadData]);

  const _loadData = useCallback(() => {
    const postId = postData.id;
    getPostDetails(props.user.accessToken, postId,
      (res) => {
        setPostData(res.data.data.post_data);
      },
      (err) => defaultError(err),
    );
  }, [postData, getPostDetails, props.user]);

  const data = postData;
  let tagListData = '';
  tagListData = CONSTANTS.renderListPeople(data.taggedUsers.map((item) => item.fullName));
  let hashTags = data.hashTags || [];
  let votedList = '';
  if (data.voteData != null) {
    votedList = 'Voted by ' + CONSTANTS.renderListPeople(data.voteData.votedUsers.map((item) => item.fullName));
  }
  const commentNo = data.totalComments;

  const timeAgo = CONSTANTS.getTimeDifference(data.createdAt);

  let fullName, avatarUrl;
  const user = data.user || new UserObject();
  fullName = user.fullName;
  avatarUrl = postData.user.id == '-999' ? CONSTANTS.INCOGNITO_AVATAR : user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const locationAddress = data.locationAddress || '';
  const exRate = props.user.exchangeRate || 0;
  const exCurrency = props.user.preferredCurrency || 'USD';

  const [postMoney, postMoneyText] = useMemo(() => {
    if (data?.money?.amount && data?.money?.currency) {
      return [
        parseInt(data.money.amount) ? (data.money.amount).toFixed(2) : '',
        getCurrencySymbol(data.money.currency) + ' ' + (data.money.amount).toFixed(2) + ' ' + data.money.currency
      ];
    }

    return [
      parseInt(data?.money?.totalCoin) ? (data.money.totalCoin * exRate).toFixed(2) : '',
      getCurrencySymbol(exCurrency) + ' ' + (data.money.totalCoin * exRate).toFixed(2) + ' ' + exCurrency
    ];
  }, [data]);

  let groupAvatar = null;
  if (data.voteData.votedUsers.length != null) {
    groupAvatar = data.voteData.votedUsers.map((item) => item.avatarUrl);
  }
  //calculate status of like/dislike...

  const shareNo = postData?.shareNo || 0; //not yet have in our system
  /* Hide wallet and money transfer feature for ios */
  /* let options = ['Report', 'Reward', 'Cancel']; */
  let options = CONSTANTS.IS_HIDE_WALLET_FEATURE
    ? ['Report', 'Cancel']
    : postData.user.id == '-999'
      ? ['Report', 'Cancel']
      : ['Report', 'Reward', 'Cancel'];
  if (data.created_by === props.user.userId) {
    options = ['Delete', 'Edit', 'Cancel'];
  }
  const timeAgoForTempComment =
    tempCommentData && CONSTANTS.getTimeDifference(tempCommentData.createdAt);

  const [youtubeAddress, setYoutubeAddress] = useState('');

  useEffect(() => {
    if (!isBackgroundLoading) {
      setIsOverlayLoading(false);
    }
  }, [isBackgroundLoading]);

  const handleUrlPress = (url, matchIndex = 0) => {
    Linking.openURL(url);
  };

  const handleHashTagPress = useCallback((hashTag) => {
    let hashTagWithoutSharp = '';
    if (hashTag[0] === '#') {
      hashTagWithoutSharp = hashTag.replace('#', '');
    }
    props.navigation.navigate('HashTagPost', {
      hashTag: hashTagWithoutSharp,
    });
  }, [props.navigation]);

  const contentText = useMemo(() => {
    return postData.content;
  }, [postData]);

  useEffect(() => {
    if (!contentText || contentText === '') return;
    let pattern = /(?:https?:\/\/|www\.|m\.|^)youtu(?:be\.com\/watch\?(?:.*?&(?:amp;)?)?v=|\.be\/)([\w‌​\-]+)(?:&(?:amp;)?[\w\?=]*)?/;
    let match = contentText.match(pattern);

    if (match && match.length > 0) {
      !youtubeAddress && match[1] && setYoutubeAddress(match[1]);
    }
  }, [contentText]);

  const handleActionSheet = useCallback(() => {
    alert({
      title: 'Post',
      main: 'Which action do you like to do?',
      button: options.map((option) => {
        if (CONSTANTS.IS_HIDE_WALLET_FEATURE && option === "Reward") {
          return;
        }

        return {
          text: option,
          style: option === 'Cancel' ? 'smallCancel' : 'small',
          onPress: () => handleOption(option)
        }
      }),
    });
  }, [options]);

  const handleOption = useCallback((option) => {
    if (option === 'Delete') {
      alert({
        title: 'Delete',
        main: 'Do you really want to delete your post?',
        button: [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              alert('');
              setHiddenPostId([...hiddenPostId, postData.id]);
              deleteAPost(
                props.user.accessToken,
                postData.id,
                (res) => {
                  //props.dispatch(refreshPosts(props.user.accessToken));
                },
                (err) => {
                  let tempHiddenPostId = hiddenPostId.map(
                    (id) => id != postData.id,
                  );
                  setHiddenPostId(tempHiddenPostId);
                  alert('Please try again.');
                },
              );
            },
          },
        ],
      });
    } else if (option === 'Edit') {
      alert('');
      props.navigation.navigate('UpdatePost', {
        postData: postData,
      });
    } else if (option === 'Reward') {
      alert('');
      reward();
    } else if (option === 'Report') {
      alert({
        title: 'Report',
        main: 'How would you like this content to be reported?',
        button: [
          {
            text: '+18',
            style: 'small',
            onPress: () => {
              _handleAction('nsfw');
            },
          },
          {
            text: 'Delete',
            style: 'small',
            onPress: () => {
              _handleAction('report');
            },
          },
          {
            text: 'Cancel',
            style: 'smallCancel',
          },
        ],
      });
    } else {
      alert('');
    }
  }, [
    hiddenPostId,
    postData,
    props.user,
    props.navigation,
    _handleAction,
    reward
  ]);

  const onRewardPressed = useCallback(() => {
    if (postData?.total_rewards || isPostOwner) {
      setOnRewardPress(true);
    } else {
      reward();
    }
  }, [postData, isPostOwner, reward]);

  useEffect(() => {
    if (onRewardPress) {
      setIsPostRewardLoaded(false);
      setIsOverlayLoading(true);
      const postId = postData.id;

      getPostRewards(
        props.user.accessToken,
        postId,
        (res) => {
          setPostRewardData(res.data.data);
          setIsPostRewardLoaded(true);
          setIsOverlayLoading(false);
        },
        (err) => {
          setIsPostRewardLoaded(false);
          defaultError(err);
          setIsOverlayLoading(false);
        },
      );
    }

    return () => {
      setIsPostRewardLoaded(false);
    }
  }, [postData, getPostRewards, props.user, onRewardPress]);

  const isRewardPopUp = useMemo(() => {
    if (onRewardPress && isPostRewardLoaded) {
      return true;
    } else {
      return false;
    }
  }, [onRewardPress, isPostRewardLoaded])

  return (
    <View style={{ flexDirection: 'column', backgroundColor: 'white', paddingBottom: 10, borderBottomColor: '#F3F4F4', borderBottomWidth: 10, shadowColor: 'blue' }}>
      <NavigationEvents onWillFocus={_onShow} />
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TouchableOpacity onPress={handleTouchOnAvatar}>
          <Image
            source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl}
            style={{ width: 48, height: 48, borderRadius: 48 / 2, backgroundColor: 'gray', marginLeft: 12, alignSelf: 'flex-start' }}
          />
        </TouchableOpacity>
        <View style={{ width: CONSTANTS.WIDTH - 86, paddingLeft: 12, backgroundColor: 'white', paddingTop: 6, flexDirection: 'column' }}>
          <TouchableOpacity onPress={handleTouchOnAvatar}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{fullName}</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: '200', fontSize: 12, color: CONSTANTS.MY_DARK_GREY }}>
            {timeAgo}
          </Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', }}>
          <TouchableOpacity onPress={handleActionSheet}>
            <Icon
              name="dots-three-vertical"
              type="Entypo"
              style={{ fontSize: 16, fontWeight: '200' }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {postData.taggedUsers.length == 0 && locationAddress == '' && postMoney == '' ?
        null
        :
        <View style={{ flexDirection: 'column', marginTop: 5, marginLeft: 36, borderStyle: 'dashed', borderColor: 'gray', borderWidth: 1, minHeight: 40, }}>
          <View style={{ flexDirection: 'column', backgroundColor: 'white', minHeight: 40, marginRight: -1, marginBottom: -1, marginTop: -1, }}>
            {postData.taggedUsers.length == 0 ?
              null
              :
              <View
                style={{ flexDirection: 'row', marginLeft: 12, marginTop: 5 }}>
                <Image source={require('../../assets/xd/Icons/users.png')} style={{ width: 14, height: 14 }} />
                <Text style={{ fontSize: 12, textAlignVertical: 'center', marginLeft: 10, paddingRight: 1, marginRight: 20 }}>
                  <CreateTagList data={postData.taggedUsers} callback={handleTouchOnTag} />
                </Text>
              </View>
            }
            {locationAddress != '' ?
              <View style={{ flexDirection: 'row', marginLeft: 12, marginTop: 5 }}>
                <Image source={require('../../assets/xd/Icons/post_location.png')} style={{ width: 14, height: 14 }} />
                <Text style={{ fontSize: 12, textAlignVertical: 'center', marginLeft: 10, maxWidth: CONSTANTS.WIDTH - 80 }}>
                  {locationAddress}
                </Text>
              </View>
              :
              null
            }
            {/* Hide wallet and money transfer feature for ios */}
            {CONSTANTS.IS_HIDE_WALLET_FEATURE ? null : postMoney !== ''
              ?
              <View style={{ flexDirection: 'row', marginLeft: 12, marginTop: 5 }}>
                <Image source={require('../../assets/xd/Icons/post_money.png')} style={{ width: 14, height: 14 }} />
                <Text style={{ fontSize: 12, textAlignVertical: 'center', marginLeft: 10 }}>
                  {postMoneyText}
                </Text>
              </View>
              :
              <View />
            }
          </View>
        </View>
      }

      <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            if (isBackgroundLoading) {
              setIsOverlayLoading(true);
              return;
            }
            handleTouchOnContent();
          }}>
          <TextTruncate
            numberOfLines={3}
            renderExpandor={renderExpandor}
            renderCollapsar={renderCollapsar}>
            <ParsedText
              parse={[
                {
                  type: 'url',
                  style: { color: CONSTANTS.MY_BLUE, textDecorationLine: 'underline' },
                  onPress: handleUrlPress,
                },
                {
                  pattern: /#(\w+)/,
                  style: { color: CONSTANTS.MY_BLUE },
                  onPress: handleHashTagPress,
                },
              ]}
              childrenProps={{ allowFontScaling: false }}>
              {contentText}
            </ParsedText>
          </TextTruncate>
        </TouchableOpacity>
      </View>
      <View>
        <PeertalMediaCarousel
          key={key}
          data={postData.media}
          youtubeAddress={youtubeAddress}
        />
      </View>

      <View style={iconRowStyle}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderVoteUpButton}
          <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{votedNo}</Text>
          {renderVoteDownButton}

          <LikeDislikeButton
            type="comment"
            onPress={() => {
              if (isBackgroundLoading) {
                setIsOverlayLoading(true);
                return;
              }
              handleTouchOnContent();
            }}
            active={true}
            style={{ marginLeft: 20, paddingTop: 1 }}
          />
          <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{commentNo}</Text>

          {!CONSTANTS.HIDE_POSTREWARD_FOR_IOS && (
            <TouchableOpacity style={{ marginLeft: 12 }} onPress={onRewardPressed}>
              {postData.user.id !== -999 && (
                <View style={rewardContainerStyle}>
                  <Icon name="dollar-bill" type="Foundation" style={{ fontSize: 26, color: CONSTANTS.MY_GREY }} />
                  <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{postData?.total_rewards ?? 0}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={shareButtonAndGroupAvatarContainerStyle}>
          <LikeDislikeButton
            type="share"
            onPress={handleShareButton}
            active={true}
            style={{ marginRight: 10 }}
          />
          <Text style={shareTextStyle}>{shareNo ? shareNo : ''}</Text>

          <GroupAvatars data={groupAvatar} />
        </View>
      </View>

      {_renderCommentItem()}

      {renderTempComment()}

      {isOverlayLoading ? <OverlayLoading /> : null}

      {/* <PostRewardModal
                showUp={isRewardPopUp}
                onClose={() => setOnRewardPress(false)}
                postRewardData={postRewardData}
                reward={reward}
                isPostOwner={isPostOwner}
            /> */}

      <NewRewardListModal
        showUp={isRewardPopUp}
        onClose={() => setOnRewardPress(false)}
        postRewardData={postRewardData}
        doReward={doReward}
        isPostOwner={isPostOwner}
      />

      <NewRewardModal
        accessToken={props.user.accessToken}
        preferredCurrency={props.user.preferredCurrency}
        postId={postData.id}
        postUsername={postData.user.fullName}
        showUp={isNewRewardModal}
        onClose={() => setIsNewRewardModal(false)}
      />
    </View>
  );
};

const MapStateToProps = (store) => ({ user: store.user });
const PostItemWrapper = connect(MapStateToProps)(PostItem);
export default memo(PostItemWrapper);

const seeLessMoreStyle = css`
    font-size: 11px;
    color: #0477ff;
`;

const iconRowStyle = css`
    height: 30px;
    margin-left: 12px;
    margin-right: 12px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const rewardContainerStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const shareButtonAndGroupAvatarContainerStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const shareTextStyle = css`
    margin-right: 16px;
    padding-top: 2px;
    font-size: 14px;
`;
