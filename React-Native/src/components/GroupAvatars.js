import React from "react";
import { View, Image } from "react-native";
import CONSTANTS from "../common/PeertalConstants";

const GroupAvatars = (props) => {
  let data = [
    "https://randomuser.me/api/portraits/women/9.jpg",
    "https://randomuser.me/api/portraits/men/68.jpg",
    "https://randomuser.me/api/portraits/thumb/men/65.jpg"
  ];

  if (props.data != null) { data = props.data.slice(); }
  let newData;
  if (data.length > 3) {
    newData = data.slice(0, 3);
  } else newData = data.slice();

  return (
    <View {...this.props} style={{ flexDirection: "row" }}>
      {newData.map((item, index) => (
        <Image
          key={index}
          source={{ uri: item || CONSTANTS.DEFAULT_AVATAR }}
          style={{ width: 30, height: 30, marginLeft: -10, borderRadius: 15 }}
        />
      ))}
    </View>
  );
}

export default GroupAvatars;
