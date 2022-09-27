export const removeCommaFromString = (x = '') => {
    if (!x) return;

    let decimal = x.indexOf('.');
    let position = decimal < 0 ? decimal : (x.length - decimal - 1);

    return position < 0 ? x.replace(/\D/g, '') : position === 0 ? x.replace(/\D/g, '') + '.' : (parseFloat(x.replace(/\D/g, '')) / Math.pow(10, position)).toFixed(2).toString();
};