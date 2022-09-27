import React, { memo, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { ImageBackground, TouchableOpacity, View, Text, TextInput, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from "native-base";
import { NavigationEvents } from "react-navigation";

import { useSetState } from '../../common/Hooks';
import { Text as Text2, LoadingSpinner, RoundButton } from "../../components/CoreUIComponents";
import CONSTANTS from '../../common/PeertalConstants';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { getWalletDetails, requestCashOutContract, requestCashOutUpdate } from '../../actions/userActions';
import SuccessMessageObject from '../../models/SuccessMessageObject';
import UserContext from '../../context/User/UserContext';
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';
import { removeCommaFromString } from '../../common/includes/removeCommaFromString';
import { capitalize } from '../../common/includes/capitalize';
import { detectDateFormat } from '../../common/includes/detectDateFormat';
import CurrencyIcon from '../../components/CurrencyIcon';

const DEFAULT_STATE = {
  mainTextArray: [],
  resultId: '',
};

const CashOutActionScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const [state, setState] = useSetState(DEFAULT_STATE);
  const { verificationStatus } = useContext(UserContext);

  const initState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

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

  const [amountDollar, setAmountDollar] = useState('');
  const [bankAccount, setBankAccount] = useState({});
  const [walletData, setWalletData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [borderColor, setBorderColor] = useState(
    CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
  );

  useEffect(() => {
    _loadingData();
  }, []);

  const _handleWithdraw = () => {
    if (!amountDollar || amountDollar === '') {
      alert("Please input amount");
      return;
    }

    if (identityStatus === 'verified') {
      setIsLoading(true);

      requestCashOutContract(
        props.user.accessToken,
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
          defaultError(err);
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
            handleCashOut(state.resultId);
          },
        },
      ],
    });

    return () => {
      initState();
    }
  }, [state.mainTextArray]);


  const handleCashOut = (id) => {
    setIsLoading(true);
    requestCashOutUpdate(
      props.user.accessToken,
      id,
      (res) => {
        setAmountDollar('0');
        setIsLoading(false);
        const messageSuccess = new SuccessMessageObject(
          'Success',
          undefined,
          '',
          '',
          '',
          '',
          'Money has been withdrew successfully. The money will be credited to your bank account in 5-10 business days. ',
        );
        props.navigation.navigate('SuccessAction', {
          data: messageSuccess,
        });
      },
      (err) => {
        setAmountDollar('0');
        setIsLoading(false);
        defaultError(err);
      },
    );
  };

  const _loadingData = () => {
    setIsLoading(true);
    setBankAccount(props.navigation.getParam('data', {}));
    getWalletDetails(
      props.user.accessToken,
      (res) => {
        setWalletData(res.data.data);
        setIsLoading(false);
      },
      (err) => {
        defaultError(err);
        setIsLoading(false);
      },
    );
  };

  const exchangeRate = walletData?.exchangeRate ?? 100; //set fixed Rate to 100 dollar per LTC
  const dollarNumber = ((walletData?.balance ?? 0) * exchangeRate).toFixed(2);
  const currency = walletData?.currency ?? 'USD';
  const bank = bankAccount?.account_holder_name ?? "";
  const cardNumber = bankAccount?.account_number ?? "";

  const coinValue = (amountDollar / exchangeRate).toFixed(5) + '';
  const fee = (amountDollar * 0.03).toFixed(2) + '';
  const feeText = 'Fee: ~$' + fee;

  return (
    <View style={{ flexDirection: "column", height: "100%" }}>
      <NavigationEvents
        onWillFocus={() => {
          _loadingData();
        }}
      />
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          shadowColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          ...CONSTANTS.MY_SHADOW_STYLE
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <Text2
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: 'black',
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON
            }}>
            CASH OUT
          </Text2>
        </View>
      </View>
      <ScrollView>
        <ImageBackground
          source={require("../../assets/xd/background/Login-bg.png")}
          style={{
            width: "100%",
            height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
          }}
        >
          {isLoading ? <LoadingSpinner /> : null}
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View
              style={{
                position: 'relative',
                backgroundColor: 'white',
                width: 320 * CONSTANTS.WIDTH_RATIO, //corrected ratio
                height: 120,
                marginTop: CONSTANTS.TOP_PADDING,
                marginLeft: 18 * CONSTANTS.WIDTH_RATIO,
                marginBottom: 23,
                borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                ...CONSTANTS.MY_SHADOW_STYLE
              }}>
              <Image style={{ position: 'absolute', right: 0, top: 0 }} source={require('../../assets/xd/wallet-right-border.png')} />
              <Text2
                style={{
                  marginTop: 25,
                  marginLeft: 24 * CONSTANTS.WIDTH_RATIO,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                }}>
                Current Balance
              </Text2>
              <View style={{ flexDirection: 'row', marginLeft: 22 * CONSTANTS.WIDTH_RATIO, position: 'relative' }}>
                {/* <Icon
                  name="attach-money"
                  type="MaterialIcons"
                  style={{
                    fontSize: 16,
                    color: CONSTANTS.MY_BLUE,
                    marginTop: 10,
                  }}
                /> */}
                <Text2 style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }}>
                  {monetaryDigitsFormatter(dollarNumber)}
                </Text2>
                <Text2
                  style={{
                    color: CONSTANTS.MY_BLUE,
                    marginLeft: 7,
                    position: 'absolute',
                    bottom: 7,
                    fontSize: 14,
                  }}>
                  {currency}
                </Text2>
              </View>
            </View>
            <View style={{
              width: (79 / 375) * CONSTANTS.WIDTH,
              height: 90,
              marginLeft: (18 / 375) * CONSTANTS.WIDTH,
              backgroundColor: 'white',
              borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
              ...CONSTANTS.MY_SHADOW_STYLE
            }} />
          </View>

          <View />
          <View
            style={{
              flexDirection: "row",
              marginBottom: 25.5,
              marginHorizontal: 15,
              alignSelf: "flex-start",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >

            <Icon name="bank" type="FontAwesome" style={{ color: CONSTANTS.MY_BLUE, fontSize: 26 }} />
            <View style={{ marginLeft: 15 }}>
              <Text2
                style={{
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  color: CONSTANTS.MY_BLUE
                }}
              >
                {bank}
              </Text2>
              <Text2 style={{ fontSize: 12, color: CONSTANTS.MY_BLUE }}>{cardNumber}</Text2>
            </View>

          </View>

          <View style={{ height: 1, borderBottomWidth: 1, borderBottomColor: "#D1D3D4", width: "100%" }} />

          <View style={{ width: "100%", paddingHorizontal: 15 }}>

            <View style={{ flexDirection: "row", marginTop: 20 }}>

              <Icon style={{ fontSize: 16 }} name="money" type="FontAwesome" />
              <Text2 style={{ marginLeft: 10, fontSize: 12 }}>Add the amount of money</Text2>
            </View>
            <View
              style={{
                ...styles.dollarBox, borderColor: borderColor
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "black",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CurrencyIcon currency={currency} />
                </View>
                <Text2 style={{ marginLeft: 5 }}>{currency}</Text2>
              </View>

              <TextInput
                onFocus={e => {
                  setBorderColor(CONSTANTS.MY_FOCUSED_BORDER_COLOR);
                }}
                onBlur={e => {
                  setBorderColor(CONSTANTS.MY_UNFOCUSED_BORDER_COLOR);
                }}
                autoFocus={true}
                style={{ ...styles.dollarInput }}
                value={monetaryDigitsFormatter(amountDollar)}
                keyboardType="numeric"
                onChangeText={(value) => setAmountDollar(removeCommaFromString(value))}
                placeholder="0.00"
                onSubmitEditing={() => {
                  let decimal = amountDollar.indexOf('.');
                  let position = decimal < 0 ? decimal : (amountDollar.length - decimal - 1);
                  if (position === 0)
                    alert('Amount format error');
                }}
              />
            </View>
            {/* <View
              style={{
                ...styles.inputBox
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text> </Text>
              </View>

              <TextInput
                style={{ ...styles.dollarInput }}
                value={coinValue}
                editable={false}
                placeholder="0.00"
              />
            </View> */}
            {/* <Text style={{ marginVertical: 10 }}>{feeText}</Text> */}
            <RoundButton text={"Preview"} onPress={_handleWithdraw} style={{ marginTop: 30 }} />
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (store) => ({ user: store.user });
const CashOutActionScreenContainerWrapper = connect(mapStateToProps)(CashOutActionScreenContainer);
export default memo(CashOutActionScreenContainerWrapper);


const styles = {
  header1: {
    marginLeft: 16,
    color: CONSTANTS.MY_BLUE,
    fontSize: 18,
    marginTop: 30
  },
  header2: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 16
  },
  textItem: {
    fontSize: 14,
    marginLeft: 10
  },
  block: {
    height: 100,
    width: 100,
    backgroundColor: "red",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    textAlign: "center"
  },
  blockText: {
    color: "white",
    textAlign: "center",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    marginTop: 5
  },
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepText: {
    color: "white",
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: "center",
    justifyContent: "center"
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD
  },
  textInput: {
    padding: 5,
    width: "100%",
    borderRadius: 5,
    // minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    marginTop: 10
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
    textAlign: "right",
    // marginTop: 10
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  dollarBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BCBEC0",
    paddingHorizontal: 10
  },
  inputBox: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "space-between",
    minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#414042",
    paddingHorizontal: 10
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  },
  big: {
    marginTop: 26.5,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontSize: 12,
    marginHorizontal: 5,
    color: CONSTANTS.MY_BLUE
  },
  small: {
    fontSize: 14,
    margin: 5
  },
};
