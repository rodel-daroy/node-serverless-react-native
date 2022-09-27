import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { createPaymentMethod, CardField } from '@stripe/stripe-react-native';
import { css } from '@emotion/native';

import CreditCard from "./CardView";
import { useSetState } from '../../common/Hooks';
import { Text, OverlayLoading } from "../../components/CoreUIComponents";
import { Icon } from "native-base";
import PopupContext from '../../context/Popup/PopupContext';
import { postPaymentMethodId } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';

const DEFAULT_STATE = {
  isLoading: false,
  stripeCustomerID: '',
  focusField: 'cardnumber',
  brand: '',
  complete: false,
  expiryMonth: null,
  expiryYear: null,
  last4: '',
};

const LinkCreditCardScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const [state, setState] = useSetState(DEFAULT_STATE);

  const handleCardDetail = useCallback((detail) => {
    if (detail) {
      setState({ brand: detail?.brand?.toLowerCase() ?? '' });

      setState({ complete: detail.complete });

      setState({ expiryMonth: detail?.expiryMonth?.toString() });

      setState({ expiryYear: detail?.expiryYear?.toString() });

      setState({ last4: detail?.last4 ?? '' });
    }
  }, []);

  const cardNum = useMemo(() => {
    if (state.focusField !== 'cardnumber' || state.complete) {
      return '**** **** **** ' + state.last4;
    }

    return '**** **** **** ****';
  }, [state.focusField, state.last4, state.complete]);

  const expiry = useMemo(() => {
    if (state.expiryMonth === '0' && state.expiryYear?.length > 0) {
      return '';
    }

    if (state.expiryYear && state.expiryMonth) {
      return state.expiryMonth + '/' + state.expiryYear
    }

    return '';
  }, [state.expiryMonth, state.expiryYear, state.focusField]);

  const handleFoucs = useCallback((value) => {
    const focusField = value?.toString()?.toLowerCase() || 'cardnumber';

    if (focusField) {
      setState({ focusField });
    }
  }, []);

  useEffect(() => {
    if (state.complete) {
      setState({ focusField: 'cardnumber' });
    }
  }, [state.complete])

  const goBackHandler = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation.goBack]);

  const getPaymentMethodId = async () => {
    setState({ isLoading: true });
    try {
      const { paymentMethod, error } = await createPaymentMethod({
        type: 'Card',
        billingDetails: {
          email: props.user.email,
        },
        customerId: state.stripeCustomerID,
      });

      paymentMethod && postPaymentMethodId(
        props.user.accessToken,
        paymentMethod?.id,
        (res) => {
          setState({ isLoading: false });
          alert({
            title: 'Success', main: 'Card details are now stored securely.', button: [
              {
                text: 'OK',
                onPress: () => {
                  alert("");
                  goBackHandler();
                },
              }
            ],
          });
        },
        (err) => {
          setState({ isLoading: false });
          alert({ title: 'Card Error', main: err.response?.data?.message ?? 'Error' });
        },
      );

      if (error) {
        setState({ isLoading: false });
        if (error.message) {
          alert({ title: 'Card Error', main: error?.message ?? 'Error' });
        }
      }
    } catch (err) {
      setState({ isLoading: false });
    }
  };

  return (
    <View style={style}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={goBackHandler}>
          <Icon name="arrowleft" type="AntDesign" style={iconStyle} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: 'black',
            }}>
            LINK A CARD
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require("../../assets/xd/background/Login-bg.png")}
        style={{
          width: "100%",
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
        }}
      >
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <View style={{ marginTop: CONSTANTS.TOP_PADDING }}>
            <View style={creditCardContainerStyle}>
              <CreditCard
                name={" "}
                focused={state.focusField}
                number={cardNum}
                brand={state.brand}
                expiry={expiry}
                cvc={'***'}
              />
            </View>

            <CardField
              postalCodeEnabled={false}
              autofocus
              placeholder={{
                number: '4242 4242 4242 4242',
                postalCode: '12345',
                cvc: 'CVC',
                expiration: 'MM|YY',
              }}
              onCardChange={handleCardDetail}
              onFocus={handleFoucs}
              cardStyle={{
                borderWidth: 1,
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderRadius: 8,
                fontSize: 14,
                placeholderColor: '#999999',
                opacity: 1,
              }}
              style={{
                width: "98.2%",
                height: 50,
                alignSelf: 'center',
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                marginTop: 20,
                backgroundColor: CONSTANTS.MY_BLUE,
                justifyContent: "center",
                alignItems: "center",
                opacity: 1,
              }}
            />
          </View>

          {state.isLoading ? null : (
            <TouchableOpacity
              onPress={() => {
                getPaymentMethodId();
              }}
              style={{
                width: "98.2%",
                height: 50,
                alignSelf: 'center',
                borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                marginTop: 30,
                backgroundColor: CONSTANTS.MY_BLUE,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  fontSize: 14
                }}
              >
                LINK CARD
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </ImageBackground>
      {state.isLoading ? <OverlayLoading /> : null}
    </View>
  );
};

const mapStateToProps = (store) => ({ user: store.user, });
const LinkCreditCardScreenContainerWrapper = connect(mapStateToProps)(LinkCreditCardScreenContainer,);
export default memo(LinkCreditCardScreenContainerWrapper);

const style = css`
  flex-direction: column;
  height: 100%;
`;

const iconStyle = css`
  margin-left: 15px;
`;

const creditCardContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;