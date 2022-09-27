import React, { memo, useState, useEffect, useContext, useMemo } from 'react';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import CONSTANTS from '../../common/PeertalConstants';
import { sendMoney, getWalletDetails, rewardPost } from '../../actions/userActions';
import SuccessMessageObject from '../../models/SuccessMessageObject';
import SendMoneyStep1 from './SendMoneyStep1';
import SendMoneyStep2 from './SendMoneyStep2';
import SendMoneyStep3 from './SendMoneyStep3';
import SendMoneyScreen from './SendMoneyScreen';
import UserContext from '../../context/User/UserContext';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';

const SendMoneyScreenContainer = (props) => {
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
  const [tagList, setTagList] = useState(
    props.navigation.getParam('tagList') || [],
  );
  const [coinValue, setCoinValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState({});
  const [focusedInput, setFocusedInput] = useState('');

  const postId = props.navigation?.getParam('postId');
  const refreshPosts = props.navigation?.getParam('refreshPosts');

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
      //let amount = (amountDollar / exchangeRate).toFixed(5); // lte value
      let amount = amountDollar; // money amount on User currency
      let reason = description;
      if (tags.length == 0) {
        return alert('need to have more than one receiver');
      }
      setIsLoading(true);

      if (postId) {
        rewardPost(
          props.user.accessToken,
          props.user.preferredCurrency,
          amount,
          tags,
          reason,
          postId,
          (res) => {
            refreshPosts();
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
              'Money has been sent successfully',
            );
            props.navigation.navigate('SuccessAction', { data: messageSuccess });
          },
          (err) => {
            setIsLoading(false);
            alert(err.response.data.message);
          },
        );
      } else {
        sendMoney(
          props.user.accessToken,
          props.user.preferredCurrency,
          amount,
          tags,
          reason,
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
              'Money has been sent successfully',
            );
            props.navigation.navigate('SuccessAction', {
              data: messageSuccess,
            });
          },
          (err) => {
            setIsLoading(false);
            alert(err.response.data.message);
          },
        );
      }
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
      <SendMoneyStep1
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
      <SendMoneyStep2
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
    const currency = data.currency || 'USD';
    const amount = amountDollar;
    const fee = getCurrencySymbol(currency) + ' ' + (amount * 0.03).toFixed(2);
    const amountText = getCurrencySymbol(currency) + ' ' + amount + ' ' + currency;
    const avatarUrlList = tagList.map((item) => item.avatarUrl);
    return (
      <SendMoneyStep3
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
        alert('Error with loading wallet : ' + err.response.data.message);
        props.navigation.goBack();
      },
    );
  };

  return (
    <SendMoneyScreen
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

const mapStateToProps = (store) => ({
  user: store.user,
});
const SendMoneyScreenContainerWrapper = connect(mapStateToProps)(
  SendMoneyScreenContainer,
);
export default memo(SendMoneyScreenContainerWrapper);
