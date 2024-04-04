import { Address, Signer, Tap, Tx, Script } from '@cmdcode/tapscript';
import * as cbor from 'cbor-web';
import * as bitcoin from 'bitcoinjs-lib';
import { keys } from '@cmdcode/crypto-utils';
import i18n from '@/locales';
import {
  textToHex,
  encodeBase64,
  base64ToHex,
  hexToBytes,
  fileToSha256Hex,
} from './index';
import { getUtxoByValue, pushBTCpmt } from '@/api';
import { addressToScriptPublicKey } from '@/lib/utils';
interface FileItem {
  mimetype: string;
  show: string;
  name: string;
  originValue: string;
  hex: string;
  amt?: number;
  op?: string;
  relateInscriptionId?: string;
  type: string;
  sha256: string;
  fileHex: string;
  fileName: string;
  fileMimeType: string;
  txsize: number;
  ordxType?: string;
  parent?: string;
  parentHex?: string;
  parentMimeType?: string;
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
    const { type, value, name, ordxType } = item;
    const file: any = {
      type,
      name,
      originValue: value,
      ordxType,
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
      file.show = value[0];
      file.originValue = value[0];
      file.hex = textToHex(value[0]);
      if (value.length > 1) {
        const fileData = value.find((v) => v.type === 'file');
        if (ordxType === 'mint') {
          file.parent = fileData?.value;
          file.parentHex = textToHex(fileData?.value);
          file.parentMimeType = fileData?.mimeType;
        } else {
          file.fileHex = fileData?.value;
          file.fileMimeType = fileData?.mimeType;
          file.fileName = fileData?.name;
          file.show += `;${fileData?.name}`;
        }
        const relateData = value.find((v) => v.type === 'relateInscriptionId');
        if (relateData) {
          file.relateInscriptionId = relateData.value;
        }
      }
      file.sha256 = '';
      const ordxData = JSON.parse(value[0]);
      file.amt = Number(ordxData.amt);
      file.op = ordxData.op;
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

    let txsize = prefix + Math.floor(contentBytes.length / 4);
    if (type === 'ordx' && ordxType === 'deploy' && file.fileHex) {
      const contentFileBytes = hexToBytes(file.fileHex);
      txsize += Math.floor(contentFileBytes.length / 4);
    } else if (type === 'ordx' && ordxType === 'mint' && file.parentHex) {
      const parentContentBytes = hexToBytes(file.parentHex);
      txsize += Math.floor(parentContentBytes.length / 4);
    }
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
const generateScript = (secret: string, file: FileItem, ordxUtxo?: any) => {
  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  const ec = new TextEncoder();
  const content = hexToBytes(file.hex);
  const mimetype = ec.encode(file.mimetype);
  let script: any;
  if (file.type === 'ordx' && file.ordxType === 'deploy' && file.fileHex) {
    const fileContent = hexToBytes(file.fileHex);
    const fileMimeType = ec.encode(file.fileMimeType);
    const metaData = cbor.encode(JSON.parse(file.originValue));
    console.log(metaData);
    script = [
      pubkey,
      'OP_CHECKSIG',
      'OP_0',
      'OP_IF',
      ec.encode('ord'),
      '01',
      fileMimeType,
      '07',
      ec.encode('ordx'),
      '05',
      metaData,
      'OP_0',
      fileContent,
      // '01',
      // mimetype,
      // 'OP_0',
      // content,
      'OP_ENDIF',
    ];
  } else if (file.type === 'ordx' && file.ordxType === 'mint') {
    if (file.parent) {
      const parentMimeType = ec.encode(file.parentMimeType);
      const parentConent = hexToBytes(file.parentHex);
      const metaData = cbor.encode(JSON.parse(file.originValue));
      const offset = ordxUtxo?.satas?.[0]?.offset || 0;
      console.log('offset', offset);
      if (ordxUtxo && offset > 0) {
        script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          parentMimeType,
          '02',
          ec.encode(offset),
          '07',
          ec.encode('ordx'),
          '05',
          metaData,
          'OP_0',
          parentConent,
          'OP_ENDIF',
        ];
      } else {
        script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          parentMimeType,
          '07',
          ec.encode('ordx'),
          '05',
          metaData,
          'OP_0',
          parentConent,
          'OP_ENDIF',
        ];
      }
    } else if (file.relateInscriptionId) {
      const offset = ordxUtxo?.satas?.[0]?.offset || 0;
      if (ordxUtxo && offset > 0) {
        script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          mimetype,
          '02',
          ec.encode(offset),
          'OP_0',
          content,
          '11',
          ec.encode(file.relateInscriptionId),
          'OP_ENDIF',
        ];
      } else {
        script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          mimetype,
          'OP_0',
          content,
          '11',
          ec.encode(file.relateInscriptionId),
          'OP_ENDIF',
        ];
      }
    } else {
      const offset = ordxUtxo?.satas?.[0]?.offset || 0;
      console.log('offset', offset);
      if (ordxUtxo && offset > 0) {
        script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          mimetype,
          '02',
          ec.encode(offset),
          'OP_0',
          content,
          'OP_ENDIF',
        ];
      } else {
        script = [
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
      }
    }
  } else {
    script = [
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
  }
  return script;
};
/*
铭刻过程
*/
export const generateInscriptions = ({
  files,
  feeRate,
  secret,
  network = 'main',
  ordxUtxo,
}: {
  files: FileItem[];
  feeRate: number;
  secret: string;
  network: any;
  ordxUtxo: any;
}) => {
  const inscriptions: InscriptionItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const seckey = keys.get_seckey(secret);
    const pubkey = keys.get_pubkey(seckey, true);
    const content = hexToBytes(files[i].hex);
    const script = generateScript(secret, files[i], ordxUtxo);

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
  ordxUtxo?: any;
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
  ordxUtxo,
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

  const script = generateScript(secret, file, ordxUtxo);

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
  const outputs = inscriptions.map((item) => {
    return {
      value: inscriptionSize + feeRate * item.txsize,
      scriptPubKey: ['OP_1', item.tapkey],
    };
  });
  // if (outputs.length > 10) {
  //   outputs = outputs.slice(1);
  // }
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

const signAndPushPsbt = async (inputs, outputs, network) => {
  const psbtNetwork = network === "testnet"
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
  const psbt = new bitcoin.Psbt({
    network: psbtNetwork,
  });
  inputs.forEach((input) => {
    psbt.addInput(input);
  });
  outputs.forEach((output) => {
    psbt.addOutput(output);
  });
  const signed = await window.unisat.signPsbt(psbt.toHex());
  const pushedTxId = await window.unisat.pushPsbt(signed);
  return pushedTxId;
};

interface SendBTCProps {
  toAddress: string;
  network: string;
  value: number;
  feeRate: number;
  fromAddress: string;
  fromPubKey: string;
  ordxUtxo?: any;
  specialAmt?: number;
}

export const sendBTC = async ({
  toAddress,
  network,
  value,
  feeRate = 1,
  fromAddress,
  ordxUtxo,
}: SendBTCProps) => {
  const hasOrdxUtxo = !!ordxUtxo;
  console.log('hasOrdxUtxo', hasOrdxUtxo);
  const data = await getUtxoByValue({
    address: fromAddress,
    value: 600,
    network,
  });
  const consumUtxos = data?.data || [];
  if (!consumUtxos.length) {
    throw new Error(i18n.t('toast.insufficient_balance'));
  }
  console.log(value)
  const fee = (180 * (hasOrdxUtxo ? 2 : 1) + 34 * 2 + 10) * feeRate;
  const filterTotalValue = hasOrdxUtxo ? 330 + fee : value + 330 + fee;
  const avialableUtxo: any[] = [];
  let avialableValue = 0;
  for (let i = 0; i < consumUtxos.length; i++) {
    const utxo = consumUtxos[i];
    avialableUtxo.push(utxo);
    avialableValue += utxo.value;
    if (avialableValue >= filterTotalValue) {
      break;
    }
  }
  if (avialableValue < filterTotalValue) {
    throw new Error(i18n.t('toast.insufficient_balance'));
  }
  // const btcUtxos = avialableUtxo.map((v) => {
  //   return {
  //     txid: v.txid,
  //     vout: v.vout,
  //     satoshis: v.value,
  //     scriptPk: addressToScriptPublicKey(fromAddress),
  //     addressType: 2,
  //     inscriptions: [],
  //     pubkey: fromPubKey,
  //     atomicals: [],
  //   };
  // });
  console.log(avialableUtxo);
  const inputs: any[] = avialableUtxo.map((v) => {
    const scriptPk = addressToScriptPublicKey(fromAddress);
    return {
      hash: v.txid,
      index: v.vout,
      witnessUtxo: {
        script: Buffer.from(scriptPk, 'hex'),
        value: v.value,
      },
    };
  });
  if (hasOrdxUtxo) {
    const scriptPk = addressToScriptPublicKey(fromAddress);
    const { utxo, value } = ordxUtxo;
    const ordxTxid = utxo.split(':')[0];
    const ordxVout = utxo.split(':')[1];
    inputs.unshift({
      hash: ordxTxid,
      index: Number(ordxVout),
      witnessUtxo: {
        script: Buffer.from(scriptPk, 'hex'),
        value: value,
      },
    });
  }
  console.log(inputs);
  const psbtNetwork = network === "testnet"
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
  const psbt = new bitcoin.Psbt({
    network: psbtNetwork,
  });
  inputs.forEach((input) => {
    psbt.addInput(input);
  });
  const total = inputs.reduce((acc, cur) => {
    return acc + cur.witnessUtxo.value;
  }, 0);
  const toValue = value;
  const fromValue = total - toValue - fee;
  const outputs = [
    {
      address: toAddress,
      value: toValue,
    },
    {
      address: fromAddress,
      value: fromValue,
    },
  ];
  return await signAndPushPsbt(inputs, outputs, network);
};
