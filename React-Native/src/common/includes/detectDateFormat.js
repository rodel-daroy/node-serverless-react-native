export const detectDateFormat = (str) => {
  const regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/g;
  return !!str.match(regex);
}