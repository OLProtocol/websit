import { Button } from 'antd';
import { useUnisatConnect, useUnisat } from '@/lib/hooks';
import { txHelpers } from '@unisat/wallet-sdk';
console.log(txHelpers);
export default function Test() {
  const findBetweenByValue = (userAmt: number, realAmt, ranges: any[]) => {
    let outAmt = 0;
    let outValue = 0;
    let preTotalSize = 0;
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      outValue += range.size;
      if (userAmt > outValue) {
        preTotalSize += range.size;
      }
      if (userAmt <= outValue) {
        const dis = userAmt - preTotalSize;
        outAmt = range.offset + dis;
        break;
      }
    }
    console.log(outAmt, realAmt);
    if (outAmt < realAmt) {
      outAmt += realAmt - outAmt;
    }
    return outAmt;
  };

  const { currentAccount, currentPublicKey } = useUnisatConnect();
  const unisat = useUnisat();
  console.log(unisat);
  const toAddress =
    'tb1pt9c60e43sxcvksr7arx9qvczj0w9sqjellk6xg9chw2d5pv7ax4sdy5r7n';
  // console.log(
  //   buf2hex(Script.fmt.toBytes(Address.toScriptPubKey(currentAccount))),
  // );
  // const addresToScriptPublicKey = (address: string) => {
  //   const scriptPublicKey = Script.fmt.toAsm(
  //     Address.toScriptPubKey(address),
  //   )?.[0];
  //   const asmScript = Address.toScriptPubKey(currentAccount) as string[];
  //   const scriptPubKey = bitcoin.script.fromASM(asmScript.join(' '));
  //   console.log(scriptPubKey);
  //   // const hexRepresentation = scriptPubKey.toString('hex');
  //   // console.log(hexRepresentation);
  //   return scriptPublicKey;
  // };

  const testHandler = async () => {
    const find = findBetweenByValue(100, 546, [
      {
        start: 999,
        offset: 30,
        size: 120,
      },
      {
        start: 8888,
        offset: 800,
        size: 300,
      },
      {
        start: 123123123,
        offset: 1200,
        size: 298,
      },
    ]);
    console.log(find);
    // const btcUtxos = await getBtcUtxos();
    // console.log(btcUtxos);
    // console.log(Buffer.from(btcUtxos[0].scriptPk, 'hex'));
    // // const { psbt, toSignInputs } = await txHelpers.sendBTC({
    // //   btcUtxos: btcUtxos,
    // //   tos: [{ address: toAddress, satoshis: 600 }],
    // //   networkType: 1,
    // //   changeAddress: currentAccount,
    // //   feeRate: 2,
    // //   enableRBF: false,
    // // });
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // //@ts-ignore
    // const inputs = btcUtxos.map((v) => {
    //   return {
    //     hash: v.txid,
    //     index: v.vout,
    //     witnessUtxo: {
    //       script: Buffer.from(v.scriptPk, 'hex'),
    //       value: v.satoshis,
    //     },
    //   };
    // });
    // console.log(inputs);
    // const psbtNetwork = network === "testnet"
      // ? bitcoin.networks.testnet
      // : bitcoin.networks.bitcoin;
    // const psbt = new bitcoin.Psbt({
    //   network: psbtNetwork,
    // });
    // inputs.forEach((input) => {
    //   console.log(input);
    //   psbt.addInput(input);
    // });
    // const total = inputs.reduce((acc, cur) => {
    //   return acc + cur.witnessUtxo.value;
    // }, 0);
    // console.log(total);
    // psbt.addOutput({
    //   address: toAddress,
    //   value: 600,
    // });
    // const fee = 170;
    // const change = total - 600 - fee;
    // psbt.addOutput({
    //   address: currentAccount,
    //   value: change,
    // });
    // const signed = await unisat.signPsbt(psbt.toHex());
    // console.log(signed);
    // const pushedTxId = await unisat.pushPsbt(signed);
    // const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
    //   network: psbtNetwork,
    // });
    // const txHex = signedToPsbt.extractTransaction().toHex();
    // console.log(txHex);
  };
  return <Button onClick={testHandler}>Test</Button>;
}
