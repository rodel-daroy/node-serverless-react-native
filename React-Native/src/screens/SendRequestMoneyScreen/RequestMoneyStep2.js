import React, {memo} from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Icon} from 'native-base';

import {Text, RoundButton} from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';
import { removeCommaFromString } from '../../common/includes/removeCommaFromString';
import { getCurrencySymbol } from '../../common/includes/getCurrencySymbol';
import CurrencyIcon from '../../components/CurrencyIcon';

const RequestMoneyStep2 = (props) => {
  const {
    exchangeRate,
    coinValueData,
    setCoinValue,
    fee,
    currency,
    amountDollar,
    setAmountDollar,
    checkSteps,
  } = props;

  const feeText = `Fee: ~${getCurrencySymbol(currency)}` + fee;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{marginLeft: 20, marginRight: 15}}>
        <Text style={{marginTop: 40, color: CONSTANTS.MY_BLUE}}>Step 2</Text>
        <Text
          style={{
            marginTop: 0,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: CONSTANTS.MY_BLUE,
            fontSize: 18,
          }}>
          Amount
        </Text>
        <View
          style={{
            width: '100%',
            borderBottomColor: '#D1D3D4',
            borderBottomWidth: 1,
            height: 20,
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 26.5, marginBottom: 11}}>
          <Icon style={{fontSize: 16}} name="money" type="FontAwesome" />
          <Text style={{marginLeft: 10, fontSize: 12}}>
            Add the amount of money
          </Text>
        </View>

        <View
          style={{
            ...styles.dollarBox,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CurrencyIcon currency={currency}/>
            </View>
            <Text style={{marginLeft: 5}}>{currency}</Text>
          </View>

          <TextInput
            autoFocus={true}
            style={{...styles.dollarInput}}
            value={monetaryDigitsFormatter(amountDollar)}
            keyboardType="numeric"
            onChangeText={(text) => {
              setAmountDollar(removeCommaFromString(text));
              setCoinValue((removeCommaFromString(text) / exchangeRate).toFixed(5));
            }}
            placeholder="0.00"
          />
        </View>

        <View
          style={{
            ...styles.LTCBox,
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text> </Text>
          </View>

          <TextInput
            style={{...styles.dollarInput}}
            value={coinValueData}
            editable={false}
            placeholder="0.00"
          />
        </View>
        {/* <Text style={{fontSize: 12}}>{feeText}</Text> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 0,
            marginTop: 20,
            width: '100%',
          }}>
          <RoundButton
            text="Cancel"
            type="gray"
            style={{width: 142}}
            onPress={() => props.navigation.goBack()}
          />
          <RoundButton
            text="Next"
            style={{width: 142, marginLeft: 20}}
            onPress={() => checkSteps(2)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(RequestMoneyStep2);

const styles = {
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: 'white',
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  LTCBox: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'space-between',
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
    paddingHorizontal: 10,
  },
  dollarInput: {
    // padding: 5,
    width: '50%',
    textAlign: 'right',
    // marginTop: 10
  },
  dollarBox: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'space-between',
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: CONSTANTS.MY_FOCUSED_BORDER_COLOR,
    paddingHorizontal: 10,
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10,
  },
};
