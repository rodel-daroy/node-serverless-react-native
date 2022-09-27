import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Text, Avatar, RoundButton } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import UserObject from "../models/UserObject";
import { ScrollView } from "react-native-gesture-handler";
import { sendMoney } from "../actions/userActions";
import { getWalletDetails } from "../actions/userActions";
import { monetaryDigitsFormatter } from "../common/includes/monetaryDigitsFormatter";
import { removeCommaFromString } from "../common/includes/removeCommaFromString";
import { getCurrencySymbol } from "../common/includes/getCurrencySymbol";
import CurrencyIcon from "./CurrencyIcon";

class SendMoneyPostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 2,
      friendName: "",
      description: "",
      amountDollar: "",
      tagList: [],
      coinValue: "",
      wallet: {},
      borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR
    };
    this._setStep = this._setStep.bind(this);
    this._renderStep1 = this._renderStep1.bind(this);
    this._renderStep2 = this._renderStep2.bind(this);
    this._renderStep3 = this._renderStep3.bind(this);
    this.updateTagList = this.updateTagList.bind(this);
    this.handleSendMoney = this.handleSendMoney.bind(this);
    this._initData = this._initData.bind(this);
    this._updateCallback = this._updateCallback.bind(this);
  }

  onFocus() {
    this.setState({
      borderColor: CONSTANTS.MY_FOCUSED_BORDER_COLOR
    })
  }

  onBlur() {
    this.setState({
      borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR
    })
  }

  _setStep(value) {
    this.setState({ currentStep: value });
  }
  updateTagList(list) {
    this.setState({ tagList: list });
  }
  handleSendMoney() {
    const exchangeRate = this.state.wallet.exchangeRate || 100;
    let tags = this.state.tagList.map(item => item.id);
    let amount = (this.state.amountDollar / exchangeRate).toFixed(5);
    let reason = this.state.description;
    sendMoney(
      this.props.user.accessToken,
      props.user.preferredCurrency,
      amount,
      tags,
      reason,
      res => {
        alert(res.data.message);
      },
      () => { }// JOEJOE need defaultError context
    );
  }
  _renderStep1() {
    return null;
  }
  _updateCallback() {
    const { callback, onClose } = this.props;
    if (this.state.amountDollar === '' || this.state.amountDollar === '.') {
      alert('Amount is not valid');
    } else {
      callback(
        this.state.coinValue,
        this.state.amountDollar,
        this.state.wallet.currency
      );
      onClose();
    }
  }
  _renderStep2() {
    const data = this.state.wallet;
    const exchangeRate = data.exchangeRate || 100;
    const coinValue = (this.state.amountDollar / exchangeRate).toFixed(5) + "";
    // const fee = (this.state.amountDollar * 0.03).toFixed(2) + "";
    const fee = "0.00";
    const currency = data.currency || "USD";
    return (
      <View style={{ marginLeft: 20, marginRight: 15 }}>
        {/* <Text style={{ marginTop: 40, color: CONSTANTS.MY_BLUE }}>Step 2</Text> */}
        <Text
          style={{
            marginTop: 0,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: CONSTANTS.MY_BLUE,
            fontSize: 22
          }}
        >
          Amount
        </Text>

        <View
          style={{
            width: "100%",
            borderBottomColor: CONSTANTS.MY_GREY,
            borderBottomWidth: 1,
            height: 20
          }}
        />

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Icon style={{ fontSize: 20 }} name="money" type="FontAwesome" />
          <Text style={{ marginLeft: 10 }}>Add the amount of money</Text>
        </View>
        <View
          style={{
            ...styles.dollarBox, borderColor: this.state.borderColor
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <CurrencyIcon currency={currency} />
            <Text style={{ marginLeft: 5 }}>{currency}</Text>
          </View>

          <TextInput
            keyboardType={"numeric"}
            autoFocus={true}
            onBlur={() => this.onBlur()}
            onFocus={() => this.onFocus()}
            style={{ ...styles.dollarInput, }}
            value={monetaryDigitsFormatter(this.state.amountDollar)}
            onChangeText={text =>
              this.setState({
                amountDollar: removeCommaFromString(text),
                coinValue: (removeCommaFromString(text) / exchangeRate).toFixed(5)
              })
            }
            placeholder="0.00"
          />
        </View>
        <View
          style={{
            ...styles.dollarBox
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
            {/* <Icon
              name="dollar"
              type="FontAwesome"
              style={{
                fontSize: 16
              }}
            /> */}
            <Text> </Text>
          </View>

          <TextInput
            style={{ ...styles.dollarInput }}
            value={coinValue}
            editable={false}
            // onChangeText={text => this.setState({ amountDollar: text })}
            placeholder="0.00"
          />
        </View>
        {/* <Text style={{ marginVertical: 10 }}>Fee: {getCurrencySymbol(currency)}{fee}</Text> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 20,
            width: "100%"
          }}
        >
          <RoundButton
            text="Cancel"
            type="gray"
            style={{ width: 100 }}
            onPress={() => this.props.onClose()}
          />
          <RoundButton
            text="Send"
            style={{ width: 100, marginLeft: 20 }}
            onPress={() => this._updateCallback()}
          />
        </View>
      </View>
    );
  }
  _renderStep3() {
    return null;
  }
  _initData() {
    // this.setState({ ...this.props.params });
    getWalletDetails(
      this.props.user.accessToken,
      res => {
        this.setState({ wallet: res.data.data });
      },
      err => {
        alert(err.response?.data?.message ?? 'error some where');
      }
    );
  }
  render() {
    const showUp = this.props.enabled;
    const onClose = this.props.onClose;
    const callback = this.props.callback;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showUp}
        onShow={this._initData}
      >
        <View style={{ flexDirection: "column", height: "100%" }}>
          <View
            style={{
              height: 48,
              marginTop: CONSTANTS.SPARE_HEADER,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "white",
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 15
            }}
          >
            <TouchableOpacity onPress={() => onClose()}>
              <Icon name="arrowleft" type="AntDesign" />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 0,
                // width: CONSTANTS.WIDTH - 15 - 30 - 30,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  color: "black"
                }}
              >
                SEND MONEY WITH POST
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this._updateCallback()}
            >
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={require("../assets/xd/background/Login-bg.png")}
            style={{
              width: "100%",
              height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
              flexDirection: "row"
            }}
          >
            <View style={{ width: 40, height: "100%" }}>
              <TouchableOpacity
                // onPress={() => this._setStep(1)}
                style={
                  this.state.currentStep == 1
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 1
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._setStep(2)}
                style={
                  this.state.currentStep == 2
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 2
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => this._setStep(3)}
                style={
                  this.state.currentStep == 3
                    ? styles.step
                    : styles.stepNoActive
                }
              >
                <Text
                  style={
                    this.state.currentStep == 3
                      ? styles.stepText
                      : styles.stepNoActiveText
                  }
                >
                  3
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: CONSTANTS.WIDTH - 40, height: "100%" }}>
              {this.state.currentStep == 1
                ? this._renderStep1()
                : this.state.currentStep == 2
                  ? this._renderStep2()
                  : this._renderStep3()}
            </View>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

const MapStateToProps = store => ({ user: store.user });
export default (SendMoneyPostContainer = connect(MapStateToProps)(
  SendMoneyPostModal
));
const styles = {
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
    borderRadius: 10,
    // minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "black",
    marginTop: 10
  },
  dollarInput: {
    // padding: 5,
    width: "50%",
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
    textAlign: "right"
    // marginTop: 10
  },
  dollarBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "space-between",
    minHeight: 50,
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 10
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10
  }
};
