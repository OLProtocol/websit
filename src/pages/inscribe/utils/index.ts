export * from './mint';
// export * from './index_back';

import { keys } from '@cmdcode/crypto-tools';

export const waitSomeSeconds = async (num: number) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('');
    }, num);
  });
};
export const serializeInscriptionId = (
  inscriptionId: string,
  index: number,
) => {
  // 将txid反转并转换为字节数组
  const txid = inscriptionId.split('i0')[0];
  const txidReverse = txid.split('').reverse().join('');
  console.log(index);
  // const txidBytes = txid
  //   .match(/.{2}/g)
  //   .reverse()
  //   .map((byte) => parseInt(byte, 16));

  // // 将index转换为小端序的字节数组
  // const indexBytes = new ArrayBuffer(4);
  // const indexView = new DataView(indexBytes);
  // indexView.setUint32(0, index, true); // true表示使用小端序

  // // 合并txid和index的字节数组，并转换为十六进制字符串
  // const inscriptionId = [...txidBytes, ...new Uint8Array(indexBytes)]
  //   .map((b) => b.toString(16).padStart(2, '0'))
  //   .join('');

  return txidReverse;
};

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
export const arrayBufferToBuffer = (ab) => {
  const buffer = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
};
export const fileToArrayBuffer = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const readFile = () => {
      const buffer = reader.result;
      resolve(buffer);
    };

    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(file);
  });
};
export const hexString = (buffer) => {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    return value.toString(16).padStart(2, '0');
  });

  return '0x' + hexCodes.join('');
};
export const bufferToSha256 = async (buffer) => {
  return window.crypto.subtle.digest('SHA-256', buffer);
};
export const fileToSha256Hex = async (file: File) => {
  const buffer = await fileToArrayBuffer(file);
  const hash = await bufferToSha256(arrayBufferToBuffer(buffer));
  return hexString(hash);
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
export const hexToBytes = (hex) => {
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

export const clacHexSize = (hex: string) => {
  const data = hexToBytes(hex);
  const txsize = data.length;
  return txsize;
};
export const clacTextSize = (text: string) => {
  const data = hexToBytes(textToHex(text));
  const txsize = data.length;
  return txsize;
};
