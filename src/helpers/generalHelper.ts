// Check Empty
export function isEmpty(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    value === 0 ||
    value === '0' ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

export function formatIndianNumber(number: number, decimals: number = 0): string {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Invalid Number';
  }

  const formattedNumber = number.toLocaleString('en-IN', {
    maximumFractionDigits: decimals
  });

  return formattedNumber;
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRoundOffValue(number: number): number {
  return (Math.round(number) - number);
}