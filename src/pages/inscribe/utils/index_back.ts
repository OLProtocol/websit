import { Address, Script, Signer, Tap, Tx, Networks } from '@cmdcode/tapscript';

interface FileItem {
  mimetype: string;
  text: string;
  name: string;
  hex: string;
  sha256: string;
}
interface InscriptionItem {
  leaf: any;
  tapkey: any;
  cblock: any;
  inscriptionAddress: any;
  txsize: any;
  fee: any;
  script: any;
  script_orig: any;
}
import { keys } from '@cmdcode/crypto-tools';
import { buffer } from 'stream/consumers';
const { gen_keypair, get_seckey, get_pubkey } = keys;
// main: 'main', signet/testnet: 'tb'
const encodedAddressPrefix = 'main';

// mainnet: '', 'signet/', 'testnet/'
const mempoolNetwork = '';
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

export const generateFundingAccount = () => {
  const privkey = bytesToHex(window.cryptoUtils.Noble.utils.randomPrivateKey());
  // const privkey =
  //   '8004fdece0e5675d2b7777d64676230884a6caa8ca802cf53dd38afda1d6bae7';
  console.log(typeof privkey);
  console.log('privkey:', privkey);
  const KeyPair = window.cryptoUtils.KeyPair;

  const seckey = new KeyPair(privkey);
  const pubkey = seckey.pub.rawX;
  // console.log(buf2hex(seckey.raw));
  // console.log(buf2hex(pubkey.buffer));
  // const seckey2 = get_seckey(privkey);
  // const pubkey2 = get_pubkey(seckey2);
  // console.log('seckey2:', buf2hex(seckey2));
  // console.log('pubkey2:', buf2hex(pubkey2));
  return {
    seckey,
    pubkey,
  };
  // const [seckey, pubkey] = gen_keypair();
  // return {
  //   seckey,
  //   pubkey,
  // };
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

export const generateInscriptions = async ({
  files,
  feerate,
  pubkey,
  network = 'main',
}: {
  files: FileItem[];
  feerate: number;
  pubkey: any;
  network: any;
}) => {
  const inscriptions: InscriptionItem[] = [];
  let total_fee = 0;

  const ec = new TextEncoder();
  for (let i = 0; i < files.length; i++) {
    const hex = files[i].hex;
    const data = hexToBytes(hex);
    const mimetype = ec.encode(files[i].mimetype);

    const script = [
      pubkey,
      'OP_CHECKSIG',
      'OP_0',
      'OP_IF',
      ec.encode('ord'),
      '01',
      mimetype,
      'OP_0',
      data,
      'OP_ENDIF',
    ];

    const script_backup = [
      '0x' + buf2hex(pubkey.buffer),
      'OP_CHECKSIG',
      'OP_0',
      'OP_IF',
      '0x' + buf2hex(ec.encode('ord')),
      '01',
      '0x' + buf2hex(mimetype),
      'OP_0',
      '0x' + buf2hex(data),
      'OP_ENDIF',
    ];

    const leaf = await Tap.tree.getLeaf(Script.encode(script));
    const [tapkey, cblock] = await Tap.getPubKey(pubkey, { target: leaf });
    console.log('network:', network);
    const inscriptionAddress = Address.p2tr.encode(tapkey, network);

    console.log('Inscription address: ', inscriptionAddress);
    console.log('Tapkey:', tapkey);

    let prefix = 160;

    if (files[i].sha256 != '') {
      prefix = feerate > 1 ? 546 : 700;
    }

    const txsize = prefix + Math.floor(data.length / 4);

    console.log('TXSIZE', txsize);

    const fee = feerate * txsize;
    total_fee += fee;

    inscriptions.push({
      leaf: leaf,
      tapkey: tapkey,
      cblock: cblock,
      inscriptionAddress: inscriptionAddress,
      txsize: txsize,
      fee: fee,
      script: script_backup,
      script_orig: script,
    });
  }
  return inscriptions;
};
export const calcInscriptionsTotalFee = ({
  files,
  feerate,
}: {
  files: FileItem[];
  feerate: number;
}) => {
  let total_fee = 0;
  for (let i = 0; i < files.length; i++) {
    const hex = files[i].hex;
    const data = hexToBytes(hex);
    let prefix = 160;
    if (files[i].sha256 != '') {
      prefix = feerate > 1 ? 546 : 700;
    }
    const txsize = prefix + Math.floor(data.length / 4);
    const fee = feerate * txsize;
    total_fee += fee;
  }
  return total_fee;
};
export const clacTextSize = (text: string) => {
  const data = hexToBytes(textToHex(text));
  const txsize = data.length;
  return txsize;
};

export const calcTotalFees = async ({
  inscriptions,
  feerate,
  padding,
  total_fee,
}: {
  inscriptions: InscriptionItem[];
  feerate: number;
  padding: number;
  total_fee: number;
}) => {
  const base_size = 160;
  return (
    total_fee +
    (69 + (inscriptions.length + 1) * 2 * 31 + 10) * feerate +
    base_size * inscriptions.length +
    padding * inscriptions.length
  );
};
