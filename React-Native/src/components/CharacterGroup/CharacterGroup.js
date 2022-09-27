import React from "react";
import { View, Image, ImageBackground } from "react-native";
import { Text } from "../CoreUIComponents";
import CharacterItem from "./CharacterItem";
import CONSTANTS from "../../common/PeertalConstants";

const CharacterGroup = (props) => {

  return (
    <View>
      <Text style={{ marginTop: 20, fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: '#414042' }}>Character</Text>
      <ImageBackground
        style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 30 }}
        source={require("../../assets/xd/background/character_bg.png")}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 85,
            width: 170,
            height: 170,
            marginLeft: 45,
            marginTop: 15,
            zIndex: 2,
            shadowColor: "#BCBEC0",
            shadowOffset: {
              width: 0,
              height: 10
            },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 7
          }}>
          <Image
            style={{
              width: 170,
              height: 170,
            }}
            source={{ uri: props.cImageUrl }}
          />
        </View>
        <View
          style={{
            height: 120,
            width: 120,
            marginLeft: -5,
            borderRadius: 60,
            backgroundColor: CONSTANTS.MY_BLUE,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1, 
            shadowColor: "#0075FF",
            shadowOffset: {
              width: 0,
              height: 10
            },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 7
          }}
        >
          <Text style={{ color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 15 }}>{props.cName}</Text>
        </View>
      </ImageBackground>
      <Text style={{ marginTop: 20, marginBottom: 15 }}>{props.cDescription}</Text>
      <CharacterItem data={props.item1} onLeftVote={props.handleVote} onRightVote={props.handleVote} alert={props.alert} />
      <CharacterItem data={props.item2} onLeftVote={props.handleVote} onRightVote={props.handleVote} alert={props.alert} />
      <CharacterItem data={props.item3} onLeftVote={props.handleVote} onRightVote={props.handleVote} alert={props.alert} />
      <CharacterItem data={props.item4} onLeftVote={props.handleVote} onRightVote={props.handleVote} alert={props.alert} />
    </View>
  );
}

export default CharacterGroup;
