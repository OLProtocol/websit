import { Button, message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useUtxoByValue, getUtxoByValue } from '@/api';
import { CopyButton } from '@/components/CopyButton';
import * as bitcoin from 'bitcoinjs-lib';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import {
  hideStr,
  filterUtxosByValue,
  addressToScriptPublicKey,
} from '@/lib/utils';
import { useCommonStore } from '@/store';

interface Ord2HistoryProps {
  address: string;
  tick: string;
  onEmpty?: (b: boolean) => void;
  onTransfer?: () => void;
  onTotalChange?: (total: number) => void;
}
export const UtxoList = ({ address, onEmpty, tick, onTransfer, onTotalChange }: Ord2HistoryProps) => {
  const { t } = useTranslation();
  const { network, currentAccount, currentPublicKey } = useUnisatConnect();
  const { feeRate } = useCommonStore((state) => state);
  const addressRef = useRef<any>();
  const publickkeyRef = useRef<any>();
  addressRef.current = currentAccount;
  publickkeyRef.current = currentPublicKey;
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();
  const { data, isLoading, trigger } = useUtxoByValue({
    address,
    network,
    value: 10,
  });
  // const toInscriptionInfo = (inscriptionNumber) => {
  //   nav(`/explorer/inscription/${inscriptionNumber}`);
  // };
  const unisat = useUnisat();
  const [transferAddress, setTransferAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const signed = await unisat.signPsbt(psbt.toHex());
    const pushedTxId = await unisat.pushPsbt(signed);
    return pushedTxId;
  };

  const fastClick = async () => {
    setLoading(true);
    const virtualFee = (160 * 10 + 34 * 10 + 10) * feeRate.value;
    const utxos = dataSource.filter((v) => v.value !== 600);
    const totalValue = utxos.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    if (totalValue < 1530 + virtualFee) {
      message.warning('utxo数量不足，无法切割');
      return;
    }

    const { utxos: avialableUtxo, total: avialableValue } = filterUtxosByValue(
      utxos,
      virtualFee + 330,
    );
    try {
      const btcUtxos = avialableUtxo.map((v) => {
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
      const psbtNetwork =
        network === 'testnet'
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
      const realityFee = (160 * inputs.length + 34 * 3 + 10) * feeRate.value;
      const firstOutputValue = 600;
      const secondOutputValue = 600;
      const thirdOutputValue =
        total - firstOutputValue - secondOutputValue - realityFee;
      console.log(realityFee);
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
      await signAndPushPsbt(inputs, outputs, network);
      message.success('切割成功');
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Split failed');
      setLoading(false);
    }
  };


  const handleOk = async () => {
    if (!transferAddress) {
      message.error('请输入地址');
      return;
    }
    await transferHander();
    setSelectItem(undefined);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  const transferHander = async () => {
    try {
      const inscriptionUtxo = selectItem.utxo;
      const inscriptionValue = selectItem.amount;
      const inscriptionTxid = inscriptionUtxo.split(':')[0];
      const inscriptionVout = inscriptionUtxo.split(':')[1];
      const firstUtxo = {
        txid: inscriptionTxid,
        vout: Number(inscriptionVout),
        value: Number(inscriptionValue),
      };
      const data = await getUtxoByValue({
        address: currentAccount,
        value: 600,
        network,
      });
      const virtualFee = (180 * 10 + 34 * 10 + 10) * feeRate.value;
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length) {
        message.error('余额不足');
        return;
      }
      const { utxos: filterConsumUtxos } = filterUtxosByValue(consumUtxos, virtualFee);
      const utxos: any[] = [firstUtxo, ...filterConsumUtxos];
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
      const realityFee = (180 * inputs.length + 34 * 2 + 10) * feeRate.value;
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
      await signAndPushPsbt(inputs, outputs, network);
      message.success('发送成功');
      onTransfer?.();
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Transfer failed');
      setLoading(false);
    }
  };

  const splitHandler = useCallback(
    async (item: any) => {
      setLoading(true);
      const virtualFee = (160 * 1 + 34 * 2 + 10) * feeRate.value;
      // const utxos = await getUtxo();
      if (item.value < 930 + virtualFee) {
        message.warning('utxo数量不足，无法切割');
        return;
      }
      console.log(network);
      console.log(currentAccount, currentPublicKey);
      // try {
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
          scriptPk: addressToScriptPublicKey(addressRef.current),
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
      const psbtNetwork =
        network === 'testnet'
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
      const realityFee = (160 * inputs.length + 34 * 2 + 10) * feeRate.value;
      const firstOutputValue = 600;
      const secondOutputValue = total - firstOutputValue - realityFee;
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
      await signAndPushPsbt(inputs, outputs, network);
      message.success('拆分成功');
      setLoading(false);
    },
    [currentAccount, currentPublicKey, network],
  );

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
                  setSelectItem(record);
                  setIsModalOpen(true);
                }}>
                {t('buttons.send')}
              </Button>
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
  const totalValue = useMemo(() => {
    return dataSource.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
  }, [dataSource]);
  const total = useMemo(() => data?.data?.total || 0, [data]);
  useEffect(() => {
    onTotalChange?.(totalValue);
  }, [totalValue]);
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
    </div>
  );
};
