import { Icon } from 'native-base';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS from '../../common/PeertalConstants';


const SettingsScreen = (props) => {

  const { handleTouchOnProfile, handlePincode, version } = props;


  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          shadowColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          ...CONSTANTS.TOP_SHADOW_STYLE
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON
            }}>
            SETTINGS
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require("../../assets/xd/background/Login-bg.png")}
        style={{ width: "100%" }}
      >
        <View
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingHorizontal: 18
          }}>

          <Text style={{ ...styles.header1, marginTop: 30 }}>General</Text>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={handleTouchOnProfile}>
            <Icon name="account" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Profile</Text>
          </TouchableOpacity>

          <View style={{ ...styles.header2, marginTop: 20 }}>
            <Icon name="bell" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Notifications</Text>
          </View>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={handlePincode}>
            <MaterialIconsIcon name="code" size={20} />
            <Text style={{ ...styles.textItem }}>Pincode</Text>
          </TouchableOpacity>

          <Text style={{ ...styles.header1, marginTop: 40 }}>About</Text>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('About')}>
            <Icon name="information" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>About Kuky</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('TandC')}>
            <Icon name="note-text" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('PrivacyPolicy')}>
            <Icon name="shield-lock" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Privacy Policy</Text>
          </TouchableOpacity>

          <Text style={{ ...styles.header1, marginTop: 40 }}>Support</Text>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('Contact')}>
            <Icon name="phone" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('FAQ')}>
            <Icon name="help-circle" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>FAQs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.header2, marginTop: 20 }} onPress={() => props.navigation.navigate('ReportProblem')}>
            <Icon name="bug" type="MaterialCommunityIcons" style={{ fontSize: 18 }} />
            <Text style={{ ...styles.textItem }}>Report a problem</Text>
          </TouchableOpacity>

          <Text style={styles.copyright}>
            You are using Kuky version {version}.{'\n'}
            Made with love by a Global team. Copyright by Kuky@2019
          </Text>

        </View>
      </ImageBackground>
    </View>
  );
}


export default SettingsScreen;


const styles = {
  header1: {
    color: "#0477FF",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
    fontSize: 18,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#414042',
    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
  },
  copyright: {
    width: '100%',
    marginBottom: CONSTANTS.SPARE_FOOTER,
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 11,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    color: '#939598',
    textAlign: 'center',
  }
};
