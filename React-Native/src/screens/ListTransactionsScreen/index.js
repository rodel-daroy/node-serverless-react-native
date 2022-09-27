import React, { memo, useMemo, useContext, useEffect, useRef, useCallback } from "react";
import { Image, View, TouchableOpacity, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import { Text } from "../../components/CoreUIComponents";
import { monetaryDigitsFormatter } from '../../common/includes/monetaryDigitsFormatter';
import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import { getWalletTransactions } from "../../actions/userActions";
import CONSTANTS from "../../common/PeertalConstants";
import TransactionItem from "./TransactionItem";
import { useSetState } from "../../common/Hooks";

const DEFAULT_STATE = {
    transactions: [],
    isLoading: false,
    sortBy: "all",
};

const ListTransactionsScreenContainer = (props) => {
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;
    const {defaultError} = useContext(DefaultErrorContext);
    const [state, setState] = useSetState(DEFAULT_STATE);

    const [data, user] = useMemo(() => {
        return [props.navigation.getParam('data'), props.navigation.getParam('user')];
    }, [props.navigation]);

    useEffect(() => {
        _loadData(state.sortBy);
    }, [state.sortBy]);

    const _loadData = useCallback((type = "all") => {
        setState({isLoading: true});
        getWalletTransactions(
            user.accessToken,
            type,
            res => {
                setState({transactions: [...res.data.data.reverse()], isLoading: false});
            },
            err => {
                setState({isLoading: false});
                defaultError(err);
            }
        );
    }, [getWalletTransactions]);

    const refActionSheet = useRef(null);
    const showActionSheet = () => {
        if (refActionSheet.current) {
            refActionSheet.current.show();
        }
    }

    const _renderItems = () => {
        return state.transactions.map((item, index) => {
            const userData = (item.totalCoin < 0 ? item.receiver : item.sender) || new UserObject();
            const avatarUrl = userData.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
            const fullName = userData.fullName;
            const amountValue = (item.totalCoin * item.exchangeRate).toFixed(2) + ' ' + item.currency;
            const amount = item.type === "receive" ? "+" + amountValue : amountValue;
            const status = item.type === "receive" ? "Received" : item.type === "send" ? "Sent" : item.type === "pending" ? "Pending" : "Failed"

            return (
                <TransactionItem
                    key={index}
                    data={item}
                    avatarUrl={avatarUrl}
                    fullName={fullName}
                    createdAt={item.createdAt}
                    amount={amount}
                    status={status}
                    sortBy={state.sortBy}
                    userAccessToken={user.accessToken}
                />
            )
        });
    }

    const exchangeRate = data.exchangeRate || 100;
    const dollarNumber = (data.balance * exchangeRate).toFixed(2) || "0.00";
    const currency = data.currency || "USD";

    const options = [
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon name="sort-variant" type="MaterialCommunityIcons" style={{fontSize: 20}}/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>All</Text>
        </View>,
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon name="cash" type="Ionicons" style={{fontSize: 20}}/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>Received</Text>
        </View>,
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon name="cash-refund" type="MaterialCommunityIcons" style={{fontSize: 20}}/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>Sent</Text>
        </View>,
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon name="md-time" type="Ionicons" style={{fontSize: 20}}/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>Pending</Text>
        </View>,
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon name="alpha-x-circle" type="MaterialCommunityIcons" style={{fontSize: 20}}/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>Failed</Text>
        </View>,
        <View style={{
            width: '100%',
            paddingLeft: 18 * CONSTANTS.WIDTH_RATIO,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Icon style={{fontSize: 20, color: "#414042"}} name="x" type="Feather"/>
            <Text style={{marginLeft: 12, color: "#414042", fontSize: 14}}>Cancel</Text>
        </View>,
    ];

    return (
        <View>
            <View style={{flexDirection: "column", height: "100%"}}>
                <View
                    style={{
                        height: 48,
                        marginTop: CONSTANTS.SPARE_HEADER,
                        alignItems: "center",
                        shadowColor: "#000",
                        borderBottomWidth: 1,
                        borderBottomColor: "white",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        ...CONSTANTS.TOP_SHADOW_STYLE
                    }}
                >
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon name="arrowleft" type="AntDesign" style={{marginLeft: 15}}/>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginLeft: 0,
                            width: CONSTANTS.WIDTH - 15 - 30 - 30,
                            justifyContent: "center",
                            flexDirection: "row"
                        }}
                    >
                        <Text style={{fontSize: 14, fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, color: "black"}}>
                            TRANSACTIONS
                        </Text>
                    </View>
                </View>
                <ImageBackground
                    source={require("../../assets/xd/background/Login-bg.png")}
                    style={{width: "100%", height: CONSTANTS.HEIGHT - CONSTANTS.SPARE_HEADER - 48}}
                >
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
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
                                ...CONSTANTS.MY_SHADOW_STYLE
                            }}>
                            <Image style={{position: 'absolute', right: 0, top: 0}}
                                   source={require('../../assets/xd/wallet-right-border.png')}/>
                            <Text
                                style={{
                                    marginTop: 25,
                                    marginLeft: 24 * CONSTANTS.WIDTH_RATIO,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                }}>
                                Current Balance
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 22 * CONSTANTS.WIDTH_RATIO,
                                position: 'relative'
                            }}>
                                {/* <Icon
                  name="attach-money"
                  type="MaterialIcons"
                  style={{
                    fontSize: 16,
                    color: CONSTANTS.MY_BLUE,
                    marginTop: 10,
                  }}
                /> */}
                                <Text style={{fontSize: 40, color: CONSTANTS.MY_BLUE}}>
                                    {monetaryDigitsFormatter(dollarNumber)}
                                </Text>
                                <Text
                                    style={{
                                        color: CONSTANTS.MY_BLUE,
                                        marginLeft: 7,
                                        position: 'absolute',
                                        bottom: 7,
                                        fontSize: 14,
                                    }}>
                                    {currency}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            width: (79 / 375) * CONSTANTS.WIDTH,
                            height: 90,
                            marginLeft: (18 / 375) * CONSTANTS.WIDTH,
                            backgroundColor: 'white',
                            borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                            ...CONSTANTS.MY_SHADOW_STYLE
                        }}/>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            showActionSheet();
                        }}
                        style={{
                            marginLeft: 18,
                            marginTop: 38,
                            marginBottom: 10,
                            marginRight: 'auto',
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                        <Text style={{fontSize: 12, marginRight: 10}}>Filter by</Text>
                        <View><Icon name="funnel" type="Ionicons" style={{fontSize: 15}}/></View>
                    </TouchableOpacity>
                    <ScrollView
                        style={{}}
                        refreshControl={<RefreshControl refreshing={state.isLoading} onRefresh={_loadData}/>}
                    >
                        {_renderItems()}
                    </ScrollView>
                </ImageBackground>
            </View>
            <ActionSheet
                ref={refActionSheet}
                options={options}
                cancelButtonIndex={options.length - 1}
                destructiveButtonIndex={1}
                onPress={index => {
                    switch (index) {
                        case 0:
                            setState({sortBy: "all"});
                            break;
                        case 1:
                            setState({sortBy: "received"});
                            break;
                        case 2:
                            setState({sortBy: "sent"});
                            break;
                        case 3:
                            setState({sortBy: "pending"});
                            break;
                        case 4:
                            setState({sortBy: "failed"});
                            break;
                        default:
                    }
                }}
            />
        </View>
    );
}

export default memo(ListTransactionsScreenContainer);
