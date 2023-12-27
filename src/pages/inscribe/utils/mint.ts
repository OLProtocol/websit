import { Address, Signer, Tap, Tx, Script } from '@cmdcode/tapscript';
import { keys } from '@cmdcode/crypto-utils';
import { textToHex } from './index';
import { pushBTCpmt } from './mempool';
interface FileItem {
  mimetype: string;
  text: string;
  name: string;
  hex: string;
  content: string;
  sha256: string;
}
interface InscriptionItem {
  script: any;
  leaf: any;
  tapkey: string;
  cblock: string;
  text: string;
  inscriptionAddress: string;
  txsize: number;
  status: 'pending';
  txid: '';
}

export const generteFiles = (list: any[]) => {
  const files: FileItem[] = list.map((item) => {
    const { type, value } = item;
    const file: any = {};
    if (type === 'text') {
      const _value = value?.trim();
      file.mimetype = 'text/plain;charset=utf-8';
      file.text = JSON.stringify(_value);
      file.content = _value;
      file.hex = textToHex(_value);
      file.sha256 = '';
    } else if (type === 'brc20') {
      file.mimetype = 'text/plain;charset=utf-8';
      file.text = value;
      file.content = value;
      file.hex = textToHex(value);
      file.sha256 = '';
    } else if (type === 'ord2') {
      file.mimetype = 'text/plain;charset=utf-8';
      file.text = value;
      file.content = value;
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

export const getFundingAddress = (sescet: string, network: string) => {
  const seckey = keys.get_seckey(sescet);
  const pubkey = keys.get_pubkey(seckey, true);
  const script = [pubkey, 'OP_CHECKSIG'];
  const leaf = Tap.encodeScript(script);
  const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
  const address = Address.p2tr.fromPubKey(tapkey, network);
  return {
    script,
    leaf,
    tapkey,
    cblock,
    address,
  };
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
/*
铭刻过程
*/
export const generateInscriptions = ({
  files,
  feeRate,
  secret,
  network = 'main',
}: {
  files: FileItem[];
  feeRate: number;
  secret: string;
  network: any;
}) => {
  const inscriptions: InscriptionItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const seckey = keys.get_seckey(secret);
    const pubkey = keys.get_pubkey(seckey, true);
    const ec = new TextEncoder();
    const content = ec.encode(files[i].text);
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
      content,
      'OP_ENDIF',
    ];
    const leaf = Tap.encodeScript(script);
    const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
    const inscriptionAddress = Address.p2tr.fromPubKey(tapkey, network);

    console.log('network:', network);
    console.log('Inscription address: ', inscriptionAddress);
    console.log('Tapkey:', tapkey);

    let prefix = 160;

    if (files[i].sha256 != '') {
      prefix = feeRate > 1 ? 546 : 700;
    }

    const txsize = prefix + Math.floor(content.length / 4);

    console.log('TXSIZE', txsize);
    inscriptions.push({
      script: script,
      leaf: leaf,
      tapkey: tapkey,
      cblock: cblock,
      text: files[i].content,
      inscriptionAddress: inscriptionAddress,
      txsize: txsize,
      status: 'pending',
      txid: '',
    });
  }
  return inscriptions;
};
interface InscribeParams {
  inscription: InscriptionItem;
  txid: string;
  vout: number;
  amount: number;
  inscribeFee: number;
  secret: any;
  toAddress: string;
  network: 'main' | 'testnet';
}
export const inscribe = async ({
  inscription,
  network,
  txid,
  vout,
  amount,
  inscribeFee = 546,
  toAddress,
  secret,
}: InscribeParams) => {
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  const { script, cblock, tapkey, leaf } = inscription;
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
          value: amount,
          // This is what our address looks like in script form.
          scriptPubKey: ['OP_1', tapkey],
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
  const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: leaf });

  // Add the signature to our witness data for input 0, along with the script
  // and merkle proof (cblock) for the script.
  txdata.vin[0].witness = [sig, script, cblock];
  const isValid = Signer.taproot.verify(txdata, 0, { pubkey, throws: true });
  console.log('isValid', isValid);
  console.log('Your txhex:', Tx.encode(txdata).hex);
  // const result = await window.unisat.pushTx({ rawtx: Tx.encode(txdata).hex });
  const result = await pushBTCpmt(Tx.encode(txdata).hex, network);
  return result;
};

export const pushCommitTx = async ({
  inscriptions,
  secret,
  network,
  funding,
  inscriptionSize,
  feeRate,
}: any) => {
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  const outputs = inscriptions.map((item) => {
    return {
      value: inscriptionSize + feeRate * item.txsize,
      scriptPubKey: ['OP_1', item.tapkey],
    };
  });
  console.log('funcding amount', funding.amount);
  console.log('commit outputs', outputs);
  const commitTxData = Tx.create({
    vin: [
      {
        txid: funding.txid,
        vout: funding.vout,
        prevout: {
          value: funding.amount,
          scriptPubKey: ['OP_1', funding.tapkey],
        },
      },
    ],
    vout: outputs,
  });
  const sig = Signer.taproot.sign(seckey, commitTxData, 0, {
    extension: funding.leaf,
  });
  commitTxData.vin[0].witness = [sig, funding.script, funding.cblock];
  const isValid = Signer.taproot.verify(commitTxData, 0, {
    pubkey,
    throws: true,
  });
  console.log('commit Tx isValid', isValid);
  const rawtx = Tx.encode(commitTxData).hex;
  console.log('Your Commit Tx txhex:', rawtx);
  const txid = await pushBTCpmt(rawtx, network);
  const result = {
    txid,
    outputs: outputs.map((item, i) => {
      return {
        vout: i,
        amount: item.value,
      };
    }),
  };
  return result;
};
