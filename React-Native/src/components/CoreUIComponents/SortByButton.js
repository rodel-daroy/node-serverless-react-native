import React, { Component } from "react";
import { Image, TouchableOpacity, View, Modal } from "react-native";
import { Text } from "../CoreUIComponents";
import { Icon } from "native-base";
import CONSTANTS from "../../common/PeertalConstants";

export default class SortByButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByModal: false
    };
    this._renderItems = this._renderItems.bind(this);
  }
  _renderItems() {
    const data = [
      { iconType: "Ionicons", iconName: "ios-menu", name: "all" },
      { iconType: "Ionicons", iconName: "ios-time", name: "completed" },
      { iconType: "Ionicons", iconName: "ios-checkmark-circle", name: "pending" }
    ];
    return data.map((item, index) => (
      <TouchableOpacity
        onPress={() => {
          this.props.onSelect(item.name);
          this.setState({ sortByModal: false });
        }}
        style={{
          flexDirection: "row",
          height: 60,
          paddingLeft: 20,
          alignItems: "center",
          borderBottomColor: CONSTANTS.MY_GREY,
          borderBottomWidth: 1
        }}
        key={index}
      >
        <Icon name={item.iconName} type={item.iconType} style={{ fontSize: 16, marginRight: 10 }} />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    ));
  }
  render() {
    const getStyle = this.props.style;
    return (
      <View style={{ ...getStyle }}>
        <TouchableOpacity
          onPress={() => this.setState({ sortByModal: true })}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 12 }}> Sort by </Text>
          <Icon name="filter" type="FontAwesome" style={{ fontSize: 14 }} />
        </TouchableOpacity>
        <Modal animationType="slide" transparent={true} visible={this.state.sortByModal}>
          <View
            style={{
              bottom: 0,
              left: 0,
              position: "absolute",
              // backgroundColor: "white",
              width: "100%",
              minHeight: 180
            }}
          >
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ sortByModal: false })}>
              <View style={{ width: 50, height: 5, backgroundColor: CONSTANTS.MY_GREY, marginBottom: 15 }} />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "white",
                height: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                ...CONSTANTS.MY_SHADOW_STYLE
              }}
            >
              {this._renderItems()}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
