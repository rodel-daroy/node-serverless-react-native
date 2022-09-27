import React, { memo, useMemo } from 'react';
import { css } from '@emotion/native';
import { Text, View } from 'react-native';
import { getCurrencySymbol } from '../common/includes/getCurrencySymbol';

const CurrencyIcon = ({
    className = '',
    currency = 'USD',
}) => {
    const currencySymbol = useMemo(() => {
        return getCurrencySymbol(currency);
    }, [currency, getCurrencySymbol]);

    return (
        <View
            className={className}
            style={style}
        >
            <Text style={textStyle}>{currencySymbol}</Text>
        </View>
    )
};

export default memo(CurrencyIcon);

const style = css`
    display: flex;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-width: 1px;
    border-color: black;
    align-items: center;
    justify-content: center;
`;

const textStyle = css`
    font-size: 16px;
`;
