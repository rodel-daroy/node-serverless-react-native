import React, { Component } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import CONSTANTS from "../../common/PeertalConstants";

export default class RadioButton extends Component {
  render() {
    const card = this.props.type || "visa";
    const cardUrl = cardTypes[card];
    const selected = this.props.selected;
    const callback = this.props.callback;

    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", width: 90, height: 25 }}
        onPress={callback}
      >
        <View style={selected ? styles.selected : styles.notSelected} />
        <Image source={cardUrl} style={{ width: 50, height: 25, marginLeft: 5 }} resizeMode={"center"} />
      </TouchableOpacity>
    );
  }
}

const cardTypes = {
  visa: require("../../assets/xd/Icons/visa.png"),
  mastercard: require("../../assets/xd/Icons/mastercard.png"),
  jcb: require("../../assets/xd/Icons/jcb.png"),
  maestro: require("../../assets/xd/Icons/mastertro.png"),
  discover: require("../../assets/xd/Icons/Discover.png"),
  "american-express": require("../../assets/xd/Icons/american-express.png")
};

const styles = {
  selected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: CONSTANTS.MY_BLUE,
    backgroundColor: "white"
  },
  notSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CONSTANTS.MY_BLUE,
    backgroundColor: "white"
  }
};
