import { Button, message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useOrdxAddressHolders, getUtxoByValue } from '@/api';
import { Address, Script } from '@cmdcode/tapscript';
import * as bitcoin from 'bitcoinjs-lib';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { hideStr } from '@/lib/utils';
import { CopyButton } from './CopyButton';

interface Ord2HistoryProps {
  tick: string;
  address: string;
  onEmpty?: (b: boolean) => void;
  onTransfer?: () => void;
}
export const OrdxAddressHolders = ({
  tick,
  address,
  onEmpty,
  onTransfer,
}: Ord2HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { network, currentAccount, currentPublicKey } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();
  const { data, isLoading, trigger } = useOrdxAddressHolders({
    ticker: tick,
    address,
    network,
    start,
    limit,
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
      const fee = 280;
      const firstOutputValue = firstUtxo.value;
      const secondOutputValue = total - firstOutputValue - fee;
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
  const splitHandler = async (item: any) => {
    setLoading(true);
    // const utxos = await getUtxo();
    try {
      const inscriptionUtxo = item.utxo;
      const inscriptionValue = item.amount;
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
          scriptPk: addresToScriptPublicKey(currentAccount),
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
      const fee = 280;
      const firstOutputValue = 330;
      const secondOutputValue = total - firstOutputValue - fee;
      const outputs = [
        {
          address:
            'tb1pttjr9292tea2nr28ca9zswgdhz0dasnz6n3v58mtg9cyf9wqr49sv8zjep',
          value: firstOutputValue,
        },
        {
          address: currentAccount,
          value: secondOutputValue,
        },
      ];
      await signAndPushPsbt(inputs, outputs);
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
    setSelectItem(undefined);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setLoading(false);
  };
  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'utxo',
        dataIndex: 'utxo',
        key: 'utxo',
        width: 130,
        align: 'center',
        render: (t) => {
          const txid = t.replace(/:0$/m, '');
          const href =
            network === 'testnet'
              ? `https://mempool.space/testnet/tx/${txid}`
              : `https://mempool.space/tx/${txid}`;
          return (
            <div className='flex'>
            <a className='text-blue-500 cursor-pointer' href={href} target='_blank'>
              {hideStr(t)}
            </a>&nbsp;&nbsp;
            <CopyButton text={t} tooltip='Copy Tick' />
            </div>
          );
        },
      },
      {
        title: 'Sats/BTC',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        align: 'center',
      },
      {
        title: 'Assets',
        dataIndex: 'assetamount',
        key: 'assetamount',
        width: 130,
        align: 'center',
      },
      {
        title: 'Asset Ranges',
        dataIndex: 'ranges',
        key: 'ranges',
        width: 120,
        align: 'center',
        render: (t) => {
          const ranges = t.map((r: any) =>
            r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`,
          );
          return ranges.join(', ');
        },
      },
      {
        title: t('common.inscriptionNumber'),
        dataIndex: 'inscriptionnum',
        key: 'inscriptionnum',
        width: 100,
        align: 'center',
        render: (t) => {
          // const href =
          //   network === 'testnet'
          //     ? `https://testnet.ordinals.com/inscription/${t}`
          //     : `https://ordinals.com/inscription/${t}`;
          return (
            <span
              className='text-blue-500 cursor-pointer'
              onClick={() => toInscriptionInfo(t)}>
              #{t}
            </span>
          );
        },
      },
    ];
    if (address === currentAccount) {
      defaultColumn.push({
        title: 'Operations',
        align: 'center',
        width: 100,
        render: (record) => {
          console.log(record);
          return (
            <div className='flex gap-2'>
              <Button
                type='link'
                loading={loading}
                onClick={() => {
                  setSelectItem(record);
                  setIsModalOpen(true);
                }}>
                发送
              </Button>
              <Button
                type='link'
                loading={loading}
                onClick={() => {
                  splitHandler(record);
                }}>
                拆分
              </Button>
            </div>
          );
        },
      });
    }
    return defaultColumn;
  }, []);
  const dataSource = useMemo(() => data?.data?.detail || [], [data]);
  const total = useMemo(() => data?.data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };
  const toInfo = () => {
    nav(`/explorer/${tick}`);
  };
  useEffect(() => {
    onEmpty?.(dataSource.length === 0);
  }, [dataSource]);
  useEffect(() => {
    console.log(address, tick);
    if (address && tick) {
      trigger();
    }
  }, [address, tick, network, start, limit]);

  return (
    <>
      {dataSource.length ? (
        <div className='rounded-2xl bg-gray-200 p-4'>
          <div className='mb-2'>
            <span className='text-orange-500'> {tick}</span>
            <span className='text-gray-500'>, {t('common.holder')}: </span>
            <span>{address}</span>
          </div>
          <div className='flex items-center mb-2'>
            <Button className='mr-2' color='rgb(249 115 22)' onClick={toInfo}>
              {t('buttons.view')} {tick}
            </Button>
          </div>
          {/* <Segmented
      options={[
        'all',
        'inscribe-mint',
        'inscribe-transfer',
        'send',
        'receive',
      ]}
      block
    /> */}
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1100 }}
            pagination={{
              position: ['bottomCenter'],
              defaultPageSize: 10,
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
      ) : (
        <div></div>
      )}
    </>
  );
};
