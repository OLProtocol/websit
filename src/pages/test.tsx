import { Button } from 'antd';
import { Address, Script } from '@cmdcode/tapscript';
import { buf2hex } from './inscribe/utils';
import { requstAvailableUtxos } from '@/api';
import { useUnisatConnect, useUnisat } from '@/lib/hooks';
import * as bitcoin from 'bitcoinjs-lib';
import { UnspentOutput, txHelpers } from '@unisat/wallet-sdk';
console.log(txHelpers);
export default function Test() {
  const { currentAccount, currentPublicKey } = useUnisatConnect();
  const unisat = useUnisat();
  console.log(unisat);
  const toAddress =
    'tb1pt9c60e43sxcvksr7arx9qvczj0w9sqjellk6xg9chw2d5pv7ax4sdy5r7n';
  // console.log(
  //   buf2hex(Script.fmt.toBytes(Address.toScriptPubKey(currentAccount))),
  // );
  const addresToScriptPublicKey = (address: string) => {
    const scriptPublicKey = Script.fmt.toAsm(
      Address.toScriptPubKey(address),
    )?.[0];
    // const asmScript = Address.toScriptPubKey(currentAccount) as string[];
    // const scriptPubKey = bitcoin.script.fromASM(asmScript.join(' '));
    // const hexRepresentation = scriptPubKey.toString('hex');
    // console.log(hexRepresentation);
    return scriptPublicKey;
  };
  const getBtcUtxos = async () => {
    const data = await requstAvailableUtxos({
      address: 'tb1prcc8rp5wn0y9vp434kchl3aag8r8hz699006ufvczwnneuqx0wdsfmvq4y',
      ticker: 'test3',
    });
    const utxos = data?.data?.detail;
    const btcUtxos = utxos
      .filter(
        (v) =>
          v.txid ===
          'c21b429bec03ed0cd0d54c3683034f07f52d251a8a97ee5c96a659bd6dbf1886',
      )
      .map((v) => {
        return {
          txid: v.txid,
          vout: v.vout,
          satoshis: v.value,
          scriptPk: addresToScriptPublicKey(currentAccount),
          addressType: 2,
          inscriptions: [],
          pubkey: currentPublicKey,
          atomicals: [],
        };
      });
    return btcUtxos;
  };
  const testHandler = async () => {
    const btcUtxos = await getBtcUtxos();
    console.log(btcUtxos);
    const { psbt, toSignInputs } = await txHelpers.sendBTC({
      btcUtxos: btcUtxos,
      tos: [{ address: toAddress, satoshis: 600 }],
      networkType: 1,
      changeAddress: currentAccount,
      feeRate: 2,
      enableRBF: false,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const psbthex = psbt.toHex();
    console.log(psbt, toSignInputs);
    console.log(psbthex);
    const psbtNetwork = bitcoin.networks.testnet;
    const _psbt = bitcoin.Psbt.fromHex(psbthex, {
      network: psbtNetwork,
    });
    console.log(_psbt.toHex());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = true;
    const res = await unisat.signPsbt(psbthex, {
      // toSignInputs,
      autoFinalized: true,
    });
    console.log(res);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
  };
  return <Button onClick={testHandler}>Test</Button>;
}
