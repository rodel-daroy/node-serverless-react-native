import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";

export default class LoadingIcon extends Component {
  render() {
    return (
      <View style={{ marginTop: 10, height: 50, width: "100%", justifyContent: "center" }}>
        <ActivityIndicator size={this.props.size ?? "small"} />
      </View>
    );
  }
}
