export * from './mempool';
export * from './mint';
// export * from './index_back';

import { keys } from '@cmdcode/crypto-tools';

export const removeObjectEmptyValue = (obj: any) => {
  const _obj = { ...obj };
  Object.keys(_obj).forEach((key) => {
    if (
      _obj[key] === '' ||
      _obj[key] === undefined ||
      _obj[key] === null ||
      _obj[key] === 'null' ||
      _obj[key] === 'undefined' ||
      _obj[key] === 'NaN' ||
      (isNaN(_obj[key]) && typeof _obj[key] === 'number')
    ) {
      delete _obj[key];
    }
  });
  return _obj;
};
export const textToHex = (text: string) => {
  const encoder = new TextEncoder().encode(text);
  return [...new Uint8Array(encoder)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
};
export const encodeBase64 = (file: File) => {
  return new Promise(function (resolve) {
    const imgReader = new FileReader();
    imgReader.onloadend = function () {
      resolve(imgReader?.result?.toString());
    };
    imgReader.readAsDataURL(file);
  });
};

export const base64ToHex = (str: string) => {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toLowerCase();
};

export const bytesToHex = (bytes) => {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    '',
  );
};
export const buf2hex = (buffer) => {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
};

export const generatePrivateKey = (): string => {
  const privkey = keys.gen_seckey();
  const privString = bytesToHex(privkey);
  return privString;
};
const hexToBytes = (hex) => {
  return Uint8Array.from(
    hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );
};
export const satsToBitcoin = (sats) => {
  if (sats >= 100000000) sats = sats * 10;
  let string =
    String(sats).padStart(8, '0').slice(0, -9) +
    '.' +
    String(sats).padStart(8, '0').slice(-9);
  if (string.substring(0, 1) == '.') string = '0' + string;
  return string;
};

export const clacTextSize = (text: string) => {
  const data = hexToBytes(textToHex(text));
  const txsize = data.length;
  return txsize;
};
