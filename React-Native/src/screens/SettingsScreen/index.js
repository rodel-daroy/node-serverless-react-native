import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import SettingsScreen from './SettingsScreen';


const SettingsScreenContainer = (props) => {

  const handleTouchOnProfile = () => {
    if (props.user.loggedStatus == 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    props.navigation.navigate('EditProfile');
  }

  const handlePincode = () => {
    if (props.user.loggedStatus == 'guest') {
      props.navigation.navigate('Welcome');
      return;
    }
    props.navigation.navigate('SetPincode');
  }

  const version = DeviceInfo.getVersion();


  return (
    <SettingsScreen
      {...props}
      handleTouchOnProfile={handleTouchOnProfile}
      handlePincode={handlePincode}
      version={version}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const SettingsContainerWrapper = connect(mapStateToProps)(SettingsScreenContainer);

export default SettingsContainerWrapper;