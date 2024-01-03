export * from './mempool';
export const hideStr = (
  str: string,
  num: number = 10,
  placeholder = '*****',
) => {
  if (str) {
    return `${str?.substring(0, num)}${placeholder}${str?.substring(
      str?.length - num,
    )}`;
  }
  return '';
};
