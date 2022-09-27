import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../CoreUIComponents";
import CONSTANTS from "../../common/PeertalConstants";
//@flow
export default class RoundButton extends Component {
  render() {
    const text = this.props.text;
    const type = this.props.type || "blue"; //or gray
    const onPress = this.props.onPress;
    const myStyle = {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: type == "gray" ? CONSTANTS.MY_CANCEL_BG_COLOR : CONSTANTS.MY_BLUE,
      minHeight: 50,
      borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: type == "gray" ? 1 : 0,
      borderColor: CONSTANTS.MY_CANCEL_BORDER_COLOR
    };

    // const grayText={}
    const getStyle = this.props.style || myStyle;
    return (
      <TouchableOpacity
        onPress={() => onPress()}
        style={{
          ...myStyle,
          ...getStyle
        }}
      >
        <Text
          style={{ color: type == "gray" ? CONSTANTS.MY_GREY : "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}
