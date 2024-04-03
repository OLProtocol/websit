import { useMemo, useState } from 'react';
import { getUtxoByValue } from '@/api';
import { useUnisatConnect, useUnisat } from '@/lib/hooks';
import { Modal, Card, Button, Input, message } from 'antd';
import * as bitcoin from 'bitcoinjs-lib';
import { addressToScriptPublicKey } from '@/lib/utils';
import { useCommonStore } from '@/store';

const { Meta } = Card;

interface Props {
  item: any;
  onTransfer?: () => void;
}
const TickerContent = ({ content }: any) => {
  return (
    <div className='h-36 border-b border-gray-100 bg-gray-200'>
      <div className='w-full h-full flex justify-center items-center break-words break-all p-4'>
        <p>{content}</p>
      </div>
    </div>
  );
};
export const OrdxItem = ({ item, onTransfer }: Props) => {
  const { network, currentAccount, currentPublicKey } = useUnisatConnect();
  const unisat = useUnisat();
  const [transferAddress, setTransferAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { feeRate } = useCommonStore((state) => state);

  const { VITE_TESTNET_TIP_ADDRESS, VITE_MAIN_TIP_ADDRESS } = import.meta.env;
  const tipAddress =
    network === 'testnet' ? VITE_TESTNET_TIP_ADDRESS : VITE_MAIN_TIP_ADDRESS;

  const signAndPushPsbt = async (inputs, outputs) => {
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
    const signed = await unisat.signPsbt(psbt.toHex());
    console.log(signed);
    const pushedTxId = await unisat.pushPsbt(signed);
    return pushedTxId;
  };
  const firstUtxo = useMemo(() => {
    const inscriptionUtxo = item.utxo;
    const inscriptionValue = item.amount;
    const inscriptionTxid = inscriptionUtxo.split(':')[0];
    const inscriptionVout = inscriptionUtxo.split(':')[1];
    return {
      txid: inscriptionTxid,
      vout: Number(inscriptionVout),
      value: Number(inscriptionValue),
    };
  }, [item]);
  const transferHander = async () => {
    try {
      const data = await getUtxoByValue({
        address: currentAccount,
        value: 600,
        network,
      });
      console.log(firstUtxo);
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length) {
        message.error('余额不足');
        return;
      }
      const utxos: any[] = [firstUtxo, ...consumUtxos];
      const btcUtxos = utxos.map((v) => {
        return {
          txid: v.txid,
          vout: v.vout,
          satoshis: v.value,
          scriptPk: addressToScriptPublicKey(currentAccount),
          addressType: 2,
          inscriptions: [],
          pubkey: currentPublicKey,
          atomicals: [],
        };
      });
      const inputs: any[] = btcUtxos.map((v) => {
        return {
          hash: v.txid,
          index: v.vout,
          witnessUtxo: {
            script: Buffer.from(v.scriptPk, 'hex'),
            value: v.satoshis,
          },
        };
      });
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
      // const fee = 600;
      const realityFee = (160 * inputs.length + 34 * 3 + 10) * feeRate.value;

      const firstOutputValue = firstUtxo.value;
      const secondOutputValue = total - firstOutputValue - realityFee;
      const outputs = [
        {
          address: transferAddress,
          value: firstOutputValue,
        },
        {
          address: currentAccount,
          value: secondOutputValue,
        },
      ];
      await signAndPushPsbt(inputs, outputs);
      message.success('发送成功');
      onTransfer?.();
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Transfer failed');
      setLoading(false);
    }
  };

  const splitHandler = async () => {
    setLoading(true);
    // const utxos = await getUtxo();
    try {
      const data = await getUtxoByValue({
        address: currentAccount,
        value: 600,
        network,
      });
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length) {
        message.error('没有可用utxo，请先切割');
        return;
      }
      console.log(firstUtxo);
      console.log(consumUtxos);
      const utxos: any[] = [firstUtxo, ...consumUtxos];
      const btcUtxos = utxos.map((v) => {
        return {
          txid: v.txid,
          vout: v.vout,
          satoshis: v.value,
          scriptPk: addressToScriptPublicKey(currentAccount),
          addressType: 2,
          inscriptions: [],
          pubkey: currentPublicKey,
          atomicals: [],
        };
      });
      console.log(btcUtxos);
      const inputs: any[] = btcUtxos.map((v) => {
        return {
          hash: v.txid,
          index: v.vout,
          witnessUtxo: {
            script: Buffer.from(v.scriptPk, 'hex'),
            value: v.satoshis,
          },
        };
      });
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
      // const fee = 600;
      const realityFee = (160 * inputs.length + 34 * 3 + 10) * feeRate.value;
      const firstOutputValue = 330;
      const secondOutputValue = total - firstOutputValue - realityFee;
      const outputs = [
        {
          address: tipAddress,
          value: firstOutputValue,
        },
        {
          address: currentAccount,
          value: secondOutputValue,
        },
      ];
      // await signAndPushPsbt(inputs, outputs);
      // const signed = await unisat.signPsbt(psbt.toHex());
      // console.log(signed);
      // const pushedTxId = await unisat.pushPsbt(signed);
      // const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
      //   network: psbtNetwork,
      // });
      // console.log(pushedTxId);
      // const txHex = signedToPsbt.extractTransaction().toHex();
      // console.log(txHex);
      message.success('拆分成功');
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Split failed');
      setLoading(false);
    }
  };
  const handleOk = async () => {
    console.log(transferAddress);
    if (!transferAddress) {
      message.error('请输入地址');
      return;
    }
    await transferHander();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setLoading(false);
  };
  return (
    <div>
      <Card
        hoverable
        cover={
          <TickerContent
            content={JSON.stringify({
              p: 'ordx',
              op: 'mint',
              amount: item.assetamount,
              tick: item.ticker,
              amt: item.balance,
            })}
          />
        }
        actions={[
          <Button type='text' color='blue' loading={loading} onClick={() => setIsModalOpen(true)}>
            发送
          </Button>,
          <Button type='text' color='blue' loading={loading} onClick={splitHandler}>
            拆分
          </Button>,
        ]}>
      </Card>
      <Modal
        title='发送'
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input
          placeholder='请输入地址'
          value={transferAddress}
          onChange={(e) => setTransferAddress(e.target.value)}
        />
      </Modal>
    </div>
  );
};
