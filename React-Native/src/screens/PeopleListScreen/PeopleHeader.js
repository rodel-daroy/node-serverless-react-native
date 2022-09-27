import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";

import CONSTANTS from "../../common/PeertalConstants";
import { Text } from "../../components/CoreUIComponents";

const PeopleHeader = (props) => {

  const { handleSelectType } = props
  const currentTab = props.currentTab || "friend";

  return (
    <View style={{ height: 68 }}>
      <ScrollView pagingEnabled={true} style={{ height: "100%" }} horizontal={true}>
        <TouchableOpacity
          onPress={() => handleSelectType("friend")}
          activeOpacity={currentTab == "friend" ? 1 : 0.2}
          style={{
            flexDirection: "row",
            height: 68,
            alignItems: "center",
            marginLeft: currentTab == "friend" ? 23 : -60,
            marginRight: 15,
          }}
        >
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: currentTab == "friend" ? 1 : 0.2
            }}
          >
            My Friends
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelectType("suggest")}
          activeOpacity={currentTab == "suggest" ? 1 : 0.2}
          style={{
            flexDirection: "row",
            height: 68,
            alignItems: "center",
            marginLeft: 15,
            marginRight: 30
          }}
        >
          <Text
            style={{
              ...styles.header,
              color: CONSTANTS.MY_HEAD_TITLE_COLOR,
              opacity: currentTab == "suggest" ? 1 : 0.2
            }}
          >
            Suggested Friends
            </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default PeopleHeader;

const styles = {
  header: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 24
  }
};
