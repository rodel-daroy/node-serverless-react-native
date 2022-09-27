import React, { memo, useState, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import CONSTANTS from '../../common/PeertalConstants';
import { getWalletDetails, createMoneyRequest } from '../../actions/userActions';
import SuccessMessageObject from '../../models/SuccessMessageObject';
import RequestMoneyStep1 from './RequestMoneyStep1';
import RequestMoneyStep2 from './RequestMoneyStep2';
import RequestMoneyStep3 from './RequestMoneyStep3';
import SendRequestMoneyScreen from './SendRequestMoneyScreen';
import UserContext from '../../context/User/UserContext';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';

const SendRequestMoneyScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { verificationStatus } = useContext(UserContext);

  const identityStatus = useMemo(() => {
    if (verificationStatus === -1) {
      return 'unverified';
    }

    if (verificationStatus === 2) {
      return 'rejected';
    }

    if (verificationStatus === 1) {
      return 'verified';
    }

    if (verificationStatus === 0) {
      return 'verifying';
    }
  }, [verificationStatus]);

  const [currentStep, setCurrentStep] = useState(1);
  const [description, setDescription] = useState('');
  const [amountDollar, setAmountDollar] = useState('');
  const [tagList, setTagList] = useState([]);
  const [coinValue, setCoinValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState({});
  const [focusedInput, setFocusedInput] = useState('');

  const _setStep = (value) => {
    setCurrentStep(value);
  };

  const updateTagList = (list) => {
    setTagList(list);
  };

  const handleSendMoney = () => {
    if (identityStatus === 'verified') {
      const data = wallet;
      const exchangeRate = data.exchangeRate || 100;
      let tags = tagList.map((item) => item.id);
      // let amount = (amountDollar / exchangeRate).toFixed(5); // ltc value
      let amount = amountDollar; // amount with user currency
      let reason = description;
      if (tags.length == 0) {
        return alert('need to have more than one receiver');
      }
      setIsLoading(true);
      const requestData = { amount: amount, currency: props.user.preferredCurrency, tags: tags, reason: reason };

      createMoneyRequest(
        props.user.accessToken,
        requestData,
        (res) => {
          setAmountDollar('0');
          setTagList([]);
          setCoinValue('0');
          setIsLoading(false);
          const messageSuccess = new SuccessMessageObject(
            'Success',
            undefined,
            '',
            '',
            '',
            '',
            'The Request has been sent successfully',
          );
          props.navigation.navigate('SuccessAction', {
            data: messageSuccess,
          });
        },
        (err) => {
          setIsLoading(false);
          defaultError(err.response.data.message);
        },
      );
    }

    if (identityStatus === 'unverified' || identityStatus === 'rejected') {
      props.navigation.navigate('AddPersonalInformation');
    }

    if (identityStatus === 'verifying') {
      alert(CONSTANTS.PENDING_VERIFICATION_MSG);
    }
  };

  const checkSteps = (step) => {
    if (step === 1) {
      if (tagList.length < 1) {
        alert('Please select recipient');
      } else if (description == '') {
        alert('Please insert your message');
      } else {
        setCurrentStep(2);
      }
    }
    if (step === 2) {
      if (tagList.length < 1) {
        alert('Please select recipient');
      } else if (description == '') {
        alert('Please insert your message');
      } else if (amountDollar === '' || amountDollar === '0' || parseInt(amountDollar) < 0) {
        alert('Please insert amount')
      } else {
        setCurrentStep(3);
      }
    }
  };

  const _renderStep1 = () => {
    return (
      <RequestMoneyStep1
        {...props}
        updateTagList={updateTagList}
        description={description}
        setDescription={setDescription}
        tagList={tagList}
        checkSteps={checkSteps}
        focusedInput={focusedInput}
        setFocusedInput={setFocusedInput}
      />
    );
  };

  const _renderStep2 = () => {
    const data = wallet;
    const exchangeRate = data.exchangeRate || 100;
    const coinValueData = ((amountDollar ?? 0) / (exchangeRate || 1)).toFixed(5) + '' ?? 0;
    const fee = (amountDollar * 0.03).toFixed(2);
    const currency = data.currency || 'USD';
    return (
      <RequestMoneyStep2
        {...props}
        exchangeRate={exchangeRate}
        coinValueData={coinValueData}
        setCoinValue={setCoinValue}
        fee={fee}
        currency={currency}
        amountDollar={amountDollar}
        setAmountDollar={setAmountDollar}
        checkSteps={checkSteps}
      />
    );
  };

  const _renderStep3 = () => {
    const data = wallet;
    const listUsers = CONSTANTS.renderListPeople(
      tagList.map((item) => item.fullName.split(' ')[0]),
    );
    const avatarUrlList = tagList.map((item) => item.avatarUrl);
    const currency = data.currency || 'USD';
    const amount = amountDollar;
    const fee = getCurrencySymbol(currency) + ' ' + (amount * 0.03).toFixed(2);
    const amountText = getCurrencySymbol(currency) + ' ' + amount + ' ' + currency;
    return (
      <RequestMoneyStep3
        {...props}
        data={data}
        listUsers={listUsers}
        fee={fee}
        amountText={amountText}
        description={description}
        handleSendMoney={handleSendMoney}
        avatarUrlList={avatarUrlList}
      />
    );
  };

  const _initData = () => {
    getWalletDetails(
      props.user.accessToken,
      (res) => {
        setWallet(res.data.data);
      },
      (err) => {
        //alert("Cannot get your wallet details. Please try again later");
        alert(err.response?.data?.message ?? 'Error');
        props.navigation.goBack();
      },
    );
  };

  return (
    <SendRequestMoneyScreen
      {...props}
      currentStep={currentStep}
      isLoading={isLoading}
      _setStep={_setStep}
      updateTagList={updateTagList}
      _renderStep1={_renderStep1}
      _renderStep2={_renderStep2}
      _renderStep3={_renderStep3}
      _initData={_initData}
      checkSteps={checkSteps}
    />
  );
};

const mapStateToProps = (store) => ({ user: store.user });
const SendRequestMoneyScreenContainerWrapper = connect(mapStateToProps)(
  SendRequestMoneyScreenContainer,
);
export default memo(SendRequestMoneyScreenContainerWrapper);
