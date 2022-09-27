import React, { memo, useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Image, ImageBackground, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'native-base';

import CreditCardItem from '../../components/CreditCardItem';
import CONSTANTS from '../../common/PeertalConstants';
import PopupContext from '../../context/Popup/PopupContext';
import { getWalletDetails, getPaymentMethods, getBankAccount } from "../../actions/userActions";
import WalletObject from '../../models/WalletObject';
import BankAccountItem from "../../components/BankAccountItem";
import WalletInformationScreen from './WalletInformationScreen';

const WalletInformationScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [walletModal, setWalletModal] = useState(false);
  const [walletData, setWalletData] = useState(new WalletObject());
  const [isLoading, setIsLoading] = useState(false);
  const [isBankAccountLoading, setIsBankAccountLoading] = useState(false);
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);
  const [isWalletDetailLoading, setIsWalletDetailLoading] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    _loadingData();
  }, [])

  const _loadingData = () => {
    setIsLoading(true);

    setIsBankAccountLoading(true);
    getBankAccount(
      props.user.accessToken,
      res => {
        setIsBankAccountLoading(false);
        setBankList(res.data.data);
      },
      err => {
        setIsBankAccountLoading(false);
        alert(err.response?.data?.message ?? 'Error')
      }
    );

    setIsPaymentMethodsLoading(true);
    getPaymentMethods(
      props.user.accessToken,
      res => {
        setIsPaymentMethodsLoading(false);
        setCardList(res.data.data);
      },
      err => {
        setIsPaymentMethodsLoading(false);
        alert(err.response?.data?.message ?? 'Error')
      }
    );

    setIsWalletDetailLoading(true);
    getWalletDetails(
      props.user.accessToken,
      res => {
        setIsWalletDetailLoading(false);
        setWalletData(res.data.data);
      },
      err => {
        setIsWalletDetailLoading(false);
        alert({
          title: 'Alert',
          main: err.response?.data?.message ?? 'Error',
          button: [
            {
              text: 'OK',
              onPress: () => {
                alert("");
                setIsLoading(false);
                props.navigation.goBack()
              }
            },
          ]
        });
      },
    );

    if (!isBankAccountLoading && !isPaymentMethodsLoading && !isWalletDetailLoading) {
      setIsLoading(false);
    }
  }

  /* const cardLogo = {
    visa: "https://revenuesandprofits.com/wp-content/uploads/2019/02/Visa.jpg",
    master: "https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_pos_92px_2x.png"
  }; */

  const cardLogo = CONSTANTS.CARD_LOGOS;

  const _renderBankAccount = () => {
    if (!bankList || bankList.length < 1) {
      return <View
        style={{
          paddingVertical: 26.5,
          paddingHorizontal: 18,
        }}>
        <Text style={{ fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: "#414042" }}>My Bank Accounts</Text>
        <View style={{ marginTop: 11 }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("LinkNewBank")}
            style={{
              display: 'flex', flexDirection: 'row'
            }}>
            <View style={{ paddingLeft: 1, backgroundColor: CONSTANTS.MY_BLUE, width: 19, height: 19, borderRadius: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon
                name="plus"
                type="AntDesign"
                style={{ fontSize: 15, color: '#ffffff' }}
              />
            </View>
            <Text style={{ marginLeft: 12, fontSize: 14, color: CONSTANTS.MY_BLUE, lineHeight: 18 }}>Add your Bank Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
    if (bankList && bankList.length > 0) {
      return <View
        style={{
          paddingVertical: 26.5,
        }}>
        <Text style={{ fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: "#414042", paddingHorizontal: 18, }}>My Bank Accounts</Text>
        {bankList.map((item, index) => (
          <BankAccountItem
            data={item}
            key={index}
            navigation={props.navigation}
            isFromWalletInformation={true}
          />
        ))}
        <View style={{ marginTop: 30, paddingHorizontal: 18, }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("LinkNewBank")}
            style={{
              display: 'flex', flexDirection: 'row'
            }}>
            <View style={{ paddingLeft: 1, backgroundColor: CONSTANTS.MY_BLUE, width: 19, height: 19, borderRadius: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon
                name="plus"
                type="AntDesign"
                style={{ fontSize: 15, color: '#ffffff' }}
              />
            </View>
            <Text style={{ marginLeft: 12, fontSize: 14, color: CONSTANTS.MY_BLUE, lineHeight: 18 }}>Add more Bank Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
  }

  const _renderCard = () => {
    if (!cardList || cardList.length < 1) {
      return <View
        style={{
          paddingVertical: 26.5,
          paddingHorizontal: 18,
        }}>
        <Text style={{ fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: "#414042" }}>My Cards</Text>
        <View style={{ marginTop: 11 }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("LinkCreditCard")}
            style={{
              display: 'flex', flexDirection: 'row'
            }}>
            <View style={{ paddingLeft: 1, backgroundColor: CONSTANTS.MY_BLUE, width: 19, height: 19, borderRadius: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon
                name="plus"
                type="AntDesign"
                style={{ fontSize: 15, color: '#ffffff' }}
              />
            </View>
            <Text style={{ marginLeft: 12, fontSize: 14, color: CONSTANTS.MY_BLUE, lineHeight: 18 }}>Add your Cards</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
    if (cardList && cardList.length > 0) {
      return <View
        style={{
          paddingVertical: 26.5,
        }}>
        <Text style={{ fontSize: 18, fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD, color: "#414042", paddingHorizontal: 18, }}>My Cards</Text>
        {cardList.map((item, index) => {
          if (!!item?.card?.brand || !!item?.card?.last4) {
            return (
              <CreditCardItem
                navigation={props.navigation}
                data={item}
                key={index}
                walletData={walletData}
                user={props.user}
                cardLogo={cardLogo}
                isFromWalletInformation={true}
              />
            )
          } else {
            return <></>;
          }
        })}
        <View style={{ marginTop: 30, paddingHorizontal: 18, }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("LinkCreditCard")}
            style={{
              display: 'flex', flexDirection: 'row'
            }}>
            <View style={{ paddingLeft: 1, backgroundColor: CONSTANTS.MY_BLUE, width: 19, height: 19, borderRadius: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon
                name="plus"
                type="AntDesign"
                style={{ fontSize: 15, color: '#ffffff' }}
              />
            </View>
            <Text style={{ marginLeft: 12, fontSize: 14, color: CONSTANTS.MY_BLUE, lineHeight: 18 }}>Add more Cards</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
  }

  const exchangeRate = walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
  const dollarNumber = (
    (walletData.balance || 0) * exchangeRate
  ).toFixed(2);
  const currency = walletData.currency || 'USD';

  return (
    <WalletInformationScreen
      {...props}
      walletModal={walletModal}
      setWalletModal={setWalletModal}
      walletData={walletData}
      setWalletData={setWalletData}
      isLoading={isLoading}
      _loadingData={_loadingData}
      dollarNumber={dollarNumber}
      currency={currency}
      _renderBankAccount={_renderBankAccount}
      _renderCard={_renderCard}
      isBankAccountLoading={isBankAccountLoading}
      isPaymentMethodsLoading={isPaymentMethodsLoading}
      isWalletDetailLoading={isWalletDetailLoading}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const WalletInformationScreenContainerWrapper = connect(mapStateToProps)(WalletInformationScreenContainer);
export default memo(WalletInformationScreenContainerWrapper);