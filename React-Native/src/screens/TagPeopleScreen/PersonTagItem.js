import React, { memo } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import CONSTANTS from "../../common/PeertalConstants";
import { Icon } from "native-base";

const PersonTagItem = (props) => {

  const handleCheck = () => {
    props.callback(props.index, !props.data.checked);
  }

  const { data } = props;
  const avatarSource = data.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const fullName = data.fullName || "Name";
  const occupation = data.occupation || "Global citizen";
  const locationAddress = data.address || "somewhere in the world";
  const checked = data.checked;

  return (
    <TouchableOpacity
      onPress={handleCheck}
      style={{
        //flex to be square
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
        marginTop: 20,
        marginHorizontal: 15,
        padding: 15,
        justifyContent: "flex-start",
        ...CONSTANTS.MY_SHADOW_STYLE
      }}
    >
      <Image source={{ uri: avatarSource }} style={{ width: 47.6, height: 47.6, borderRadius: 24 }} />

      <View style={{ marginLeft: 10, width: CONSTANTS.WIDTH - 30 - 50 - 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View style={{ width: '80%' }}>
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, color: '#414042', fontSize: 14 }}>{fullName}</Text>
            <View style={{ flexDirection: "row", marginTop: 1 }}>
              <Icon name="ios-briefcase" style={{ fontSize: 14, color: '#BCBEC0', paddingLeft: 1.5, alignSelf: 'center' }} />
              <Text style={{ marginLeft: 10, color: '#BCBEC0', fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, fontSize: 12 }}>{occupation}</Text>
            </View>
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <Icon
                name="location-on"
                type="MaterialIcons"
                style={{
                  fontSize: 14,
                  color: '#BCBEC0',
                  alignSelf: 'center'
                }}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: '#BCBEC0',
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  fontSize: 12,
                }}
              >
                {locationAddress}
              </Text>
            </View>
          </View>
          <View style={{ width: '15%' }}>
            <View
              style={{
                backgroundColor: checked ? CONSTANTS.MY_BLUE : CONSTANTS.MY_GRAYBG,
                height: 32,
                width: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15,
                display: "flex",
              }}
            >
              {checked ? <Icon name="check"
                type="FontAwesome" style={{ fontSize: 20, color: '#ffffff' }} /> : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(PersonTagItem);

