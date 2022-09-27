import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert, ImageBackground, Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as RNIap from 'react-native-iap';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { getPaymentMethods, getWalletDetails, requestTopUpContract, requestTopUpUpdate } from "../../actions/userActions";
import { useSetState } from '../../common/Hooks';
import { capitalize } from '../../common/includes/capitalize';
import { detectDateFormat } from '../../common/includes/detectDateFormat';
import CONSTANTS, { COLORS, SIZES } from "../../common/PeertalConstants";
import { OverlayLoading, Text } from "../../components/CoreUIComponents";
import CreditCardItem from "../../components/CreditCardItem";
import TopUpAmountModal from '../../components/TopUp/TopUpAmountModal';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';


const DEFAULT_STATE = {
  isLoading: false,
  isPaymentMethodsLoading: false,
  isWalletDetailsLoading: false,
  walletData: {},
  topUpStep2Modal: false,
  cardList: [],
  isDragUpdate: false,
};

const DEFAULT_STATE1 = {
  mainTextArray: [],
  resultId: '',
};


const consumableSkus = Platform.select({
  ios: ['topup5', 'Topup10', 'Topup20', 'Topup30', 'Topup50', 'Topup100'],
  android: []
});

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;


const TopUpStep1ScreenContainer = (props) => {

  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { defaultError } = useContext(DefaultErrorContext);

  const [state, setState] = useSetState(DEFAULT_STATE);
  const [modalVisiable, setModalVisiable] = useState(false);
  const [iapProducts, setIapProducts] = useState([]);
  const [topUpAmount1, setTopUpAmount1] = useState('');
  const [productId, setProductId] = useState('');
  const [localizedPrice, setLocalizedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state1, setState1] = useSetState(DEFAULT_STATE1);


  useEffect(() => {
    initilizeIAPConnection();
  }, [])

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()
      .then(async (connection) => getItems())
      .catch((err) => console.log(`initConnection ERROR =====> ${err.code}`, err.message));

    if (Platform.OS === 'android') {
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .then(async (consumed) => console.log('consumed all items =====>', consumed))
        .catch((err) => console.log(`flushFailedPurchasesCachedAsPendingAndroid ERROR =====> ${err.code}`, err.message));
    }
  }

  const getItems = async () => {
    try {
      const Products = await RNIap.getProducts(consumableSkus);
      console.log('Products =====>', Products);
      setIapProducts(Products);
      if (Products.length !== 0) {
        if (Platform.OS === 'ios') {
        } else if (Platform.OS === 'android') {
        }
      }
    } catch (err) {
      console.log("IAP error", err.code, err.message, err);
    }
  }

  useEffect(() => {
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      console.log('purchaseUpdatedListener =====>', purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          if (Platform.OS === 'ios') {
            _handleTopUp(state1.resultId);
          } else if (Platform.OS === 'android') {
            await RNIap.consumeAllItemsAndroid(purchase.purchaseToken);
            await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          }
          let ackResult = await RNIap.finishTransaction(purchase, true);
          console.log('IAP ackResult =====>', ackResult);
        } catch (ackErr) {
          console.log('IAP ackErr =====>', ackErr);
        }
      }
    });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => console.log('IAP purchaseErrorListener =====>', error));

    return (() => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    });
  }, [state1.resultId])

  const onRequestPurchase = async (productId) => {
    if (iapProducts.length > 0) {
      RNIap.requestPurchase(productId);
    } else {
      Alert.alert('Warning', 'No product is available to purchase');
    }
  }

  useEffect(() => {
    if (state.isPaymentMethodsLoading || state.isWalletDetailsLoading) {
      setState({ isLoading: true });
    } else {
      setState({ isLoading: false });
    }
  }, [state.isPaymentMethodsLoading, state.isWalletDetailsLoading])

  const loadPaymentMethods = () => {
    setState({ isDragUpdate: true });

    getPaymentMethods(
      props.user.accessToken,
      res => {
        setState({ cardList: res.data.data, isDragUpdate: false });
      },
      err => {
        setState({ isDragUpdate: false });
        defaultError(err);
      }
    );
  }

  const _initData = () => {

    setState({ isPaymentMethodsLoading: true });

    getPaymentMethods(
      props.user.accessToken,
      res => {
        setState({ cardList: res.data.data, isPaymentMethodsLoading: false });
      },
      err => {
        setState({ isPaymentMethodsLoading: false });
        defaultError(err);
      }
    );

    setState({ isWalletDetailsLoading: true });

    getWalletDetails(
      props.user.accessToken,
      res => {
        setState({ walletData: res.data.data, isWalletDetailsLoading: false });
      },
      err => {
        setState({ isWalletDetailsLoading: false });
        defaultError(err);
      }
    );
  }

  const onClose = () => {
    setModalVisiable(false);
  }

  const onPurchase = (productId, amount) => {
    setModalVisiable(false);
    setTopUpAmount1(amount);
    setProductId(productId);
    let selectedProduct = iapProducts.filter(item => item.productId === productId);
    setLocalizedPrice(selectedProduct[0].localizedPrice);
    onRequestTopUpContract(amount);
  }

  const onRequestTopUpContract = (topUpAmount) => {
    setIsLoading(true);
    requestTopUpContract(props.user.accessToken, 'iap', props.user.preferredCurrency, topUpAmount,
      (res) => {
        setIsLoading(false);
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
        setState1({ mainTextArray: mainTextArray, resultId: result.id });
      },
      (err) => {
        setIsLoading(false);
        initState();
        alert(err.response.data.message);
        return;
      },
    );
  }

  useEffect(() => {
    state1.mainTextArray && state1.mainTextArray.length > 0 && alert({
      title: 'Would you like to proceed?',
      main: (
        <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
          {state1.mainTextArray.map((item, index) => {
            return (
              <View key={index}>
                <Text style={styles.big}>{item.title}</Text>
                <Text style={styles.small}>{item.title === 'Requested Amount' ? (item.value + '(' + localizedPrice + ')') : item.value}</Text>
              </View>
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
            onRequestPurchase(productId);
          },
        },
      ],
    });

    return () => {
      // initState();
    }
  }, [state1.mainTextArray])

  const initState = useCallback(() => {
    setState1(DEFAULT_STATE1);
  }, [])

  const _handleTopUp = (id) => {
    setIsLoading(true);
    requestTopUpUpdate(props.user.accessToken, id,
      (res) => {
        setIsLoading(false);
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
      },
      (err) => {
        setIsLoading(false);
        alert(err.response.data.message);
      },
    );
  };

  const cardLogo = CONSTANTS.CARD_LOGOS;

  const setTopUpStep2Modal = useMemo((boolState) => {
    setState({ topUpStep2Modal: boolState });
  }, [])

  const _renderCards = () => {
    if (state.cardList.length === 0) return;
    return state.cardList.map((item, index) => {
      if (!!item?.card?.brand || !!item?.card?.last4) {
        return (
          <CreditCardItem
            navigation={props.navigation}
            data={item}
            key={index}
            walletData={state.walletData}
            user={props.user}
            topUpStep2Modal={state.topUpStep2Modal}
            setTopUpStep2Modal={setTopUpStep2Modal}
            cardLogo={cardLogo}
          />
        )
      } else {
        return <View key={index} />;
      }
    });
  }


  return (
    state.isLoading ?
      <View style={{ position: 'absolute', left: SIZES.windowWidth / 2, top: '40%' }}>
        <OverlayLoading />
      </View>
      :
      <View style={styles.container}>
        <NavigationEvents onWillFocus={_initData} />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <AntDesign name='arrowleft' size={28} color={COLORS.fontColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>TOP UP</Text>
            <View style={{ width: 36 }} />
          </View>
          <ImageBackground source={require("../../assets/xd/background/Login-bg.png")} style={styles.body}>
            <View style={styles.textGroup}>
              <Text style={styles.smallTitle}>
                Please select a payment method to top up
              </Text>
              <Text style={{ marginTop: 16 }}>
                We keep your financial details more secure.
              </Text>
            </View>

            <ScrollView
              style={{ width: SIZES.windowWidth }}
              refreshControl={<RefreshControl refreshing={state.isDragUpdate} onRefresh={loadPaymentMethods} />}
            >
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.listButton} onPress={() => setModalVisiable(true)}>
                  <View style={styles.listButtonIconSection}>
                    <Fontisto name={Platform.OS === 'ios' ? 'apple' : 'android'} size={28} color={COLORS.fontColor} />
                  </View>
                  <View style={styles.listButtonTextSection}>
                    <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
                      {Platform.OS === 'ios' ? 'Apple in app purchase' : 'Google in app purchase'}
                    </Text>
                    <MaterialIcons name='arrow-forward' size={16} color={COLORS.fontColor} />
                  </View>
                </TouchableOpacity>

                {_renderCards()}

                {(state.cardList.length > 0) && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('WalletInformation') }}>
                      <View style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Card List</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity style={styles.linkCardButton} onPress={() => props.navigation.navigate("LinkCreditCard")}>
                  <Text style={styles.linkCardButonText}>Link Other Card</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>

        <TopUpAmountModal
          modalVisible={modalVisiable}
          iapProducts={iapProducts}
          onClose={onClose}
          onPurchase={onPurchase}
        />

        {isLoading && (
          <OverlayLoading />
        )}
      </View >
  );
}

const mapStateToProps = store => ({ user: store.user });
const TopUpStep1ContainerWrapper = connect(mapStateToProps)(TopUpStep1ScreenContainer);
export default memo(TopUpStep1ContainerWrapper);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    height: SIZES.header,
    marginTop: CONSTANTS.SPARE_HEADER,
    borderBottomWidth: SIZES.size_1,
    borderBottomColor: COLORS.white,
    paddingHorizontal: SIZES.size_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CONSTANTS.MY_SHADOW_STYLE
  },
  headerTitle: {
    fontSize: SIZES.font_20,
    fontWeight: '700',
    color: COLORS.fontColor
  },
  textGroup: {
    marginTop: 60,
    marginBottom: 30,
    flexDirection: 'column',
    alignItems: 'center'
  },
  smallTitle: {
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    fontWeight: '700',
    color: COLORS.fontColor
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  listButton: {
    width: SIZES.windowWidth * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.size_10,
    marginTop: SIZES.size_20,
    marginHorizontal: SIZES.size_16,
    padding: SIZES.size_16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...CONSTANTS.MY_SHADOW_STYLE
  },
  listButtonIconSection: {
    width: SIZES.size_64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listButtonTextSection: {
    flex: 1,
    paddingRight: SIZES.size_16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    width: '100%',
    borderRadius: SIZES.size_10,
    padding: SIZES.size_20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  editButton: {
    minWidth: 80,
    height: 40,
    minHeight: 30,
    backgroundColor: CONSTANTS.MY_CANCEL_BG_COLOR,
    borderWidth: SIZES.size_1,
    borderColor: CONSTANTS.MY_CANCEL_BORDER_COLOR,
    borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
    paddingVertical: SIZES.size_10,
    paddingHorizontal: SIZES.size_20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editButtonText: {
    fontSize: SIZES.font_14,
    fontWeight: '300',
    color: COLORS.fontColor
  },
  linkCardButton: {
    width: SIZES.windowWidth * 0.9,
    height: SIZES.size_48,
    backgroundColor: CONSTANTS.MY_BLUE,
    borderRadius: SIZES.size_8,
    marginTop: SIZES.size_50,
    padding: SIZES.size_16,
    alignItems: 'center',
    justifyContent: 'center',
    ...CONSTANTS.MY_SHADOW_STYLE
  },
  linkCardButonText: {
    fontSize: SIZES.font_16,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
    color: COLORS.white
  },
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
});
