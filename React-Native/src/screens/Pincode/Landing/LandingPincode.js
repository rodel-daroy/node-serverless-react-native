import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CONSTANTS, { COLORS, SIZES } from '../../../common/PeertalConstants';


const LandingPincodeScreen = (props) => {

  const { username, onPincode, onFaceId, onSkip } = props;


  return (
    <View>
      <ImageBackground source={require('../../../assets/xd/background/Login-bg.png')} style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <View style={styles.header} />
          <View style={styles.body}>
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <FontAwesome5 name='user-alt' size={32} color={CONSTANTS.Colors.white}></FontAwesome5>
              </View>
              <Text style={styles.username}>Hello, {username}</Text>
              <Text style={styles.description}>You can user it conveniently by {'\n'}registering a PIN Code or Face ID</Text>
            </View>
            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.pincodeButton} onPress={onPincode}>
                <Text style={styles.buttonText}>{CONSTANTS.ButtonTexts.pincode}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pincodeButton} onPress={onFaceId}>
                <Text style={styles.buttonText}>{CONSTANTS.ButtonTexts.faceId}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <MaterialCommunityIcons name='check' size={20} color={CONSTANTS.Colors.fontColor} />
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer} />
        </View>
      </ImageBackground>
    </View>
  );
}


export default LandingPincodeScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  statusBar: {
    height: CONSTANTS.SPARE_HEADER
  },
  header: {
    height: SIZES.header
  },
  body: {
    flex: 1
  },
  userSection: {
    marginTop: 100,
    flexDirection: 'column',
    alignItems: 'center'
  },
  userAvatar: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.blue,
    borderRadius: SIZES.size_40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    marginVertical: SIZES.size_8,
    fontSize: SIZES.font_24,
    fontWeight: '500',
    color: COLORS.fontColor
  },
  description: {
    fontSize: SIZES.font_16,
    color: COLORS.fontColor
  },
  buttonSection: {
    height: 130,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pincodeButton: {
    width: SIZES.windowWidth * 0.85,
    height: SIZES.size_56,
    backgroundColor: COLORS.blue,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: CONSTANTS.Colors.white
  },
  skipButton: {
    position: 'absolute',
    right: SIZES.windowWidth * 0.075,
    bottom: SIZES.size_16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  skipText: {
    marginStart: SIZES.size_4,
    fontSize: SIZES.font_16,
    color: COLORS.fontColor
  },
  footer: {
    height: CONSTANTS.SPARE_FOOTER
  }
});