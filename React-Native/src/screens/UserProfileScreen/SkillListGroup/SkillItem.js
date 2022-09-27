import React, { useRef } from "react";
import { Icon } from "native-base";
import ActionSheet from "react-native-actionsheet";
import { View, TouchableOpacity } from "react-native";

import CONSTANTS from "../../../common/PeertalConstants";
import { Text } from "../../../components/CoreUIComponents";
import LikeDislikeButton from "../../../components/LikeDislikeButton";

const SkillItem = (props) => {
  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };

  const handleVoteButton = () => {
    props.alert("fun");
  }

  const data = props.data;
  const votedNo = data.voteData.total;
  const likeButtonEnabled = data.voteData.upData.active;
  const dislikeButtonEnabled = data.voteData.downData.active;
  const name = data.name;
  const onLikeAction = props.onLikeAction || handleVoteButton;
  const onDislikeAction = props.onDisLikeAction || handleVoteButton;
  const onReportAction = props.onReportAction || handleVoteButton;
  const deleteSkillAction = props.deleteSkillAction || handleVoteButton;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row", width: 74 }}>
          <LikeDislikeButton onPress={() => onLikeAction()} type="like" active={likeButtonEnabled} />
          <Text style={{ paddingHorizontal: 1, width: 41, fontSize: 13, textAlign: 'center' }}>{votedNo}</Text>
          <LikeDislikeButton onPress={() => onDislikeAction()} type="dislike" active={dislikeButtonEnabled} />
        </View>
        <Text style={{ marginLeft: 15, fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT }}>{name}</Text>
      </View>
      <TouchableOpacity onPress={showActionSheet}>
        <Icon name="dots-three-vertical" type="Entypo" style={{ fontSize: 16, fontWeight: "200" }} />
      </TouchableOpacity>
      <ActionSheet
        ref={refActionSheet}
        title={"Which action do you like to do?"}
        options={props.options}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        onPress={index => {
          if (index === 0) {
            props.options[0] == "Delete" && deleteSkillAction(data.id);
            props.options[0] == "Report" && onReportAction();
          }
        }}
      />
    </View>
  );
}

export default SkillItem;
