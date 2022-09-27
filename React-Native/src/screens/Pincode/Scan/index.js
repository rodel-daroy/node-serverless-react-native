
import React from 'react';
import { connect } from 'react-redux';
import ScanFaceScreen from './ScanFace';


const ScanFaceScreenContainer = (props) => {


  const onBack = () => {
    props.navigation.goBack();
  }

  const onScan = () => {
    props.navigation.navigate('Discover');
  }


  return (
    <ScanFaceScreen
      onBack={onBack}
      onScan={onScan}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const ScanFaceContainerWrapper = connect(mapStateToProps)(ScanFaceScreenContainer);

export default ScanFaceContainerWrapper;