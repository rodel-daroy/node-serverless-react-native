import React, { Component } from "react";
import { Text, View } from "react-native";

export default class CustomText extends Component {
  render() {
    const fontF = "Montserrat-Regular";
    const fontS = 14;
    const fontC = "#414042";
    let myFontFamily, myFontColor;
    if (this.props.style) {
      myFontSize = this.props.style.fontSize || fontS;
      myFontFamily = this.props.style.fontFamily || fontF;
      myFontColor = this.props.style.color || fontC;
    } else {
      myFontSize = fontS;
      myFontFamily = fontF;
      myFontColor = fontC;
    }

    return (
      <View>
        <Text
          style={{
            ...this.props.style,
            fontFamily: myFontFamily,
            fontSize: myFontSize,
            color: myFontColor
          }}
        >
          {this.props.children}
        </Text>
      </View>
    );
  }
}
