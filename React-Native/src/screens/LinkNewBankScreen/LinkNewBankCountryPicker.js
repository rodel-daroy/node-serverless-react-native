import React, { memo, useContext, useCallback, useMemo } from 'react';
import { Icon } from "native-base";
import { TouchableOpacity, View } from "react-native";
import CountryPicker from 'react-native-country-picker-modal';

import CONSTANTS from "../../common/PeertalConstants";
import { Text } from '../../components/CoreUIComponents';

const LinkNewBankCountryPicker = ({
    focused = '',
    country = '',
    isSelectCountryModal = false,
    handleCountryModal,
    handleFocus,
    setCountry,
}) => {

    return (
        <View
            style={{
                ...styles.countryInputContainer,
                borderColor: focused === 'country' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
            }}>
            <TouchableOpacity
                onPress={() => {
                    handleFocus('country');
                    handleCountryModal(true);
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
                        {...{
                            countryCode: country,
                            withFilter: true,
                            withFlag: true,
                            withCountryNameButton: true,
                            withAlphaFilter: true,
                            withCallingCode: false,
                            withEmoji: true,
                            placeholder:
                                <TouchableOpacity onPress={() => { }}>
                                    <Text style={{ paddingTop: 5, color: '#BCBEC0', }}>Select Country</Text>
                                </TouchableOpacity>,
                            onSelect: (country) => {
                                setCountry(country.cca2);
                            },
                        }}
                        visible={isSelectCountryModal}
                        onClose={() => handleCountryModal(false)}
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

export default memo(LinkNewBankCountryPicker);

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
