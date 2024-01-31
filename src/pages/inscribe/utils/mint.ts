import { Address, Signer, Tap, Tx, Script } from '@cmdcode/tapscript';
import { keys } from '@cmdcode/crypto-utils';
import {
  textToHex,
  encodeBase64,
  base64ToHex,
  hexToBytes,
  fileToSha256Hex,
} from './index';
import { pollPushBTCpmt, pushBTCpmt } from '@/api';
interface FileItem {
  mimetype: string;
  show: string;
  name: string;
  hex: string;
  amt?: number;
  op?: string;
  sha256: string;
  txsize: number;
}
interface InscriptionItem {
  script: any;
  leaf: any;
  tapkey: string;
  cblock: string;
  inscriptionAddress: string;
  txsize: number;
  status: 'pending';
  txid: '';
  file: FileItem;
}

export const generteFiles = async (list: any[]) => {
  const files: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const { type, value, name } = item;
    const file: any = {
      type,
      name,
    };
    if (type === 'text') {
      const _value = value?.trim();
      file.mimetype = 'text/plain;charset=utf-8';
      file.show = _value;
      file.hex = textToHex(_value);
      file.sha256 = '';
    } else if (type === 'brc20') {
      file.mimetype = 'text/plain;charset=utf-8';
      file.show = value;
      file.hex = textToHex(value);
      file.sha256 = '';
    } else if (type === 'ordx') {
      file.mimetype = 'text/plain;charset=utf-8';
      file.show = value;
      file.hex = textToHex(value);
      file.sha256 = '';
      try {
        file.amt = Number(JSON.parse(value).amt);
        file.op = JSON.parse(value).op;
      } catch (error) {
        console.log(error);
      }
    } else if (type === 'file') {
      let mimetype = value.type?.trim();
      if (mimetype.includes('text/plain')) {
        mimetype += ';charset=utf-8';
      }
      const b64 = (await encodeBase64(value)) as string;
      const base64 = b64.substring(b64.indexOf('base64,') + 7);
      console.log('base64', base64);
      const hex = base64ToHex(base64);
      file.mimetype = mimetype;
      file.show = name;
      const sha256 = await fileToSha256Hex(value);
      file.sha256 = sha256.replace('0x', '');
      file.hex = hex;
    }
    let prefix = 160;

    if (file.sha256 != '') {
      prefix = 546;
    }
    const contentBytes = hexToBytes(file.hex);
    const txsize = prefix + Math.floor(contentBytes.length / 4);
    file.txsize = txsize;
    files.push(file);
  }
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
  const address = Address.p2tr.fromPubKey(tapkey, network as any);
  return {
    script,
    leaf,
    tapkey,
    cblock,
    address,
  };
};
export const getAddressBySescet = (sescet: string, network: string) => {
  const seckey = keys.get_seckey(sescet);
  const pubkey = keys.get_pubkey(seckey, true);
  return Address.p2tr.fromPubKey(pubkey, network as any);
};
/*
铭刻过程
*/

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
    const content = hexToBytes(files[i].hex);
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
      file: files[i],
      script: script,
      leaf: leaf,
      tapkey: tapkey,
      cblock: cblock,
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
  file: any;
  inscribeFee: number;
  serviceFee?: number;
  secret: any;
  toAddress: string;
  network: 'main' | 'testnet';
}
export const inscribe = async ({
  inscription,
  network,
  file,
  txid,
  vout,
  amount,
  serviceFee,
  inscribeFee = 546,
  toAddress,
  secret,
}: InscribeParams) => {
  const { VITE_TESTNET_TIP_ADDRESS, VITE_MAIN_TIP_ADDRESS } = import.meta.env;
  const tipAddress =
    network === 'testnet' ? VITE_TESTNET_TIP_ADDRESS : VITE_MAIN_TIP_ADDRESS;
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  const { cblock, tapkey, leaf } = inscription;
  const outputs = [
    {
      // We are leaving behind 1000 sats as a fee to the miners.
      value: inscribeFee,
      // This is the new script that we are locking our funds to.
      scriptPubKey: Address.toScriptPubKey(toAddress),
    },
  ];
  if (serviceFee && tipAddress) {
    outputs.push({
      value: serviceFee,
      scriptPubKey: Address.toScriptPubKey(tipAddress),
    });
  }
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
    vout: outputs,
  });
  const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: leaf });

  const ec = new TextEncoder();
  const content = hexToBytes(file.hex);
  const mimetype = ec.encode(file.mimetype);
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
  // Add the signature to our witness data for input 0, along with the script
  // and merkle proof (cblock) for the script.
  txdata.vin[0].witness = [sig, script, cblock];
  console.log('Your txhex:', txdata);
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
  serviceFee,
  funding,
  inscriptionSize,
  feeRate,
}: any) => {
  const { VITE_TESTNET_TIP_ADDRESS, VITE_MAIN_TIP_ADDRESS } = import.meta.env;
  const tipAddress =
    network === 'testnet' ? VITE_TESTNET_TIP_ADDRESS : VITE_MAIN_TIP_ADDRESS;
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  let outputs = inscriptions.map((item) => {
    return {
      value: inscriptionSize + feeRate * item.txsize,
      scriptPubKey: ['OP_1', item.tapkey],
    };
  });
  if (outputs.length > 10) {
    outputs = outputs.slice(1);
  }
  if (serviceFee && tipAddress) {
    outputs.push({
      value: serviceFee,
      scriptPubKey: Address.toScriptPubKey(tipAddress),
    });
  }
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
