import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from "react-navigation";
import CONSTANTS from '../common/PeertalConstants';


const NewRewardListModal = (props) => {

  const {
    postRewardData,
    showUp,
    onClose,
    doReward,
    isPostOwner,
  } = props;

  const [isProcessing, setIsProcessing] = useState(false);

  const onReward = () => {
    doReward();
  }

  const convertDate = (unixTime) => {
    let newDate = new Date(unixTime * 1000);
    let year = newDate.getFullYear();
    let month = newDate.getMonth();
    let date = newDate.getDate();
    return date + ' ' + CONSTANTS.Months[month] + ' ' + year;
  }

  return (
    <Modal isVisible={showUp}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text></Text>
          <Text style={styles.title}>Reward Received</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <MaterialIconsIcon name='close' size={20} color='#333333'></MaterialIconsIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {postRewardData && postRewardData.map((item, index) => (
              <View key={index} style={styles.rewardItem}>
                <View style={styles.userField}>
                  <Image
                    source={{ uri: item?.userData?.avatarUrl || CONSTANTS.DEFAULT_AVATAR }}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.username}>{item?.userData?.fullName}</Text>
                </View>
                <View style={styles.rewardField}>
                  <Text style={styles.rewardAmount}>{item.amount.toFixed(2)}</Text>
                  <Text style={styles.rewardDate}>{convertDate(item.date)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.sendButton} disabled={isProcessing} onPress={() => onReward()}>
            <Text style={styles.sendText}>{CONSTANTS.ButtonTexts.reward}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default NewRewardListModal;

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'column'
  },
  header: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333'
  },
  body: {
    flex: 1
  },
  rewardItem: {
    height: 80,
    backgroundColor: CONSTANTS.Colors.white,
    marginTop: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  userField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  username: {
    marginStart: 8,
    fontSize: 16,
    fontWeight: '500'
  },
  rewardField: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: CONSTANTS.MY_BLUE
  },
  rewardDate: {
    fontSize: 14
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
})