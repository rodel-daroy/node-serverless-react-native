import React, { useState } from "react";
import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Modal from 'react-native-modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import { rewardPost } from '../actions/userActions';
import CONSTANTS from '../common/PeertalConstants';


const rewardAmountList = [
  { amount: 1, selected: false },
  { amount: 3, selected: false },
  { amount: 5, selected: false },
  { amount: 10, selected: false }
]

const NewRewardModal = (props) => {

  const {
    accessToken,
    preferredCurrency,
    postId,
    postUsername,
    showUp,
    onClose
  } = props;

  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardAmount, setRewardAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);


  const selectAmount = (index) => {
    for (let [i, item] of rewardAmountList.entries()) {
      if (i === index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    }
    setRewardAmount(rewardAmountList[index].amount)
  }

  const onSend = () => {
    let selected = rewardAmountList.filter(item => item.selected == true);
    if (selected.length > 0) {
      setIsProcessing(true);
      rewardPost(accessToken, preferredCurrency, rewardAmount, [], rewardMessage, postId,
        (res) => {
          setIsProcessing(false);
          setSuccessResponse(true);
        },
        (err) => {
          setIsProcessing(false);
          setSuccessResponse(false);
          Alert.alert('Error', err.response.data.message);
        },
      );
    } else {
      Alert.alert('Warning', 'Please select any amount!');
    }
  }

  onModalWillHide = () => {
    for (let item of rewardAmountList) {
      item.selected = false;
    }
    setRewardMessage('');
    setSuccessResponse(false);
  }


  return (
    <Modal isVisible={showUp} onModalWillHide={() => onModalWillHide()}>
      {
        successResponse ?
          <View style={styles.responseContainer}>
            <TouchableOpacity style={styles.responseClose} onPress={() => onClose()}>
              <MaterialIconsIcon name='close' size={20} color='#333333'></MaterialIconsIcon>
            </TouchableOpacity>
            <View style={styles.responseBody}>
              <Text style={styles.responseMessage}>Your reward has been sent to {postUsername} successfully!</Text>
              <Text style={[styles.responseMessage, { marginTop: 12 }]}>Thank you for contributing to Kuky community!</Text>
            </View>
          </View>
          :
          isProcessing ?
            <View style={styles.responseContainer}>
              <Image
                source={require("../assets/icon/apploading.gif")}
                style={styles.processing}
              />
            </View>
            :
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text></Text>
                  <Text style={styles.title}>Reward {postUsername}</Text>
                  <TouchableOpacity onPress={() => onClose()}>
                    <MaterialIconsIcon name='close' size={20} color='#333333'></MaterialIconsIcon>
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <View style={styles.amountSection}>
                    <View style={styles.subHeader}>
                      <FontAwesomeIcon name='money' size={16} color='#333333'></FontAwesomeIcon>
                      <Text style={styles.subTitle}>Reward Amount</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                      {rewardAmountList.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.amountButton} onPress={() => selectAmount(index)}>
                          <View style={styles.amountButtonDollar}>
                            <FontAwesomeIcon name='dollar' size={16} color='#333333'></FontAwesomeIcon>
                            <Text style={styles.amountButtonDollarText}>{item.amount.toFixed(2)}</Text>
                          </View>
                          <View>
                            {item.selected ?
                              <MaterialIconsIcon name='check' size={16} color={CONSTANTS.MY_BLUE}></MaterialIconsIcon>
                              :
                              <MaterialIconsIcon name='radio-button-unchecked' size={16} color='#333333'></MaterialIconsIcon>
                            }
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={styles.MessageSection}>
                    <View style={styles.subHeader}>
                      <MaterialIconsIcon name='message' size={16} color='#333333'></MaterialIconsIcon>
                      <Text style={styles.subTitle}>Reward Messsage</Text>
                    </View>
                    <TextInput
                      style={styles.messageInput}
                      textAlignVertical='top'
                      multiline={true}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                      onSubmitEditing={() => { Keyboard.dismiss() }}
                      onChangeText={setRewardMessage}
                      value={rewardMessage}
                      placeholder={'Please type your message to ' + postUsername + ' for the reward'}>
                    </TextInput>
                  </View>
                </View>
                <View style={styles.footer}>
                  <TouchableOpacity style={styles.sendButton} disabled={isProcessing} onPress={() => onSend()}>
                    <Text style={styles.sendText}>{CONSTANTS.ButtonTexts.send}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
      }
    </Modal>
  )
}

export default NewRewardModal;

const styles = StyleSheet.create({
  responseContainer: {
    height: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  responseBody: {
    flexDirection: 'column'
  },
  responseClose: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  responseMessage: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  processing: {
    width: 66,
    height: 66,
    backgroundColor: "rgba(255,255,255,0)",
    opacity: 0.8
  },
  container: {
    height: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'column'
  },
  header: {
    height: 40,
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
    height: 48,
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
    width: "46%",
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 8,
    marginHorizontal: "2%",
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: "flex-start",
  },
  amountButtonDollar: {
    flexDirection: 'row'
  },
  amountButtonDollarText: {
    marginStart: 12
  },
  MessageSection: {
    flexDirection: 'column'
  },
  messageInput: {
    width: '96%',
    height: 80,
    marginHorizontal: '2%',
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 8,
    padding: 8
  },
  footer: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButton: {
    width: 160,
    height: 48,
    backgroundColor: CONSTANTS.MY_BLUE,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    fontSize: 16,
    color: CONSTANTS.Colors.white,
    fontWeight: '700'
  }
});