import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CONSTANTS from '../../../common/PeertalConstants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ScanFaceScreen = (props) => {

  const { onBack, onScan } = props;


  return (
    <View>
      <ImageBackground source={require('../../../assets/xd/background/Login-bg.png')} style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <View style={styles.header} >
            <TouchableOpacity onPress={onBack}>
              <MaterialCommunityIcons name='arrow-left' size={32} color={CONSTANTS.MY_BLACK_BORDER} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>Sign up for the event by {'\n'}scanning your face</Text>
            <MaterialCommunityIcons name='face-recognition' size={80} color={CONSTANTS.Colors.MY_BLUE} />
            <TouchableOpacity style={styles.pincodeButton} onPress={onScan}>
              <Text style={styles.buttonText}>{CONSTANTS.ButtonTexts.scan}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer} />
        </View>
      </ImageBackground>
    </View>
  );
}


export default ScanFaceScreen;


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
    height: 56,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 100,
    marginBottom: 150
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },
  pincodeButton: {
    width: windowWidth * 0.85,
    height: 56,
    backgroundColor: CONSTANTS.MY_BLUE,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 24,
    color: CONSTANTS.Colors.white
  },
  footer: {
    height: CONSTANTS.SPARE_FOOTER
  }
});