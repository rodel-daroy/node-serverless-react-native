import React from "react";
import { View, TouchableOpacity } from "react-native";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { Text } from "./CoreUIComponents";
import { goToPage } from "../actions/userActions";

const SearchBar = (props) => {

  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        height: 34,
        backgroundColor: CONSTANTS.MY_GRAYBG,
        width: CONSTANTS.WIDTH - 30 - 34,
        borderRadius: 17
      }}
    >
      <TouchableOpacity
        onPress={() => {
          goToPage(props.navigation, "Search");
        }}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          row: "100%"
        }}
      >
        <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, fontSize: 12, color: "gray", marginLeft: 20 }}>Search</Text>
        <Icon name="search" type="EvilIcons" style={{ marginRight: 10 }} />
      </TouchableOpacity>
    </View>
  );
}

export default SearchBar;