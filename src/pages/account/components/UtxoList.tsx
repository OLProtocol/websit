import { Button, message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useUtxoByValue, getUtxoByValue } from '@/api';
import { Address, Script } from '@cmdcode/tapscript';
import { CopyButton } from '@/components/CopyButton';
import * as bitcoin from 'bitcoinjs-lib';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hideStr } from '@/lib/utils';

interface Ord2HistoryProps {
  address: string;
  tick: string;
  onEmpty?: (b: boolean) => void;
  onTransfer?: () => void;
}
export const UtxoList = ({ address, onEmpty, tick }: Ord2HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network, currentAccount, currentPublicKey } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();
  const { data, isLoading, trigger } = useUtxoByValue({
    address,
    network,
    value: 10,
  });
  const toInscriptionInfo = (inscriptionNumber) => {
    nav(`/explorer/inscription/${inscriptionNumber}`);
  };
  const unisat = useUnisat();
  const [transferAddress, setTransferAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const addresToScriptPublicKey = (address: string) => {
    const scriptPublicKey = Script.fmt.toAsm(
      Address.toScriptPubKey(address),
    )?.[0];
    // const asmScript = Address.toScriptPubKey(currentAccount) as string[];
    // const scriptPubKey = bitcoin.script.fromASM(asmScript.join(' '));
    return scriptPublicKey;
  };

  const signAndPushPsbt = async (inputs, outputs) => {
    const psbtNetwork = bitcoin.networks.testnet;
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

  const fastClick = async () => {
    setLoading(true);
    const fee = 400;
    const totalValue = dataSource.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    if (totalValue < 1530 + fee) {
      message.warning('utxo数量不足，无法切割');
      return;
    }
    const avialableUtxo: any[] = [];
    let avialableValue = 0;
    for (let i = 0; i < dataSource.length; i++) {
      const utxo = dataSource[i];
      avialableUtxo.push(utxo);
      avialableValue += utxo.value;
      if (avialableValue >= 1530 + fee) {
        break;
      }
    }
    try {
      const btcUtxos = avialableUtxo.map((v) => {
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
      const psbtNetwork = bitcoin.networks.testnet;
      const psbt = new bitcoin.Psbt({
        network: psbtNetwork,
      });
      inputs.forEach((input) => {
        psbt.addInput(input);
      });
      const total = inputs.reduce((acc, cur) => {
        return acc + cur.witnessUtxo.value;
      }, 0);
      const firstOutputValue = 600;
      const secondOutputValue = 600;
      const thirdOutputValue =
        total - firstOutputValue - secondOutputValue - fee;
      const outputs = [
        {
          address: currentAccount,
          value: firstOutputValue,
        },
        {
          address: currentAccount,
          value: secondOutputValue,
        },
        {
          address: currentAccount,
          value: thirdOutputValue,
        },
      ];
      console.log(inputs);
      console.log(outputs);
      await signAndPushPsbt(inputs, outputs);
      message.success('切割成功');
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Split failed');
      setLoading(false);
    }
  };
  const splitHandler = async (item: any) => {
    setLoading(true);
    const fee = 400;
    // const utxos = await getUtxo();
    if (item.value < 930 + fee) {
      message.warning('utxo数量不足，无法切割');
      return;
    }
    try {
      const inscriptionUtxo = item.utxo;
      const inscriptionValue = item.value;
      const inscriptionTxid = inscriptionUtxo.split(':')[0];
      const inscriptionVout = inscriptionUtxo.split(':')[1];
      const firstUtxo = {
        txid: inscriptionTxid,
        vout: Number(inscriptionVout),
        value: Number(inscriptionValue),
      };

      const utxos: any[] = [firstUtxo];
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
      const psbtNetwork = bitcoin.networks.testnet;
      const psbt = new bitcoin.Psbt({
        network: psbtNetwork,
      });
      inputs.forEach((input) => {
        psbt.addInput(input);
      });
      const total = inputs.reduce((acc, cur) => {
        return acc + cur.witnessUtxo.value;
      }, 0);
      const firstOutputValue = 600;
      const secondOutputValue = total - firstOutputValue - fee;
      const outputs = [
        {
          address: currentAccount,
          value: firstOutputValue,
        },
        {
          address: currentAccount,
          value: secondOutputValue,
        },
      ];
      await signAndPushPsbt(inputs, outputs);
      message.success('拆分成功');
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Split failed');
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'utxo',
        dataIndex: 'utxo',
        key: 'utxo',
        align: 'center',
        render: (t) => {
          const txid = t.replace(/:0$/m, '');
          const href =
            network === 'testnet'
              ? `https://mempool.space/testnet/tx/${txid}`
              : `https://mempool.space/tx/${txid}`;
          return (
            <div className='flex item-center justify-center'>
              <a
                className='text-blue-500 cursor-pointer mr-2'
                href={href}
                target='_blank'>
                {hideStr(t)}
              </a>
              <CopyButton text={t} tooltip='Copy Tick' />
            </div>
          );
        },
      },
      {
        title: 'Sats/BTC',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
      },
    ];
    if (address === currentAccount) {
      defaultColumn.push({
        title: '操作',
        align: 'center',
        render: (record) => {
          return (
            <div className='flex gap-2 justify-center'>
              <Button
                type='link'
                loading={loading}
                onClick={() => {
                  splitHandler(record);
                }}>
                切割
              </Button>
            </div>
          );
        },
      });
    }
    return defaultColumn;
  }, []);
  const dataSource = useMemo(
    () =>
      data?.data?.map((v) => ({
        ...v,
        utxo: `${v.txid}:${v.vout}`,
      })) || [],
    [data],
  );
  const total = useMemo(() => data?.data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };
  useEffect(() => {
    onEmpty?.(dataSource.length === 0);
  }, [dataSource]);
  useEffect(() => {
    if (address) {
      trigger();
    }
  }, [address, network, start, limit]);

  return (
    <div>
      <div className='rounded-2xl bg-gray-200 p-4'>
        <div className='mb-2'>
          <span className='text-orange-500'> {tick}</span>
          <span className='text-gray-500'>, {t('common.holder')}: </span>
          <span>{address}</span>
        </div>

        <div className='mb-4'>
          <Button onClick={fastClick}>快速切割生成2个600Utxo</Button>
        </div>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 800 }}
          pagination={{
            position: ['bottomCenter'],
            defaultPageSize: 100,
            total: total,
            onChange: paginationChange,
            showSizeChanger: false,
          }}
          // onRow={(record) => {
          //   return {
          //     onClick: () => clickHandler(record), // 点击行
          //   };
          // }}
        />
      </div>
    </div>
  );
};
