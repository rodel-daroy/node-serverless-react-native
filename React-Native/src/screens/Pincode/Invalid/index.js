
import React from 'react';
import { connect } from 'react-redux';
import InvalidPincodeScreen from './InvalidPincode';


const InvalidPincodeScreenContainer = (props) => {


  const onCancel = () => {
    props.navigation.navigate('EnterPincode', { format: false });
  }


  return (
    <InvalidPincodeScreen
      onCancel={onCancel}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const InvalidPincodeContainerWrapper = connect(mapStateToProps)(InvalidPincodeScreenContainer);

export default InvalidPincodeContainerWrapper;