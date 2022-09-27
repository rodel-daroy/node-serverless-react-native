import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Icon } from "native-base";

export default class SquareButton extends Component {
  render() {
    const iconName = this.props.iconName || "ios-bus";
    const iconType = this.props.iconType || "Ionicons";
    return (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: CONSTANTS.MY_BLUE,
            width: 50,
            height: 50,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5
          }}
        >
          <Icon name={iconName} style={{ color: "white" }} />
        </TouchableOpacity>
      </View>
    );
  }
}
