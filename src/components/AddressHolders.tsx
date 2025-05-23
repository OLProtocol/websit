import { Button, message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAddressUtxoList } from '@/swr';
import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { useCommonStore } from '@/store';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import {
  hideStr,
  filterUtxosByValue,
  buildTransaction,
  signAndPushPsbt,
} from '@/lib/utils';
import { CopyButton } from './CopyButton';
import { IndexerLayer } from '@/api/type';

interface HistoryProps {
  ticker: string;
  address: string;
  indexerLayer: IndexerLayer;
  onEmpty?: (b: boolean) => void;
  onTransfer?: () => void;
}
export const AddressHolders = ({
  ticker,
  address,
  indexerLayer,
  onEmpty,
  onTransfer,
}: HistoryProps) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { feeRate } = useCommonStore((state) => state);
  const { network, address: currentAccount, publicKey } = useReactWalletStore();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();

  // Reset pagination when ticker changes
  useEffect(() => {
    setStart(0);
  }, [ticker]);

  const { VITE_TESTNET_TIP_ADDRESS, VITE_MAIN_TIP_ADDRESS } = import.meta.env;
  const tipAddress = network === 'testnet' ? VITE_TESTNET_TIP_ADDRESS : VITE_MAIN_TIP_ADDRESS;

  let keyPrefix = "";
  switch (indexerLayer) {
    case IndexerLayer.Base:
      keyPrefix = 'base';
      break;
    case IndexerLayer.Satsnet:
      keyPrefix = 'satsnet';
      break;
  }
  const { data, isLoading, trigger } = useAddressUtxoList({ ticker, address, start, limit }, keyPrefix, indexerLayer);

  const [transferAddress, setTransferAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const transferHander = async () => {
    const inscriptionUtxo = selectItem.utxo;
    const inscriptionValue = selectItem.amount;
    const inscriptionTxid = inscriptionUtxo.split(':')[0];
    const inscriptionVout = inscriptionUtxo.split(':')[1];
    const firstUtxo = {
      txid: inscriptionTxid,
      vout: Number(inscriptionVout),
      value: Number(inscriptionValue),
    };
    try {
      const data = await indexer.utxo.getPlainUtxoList({address: currentAccount,value: 0, start: 0, limit: 1}, indexerLayer);
      const virtualFee = (148 * 10 + 34 * 10 + 10) * feeRate.value;
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length) {
        message.error(t('messages.no_enough_balance'));
        return;
      }
      const { utxos: filterConsumUtxos } = filterUtxosByValue(
        consumUtxos,
        virtualFee,
      );
      const utxos: any[] = [firstUtxo, ...filterConsumUtxos];
      const firstOutputValue = firstUtxo.value;
      const outputs = [
        {
          address: transferAddress,
          value: firstOutputValue,
        },
      ];
      const psbt = await buildTransaction({
        utxos: utxos,
        outputs,
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: publicKey,
      });
      await signAndPushPsbt(psbt);
      message.success(t('messages.transfer_success'));
      onTransfer?.();
    } catch (error: any) {
      console.error(error.message || 'Split failed');
      message.error(error.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };
  const toSplit = async (item: any) => {
    Modal.confirm({
      centered: true,
      content: t('messages.whether_continue_split'),
      okText: t('common.continue'),
      cancelText: t('common.cancel'),
      onOk() {
        splitHandler(item);
      },
    });
  };
  const splitHandler = async (item: any) => {
    setLoading(true);
    // const utxos = await getUtxo();
    const virtualFee = (148 * 10 + 34 * 10 + 10) * feeRate.value;
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
      message.warning(t('messages.no_enough_utxo'));
      setLoading(false);
      return;
    }
    try {
      const data = await indexer.utxo.getPlainUtxoList({ address: currentAccount, value: 0, start: 0, limit: 1 }, indexerLayer);
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length || consumUtxos.length < 2) {
        message.error(t('messages.no_available_utxo'));
        return;
      }
      const {
        utxos: filterConsumUtxos,
        minUtxo: serviceUtxo,
        total: avialableValue,
      } = filterUtxosByValue(consumUtxos, virtualFee + 330);
      if (serviceUtxo.value > 1000) {
        message.error(t('messages.no_available_utxo'));
        return;
      }

      const utxos: any[] = [serviceUtxo, splitUtxo, ...filterConsumUtxos];
      const serviceOutputValue = serviceUtxo.value + 1;
      const splitOutputValue = splitUtxo.value - 1;
      const outputs = [
        {
          address: tipAddress,
          value: serviceOutputValue,
        },
        {
          address: currentAccount,
          value: splitOutputValue,
        },
      ];
      const psbt = await buildTransaction({
        utxos: utxos,
        outputs,
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: publicKey,
      });
      console.log(psbt);
      await signAndPushPsbt(psbt);
      message.success(t('messages.split_success'));
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'Split failed');
    } finally {
      setLoading(false);
    }

  };
  const handleOk = async () => {
    if (!transferAddress) {
      message.error(t('messages.input_address'));
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

  const toInscriptionInfo = (inscriptionId) => {
    nav(`/explorer/inscription/${inscriptionId}`);
  };

  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'UTXO',
        dataIndex: 'utxo',
        key: 'utxo',
        width: 100,
        align: 'center',
        render: (t) => {
          return (
            <div className='flex item-center justify-center'>
              <span
                className='text-blue-500 cursor-pointer'
                onClick={() => nav(`/explorer/utxo/${t}`)}>
                {hideStr(t)}
              </span>
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
        render: (value) => {
          if (ticker === 'Runes' && value) {
            return new BigNumber(value).toFixed(4, BigNumber.ROUND_DOWN);
          }
          return value;
        },
      },
      {
        title: 'Asset Ranges',
        dataIndex: 'ranges',
        key: 'ranges',
        width: 300,
        align: 'center',
        render: (t) => {
          const ranges = t?.map((r: any, index: number) => (
            <div key={index}>
              <span>
                {r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`}
              </span>
            </div>
          ));
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

          const href =
            network === 'testnet'
              ? `https://testnet.ordinals.com/inscription/`
              : `https://ordinals.com/inscription/`;
          const inscriptionnums = t?.map((r: any, index: number) => (
            <div key={index}>
              <span
                className='text-blue-500 cursor-pointer'
                onClick={() => toInscriptionInfo(r.id)}>
                {hideStr(r.id)}
              </span>
              {/* {r.num === '9223372036854775807' ? (
                <span
                  className='text-blue-500 cursor-pointer'
                  onClick={() => toInscriptionInfo(r.id)}>
                  {hideStr(r.id)}
                </span>
              ) : (
                // <a className='text-blue-500 cursor-pointer'
                //   href={href + r.id}
                //   target='_blank'>
                //   {hideStr(r.id)}
                // </a>
                <span
                  className='text-blue-500 cursor-pointer'
                  onClick={() => toInscriptionInfo(r.id)}>
                  #{r.num}
                </span>
                // <a className='text-blue-500 cursor-pointer'
                //   href={href + r.num}
                //   target='_blank'>
                //   #{r.num}
                // </a>
              )} */}
            </div>
          ));
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
            <div className='flex justify-center'>
              <Button
                type='link'
                loading={loading}
                onClick={() => {
                  setSelectItem(record);
                  setIsModalOpen(true);
                }}>
                {t('buttons.send')}
              </Button>
              {/* <Button
                type='link'
                loading={loading}
                onClick={() => {
                  toSplit(record);
                }}>
                {t('buttons.split')}
              </Button> */}
            </div>
          );
        },
      });
    }
    return defaultColumn;
  }, []);

  // const [dataSource, setDataSource] = useState<any[]>();
  const generateData = () => {
    const details = data?.detail;
    const datas: any[] = [];
    if (details) {
      for (const detail of details) {
        let ranges: any[] = [];
        const inscriptionNums: any[] = [];
        const item = {
          key: detail.utxo,
          utxo: detail.utxo,
          amount: detail.amount,
          assetamount: detail.assetamount,
          ranges: ranges,
          inscriptionnums: inscriptionNums,
        };
        if (Array.isArray(detail.assets)) {
          detail.assets.forEach((assetInfo) => {
            ranges = item['ranges'].concat(assetInfo.ranges);
            inscriptionNums.push({
              num: assetInfo.inscriptionnum,
              id: assetInfo.inscriptionId,
            });
          });

          item['ranges'] = ranges;
          item['inscriptionnums'] = inscriptionNums;
        }
        datas.push(item);
      }
    }
    return datas;
  };
  // const dataSource = useMemo(() => data?.data?.detail || [], []);
  const dataSource = useMemo(() => {
    return generateData();
  }, [data]);
  const total = useMemo(() => data?.total || 10, [data]);
  const paginationChange = (page: number, pageSize: number) => {
    setStart((page - 1) * pageSize);
    console.log(page, pageSize);
  };

  const toInfo = () => {
    nav(`/explorer/${ticker}`);
  };

  useEffect(() => {
    onEmpty?.(dataSource !== undefined && dataSource.length === 0);
  }, [dataSource]);

  useEffect(() => {
    if (address && ticker) {
      trigger();
    }
    // console.log('data:', data)
  }, [address, ticker, network, start, limit]);

  return (
    <>
      {dataSource !== undefined && dataSource.length ? (
        <div className='rounded-2xl bg-gray-200 p-4'>
          <div className='mb-2'>
            <span className='text-orange-500'> {ticker}</span>
            <span className='text-gray-500'>, {t('common.holder')}: </span>
            <span>{address}</span>
          </div>
          <div className='flex items-center mb-2'>
            <Button className='mr-2' color='rgb(249 115 22)' onClick={toInfo}>
              {t('buttons.view')} {ticker}
            </Button>
          </div>
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1000 }}
            pagination={{
              position: ['bottomCenter'],
              defaultPageSize: 10,
              total: total,
              onChange: paginationChange,
              showSizeChanger: false,
            }}
          />
          <Modal
            title={t('common.send')}
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <Input
              placeholder={t('messages.input_address')}
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
