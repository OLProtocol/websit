import { Button, message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useOrdxAddressHolders, getUtxoByValue } from '@/api';
import { Address, Script } from '@cmdcode/tapscript';
import * as bitcoin from 'bitcoinjs-lib';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { useCommonStore } from '@/store';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hideStr, filterUtxosByValue } from '@/lib/utils';
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
  const { feeRate } = useCommonStore((state) => state);
  const { network, currentAccount, currentPublicKey } = useUnisatConnect();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();

  const { VITE_TESTNET_TIP_ADDRESS, VITE_MAIN_TIP_ADDRESS } = import.meta.env;
  const tipAddress =
    network === 'testnet' ? VITE_TESTNET_TIP_ADDRESS : VITE_MAIN_TIP_ADDRESS;

  const { data, isLoading, trigger } = useOrdxAddressHolders({
    ticker: tick,
    address,
    network,
    start,
    limit,
  });
  
  // const toInscriptionInfo = (inscriptionNumber) => {
  //   nav(`/explorer/inscription/${inscriptionNumber}`);
  // };

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
  const toSplit = async (item: any) => {
    Modal.confirm({
      centered: true,
      content: `该工具仅用于ordx资产的拆分演示，会收取一个聪的ordx资产加上至少546个普通聪作为拆分费用支付给协议开发团队。请确认是否继续拆分？`,
      okText: '继续',
      cancelText: '取消',
      onOk() {
        splitHandler(item);
      },
    });
  }
  const splitHandler = async (item: any) => {
    setLoading(true);
    // const utxos = await getUtxo();
    try {
      const virtualFee = (180 * 10 + 34 * 10 + 10) * feeRate.value;
      const inscriptionUtxo = item.utxo;
      const inscriptionValue = item.amount;
      const inscriptionTxid = inscriptionUtxo.split(':')[0];
      const inscriptionVout = inscriptionUtxo.split(':')[1];
      const splitUtxo = {
        txid: inscriptionTxid,
        vout: Number(inscriptionVout),
        value: Number(inscriptionValue),
      };
      if (splitUtxo.value < 331) {
        message.warning('utxo数量不足，无法拆分！');
        setLoading(false);
        return;
      }
      const data = await getUtxoByValue({
        address: currentAccount,
        value: 500,
        network,
      });
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length || consumUtxos.length < 2) {
        message.error('没有可用utxo,请先进行切割！');
        return;
      }

      const { utxos: filterConsumUtxos, minUtxo: serviceUtxo, total: avialableValue } =
        filterUtxosByValue(consumUtxos, virtualFee + 330);
      if (serviceUtxo.value > 1000) {
        message.error('没有可用utxo,请先进行切割！');
        return;
      }

      const utxos: any[] = [serviceUtxo, splitUtxo, ...filterConsumUtxos];
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
      const realityFee = (180 * inputs.length + 34 * 3 + 10) * feeRate.value;
      const serviceOutputValue = serviceUtxo.value + 1;
      const splitOutputValue = splitUtxo.value - 1;
      const balanceOutputValue = avialableValue - realityFee;
      const outputs = [
        {
          address: tipAddress,
          value: serviceOutputValue,
        },
        {
          address: currentAccount,
          value: splitOutputValue,
        },
        {
          address: currentAccount,
          value: balanceOutputValue,
        },
      ];
      console.log(inputs, outputs);
      await signAndPushPsbt(inputs, outputs, network);
      message.success('拆分成功');
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
  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'utxo',
        dataIndex: 'utxo',
        key: 'utxo',
        width: 100,
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
                className='text-blue-500 cursor-pointer'
                href={href}
                target='_blank'>
                {hideStr(t)}
              </a>
              &nbsp;&nbsp;
              <CopyButton text={t} tooltip='Copy' />
            </div>
          );
        },
      },
      {
        title: 'Sats/BTC',
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        align: 'center',
      },
      {
        title: 'Assets',
        dataIndex: 'assetamount',
        key: 'assetamount',
        width: 100,
        align: 'center',
      },
      {
        title: 'Asset Ranges',
        dataIndex: 'ranges',
        key: 'ranges',
        width: 300,
        align: 'center',
        render: (t) => {
          const ranges = t?.map((r: any) =>
            <div>
              <span>
                {r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`}
              </span>
            </div>
          );
          return ranges;
        },
      },
      {
        title: t('common.inscribe'),
        dataIndex: 'inscriptionnums',
        key: 'inscriptionnums',
        width: 100,
        align: 'center',
        render: (t) => {
          let inscriptionnums : any
          const href = network === 'testnet'
              ? `https://testnet.ordinals.com/inscription/`
              : `https://ordinals.com/inscription/`;
          inscriptionnums = t?.map((r: any) => 
            <div>
              {r.num === 9223372036854775807 ? (
                // <span
                //   className='text-blue-500 cursor-pointer'
                //   onClick={() => toInscriptionInfo(r.id)}>
                //   #{hideStr(r.id)}
                // </span>
                <a className='text-blue-500 cursor-pointer'
                  href={href + r.id}
                  target='_blank'>
                  #{hideStr(r.id)}
                </a>
              ) : (
                // <span
                //   className='text-blue-500 cursor-pointer'
                //   onClick={() => toInscriptionInfo(r.num)}>
                //    #{r.num}
                // </span>
                <a className='text-blue-500 cursor-pointer'
                  href={href + r.num}
                  target='_blank'>
                  #{r.num}
                </a>
              )}
            </div>
            );
          return inscriptionnums;
        },
      },
    ];
    if (address === currentAccount) {
      defaultColumn.push({
        title: 'Operations',
        align: 'center',
        width: 100,
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
                  toSplit(record);
                }}>
                {t('buttons.split')}
              </Button>
            </div>
          );
        },
      });
    }
    return defaultColumn;
  }, []);
  
  // const [dataSource, setDataSource] = useState<any[]>();
  const generateData = () => {
    const details = data?.data?.detail
    let datas : any[] = []
    if(details){
      for (let detail of details){
        let ranges : any[] = []
        let inscriptionNums : any[] = []
        let item = {
          utxo: detail.utxo,
          amount: detail.amount,
          assetamount: detail.assetamount,
          ranges: ranges,
          inscriptionnums: inscriptionNums,
        }
        if (Array.isArray(detail.assets)) {
          detail.assets.forEach((assetInfo) => {
            ranges = item['ranges'].concat(assetInfo.ranges)
            inscriptionNums.push({
              num: assetInfo.inscriptionnum,
              id: assetInfo.inscriptionId
            })
          })
          
          item['ranges'] = ranges
          item['inscriptionnums'] = inscriptionNums
        }
        datas.push(item)
      }
      
    }
    return datas;
  }
  // const dataSource = useMemo(() => data?.data?.detail || [], []);
  const dataSource = useMemo(() => {
    return generateData();
  }, [data])

  const total = useMemo(() => data?.data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };
  const toInfo = () => {
    nav(`/explorer/${tick}`);
  };
  useEffect(() => {
    onEmpty?.(dataSource !== undefined && dataSource.length === 0);
  }, [dataSource]);
  useEffect(() => {
    if (address && tick) {
      trigger();
    }
  }, [address, tick, network, start, limit]);

  return (
    <>
      {(dataSource !== undefined && dataSource.length) ? (
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
