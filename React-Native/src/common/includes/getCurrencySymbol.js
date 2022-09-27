import getSymbolFromCurrency from 'currency-symbol-map';

export const getCurrencySymbol = (x = 'NOT A VALID CODE') => {
    return getSymbolFromCurrency(x);
};
