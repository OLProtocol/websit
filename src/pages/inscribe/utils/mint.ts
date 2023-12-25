import { Address, Signer, Tap, Tx } from '@cmdcode/tapscript';
import { keys } from '@cmdcode/crypto-utils';
import { textToHex } from './index';
import { pushBTCpmt } from './mempool';
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

export const generteFiles = (list: any[]) => {
  const files: any[] = list.map((item) => {
    const { type, value } = item;
    const file: any = {};
    if (type === 'text') {
      const _value = value?.trim();
      file.mimetype = 'text/plain;charset=utf-8';
      file.text = JSON.stringify(_value);
      file.hex = textToHex(_value);
      file.sha256 = '';
    } else if (type === 'brc20') {
      file.mimetype = 'text/plain;charset=utf-8';
      file.text = value;
      file.hex = textToHex(value);
      file.sha256 = '';
    }
    return file;
  });
  return files;
};
export const generateBrc20MintContent = (
  tick: string,
  amt: number,
  protocol: string = 'brc-20',
): string => {
  const text = `{"p":"${protocol}","op":"mint","tick":"${tick}","amt":"${Math.floor(
    amt,
  )}"}`;
  return text;
};

/*
铭刻过程
*/
export function generateInscribe(
  secret: string,
  text: string,
  network: 'main' | 'testnet',
): string {
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  // Basic format of an 'inscription' script.
  const ec = new TextEncoder();
  const content = ec.encode(text);
  const mimetype = ec.encode('text/plain;charset=utf-8');

  const script = [
    pubkey,
    'OP_CHECKSIG',
    'OP_0',
    'OP_IF',
    ec.encode('ord'),
    '01',
    mimetype,
    'OP_0',
    content,
    'OP_ENDIF',
  ];

  // For tapscript spends, we need to convert this script into a 'tapleaf'.
  const tapleaf = Tap.encodeScript(script);
  // Generate a tapkey that includes our leaf script. Also, create a merlke proof
  // (cblock) that targets our leaf and proves its inclusion in the tapkey.
  const [tpubkey] = Tap.getPubKey(pubkey, { target: tapleaf });
  console.log('tpubkey', tpubkey);
  // A taproot address is simply the tweaked public key, encoded in bech32 format.
  const address = Address.p2tr.fromPubKey(tpubkey, network);
  console.log('Your address:', address);
  return address;
}
interface InscribeParams {
  secret: string;
  text: string;
  txid: string;
  vout: number;
  fee: number;
  inscribeFee: number;
  toAddress: string;
  network: 'main' | 'testnet';
}
export const inscribe = async ({
  secret,
  text,
  network,
  txid,
  vout,
  fee,
  inscribeFee = 546,
  toAddress,
}: InscribeParams) => {
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);

  // Basic format of an 'inscription' script.
  const ec = new TextEncoder();
  const content = ec.encode(text);
  const mimetype = ec.encode('text/plain;charset=utf-8');

  const script = [
    pubkey,
    'OP_CHECKSIG',
    'OP_0',
    'OP_IF',
    ec.encode('ord'),
    '01',
    mimetype,
    'OP_0',
    content,
    'OP_ENDIF',
  ];
  // For tapscript spends, we need to convert this script into a 'tapleaf'.
  const tapleaf = Tap.encodeScript(script);
  // Generate a tapkey that includes our leaf script. Also, create a merlke proof
  // (cblock) that targets our leaf and proves its inclusion in the tapkey.
  const [tpubkey, cblock] = Tap.getPubKey(pubkey, { target: tapleaf });
  console.log('tpubkey', tpubkey);
  // A taproot address is simply the tweaked public key, encoded in bech32 format.
  const address = Address.p2tr.fromPubKey(tpubkey, network);
  console.log('Your address:', address, Address.toScriptPubKey(toAddress));
  const txdata = Tx.create({
    vin: [
      {
        // Use the txid of the funding transaction used to send the sats.
        txid: txid,
        // Specify the index value of the output that you are going to spend from.
        vout: vout,
        // Also include the value and script of that ouput.
        prevout: {
          // Feel free to change this if you sent a different amount.
          value: fee,
          // This is what our address looks like in script form.
          scriptPubKey: ['OP_1', tpubkey],
        },
      },
    ],
    vout: [
      {
        // We are leaving behind 1000 sats as a fee to the miners.
        value: inscribeFee,
        // This is the new script that we are locking our funds to.
        scriptPubKey: Address.toScriptPubKey(toAddress),
      },
    ],
  });
  const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf });

  // Add the signature to our witness data for input 0, along with the script
  // and merkle proof (cblock) for the script.
  txdata.vin[0].witness = [sig, script, cblock];
  const isValid = Signer.taproot.verify(txdata, 0, { pubkey, throws: true });
  console.log('isValid', isValid);
  console.log("Your txhex:", Tx.encode(txdata).hex);
  // const result = await window.unisat.pushTx({ rawtx: Tx.encode(txdata).hex });
  const result = await pushBTCpmt(Tx.encode(txdata).hex, network);
  return result;
};
