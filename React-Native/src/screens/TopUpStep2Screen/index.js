import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { requestTopUpContract, requestTopUpUpdate } from '../../actions/userActions';
import { useSetState } from '../../common/Hooks';
import { capitalize } from '../../common/includes/capitalize';
import { detectDateFormat } from '../../common/includes/detectDateFormat';
import CONSTANTS, { COLORS, SIZES } from '../../common/PeertalConstants';
import PopupContext from '../../context/Popup/PopupContext';
import UserContext from '../../context/User/UserContext';
import TopUpStep2Screen from './TopUpStep2Screen';


const DEFAULT_STATE = {
  mainTextArray: [],
  resultId: '',
};


const TopUpStep2ScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { verificationStatus } = useContext(UserContext);
  const [state, setState] = useSetState(DEFAULT_STATE);

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

  const [amountDollar, setAmountDollar] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(props.navigation.getParam('user'));
  const [data, setData] = useState(props.navigation.getParam('data', {}));
  const [walletData, setWalletData] = useState(props.navigation.getParam('walletData', {}));


  const initState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const requestContracts = () => {
    if (!amountDollar || amountDollar === '') {
      alert("Please input amount");
      return;
    }

    if (identityStatus === 'verified') {
      const exchangeRate = walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
      const coinValue = (amountDollar / exchangeRate).toFixed(5);

      setIsLoading(true);
      requestTopUpContract(
        user.accessToken,
        data.payment_method_id,
        props.user.preferredCurrency,
        amountDollar,
        (res) => {
          const result = res.data.data;
          const keyArray = Object.keys(result) || [];
          const keyArrayExceptId = keyArray.filter((element) => element !== 'id');
          const mainTextArray = keyArrayExceptId.reduce((acc, cur) => {
            if (typeof result[cur] === 'object') {
              return acc;
            }
            const valueData = detectDateFormat(result[cur].toString()) ? (new Date(result[cur]).toLocaleString("en-GB", { dateStyle: "full" })) : result[cur];

            if (acc === '') return [{ title: capitalize(cur), value: valueData }];
            return [...acc, { title: capitalize(cur), value: valueData }];
          }, '');
          setState({ mainTextArray: mainTextArray, resultId: result.id });
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setAmountDollar(null);
          initState();
          alert(err.response.data.message);
          return;
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

  useEffect(() => {
    state.mainTextArray && state.mainTextArray.length > 0 && alert({
      title: 'Would you like to proceed?',
      main: (
        <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
          {state.mainTextArray.map((item, index) => {
            return (
              <>
                <Text style={styles.big}>{item.title}</Text>
                <Text style={styles.small}>{item.value}</Text>
              </>
            )
          })}
        </View>
      ),
      button: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            alert('');
            _handleTopUp(state.resultId);
          },
        },
      ],
    });

    return () => {
      initState();
    }
  }, [state.mainTextArray]);

  const _handleTopUp = (id) => {
    setIsLoading(true);
    requestTopUpUpdate(
      user.accessToken,
      id,
      (res) => {
        setAmountDollar(null);
        alert({
          title: 'Top Up',
          main: 'top up successfully',
          button: [
            {
              text: 'OK',
              onPress: () => {
                alert('');
                props.navigation.navigate('MainFlow');
              },
            },
          ],
        });
        setIsLoading(false);
      },
      (err) => {
        setAmountDollar(null);
        setIsLoading(false);
        alert(err.response.data.message);
      },
    );
  };

  const showUp = props.enabled;
  const onClose = props.onClose;

  const exchangeRate = walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
  const dollarNumber = ((walletData.balance || 0) * exchangeRate).toFixed(2);
  const currency = walletData.currency || 'USD';
  const cardLogo = CONSTANTS.CARD_LOGOS[data.type];
  const cardNumber = data.cardNumber;
  const fullName = data.fullName;
  const coinValue = (amountDollar / exchangeRate).toFixed(5) + '';


  return (
    <TopUpStep2Screen
      {...props}
      amountDollar={amountDollar}
      setAmountDollar={setAmountDollar}
      isLoading={isLoading}
      requestContracts={requestContracts}
      showUp={showUp}
      onClose={onClose}
      dollarNumber={dollarNumber}
      currency={currency}
      cardLogo={cardLogo}
      cardNumber={cardNumber}
      fullName={fullName}
      coinValue={coinValue}
    />
  );
};


const mapStateToProps = (store) => ({
  user: store.user,
});
const TopUpStep2ScreenContainerWrapper = connect(mapStateToProps)(TopUpStep2ScreenContainer);
export default memo(TopUpStep2ScreenContainerWrapper);


const styles = {
  big: {
    marginTop: SIZES.size_24,
    marginHorizontal: SIZES.size_6,
    fontSize: SIZES.font_12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: COLORS.blue
  },
  small: {
    margin: SIZES.size_6,
    fontSize: SIZES.font_14
  }
};