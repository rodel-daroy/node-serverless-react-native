import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CONSTANTS, { COLORS, SIZES } from '../../../common/PeertalConstants';


const InvalidPincodeScreen = (props) => {

  const { onCancel } = props;


  return (
    <View>
      <ImageBackground source={require('../../../assets/xd/background/Login-bg.png')} style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <View style={styles.header} />
          <View style={styles.body}>
            <View style={styles.invalidSection}>
              <MaterialCommunityIcons name='alert-circle' size={50} color={CONSTANTS.MY_BLUE} />
              <Text style={styles.title}>Invalid pin code</Text>
              <Text style={styles.description}>If you make three mistakes, you will be {'\n'}logged out.</Text>
            </View>
            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.pincodeButton} onPress={onCancel}>
                <Text style={styles.buttonText}>{CONSTANTS.ButtonTexts.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footer} />
        </View>
      </ImageBackground>
    </View>
  );
}


export default InvalidPincodeScreen;


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
    height: SIZES.header,
    paddingHorizontal: SIZES.size_20,
    justifyContent: 'center'
  },
  body: {
    flex: 1
  },
  invalidSection: {
    marginTop: 100,
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    marginVertical: SIZES.size_8,
    fontSize: SIZES.font_24,
    fontWeight: '500'
  },
  description: {
    fontSize: SIZES.font_16,
    textAlign: 'center'
  },
  buttonSection: {
    height: 130,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  pincodeButton: {
    width: SIZES.windowWidth * 0.85,
    height: SIZES.size_56,
    backgroundColor: COLORS.blue,
    borderRadius: SIZES.size_28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: SIZES.font_20,
    color: COLORS.white
  },
  footer: {
    height: CONSTANTS.SPARE_FOOTER
  }
});