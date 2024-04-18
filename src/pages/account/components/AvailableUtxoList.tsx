import { message, Table, Modal, Input } from 'antd';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { getUtxoByValue } from '@/api';
import { CopyButton } from '@/components/CopyButton';
import * as bitcoin from 'bitcoinjs-lib';
import { useReactWalletStore } from 'btc-connect/dist/react';

import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import {
  hideStr,
  signAndPushPsbt,
  filterUtxosByValue,
  addressToScriptPublicKey,
  buildTransaction,
} from '@/lib/utils';
import { useCommonStore } from '@/store';
import { cacheData, getCachedData } from '@/lib/utils/cache';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface AvailableUtxoListProps {
  address: string;
  onEmpty?: (b: boolean) => void;
  onTransfer?: () => void;
  onTotalChange?: (total: number) => void;
}
export const AvailableUtxoList = ({
  address,
  onEmpty,
  onTransfer,
  onTotalChange,
}: AvailableUtxoListProps) => {
  const { t } = useTranslation();
  const { network, address: currentAccount, publicKey } = useReactWalletStore();
  const router = useNavigate();
  const { feeRate } = useCommonStore((state) => state);
  const addressRef = useRef<any>();
  const publickkeyRef = useRef<any>();
  addressRef.current = currentAccount;
  publickkeyRef.current = publicKey;
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectItem, setSelectItem] = useState<any>();

  // const { data, isLoading, trigger } = useUtxoByValue({
  //   address,
  //   network,
  //   value: 10,
  // });
  const toast = useToast();
  const [data, setData] = useState<any>();

  const [transferAddress, setTransferAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fastClick = async () => {
    setLoading(true);
    const virtualFee = (148 * 4 + 34 * 3 + 10) * feeRate.value;
    const utxos = dataSource.filter((v) => v.value !== 600);
    const totalValue = utxos.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    if (totalValue < 1530 + virtualFee) {
      message.warning('utxo数量不足，无法切割');
      setLoading(false);
      return;
    }

    const { utxos: avialableUtxo, total: avialableValue } = filterUtxosByValue(
      utxos,
      virtualFee + 546 + 600 * 2,
    );
    try {
      const firstOutputValue = 600;
      const secondOutputValue = 600;
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
      const psbt = await buildTransaction({
        utxos: avialableUtxo,
        outputs,
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: publicKey,
      });
      await signAndPushPsbt(psbt);
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
      const inscriptionValue = selectItem.value;
      const firstUtxo = {
        txid: selectItem.txid,
        vout: selectItem.vout,
        value: Number(inscriptionValue),
      };
      const data = await getUtxoByValue({
        address: currentAccount,
        // value: 600,
        value: 0,
        network,
      });
      const virtualFee = (148 * 4 + 34 * 3 + 10) * feeRate.value;
      const consumUtxos = data?.data || [];
      if (!consumUtxos.length) {
        message.error('余额不足');
        return;
      }
      const { utxos: filterConsumUtxos } = filterUtxosByValue(
        consumUtxos,
        virtualFee + 330,
      );
      const utxos: any[] = [firstUtxo, ...filterConsumUtxos];

      const firstOutputValue = firstUtxo.value;
      const outputs = [
        {
          address: transferAddress,
          value: firstOutputValue,
        },
      ];
      console.log(utxos);
      const psbt = await buildTransaction({
        utxos: utxos,
        outputs,
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: publicKey,
      });
      await signAndPushPsbt(psbt);
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
      const virtualFee = (148 * 1 + 34 * 2 + 10) * feeRate.value;
      // const utxos = await getUtxo();
      if (item.value < 930 + virtualFee) {
        message.warning('utxo数量不足，无法切割');
        setLoading(false);
        return;
      }
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

      const firstOutputValue = 600;
      const outputs = [
        {
          address: currentAccount,
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
      message.success('拆分成功');
      setLoading(false);
    },
    [currentAccount, publicKey, network],
  );

  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'UTXO',
        dataIndex: 'utxo',
        key: 'utxo',
        align: 'center',
        render: (t) => {
          // const txid = t.replace(/:0$/m, '');
          // const href =
          //   network === 'testnet'
          //     ? `https://mempool.space/testnet/tx/${txid}`
          //     : `https://mempool.space/tx/${txid}`;
          return (
            <div className='flex item-center justify-center'>
              <span
                className='text-blue-500 cursor-pointer mr-2'
                onClick={() => router(`/explorer/utxo/${t}`)}>
                {hideStr(t)}
              </span>
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
        title: 'Operations',
        align: 'center',
        render: (record) => {
          return (
            <div className='flex gap-2 justify-center'>
              <a
                className='text-blue-500 cursor-pointer mr-2'
                onClick={() => {
                  setSelectItem(record);
                  setIsModalOpen(true);
                }}>
                {t('buttons.send')}
              </a>
              <a
                className='text-blue-500 cursor-pointer mr-2'
                onClick={() => {
                  splitHandler(record);
                }}>
                {t('pages.account.cut')}
              </a>
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

  const getAvailableUtxos = async () => {
    setLoading(true);
    const resp = await getUtxoByValue({
      address,
      network,
      value: 0,
    });
    if (resp.code !== 0) {
      toast({
        title: resp.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setData(resp);
    cacheData('available_ordx_list_' + address, resp);
  };

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
      // trigger();
      const cachedData = getCachedData('available_ordx_list_' + address);
      if (cachedData === null) {
        getAvailableUtxos();
      } else {
        setData(cachedData);
      }

      // 设置定时器每隔一定时间清除缓存数据
      const intervalId = setInterval(() => {
        cacheData('available_ordx_list_' + address, null);
      }, 600000); // 每10min清除缓存
      return () => clearInterval(intervalId); // 清除定时器
    }
  }, [address, network, start, limit]);

  return (
    <Card>
      <CardHeader className='text-center flex justify-between'>
        <Tooltip label={t('pages.account.quick_cut_des')}>
          <Button
            bgColor={'white'}
            border='1px'
            borderColor='gray.400'
            size='sm'
            color='gray.600'
            onClick={fastClick}>
            {t('pages.account.quick_cut')}
          </Button>
        </Tooltip>
        <Button
          bgColor={'white'}
          border='1px'
          borderColor='gray.400'
          size='sm'
          color='gray.600'
          onClick={getAvailableUtxos}>
          {t('buttons.fresh')}
        </Button>
      </CardHeader>
      <CardBody>
        <Table
          bordered
          loading={loading}
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
        />
        <Modal
          title={t('buttons.send')}
          centered
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}>
          <Input
            placeholder={t('pages.account.tip_enter_address')}
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
          />
        </Modal>
      </CardBody>
    </Card>
  );
};
