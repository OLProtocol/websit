import { useParams } from 'react-router-dom';
import {
  useGetAssetByUtxo,
  getOrdxInfo,
  getInscriptiontInfo,
  useGetUtxo,
} from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Divider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { UtxoContent } from '@/components/UtxoContent';
import { hideStr } from '@/lib/utils';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { generateMempoolUrl } from '@/lib/utils';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';

export default function UtxoInfo() {
  const { t } = useTranslation();
  const { utxo } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const { network } = useReactWalletStore();
  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { data: assetData, isLoading } = useGetUtxo({ utxo, network });
  const detail = useMemo(() => {
    return assetData?.data?.detail || {};
  }, [assetData]);
  const assets = useMemo(() => {
    return detail?.assets || [];
  }, [detail]);

  const toInscriptionInfo = (inscriptionId) => {
    nav(`/explorer/inscription/${inscriptionId}`);
  };

  const txid = useMemo(() => {
    return utxo?.split(':')[0];
  }, [utxo]);

  const toTick = (tick) => {
    nav(`/explorer/${tick}`);
  }

  const txLink = useMemo(() => {
    const href = generateMempoolUrl({
      network,
      path: `tx/${txid}`,
    });
    return href;
  }, [network, txid]);
  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'Assets',
        dataIndex: 'assetamount',
        key: 'assetamount',
        width: 60,
        align: 'center',
      },
      {
        title: 'Asset Ranges',
        dataIndex: 'ranges',
        key: 'ranges',
        width: 200,
        align: 'center',
        render: (t) => {
          const ranges = t?.map((r: any) => (
            <div>
              <span>
                {r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`}
              </span>
            </div>
          ));
          return ranges;
        },
      },
      {
        title: t('common.inscriptionId'),
        dataIndex: 'inscriptionId',
        key: 'inscriptionId',
        width: 100,
        align: 'center',
        render: (t) => {
          return (
            <span
              className='text-blue-500 cursor-pointer'
              onClick={() => toInscriptionInfo(t)}>
              {hideStr(t)}
            </span>
          );
        },
      },
      {
        title: t('common.content'),
        dataIndex: 'inscriptionId',
        key: 'inscriptionId',
        width: 100,
        align: 'center',
        render: (t) => {
          return <UtxoContent inscriptionId={t} utxo={utxo} />;
        },
      },
    ];
    return defaultColumn;
  }, []);
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='p-4'>
            <div className='mb-2'>
              <p className='text-gray-400'>utxo:</p>
              <a href={txLink} className='indent-2' target='_blank'>
                {utxo || '-'}
              </a>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.amount')}:</p>
              <span className='indent-2'>{detail?.value || '-'}</span>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Sat Ranges:</p>
              <div>
                {detail.ranges?.map((r: any) => (
                  <div>
                    <span>
                      {r.size === 1
                        ? r.start
                        : `${r.start}-${r.start + r.size - 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {assets?.map((asset: any) => (
              <div>
                <Divider plain></Divider>
                <div className='mb-2'>
                  <p className='text-gray-400'>{t('common.tick')}:</p>
                  <a onClick={() => toTick(asset?.ticker)} className='indent-2' target='_blank'>
                    {asset?.ticker || '-'}
                  </a>
                </div>
                <div className='mb-2'>
                  <p className='text-gray-400'>{t('common.asset_amount')}:</p>
                  <span className='indent-2'>{asset?.assetamount}</span>
                </div>
                <Table
                  pagination={false}
                  bordered
                  columns={columns}
                  dataSource={asset.assets}
                  scroll={{ x: 460 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
}
