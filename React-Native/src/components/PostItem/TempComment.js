import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import CommentInputItem from '../CommentInputItem';

const TempComment = (props) => {
  const { callback } = props;

  const [refData, setRefData] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (refData) {
      props.hiddenCommentId.some((id) => id == refData.id) && setVisible(false);
    }
  }, [props.hiddenCommentId]);

  useEffect(() => {
    props.tempCommentData && setRefData(props.tempCommentData);
    setVisible(true);
  }, [props.tempCommentData]);

  if (visible) {
    return (
      <View style={{}}>
        <CommentInputItem
          onFocus={() => {
            if (props.user.loggedStatus === 'guest') {
              props.navigation.navigate('Welcome');
              return;
            }
          }}
          data={props.data}
          callback={callback}
          user={props.user}
          navigation={props.navigation}
          showCommentOnce={props.tempCommentHandler}
          tempCommentInitCallback={props.tempCommentInit}
        />
      </View>
    );
  } else {
    return (
      <CommentInputItem
        onFocus={() => {
          if (props.user.loggedStatus === 'guest') {
            props.navigation.navigate('Welcome');
            return;
          }
        }}
        data={props.data}
        callback={callback}
        user={props.user}
        navigation={props.navigation}
        showCommentOnce={props.tempCommentHandler}
        tempCommentInitCallback={props.tempCommentInit}
      />
    );
  }
};

export default TempComment;
