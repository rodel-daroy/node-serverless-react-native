import React, { useContext, memo, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import Modal from 'react-native-modal';

import DefaultErrorContext from '../context/DefaultError/DefaultErrorContext';
import { useSetState } from '../common/Hooks';
import { Text } from "../components/CoreUIComponents";
import CONSTANTS from "../common/PeertalConstants";
import { Icon } from "native-base";
import { getTransactionDetail } from "../actions/userActions";
import { capitalize } from "../common/includes/capitalize";
import { detectDateFormat } from "../common/includes/detectDateFormat";

const DEFAULT_STATE = {
    mainTextArray: [],
};

const TransactionItemModal = (props) => {
    const {defaultError} = useContext(DefaultErrorContext);
    const [state, setState] = useSetState(DEFAULT_STATE);

    const showUp = props.enabled;
    const onClose = props.onClose;
    const data = props.data;
    const transactionId = data.blockchainId;

    useEffect(() => {
        showUp && getTransactionDetail(
            props.userAccessToken,
            transactionId,
            (res) => {
                const result = res.data.data;
                const keyArray = Object.keys(result) || [];
                const keyArrayExceptId = keyArray.filter((element) => element !== 'id');
                const mainTextArray = keyArrayExceptId.reduce((acc, cur) => {
                    if (typeof result[cur] === 'object') {
                        return acc;
                    }
                    const valueData = detectDateFormat(result[cur].toString()) ? (new Date(result[cur]).toLocaleString("en-GB", {dateStyle: "full"})) : result[cur];

                    if (acc === '') return [{title: capitalize(cur), value: valueData}];
                    return [...acc, {title: capitalize(cur), value: valueData}];
                }, '');
                setState({mainTextArray: mainTextArray});
            },
            (err) => {
                onClose();
                defaultError(err);
            });
    }, [showUp])

    if (!state.mainTextArray || state.mainTextArray.length < 1) return <></>;
    return (
        <Modal
            isVisible={showUp}
            backdropOpacity={0.15}>
            <View
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    shadowColor: '#BCBEC0',
                    shadowOffset: {width: 10, height: 10},
                    shadowOpacity: 0.9,
                    shadowRadius: 20,
                    elevation: 1,
                }}>
                <View
                    style={{
                        width: '90%',
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                    <View
                        style={{
                            width: '100%',
                            height: 60,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#D1D3D4',
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative'
                        }}
                    >
                        <Text style={{
                            color: "#414042",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>
                            Transaction details
                        </Text>
                        <TouchableOpacity
                            style={{position: "absolute", right: 9}}
                            onPress={() => {
                                onClose();
                            }}>
                            <Icon
                                style={{fontSize: 20, color: "#D5D7D7"}}
                                name="x"
                                type="Feather"
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{marginHorizontal: 15, marginVertical: 5, height: '60%'}}>
                        {state.mainTextArray && state.mainTextArray.length > 0 && state.mainTextArray.map((item, index) => {
                            return (
                                <View key={item?.id ?? index}>
                                    <Text style={styles.big}>{item?.title ?? ''}</Text>
                                    <Text style={styles.small}>{item?.value ?? ''}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => onClose()}
                        style={{
                            width: "50%",
                            height: 50,
                            borderRadius: CONSTANTS.BUTTON_BORDER_RADIUS,
                            marginVertical: 30,
                            backgroundColor: CONSTANTS.MY_BLUE,
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            marginBottom: 20
                        }}
                    >
                        <Text
                            style={{color: "white", fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD, fontSize: 14}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default memo(TransactionItemModal);

const styles = {
    big: {
        marginTop: 26.5,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
        fontSize: 12,
        marginHorizontal: 5,
        color: CONSTANTS.MY_BLUE
    },
    small: {
        fontSize: 14,
        margin: 5
        // color: CONSTANTS.MY_GREY
    }
};
