import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import EnterPincodeScreen from './EnterPincode';


const EnterPincodeScreenContainer = (props) => {

  const [savedPincode, setSavedPincode] = useState('');
  const [pincode, setPincode] = useState('');
  const [tryChance, setTryChance] = useState(0);
  const [forgot, setForgot] = useState(false);


  useEffect(() => {
    getSavedPincode()
  }, [])

  useEffect(() => {
    if (pincode.length === 4) {
      if (pincode !== savedPincode) {
        if (tryChance < 3) {
          setTryChance(tryChance + 1);
          props.navigation.navigate('InvalidPincode');
        }
      } else {
        props.navigation.navigate('Discover');
      }
    }
  }, [pincode])

  useEffect(() => {
    if (tryChance === 3) {
      setForgot(true);
    } else {
      setPincode('');
    }
  }, [tryChance])

  const onWillFocus = () => {
    if (props.navigation.state.params === true) {
      setPincode('');
      setTryChance(0);
      setForgot(false);
    }
  }

  const onBack = () => {
    props.navigation.goBack();
  }

  const getSavedPincode = async () => {
    let value = await AsyncStorage.getItem('@pincode');
    setSavedPincode(value ? value : '0000');
  }

  const onClickNumber = (number) => {
    if (pincode.length < 4) {
      setPincode(pincode + number);
    }
  }

  const onDeleteNumber = () => {
    setPincode(pincode.slice(0, -1));
  }

  const onForgotPincode = () => {
    props.navigation.navigate('LoginViaEmail');
  }


  return (
    <EnterPincodeScreen
      pincode={pincode}
      tryChance={tryChance}
      forgot={forgot}
      onWillFocus={onWillFocus}
      onBack={onBack}
      onClickNumber={onClickNumber}
      onDeleteNumber={onDeleteNumber}
      onForgotPincode={onForgotPincode}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const EnterPincodeContainerWrapper = connect(mapStateToProps)(EnterPincodeScreenContainer);

export default EnterPincodeContainerWrapper;