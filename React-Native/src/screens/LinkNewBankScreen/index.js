import React, { memo, useContext, useCallback, useMemo, useEffect } from 'react';
import { css } from '@emotion/native';
import { connect } from 'react-redux';
import { Icon } from "native-base";
import { ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import { getAllCountries } from 'react-native-country-picker-modal';

import { useSetState } from '../../common/Hooks';
import CONSTANTS from "../../common/PeertalConstants";
import { OverlayLoading, Text } from '../../components/CoreUIComponents';
import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import { postBankAccount, getSupportedCurrencies } from '../../actions/userActions';
import UserContext from '../../context/User/UserContext';
import LinkNewBankCountryPicker from './LinkNewBankCountryPicker';
import LinkNewBankCurrencyPicker from './LinkNewBankCurrencyPicker';

const DEFAULT_STATE = {
  isLoading: false,
  country: '',
  isSelectCountryModal: false,
  currency: {},
  isSelectCurrencyModal: false,
  accountHolderName: '',
  accountHolderType: '',
  routingNumber: '',
  accountNumber: '',
  focused: 'country',
  supportedCurrencies: [],
  countryCodes: [],
};

const LinkNewBankScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;
  const { verificationStatus } = useContext(UserContext);
  const [state, setState] = useSetState(DEFAULT_STATE);

  useEffect(() => {
    setState({ isLoading: true });
    getSupportedCurrencies(
      props.user.accessToken,
      res => {
        setState({ isLoading: false, supportedCurrencies: res.data.data });
      },
      err => {
        setState({ isLoading: false });
        defaultError(err);
        goBackHandler();
      }
    );
  }, [getSupportedCurrencies]);

  useEffect(() => {
    if (!state.supportedCurrencies || !(state.supportedCurrencies.length > 0)) return;

    const supportedCurrenciesUpperCase = state.supportedCurrencies.map(item => item.toUpperCase());
    getAllCountries().then((countries) => {
      const countryCodes = new Array();
      countries.forEach(item => {
        if ((item.currency.length === 1) && supportedCurrenciesUpperCase.includes(item.currency[0])) {
          countryCodes.push(item.cca2);
        }
      });

      setState({ countryCodes: countryCodes });
    });
  }, [state.supportedCurrencies]);

  const handleFocus = useCallback(component => {
    setState({ focused: component });
  }, []);

  const handleCountryModal = useCallback(state => {
    setState({ isSelectCountryModal: state });
  }, []);

  const setCountry = useCallback(country => {
    setState({ country: country });
  }, []);

  const handleCurrencyModal = useCallback(state => {
    setState({ isSelectCurrencyModal: state });
  }, []);

  const setCurrency = useCallback(country => {
    setState({ currency: country });
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

  const goBackHandler = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation.goBack]);

  const isInputValidated = useMemo(() => {
    if (
      state.country === '' ||
      state.currency === '' ||
      state.accountHolderName === '' ||
      state.accountHolderType === '' ||
      state.routingNumber === '' ||
      state.accountNumber === ''
    ) {
      return false;
    }

    return true;
  }, [state]);

  const _handleLinkAction = () => {
    if (!isInputValidated) {
      alert({ title: "Uh-oh", main: "Please check input" });
      return;
    }

    if (identityStatus === 'verified') {
      setState({ isLoading: true });
      postBankAccount(
        props.user.accessToken,
        {
          country: state.country,
          currency: state.currency,
          accountHolderName: state.accountHolderName,
          accountHolderType: state.accountHolderType,
          routingNumber: state.routingNumber,
          accountNumber: state.accountNumber,
        },
        (res) => {
          setState({ isLoading: false });
          alert({
            title: 'Success', main: 'Bank details are now stored securely. You can take advantage of our cash out feature.', button: [
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
          defaultError(err);
          goBackHandler();
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

  if (!state.countryCodes || state.countryCodes?.length < 1) return <></>;

  if (state.isLoading) return (
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
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: "center",
          ...CONSTANTS.MY_SHADOW_STYLE,
          borderBottomWidth: 1,
          borderBottomColor: "white",
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: 15
        }}
      >
        <TouchableOpacity onPress={goBackHandler}>
          <Icon name="arrowleft" type="AntDesign" />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,

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
            LINK A BANK ACCOUNT
          </Text>
        </View>
        <TouchableOpacity onPress={_handleLinkAction}>
          <Text style={{ fontSize: 12, color: CONSTANTS.MY_BLUE }}>Done</Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require("../../assets/xd/background/Login-bg.png")}
        style={{
          width: "100%",
          height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48
        }}
      >
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <Text style={{ marginTop: CONSTANTS.TOP_PADDING }}>
            The safety and security of your bank account information is protected by Kuky. You can only link a bank account in the currency of your country
          </Text>

          <View style={styles.lineContainer}>
            <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
            <Text style={{ ...styles.textCaption }}>Country</Text>
          </View>

          <LinkNewBankCountryPicker
            focused={state.focused}
            country={state.country}
            isSelectCountryModal={state.isSelectCountryModal}
            handleFocus={handleFocus}
            handleCountryModal={handleCountryModal}
            setCountry={setCountry}
          />

          <View style={styles.lineContainer}>
            <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
            <Text style={{ ...styles.textCaption }}>Currency</Text>
          </View>

          <LinkNewBankCurrencyPicker
            focused={state.focused}
            currency={state.currency}
            isSelectCurrencyModal={state.isSelectCurrencyModal}
            handleFocus={handleFocus}
            handleCurrencyModal={handleCurrencyModal}
            setCurrency={setCurrency}
            countryCodes={state.countryCodes}
          />

          <View style={styles.lineContainer}>
            <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
            <Text style={{ ...styles.textCaption }}>SWIFT Code</Text>
          </View>
          <View>
            <TextInput
              style={{ ...styles.upperInputContainer, borderColor: state.focused == 'routingNumber' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR }}
              onFocus={e => {
                handleFocus('routingNumber');
              }}
              placeholder={"Enter SWIFT Code"}
              value={state.routingNumber}
              onChangeText={value => setState({ routingNumber: value })}
              onBlur={e => {
                setState({ focused: '' });
              }}
            />
          </View>
          <View>
            <TextInput
              style={{ ...styles.descriptionContainer }}
              placeholder={"8-11 Characters (no dashes)"}
              editable={false}
            />
          </View>
          <View>
            <View style={styles.lineContainer}>
              <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
              <Text style={{ ...styles.textCaption }}>Account Number</Text>
            </View>
            <TextInput
              style={{ ...styles.upperInputContainer, borderColor: state.focused === 'accountNumber' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR }}
              onFocus={e => {
                handleFocus('accountNumber');
              }}
              placeholder={"Enter account number"}
              value={state.accountNumber}
              onChangeText={value => setState({ accountNumber: value })}
              onBlur={e => {
                setState({ focused: '' });
              }}
            />
          </View>
          <View>
            <TextInput
              style={{ ...styles.descriptionContainer }}
              placeholder={"1-35 digit number. Contact your bank if you need help"}
              editable={false}
            />
          </View>

          <View>
            <View style={styles.lineContainer}>
              <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
              <Text style={{ ...styles.textCaption }}>Account Name</Text>
            </View>
            <TextInput
              style={{ ...styles.inputContainer, borderColor: state.focused == 'accountHolderName' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR }}
              onFocus={e => {
                handleFocus('accountHolderName');
              }}
              placeholder={"Enter account name"}
              value={state.accountHolderName}
              onChangeText={value => setState({ accountHolderName: value })}
              onBlur={e => {
                setState({ focused: '' });
              }}
            />
          </View>

          <View>
            <View style={styles.lineContainer}>
              <Icon name="infocirlce" type="AntDesign" style={{ ...styles.iconStyle }} />
              <Text style={{ ...styles.textCaption }}>Account Type</Text>
            </View>
            <SelectDropdown
              data={["Individual", "Business"]}
              onSelect={(selectedItem, index) => {
                setState({ accountHolderType: selectedItem.toLowerCase() })
              }}
              buttonStyle={{ ...styles.inputContainer, borderColor: state.focused == 'accountHolderType' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR, width: '100%' }}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: state.accountHolderType === '' ? '#BCBEC0' : '#000000' }}>
                      {selectedItem ? selectedItem : "Select Account Type"}
                    </Text>
                    <Icon
                      name="chevron-small-down"
                      type="Entypo"
                      style={{
                        fontSize: 26, marginTop: -5, marginRight: 8
                      }}
                    />
                  </View>
                );
              }}
              dropdownStyle={{ backgroundColor: 'white', borderRadius: 10 }}
              rowStyle={{}}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={{ display: 'flex' }}>
                    <Text style={{ textAlign: 'center' }}>{item}</Text>
                  </View>
                );
              }}
            />
          </View>

          {state.isLoading ? null : (
            <TouchableOpacity
              onPress={() => {
                _handleLinkAction();
              }}
              style={{
                width: "100%",
                height: 50,
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
                LINK BANK ACCOUNT
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ width: "100%", height: 300 }} />
        </ScrollView>
      </ImageBackground>
      { }
    </View>
  );
};

const mapStateToProps = (store) => ({ user: store.user });
const LinkNewBankScreenContainerWrapper = connect(mapStateToProps)(LinkNewBankScreenContainer);
export default memo(LinkNewBankScreenContainerWrapper);

const styles = {
  lineContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 20
  },
  textCaption: {
    marginLeft: 10
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  countryInputContainer: {
    marginTop: 10,
    padding: 5,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  upperInputContainer: {
    marginTop: 10,
    padding: 15,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  descriptionContainer: {
    fontSize: 12,
    height: 34,
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#BCBEC0",
    backgroundColor: "#F3F4F4",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  bankNameInputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  iconStyle: {
    fontSize: 18
  },
  lineHalfContainer: {
    flexDirection: "row",
    width: 160 * CONSTANTS.WIDTH_RATIO,
    justifyContent: "flex-start",
    marginTop: 20
  },
  buttonContainer: {
    flexDirection: "row"
  },
  image: { height: 12, width: 42 },
};