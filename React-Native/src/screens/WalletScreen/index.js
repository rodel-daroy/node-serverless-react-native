import React, { memo, useEffect, useContext, useCallback, useMemo } from 'react';
import { Image, ImageBackground, TouchableOpacity, View, ScrollView, RefreshControl } from 'react-native';
import { css } from '@emotion/native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'native-base';

import { getMySettings, updateMySettings } from '../../actions/userActions';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import { useSetState } from '../../common/Hooks';
import CONSTANTS from '../../common/PeertalConstants';
import { OverlayLoading, Text } from '../../components/CoreUIComponents';
import PopupContext from '../../context/Popup/PopupContext';
import UserContext from '../../context/User/UserContext';
import { getSupportedCurrencies, getUserVerification, getWalletDetails } from '../../actions/userActions';
import SettingsObject from '../../models/SettingsObject';
import SelectDropdown from 'react-native-select-dropdown';
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';

const DEFAULT_STATE = {
    isLoading: false,
    isRefreshing: false,
    walletData: {},
    supportedCurrencies: [],
    userSettings: null,
    selectedCurrency: '',
};

const WalletScreenContainer = (props) => {
    const [state, setState] = useSetState(DEFAULT_STATE);
    const { defaultError } = useContext(DefaultErrorContext);
    const { setPopup } = useContext(PopupContext);
    const alert = setPopup;
    const { verificationStatus, setVerificationStatus } = useContext(UserContext);

    const getUserVerificationStatus = useCallback(() => {
        if (props.user.loggedStatus === 'logged') {
            getUserVerification(
                props.user.accessToken,
                (res) => {
                    res.data.data.length > 0 &&
                    setVerificationStatus(res.data.data[res.data.data.length - 1].status);
                    !(res.data.data.length > 0) && setVerificationStatus(-1);
                },
                (err) => console.log(err),
            );
        }
    }, [setVerificationStatus, props.user.accessToken, props.user.loggedStatus]);

    const preferredCurrency = useMemo(() => {
        if (props.user?.preferredCurrency) {
            return props.user?.preferredCurrency;
        }
    }, [props.user?.preferredCurrency])

    const isPreferredCurrencyButton = useMemo(() => {
        if (!preferredCurrency) {
            return true;
        } else {
            return false;
        }
    }, [preferredCurrency]);

    useEffect(() => {
        if (isPreferredCurrencyButton && props.user.loggedStatus === 'logged') {
            getSupportedCurrencies(
                props.user.accessToken,
                res => {
                    setState({ supportedCurrencies: res.data.data });
                },
                err => {
                    defaultError(err);
                }
            );
        }

        _loadingData();
    }, [isPreferredCurrencyButton, props.user.loggedStatus]);

    useEffect(() => {
        if (isPreferredCurrencyButton && props.user.loggedStatus === 'logged') {
            getMySettings(props.user.accessToken, props.user.userId, res => {
                let settings;
                res == null
                    ? (settings = new SettingsObject())
                    : (settings = res.data.data);
                setState({ userSettings: settings });
            }, (err) => defaultError(err))
        }
    }, [props.user.accessToken, props.user.userId, props.user.loggedStatus]);

    const onShow = () => {
        getUserVerificationStatus();
        refreshData();
    };

    const isUserVerified = (callback) => {
        getUserVerification(props.user.accessToken, (res) => {
                if (res.data.data.length > 0) {
                    setVerificationStatus(res.data.data[res.data.data.length - 1].status);
                    res.data.data[res.data.data.length - 1].status === 2
                        ? props.navigation.navigate('AddPersonalInformation')
                        : res.data.data[res.data.data.length - 1].status === 0
                            ? alert(CONSTANTS.PENDING_VERIFICATION_MSG)
                            : callback();
                }
                if (!(res.data.data.length > 0)) {
                    setVerificationStatus(-1);
                    props.navigation.navigate('AddPersonalInformation');
                }
            },
            (err) => console.log(err),
        );
    };

    const _loadingData = useCallback(() => {
        setState({ isLoading: true });
        if (props.user.loggedStatus !== 'guest') {
            getWalletDetails(
                props.user.accessToken,
                (res) => {
                    setState({ walletData: res.data.data, isLoading: false });
                },
                (err) => {
                    alert({
                        title: 'Alert',
                        main: err.response?.data?.message ?? 'Error',
                        button: [
                            {
                                text: 'OK',
                                onPress: () => {
                                    alert('');
                                    setState({ isLoading: false });
                                    props.navigation.goBack();
                                },
                            },
                        ],
                    });
                },
            );
        }
    }, [props.user]);

    const refreshData = useCallback(() => {
        setState({ isRefreshing: true });
        if (props.user.loggedStatus !== 'guest') {
            getWalletDetails(
                props.user.accessToken,
                (res) => {
                    setState({ walletData: res.data.data, isRefreshing: false });
                },
                (err) => {
                    alert({
                        title: 'Alert',
                        main: err.response?.data?.message ?? 'Error',
                        button: [
                            {
                                text: 'OK',
                                onPress: () => {
                                    alert('');
                                    setState({ isRefreshing: false });
                                    props.navigation.goBack();
                                },
                            },
                        ],
                    });
                },
            );
        }
    }, [props.user]);

    const exchangeRate = state.walletData.exchangeRate || 100; //set fixed Rate to 100 dollar per LTC
    const dollarNumber = ((state.walletData.balance || 0) * exchangeRate).toFixed(2);
    const currency = state.walletData.currency || 'USD';

    if (state.isLoading) {
        return (
            <View
                style={{
                    position: 'absolute',
                    left: CONSTANTS.WIDTH / 2,
                    top: '40%',
                }} >
                <OverlayLoading />
            </View >
        );
    }
    if (!state.isLoading) {
        return (
            <View
                style={{ flexDirection: 'column', height: '100%' }}
            >
                <NavigationEvents onWillFocus={onShow} />
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
                        ...CONSTANTS.TOP_SHADOW_STYLE,
                    }} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} >
                        <Icon
                            name="arrowleft"
                            type="AntDesign"
                            style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }}
                        />
                    </TouchableOpacity >
                    <View
                        style={{
                            marginLeft: 0,
                            width: CONSTANTS.WIDTH - 15 - 30 - 30,
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }} >
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                                color: '#414042',
                                marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON,
                            }} >
                            WALLET
                        </Text >
                    </View >
                </View >
                <ImageBackground
                    source={require('../../assets/xd/background/Login-bg.png')}
                    style={{
                        width: '100%',
                        height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48,
                    }} >
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={state.isRefreshing} onRefresh={refreshData} />} >
                        {/* Start of Balance Card */}
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }} >
                            <View
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'white',
                                    width: 320 * CONSTANTS.WIDTH_RATIO, //corrected ratio
                                    height: 120,
                                    marginTop: CONSTANTS.TOP_PADDING,
                                    marginLeft: 18 * CONSTANTS.WIDTH_RATIO,
                                    marginBottom: 23,
                                    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                                    ...CONSTANTS.MY_SHADOW_STYLE,
                                }} >
                                <Image
                                    style={{ position: 'absolute', right: 0, top: 0 }}
                                    source={require('../../assets/xd/wallet-right-border.png')}
                                />
                                <Text
                                    style={{
                                        marginTop: 25,
                                        marginLeft: 24 * CONSTANTS.WIDTH_RATIO,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    }} >
                                    Current Balance
                                </Text >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 22 * CONSTANTS.WIDTH_RATIO,
                                        position: 'relative',
                                    }} >
                                    {/* <Icon
                    name="attach-money"
                    type="MaterialIcons"
                    style={{
                      fontSize: 16,
                      color: CONSTANTS.MY_BLUE,
                      marginTop: 10,
                    }}
                  /> */}
                                    <Text style={{ fontSize: 40, color: CONSTANTS.MY_BLUE }} >
                                        {monetaryDigitsFormatter(dollarNumber)}
                                    </Text >
                                    <Text
                                        style={{
                                            color: CONSTANTS.MY_BLUE,
                                            marginLeft: 7,
                                            position: 'absolute',
                                            bottom: 7,
                                            fontSize: 14,
                                        }} >
                                        {currency}
                                    </Text >
                                </View >
                            </View >
                            <View
                                style={{
                                    width: (79 / 375) * CONSTANTS.WIDTH,
                                    height: 90,
                                    marginLeft: (18 / 375) * CONSTANTS.WIDTH,
                                    backgroundColor: 'white',
                                    borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                                    ...CONSTANTS.MY_SHADOW_STYLE,
                                }}
                            />
                        </View >
                        {/* End of Balance Card */}

                        {isPreferredCurrencyButton && (
                            <View style={selectCurrencyViewStyle} >
                                <SelectDropdown
                                    data={state.supportedCurrencies}
                                    onSelect={(selectedItem, index) => {
                                        setState({ selectedCurrency: selectedItem });
                                    }}
                                    buttonStyle={{
                                        ...styles.inputContainer,
                                        borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
                                        width: '70%'
                                    }}
                                    renderCustomizedButtonChild={(selectedItem, index) => {
                                        return (
                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }} >
                                                <Text style={{ color: CONSTANTS.MY_DARK_GREY, fontSize: 14 }} >
                                                    {state.selectedCurrency ? state.selectedCurrency.toUpperCase() : "Preferred Currency"}
                                                </Text >
                                                <Icon
                                                    name="chevron-small-down"
                                                    type="Entypo"
                                                    style={{
                                                        fontSize: 26, marginTop: -5, marginRight: 8
                                                    }}
                                                />
                                            </View >
                                        );
                                    }}
                                    dropdownStyle={{ backgroundColor: 'white', borderRadius: 10 }}
                                    rowStyle={{}}
                                    renderCustomizedRowChild={(item, index) => {
                                        return (
                                            <View style={{ display: 'flex' }} >
                                                <Text style={{ textAlign: 'center' }} >{item.toUpperCase()}</Text >
                                            </View >
                                        );
                                    }}
                                />

                                <View style={styles.buttonContainer} >
                                    <TouchableOpacity onPress={() => {
                                        setState({ isLoading: true });
                                        let settings = {
                                            ...state.userSettings,
                                            preferredCurrency: state.selectedCurrency.toUpperCase(),
                                        };

                                        updateMySettings(
                                            props.user.accessToken,
                                            props.user.userId,
                                            settings,
                                            res => {
                                                const settings = res.data.data;
                                                props.dispatch({
                                                    type: 'UPDATE_MY_SETTINGS',
                                                    data: {
                                                        ...settings,
                                                    },
                                                });
                                                refreshData();
                                                setState({ isLoading: false });
                                                alert(`You set your Preferred Currency to ${state.selectedCurrency.toUpperCase()}`);
                                            }, (err) => {
                                                setState({ isLoading: false });
                                                defaultError(err);
                                            }
                                        );
                                    }} >
                                        <View style={styles.editButton} >
                                            <Text style={styles.editButtonText} >Save</Text >
                                        </View >
                                    </TouchableOpacity >
                                </View >
                            </View >
                        )}

                        <View >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginTop: 40,
                                }} >
                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate('ListTransactions', {
                                            data: state.walletData,
                                            user: props.user,
                                        });
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: CONSTANTS.MY_BLUE,
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: CONSTANTS.MY_BLUE,
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/transaction_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text style={{ ...styles.blockText }} >Transactions</Text >
                                </TouchableOpacity >
                                <TouchableOpacity
                                    onPress={() => {
                                        isUserVerified(() =>
                                            props.navigation.navigate('WalletInformation'),
                                        );
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: '#5918E8',
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: '#5918E8',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/wallet_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text style={{ ...styles.blockText }} >Wallet Information</Text >
                                </TouchableOpacity >
                                <TouchableOpacity
                                    onPress={() => {
                                        isUserVerified(() =>
                                            props.navigation.navigate('RequestMoney'),
                                        );
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: '#BA27FF',
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: '#BA27FF',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/request_money_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text style={{ ...styles.blockText }} >Request Money</Text >
                                </TouchableOpacity >
                            </View >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginTop: 20,
                                }} >
                                <TouchableOpacity
                                    onPress={() => {
                                        isUserVerified(() => props.navigation.navigate('TopUpStep1'));
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: '#FF00B4',
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: '#FF00B4',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/top_up_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text style={{ ...styles.blockText }} >Top Up</Text >
                                </TouchableOpacity >
                                <TouchableOpacity
                                    onPress={() => {
                                        isUserVerified(() => props.navigation.navigate('SendMoney'));
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: '#FF1A53',
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: '#FF1A53',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/send_money_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text
                                        style={{
                                            ...styles.blockText,
                                        }} >
                                        Send Money
                                    </Text >
                                </TouchableOpacity >
                                <TouchableOpacity
                                    onPress={() => {
                                        isUserVerified(() => {
                                            props.navigation.navigate('CashOutStep1', {
                                                data: state.walletData.bankAccounts || [],
                                                walletData: state.walletData,
                                            });
                                        });
                                    }}
                                    style={{
                                        ...styles.block,
                                        backgroundColor: '#FF692F',
                                        elevation: 4,
                                        shadowOffset: { width: 5, height: 5 },
                                        shadowColor: '#FF692F',
                                        shadowOpacity: 0.3,
                                        shadowRadius: 10,
                                    }} >
                                    <Image
                                        source={require('../../assets/icon/atm_icon.png')}
                                        style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                                    />
                                    <Text style={{ ...styles.blockText }} >Cash Out</Text >
                                </TouchableOpacity >
                            </View >
                        </View >
                    </ScrollView >
                </ImageBackground >
            </View >
        );
    }
};

const mapStateToProps = (store) => ({ user: store.user });
const WalletScreenContainerWrapper = connect(mapStateToProps)(WalletScreenContainer);
export default memo(WalletScreenContainerWrapper);

const styles = {
    header1: {
        marginLeft: 16,
        color: CONSTANTS.MY_BLUE,
        fontSize: 18,
        marginTop: 30,
    },
    header2: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 16,
    },
    textItem: {
        fontSize: 14,
        marginLeft: 10,
    },
    block: {
        height: 100,
        width: 100,
        backgroundColor: 'red',
        borderRadius: 12,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        textAlign: 'center',
    },
    blockText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
        fontSize: 12,
        marginTop: 5,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
        paddingLeft: 20,
        justifySelf: 'flex-end',
    },
    editButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: CONSTANTS.MY_CANCEL_BG_COLOR,
        minWidth: 80,
        minHeight: 40,
        borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: CONSTANTS.MY_CANCEL_BORDER_COLOR
    },
    editButtonText: {
        color: "#414042",
        fontSize: 15,
        fontWeight: '700'
    },
    inputContainer: {
        height: 46,
        paddingTop: 2,
        paddingLeft: -3,
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 10,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
    }
};

const selectCurrencyViewStyle = css`
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
`;