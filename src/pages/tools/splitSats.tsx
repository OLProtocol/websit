import { Input, Button, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUtxoByConditon } from '@/api';
import { useUnisatConnect, useUnisat } from '@/lib/hooks';
import { Address, Script } from '@cmdcode/tapscript';
import * as bitcoin from 'bitcoinjs-lib';

export default function SplitSats() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const [sat, setSat] = useState('');
  useEffect(() => {
    if (q) {
      setSat(q);
    }
  }, [q]);

  const { currentAccount, network, currentPublicKey } = useUnisatConnect();
  const [messageApi] = message.useMessage();
  const unisat = useUnisat();
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const addresToScriptPublicKey = (address: string) => {
    const scriptPublicKey = Script.fmt.toAsm(
      Address.toScriptPubKey(address),
    )?.[0];
    // const asmScript = Address.toScriptPubKey(currentAccount) as string[];
    // const scriptPubKey = bitcoin.script.fromASM(asmScript.join(' '));
    return scriptPublicKey;
  };

  const splitHandler = async () => {
    if (!currentAccount) {
      return;
    }
    setLoading(true);
    try {
      const data = await getUtxoByConditon({
        address: currentAccount,
        satNumber: Number(sat),
        network,
      });
      const { satIndexCondition = null, randomCondition = null } =
        data?.data || {};
      const utxos: any[] = [];
      let offset = 0;
      if (satIndexCondition) {
        utxos.push({
          txid: satIndexCondition.txid,
          vout: satIndexCondition.vout,
          value: satIndexCondition.value,
        });
        offset = satIndexCondition.offset;
      }
      if (randomCondition?.length) {
        randomCondition.forEach((v: any) => {
          utxos.push({
            txid: v.txid,
            vout: v.vout,
            value: v.value,
          });
        });
      }
      const btcUtxos = utxos.map((v) => {
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
      console.log(btcUtxos);
      const inputs: any[] = [
        {
          hash: btcUtxos[1].txid,
          index: btcUtxos[1].vout,
          witnessUtxo: {
            script: Buffer.from(btcUtxos[1].scriptPk, 'hex'),
            value: btcUtxos[1].satoshis,
          },
        },
        {
          hash: btcUtxos[0].txid,
          index: btcUtxos[0].vout,
          witnessUtxo: {
            script: Buffer.from(btcUtxos[0].scriptPk, 'hex'),
            value: btcUtxos[0].satoshis,
          },
        },
        {
          hash: btcUtxos[2].txid,
          index: btcUtxos[2].vout,
          witnessUtxo: {
            script: Buffer.from(btcUtxos[2].scriptPk, 'hex'),
            value: btcUtxos[2].satoshis,
          },
        },
      ];
      console.log(inputs);
      const psbtNetwork = bitcoin.networks.testnet;
      const psbt = new bitcoin.Psbt({
        network: psbtNetwork,
      });
      inputs.forEach((input) => {
        console.log(input);
        psbt.addInput(input);
      });
      const total = inputs.reduce((acc, cur) => {
        return acc + cur.witnessUtxo.value;
      }, 0);
      const fee = 280;
      const firstOutputValue = btcUtxos[1].satoshis + offset;
      const secondOutputValue = total - firstOutputValue - fee;
      psbt.addOutput({
        address: currentAccount,
        value: firstOutputValue,
      });
      psbt.addOutput({
        address: currentAccount,
        value: secondOutputValue,
      });
      const signed = await unisat.signPsbt(psbt.toHex());
      console.log(signed);
      const pushedTxId = await unisat.pushPsbt(signed);
      const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
        network: psbtNetwork,
      });
      console.log(pushedTxId);
      const txHex = signedToPsbt.extractTransaction().toHex();
      console.log(txHex);
      setTxId(pushedTxId);
      setLoading(false);
    } catch (error: any) {
      messageApi.error(error.message || 'Split failed');
      setLoading(false);
    }
  };
  return (
    <div className='max-w-xl mx-auto'>
      <div className='mb-2 py-2'>
        <Input
          allowClear
          placeholder='Sats'
          size='large'
          className='mb-2'
          value={sat}
          onChange={(e) => setSat(e.target.value)}
        />
        <Button
          type='primary'
          size='large'
          disabled={!sat}
          loading={loading}
          className='w-full'
          onClick={splitHandler}>
          Split
        </Button>
      </div>
      {txId && (
        <Card title='Split Sats Detail'>
          <div className='flex'>
            <span>Tx</span>
            <span>{txId}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
