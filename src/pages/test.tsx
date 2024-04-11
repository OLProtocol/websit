import { Button } from 'antd';
import { sort } from 'radash';
import { useUnisatConnect, useUnisat } from '@/lib/hooks';
import { txHelpers } from '@unisat/wallet-sdk';
export default function Test() {
  const filterUtxosByValue = (utxos: any[], value, reverseStatus = true) => {
    const sortUtxos = sort(utxos, u => u.value);
    const _utxoList = structuredClone(sortUtxos);
    if (reverseStatus) {
      _utxoList.reverse();
    }
    const avialableUtxo: any[] = [];
    let avialableValue = 0;
    for (let i = 0; i < _utxoList.length; i++) {
      const utxo = _utxoList[i];
      avialableUtxo.push(utxo);
      avialableValue += utxo.value;
      if (avialableValue >= value) {
        break;
      }
    }
    return {
      minUtxo: sortUtxos[0],
      maxUtxo: sortUtxos[sortUtxos.length - 1],
      utxos: avialableUtxo,
      total: avialableValue,
    };
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
    console.log(filterUtxosByValue(
      [
        {
          txid: 123123123,
          vout: 0,
          value: 10000,
        },
        {
          txid: 12123223,
          vout: 0,
          value: 100200,
        },
        {
          txid: 22222222,
          vout: 0,
          value: 1100,
        },
      ],
      600,
    ));
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
