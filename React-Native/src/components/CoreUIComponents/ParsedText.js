import React, { Component } from "react";
import ParsedText from "react-native-parsed-text";
import { Linking, StyleSheet, View } from "react-native";
import CONSTANTS from "../../common/PeertalConstants";
export default class ContentText extends React.Component {
  static displayName = "Example";

  handleUrlPress(url, matchIndex /*: number*/) {
    Linking.openURL(url);
  }

  handlePhonePress(phone, matchIndex /*: number*/) {
    alert(`${phone} has been pressed!`);
  }

  handleNamePress(name, matchIndex /*: number*/) {
    alert(`Hello ${name}`);
  }

  handleEmailPress(email, matchIndex /*: number*/) {
    alert(`send email to ${email}`);
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }

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
      <ParsedText
        style={{
          ...this.props.style,
          fontFamily: myFontFamily,
          fontSize: myFontSize,
          color: myFontColor
        }}
        parse={[
          { type: "url", style: styles.url, onPress: this.handleUrlPress }
        ]}
        childrenProps={{ allowFontScaling: false }}
      >
        {this.props.children}
      </ParsedText>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },

  url: {
    color: CONSTANTS.MY_BLUE,
    textDecorationLine: "underline"
  },

  email: {
    textDecorationLine: "underline"
  },

  text: {
    color: "black",
    fontSize: 15
  },

  phone: {
    color: "blue",
    textDecorationLine: "underline"
  },

  name: {
    color: "red"
  },

  username: {
    color: "green",
    fontWeight: "bold"
  },

  magicNumber: {
    fontSize: 42,
    color: "pink"
  },

  hashTag: {
    fontStyle: "italic"
  }
});
