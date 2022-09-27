import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Icon} from 'native-base';

import ReplyItem from './ReplyItem';
import ReplyInput from './ReplyInput';
import LikeDislikeButton from '../LikeDislikeButton';
import CONSTANTS from '../../common/PeertalConstants';
import {ParsedText, Text} from '../CoreUIComponents';

const CommentItem = (props) => {
  const {
    isReply,
    setIsReply,
    _onLongPress,
    handleDislikeButton,
    handleVoteButton,
    data,
    userId,
    commentUserId,
    votedNo,
    timeAgo,
    fullName,
    avatarUrl,
    likeButtonEnabled,
    dislikeButtonEnabled,
    callback,
    content,
    commentId,
    postId,
    isCommentOwner,
  } = props;
  return (
    <View
      key={data.id}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginHorizontal: 15,
      }}>
      <Image
        source={typeof avatarUrl === 'string' ? {uri: avatarUrl} : avatarUrl}
        style={{
          width: 48,
          height: 48,
          borderRadius: 48 / 2,
          alignSelf: 'flex-start',
        }}
      />
      <View>
        <View>
          <TouchableWithoutFeedback
            onLongPress={() =>
              _onLongPress(isCommentOwner, commentId, commentUserId, userId)
            }>
            <View
              style={{
                width: CONSTANTS.WIDTH - 30 - 48 - 10,
                minHeight: 48,
                borderRadius: 6,
                backgroundColor: '#F3F4F4',
                marginHorizontal: 10,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  {fullName}
                </Text>
                {/* <Icon
                  name="dot-single"
                  type="Entypo"
                  style={{
                    color: 'gray',
                    fontSize: 14,
                    marginLeft: 15,
                  }}
                /> */}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '200',
                    color: '#000000',
                    marginLeft: 15,
                    marginTop: 2,
                  }}>
                  {timeAgo}
                </Text>
              </View>
              <ParsedText
                style={{
                  marginHorizontal: 10,
                  fontSize: 14,
                  marginVertical: 8,
                }}>
                {content}
              </ParsedText>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              marginTop: 5,
              alignItems: 'center',
            }}>
            <LikeDislikeButton
              onPress={handleVoteButton}
              type="like"
              active={likeButtonEnabled}
              callback={callback}
            />
            <Text style={{marginHorizontal: 8, fontSize: 14}}>{votedNo}</Text>
            <LikeDislikeButton
              onPress={handleDislikeButton}
              type="dislike"
              active={dislikeButtonEnabled}
              callback={callback}
            />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginLeft: 15,
                alignItems: 'center',
              }}
              onPress={() => setIsReply(!isReply)}>
              <Icon
                style={{fontSize: 18, color: CONSTANTS.MY_GREY}}
                name="reply"
                type="MaterialIcons"
              />
              <Text style={{marginLeft: 10}}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        {data.children.map((item) => {
          return (
            <ReplyItem
              data={item}
              key={item.id}
              callback={callback}
              setIsLoading={props.setIsLoading}
              commentId={commentId}
              user={props.user}
            />
          );
        })}
        {isReply ? (
          <ReplyInput
            defaultError={props.defaultError}
            user={props.user}
            commentId={commentId}
            postId={postId}
            callback={callback}
          />
        ) : null}
      </View>
    </View>
  );
};

export default CommentItem;
