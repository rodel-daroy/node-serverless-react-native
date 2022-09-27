import React, { memo, useState, useContext } from "react";
import { connect } from "react-redux";
import { Icon } from "native-base";
import { ImageBackground, TouchableOpacity, View, StyleSheet, RefreshControl } from "react-native";
import { NavigationEvents } from "react-navigation";

import CONSTANTS from "../../common/PeertalConstants";
import { Text, OverlayLoading } from "../../components/CoreUIComponents";
import { ScrollView } from "react-native-gesture-handler";
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import BankAccountItem from "../../components/BankAccountItem";
import { getBankAccount } from "../../actions/userActions";

const CashOutStep1ScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const [bankAccounts, setBankAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragUpdate, setIsDragUpdate] = useState(false);

  const handleLoadingData = () => {
    setIsLoading(true);
    getBankAccount(
      props.user.accessToken,
      res => {
        setBankAccount(res.data.data)
        setIsLoading(false);
      },
      err => {
        setIsLoading(false);
        defaultError(err);
      }
    );
  }

  const updateBankInfo = () => {
    setIsDragUpdate(true);

    getBankAccount(
      props.user.accessToken,
      res => {
        setBankAccount(res.data.data)
        setIsDragUpdate(false);
      },
      err => {
        setIsDragUpdate(false);
        defaultError(err);
      }
    );
  }

  const _renderCards = () => {
    if (!bankAccounts || bankAccounts.length < 1) return;
    const data = bankAccounts;
    return data.map((item, index) => (
      <BankAccountItem
        data={item}
        key={index}
        navigation={props.navigation}
      />
    ));
  }

  const description = "We keep your financial details more secure";
  const title = "Please use Bank Account to cash out";

  if (isLoading) return (
    <View
      style={{
        position: 'absolute',
        left: CONSTANTS.WIDTH / 2,
        top: '40%',
      }}>
      <OverlayLoading />
    </View>
  );

  return (
    <View style={{ flexDirection: "column", height: "100%" }}>
      <NavigationEvents
        onWillFocus={() => {
          handleLoadingData();
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
          ...CONSTANTS.TOP_SHADOW_STYLE
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
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON
            }}>
            CASH OUT
          </Text>
        </View>
      </View>
      <ImageBackground
        source={require("../../assets/xd/background/Login-bg.png")}
        style={{
          width: "100%",
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
          alignItems: "center"
        }}
      >
        <Text
          style={{
            marginTop: 56,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            color: "black"
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            marginTop: 15,
            textAlign: "center",
            marginHorizontal: 15
          }}
        >
          {description}
        </Text>
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          style={{ width: CONSTANTS.WIDTH }}
          refreshControl={<RefreshControl refreshing={isDragUpdate} onRefresh={updateBankInfo} />}
        >
          {_renderCards()}

          {(bankAccounts && bankAccounts.length > 0) && (
            <View style={Styles.buttonContainer}>
              <TouchableOpacity onPress={() => { props.navigation.navigate('WalletInformation') }}>
                <View style={Styles.editButton}>
                  <Text style={Styles.editButtonText}>Edit Bank Account List</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={() => props.navigation.navigate("LinkNewBank")}
            style={{
              height: 50,
              borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
              marginTop: 30,
              width: CONSTANTS.WIDTH - 30,
              marginHorizontal: 15,
              padding: 15,
              backgroundColor: CONSTANTS.MY_BLUE,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                fontSize: 14
              }}
            >
              Link Other Bank Account
            </Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const CashOutStep1ScreenContainerWrapper = connect(mapStateToProps)(CashOutStep1ScreenContainer);
export default memo(CashOutStep1ScreenContainerWrapper);

const Styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
    padding: 20
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: CONSTANTS.MY_CANCEL_BG_COLOR,
    minWidth: 80,
    minHeight: 30,
    height: 40,
    borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: CONSTANTS.MY_CANCEL_BORDER_COLOR
  },
  editButtonText: {
    color: "#414042",
    fontSize: 13,
    fontWeight: '300'
  },
});