import React, { useState } from "react";
import { Alert, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from 'react-native-modal';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import CONSTANTS, { COLORS } from '../../common/PeertalConstants';


const topUpAmountList = [
  // { amount: 5, ios: 'topup5', android: '', selected: false },
  // { amount: 10, ios: 'Topup10', android: '', selected: false },
  { label: 'Small', amount: 20, ios: 'Topup20', android: '', selected: false },
  // { amount: 30, ios: 'Topup30', android: '', selected: false },
  { label: 'Medium', amount: 50, ios: 'Topup50', android: '', selected: false },
  { label: 'Large', amount: 100, ios: 'Topup100', android: '', selected: false }
]


const TopUpAmountModal = (props) => {

  const { modalVisible, iapProducts, onClose, onPurchase } = props;

  const [topUpAmount, setTopUpAmount] = useState('');


  const onModalWillShow = () => {
    for (let item of topUpAmountList) {
      item.selected = false;
    }
  }

  const selectAmount = (index) => {
    for (let [i, item] of topUpAmountList.entries()) {
      if (i === index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    }
    setTopUpAmount(topUpAmountList[index].label);
  }

  const onSend = () => {
    let selected = topUpAmountList.filter(item => item.selected == true);
    if (selected.length > 0) {
      let selectedProduct = iapProducts.filter(item => item.productId === selected[0].ios);
      onPurchase(selectedProduct[0].productId, topUpAmount.toLowerCase());
    } else {
      Alert.alert('Warning', 'Please select any item!');
    }
  }

  const onModalWillHide = () => {
    for (let item of topUpAmountList) {
      item.selected = false;
    }
  }


  return (
    <Modal isVisible={modalVisible} onModalWillShow={onModalWillShow} onModalWillHide={onModalWillHide}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{ width: 20 }} />
            <Fontisto name={Platform.OS === 'ios' ? 'apple' : 'android'} size={32} color={COLORS.black} />
            <TouchableOpacity onPress={onClose}>
              <MaterialIconsIcon name='close' size={20} color={COLORS.blurFontColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.amountSection}>
              <View style={styles.subHeader}>
                <Fontisto name='wallet' size={16} color={COLORS.fontColor} />
                <Text style={styles.subTitle}>Top Up Amount</Text>
              </View>
              <View style={styles.buttonGroup}>
                {topUpAmountList.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.amountButton} onPress={() => selectAmount(index)}>
                    <View style={styles.amountButtonDollar}>
                      <Text style={styles.amountButtonDollarText}>{item.label}</Text>
                    </View>
                    <View>
                      {item.selected ?
                        <MaterialIconsIcon name='check' size={16} color={CONSTANTS.MY_BLUE} />
                        :
                        <MaterialIconsIcon name='radio-button-unchecked' size={16} color={COLORS.blurFontColor} />
                      }
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.sendButton} onPress={() => onSend()}>
              <Text style={styles.sendText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default TopUpAmountModal;

const styles = StyleSheet.create({
  container: {
    height: 250,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'column'
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderColor: COLORS.unFocusedBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    fontWeight: '700'
  },
  body: {
    flex: 1
  },
  amountSection: {
    flexDirection: 'column'
  },
  subHeader: {
    height: 56,
    marginHorizontal: "2%",
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitle: {
    marginStart: 8,
    fontWeight: '500'
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  amountButton: {
    width: "31%",
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 8,
    marginHorizontal: "1%",
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: "flex-start",
  },
  amountButtonDollar: {
    flexDirection: 'row'
  },
  amountButtonDollarText: {
    marginStart: 12,
    color: COLORS.blurFontColor
  },
  footer: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButton: {
    width: 160,
    height: 48,
    backgroundColor: COLORS.blue,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700'
  }
});
