import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SetPincodeScreen from './SetPincode';


const SetPincodeScreenContainer = (props) => {

  const [firstPincode, setFirstPincode] = useState('');
  const [secondPincode, setSecondPincode] = useState('');
  const [nextStep, setNextStep] = useState(false);
  const [isMatched, setIsMatched] = useState(false);


  useEffect(() => {
    if (firstPincode.length === 4 && secondPincode.length === 0) {
      setNextStep(true);
    }

    if (firstPincode.length === 4 && secondPincode.length === 4) {
      if (firstPincode === secondPincode) {
        setIsMatched(true);
      } else {
        setFirstPincode('');
        setNextStep(false);
      }
    }

    if (!nextStep && firstPincode.length === 1 && secondPincode.length === 4) {
      setSecondPincode('');
    }
  }, [firstPincode, secondPincode])


  useEffect(() => {
    if (isMatched) {
      setTimeout(() => {
        savePincode();
      }, 1000);
    }
  }, [isMatched])

  const onWillFocus = () => {
    setFirstPincode('');
    setSecondPincode('');
    setNextStep(false);
    setIsMatched(false);
  }

  const onBack = () => {
    props.navigation.goBack();
  }

  const onClickNumber = (number) => {
    if (nextStep) {
      setSecondPincode(secondPincode + number);
    } else {
      setFirstPincode(firstPincode + number);
    }
  }

  const onDeleteNumber = () => {
    if (nextStep) {
      setSecondPincode(secondPincode.slice(0, -1));
    } else {
      setFirstPincode(firstPincode.slice(0, -1));
    }
  }

  const savePincode = async () => {
    try {
      if (secondPincode) {
        await AsyncStorage.setItem('@pincode', secondPincode);
      }
      onBack();
    } catch (e) {
    }
  }


  return (
    <SetPincodeScreen
      firstPincode={firstPincode}
      secondPincode={secondPincode}
      nextStep={nextStep}
      isMatched={isMatched}
      onWillFocus={onWillFocus}
      onBack={onBack}
      onClickNumber={onClickNumber}
      onDeleteNumber={onDeleteNumber}
    />
  );
}


const mapStateToProps = store => ({
  user: store.user,
});
const SetPincodeContainerWrapper = connect(mapStateToProps)(SetPincodeScreenContainer);

export default SetPincodeContainerWrapper;
