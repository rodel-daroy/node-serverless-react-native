export const monetaryDigitsFormatter = (x = '') => {
    if (!x) return;

    if (x === '0' || x === 0) return 0;

    let decimal = x.toString().indexOf('.');
    let position = decimal < 0 ? decimal : (x.toString().length - decimal - 1);

    return position === 0 ? parseFloat(x).toLocaleString() + '.' : parseFloat(x).toLocaleString(undefined, { maximumFractionDigits: 2 });
};