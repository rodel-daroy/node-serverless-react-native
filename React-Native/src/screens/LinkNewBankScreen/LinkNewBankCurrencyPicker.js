import React, { memo, useContext, useCallback, useMemo, useEffect } from 'react';
import { Icon } from "native-base";
import { TouchableOpacity, View } from "react-native";
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';

import CONSTANTS from "../../common/PeertalConstants";
import { Text } from '../../components/CoreUIComponents';

const LinkNewBankCurrencyPicker = ({
    focused = '',
    currency = {},
    isSelectCurrencyModal = false,
    handleCurrencyModal,
    handleFocus,
    setCurrency,
    countryCodes,
}) => {
    if (!countryCodes || countryCodes.length < 1) return <></>
    return (
        <View
            style={{
                ...styles.countryInputContainer,
                borderColor: focused === 'currency' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
            }}>
            <TouchableOpacity
                onPress={() => {
                    handleFocus('currency');
                    handleCurrencyModal(true);
                }}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                <View style={{
                    width: '85%',
                    alignItems: 'center',
                    borderRadius: 10,
                    flexDirection: 'row',
                    paddingLeft: 8,
                }}>
                    <CountryPicker
                        countryCodes={countryCodes}
                        {...{
                            withCountryNameButton: false,
                            withCurrencyButton: true,
                            withFlagButton: false,
                            withCurrency: true,
                            withFilter: true,
                            withFlag: false,
                            withAlphaFilter: true,
                            withCallingCode: false,
                            withEmoji: true,
                            countryCode: currency.cca2,
                            placeholder:
                                <TouchableOpacity onPress={() => { }}>
                                    <Text style={{ paddingTop: 5, color: '#BCBEC0', }}>Select Currency</Text>
                                </TouchableOpacity>,
                            onSelect: (country) => {
                                setCurrency(country);
                            },
                        }}
                        visible={isSelectCurrencyModal}
                        onClose={() => handleCurrencyModal(false)}
                    />
                </View>
                <View
                    style={{
                        fontSize: 14,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        width: '100%',
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                    }}>
                    <Icon
                        name="chevron-small-down"
                        type="Entypo"
                        style={{
                            fontSize: 26, marginTop: -5, marginRight: 8
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default memo(LinkNewBankCurrencyPicker);

const styles = {
    countryInputContainer: {
        marginTop: 10,
        padding: 5,
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 10,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
    },
};
