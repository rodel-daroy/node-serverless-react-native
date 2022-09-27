import React, {memo} from 'react';
import {View, Image, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'native-base';

import CONSTANTS from '../../../common/PeertalConstants';
import LikeDislikeButton from '../../LikeDislikeButton';
import {Text, ParsedText} from '../../CoreUIComponents';

const ReplyItem = (props) => {
  const {
    _onLongPress,
    handleVoteButton,
    handleDislikeButton,
    key,
    votedNo,
    timeAgo,
    fullName,
    avatarUrl,
    likeButtonEnabled,
    dislikeButtonEnabled,
    callback,
    content,
    commentId,
    isCommentOwner,
  } = props;

  return (
    <View
      key={key}
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
          width: 24,
          height: 24,
          borderRadius: 24 / 2,
          alignSelf: 'flex-start',
        }}
      />
      <View>
        <TouchableWithoutFeedback
          onLongPress={() => _onLongPress(isCommentOwner, commentId)}>
          <View
            style={{
              width: CONSTANTS.WIDTH - 30 - 48 - 10 - 50,
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
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>{fullName}</Text>
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
          style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 5}}>
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
        </View>
      </View>
    </View>
  );
};

export default memo(ReplyItem);
