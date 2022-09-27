import React, { Component } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import CONSTANTS from "../../common/PeertalConstants";

export default class LoadingIcon extends Component {
  render() {
    const progress = (this.props.data || 5) + "%";
    return (
      <View
        style={{
          marginVertical: 10,
          height: 6,
          width: "100%",
          justifyContent: "center",
          borderWidth: 1,
          backgroundColor: CONSTANTS.MY_GRAYBG,
          borderColor: CONSTANTS.MY_BLUE
        }}
      >
        <View
          style={{
            marginVertical: 10,
            height: 4,
            width: progress,
            backgroundColor: CONSTANTS.MY_BLUE
          }}
        />
      </View>
    );
  }
}
