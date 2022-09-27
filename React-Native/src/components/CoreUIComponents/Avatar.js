import React, { Component } from "react";
import { View, Image } from "react-native";
import { Text } from "../CoreUIComponents";
import CONSTANTS from "../../common/PeertalConstants";
//@flow
export default class Avatar extends Component {
  render() {
    let source = { uri: CONSTANTS.DEFAULT_AVATAR };
    if (this.props.source) {
      if (this.props.source.uri != null) source = this.props.source;
    }
    let name = this.props.text || "fullName ddddd";
    name = name.substring(0, 10);
    let noName = this.props.noName;
    return (
      <View style={{ alignItems: "center", margin: 10 }}>
        <Image
          source={source}
          style={{
            borderRadius: 50 / 2,
            height: 50,
            width: 50,
            backgroundColor: "gray"
          }}
        />
        {noName ? null : <Text style={{ marginTop: 5 }}>{name}</Text>}
      </View>
    );
  }
}
