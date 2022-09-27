export const capitalize = (str) => {
    if (str === 'ltc') return str.toUpperCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}
