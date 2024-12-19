// Check Empty
function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === 0 ||
    value === '0' ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

function formatIndianNumber(number, decimals = 0) {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Invalid Number';
  }

  const formattedNumber = number.toLocaleString('en-IN', {
    maximumFractionDigits: decimals
  });

  return formattedNumber;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


module.exports = {
  isEmpty,
  formatIndianNumber,
  generateRandomString
};
