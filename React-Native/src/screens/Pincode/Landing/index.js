import React from 'react';
import { connect } from 'react-redux';
import LandingPincodeScreen from './LandingPincode';


const LandingPincodeScreenContainer = (props) => {

  const onPincode = () => {
    props.navigation.navigate('EnterPincode', { format: true });
  }

  const onFaceId = () => {
    props.navigation.navigate('ScanFace');
  }

  const onSkip = () => {
    props.navigation.navigate('LoginViaEmail');
  }


  return (
    <LandingPincodeScreen
      username={props.user.fullName}
      onPincode={onPincode}
      onFaceId={onFaceId}
      onSkip={onSkip}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const LandingPincodeContainerWrapper = connect(mapStateToProps)(LandingPincodeScreenContainer);

export default LandingPincodeContainerWrapper;