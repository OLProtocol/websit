import { useParams } from 'react-router-dom';
import {useGetUtxo } from '@/swr';
import { useState, useMemo } from 'react';
import { Divider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { UtxoContent } from '@/components/UtxoContent';
import { hideStr } from '@/lib/utils';
import { generateMempoolUrl, getAssetTypeLabel } from '@/lib/utils';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNetwork } from '@/lib/wallet';

export default function UtxoInfo() {
  const { t } = useTranslation();
  const { utxo } = useParams();
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const network = useNetwork();

  const { data: assetData, isLoading } = useGetUtxo({ utxo, network });

  const allAssetList = useMemo(() => {
    return assetData?.data?.detail;
  }, [assetData]);

  // console.log("allAssetList", allAssetList);
  const toInscriptionInfo = (inscriptionId) => {
    nav(`/explorer/inscription/${inscriptionId}`);
  };

  const txid = useMemo(() => {
    return utxo?.split(':')[0];
  }, [utxo]);

  const toTick = (tick) => {
    nav(`/explorer/${tick}`);
  };

  const toName = (name) => {
    nav(`/explorer/ns/${name}`);
  };

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
        title: t('common.asset_amount'),
        dataIndex: 'assetamount',
        key: 'assetamount',
        width: 60,
        align: 'center',
      },
      {
        title: t('common.asset_ranges'),
        dataIndex: 'ranges',
        key: 'ranges',
        width: 200,
        align: 'center',
        render: (t) => {
          const ranges = t?.map((r: any, index) => (
            <div key={index}>
              <span>
                {r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`}
              </span>
              {/* <span> - ({r.size} sats)</span> */}
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
        render: (t, record) => {
          return record.type !== 'e' /*|| record.type === 'n'*/ ? (
            <span
              className='text-blue-500 cursor-pointer'
              onClick={() => toInscriptionInfo(t)}>
              {hideStr(t)}
            </span>
          ) : (
            <span>_</span>
          );
        },
      },
      {
        title: t('common.content'),
        dataIndex: 'inscriptionId',
        key: 'inscriptionId',
        width: 100,
        align: 'center',
        render: (t, record) => {
          // console.log('record', record);
          switch (record.type) {
            case 'f':
              return (
                <UtxoContent
                  inscriptionId={t}
                  ranges={record.ranges}
                />);
            case 'o':
            case 'n':
              return (
                <UtxoContent
                  inscriptionId={t}
                  ranges={[]}
                />);
            case 'e':
              return '-';
            default:
              return '-';
          }
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
                {allAssetList?.utxo || '-'}
              </a>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.amount')}:</p>
              <span className='indent-2'>{allAssetList?.value || '-'}</span>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>Sat Ranges:</p>
              <div>
                {allAssetList?.ranges?.map((r: any, index: number) => (
                  <div key={index}>
                    <span>
                      {r.size === 1
                        ? r.start
                        : `${r.start}-${r.start + r.size - 1}`}
                    </span>
                    <span> - ({r.size} sats)</span>
                  </div>
                ))}
              </div>
            </div>

            {allAssetList?.assets?.map((asset: any, index: number) => (
              <div key={index}>
                <Divider plain></Divider>
                <div className='mb-2'>
                  <p className='text-gray-400'>{t('common.asset_type')}:</p>
                  <span className='indent-2'>{getAssetTypeLabel(asset?.type)}</span>
                </div>
                {asset?.type === 'f' && (
                  <div className='mb-2'>
                    <p className='text-gray-400'>{t('common.asset_name')}:</p>
                    <a
                      onClick={() => toTick(asset.ticker)}
                      className='indent-2'
                      target='_blank'
                      style={{ cursor: 'pointer' }}>
                      {asset.ticker}
                    </a>
                  </div>
                )}
                {asset?.type === 'n' && (
                  <div className='mb-2'>
                    <p className='text-gray-400'>{t('common.asset_name')}:</p>
                    <a
                      onClick={() => toName(asset.ticker)}
                      className='indent-2'
                      target='_blank'
                      style={{ cursor: 'pointer' }}>
                      {asset.ticker}
                    </a>
                  </div>
                )}

                <div className='mb-2'>
                  <p className='text-gray-400'>{t('common.asset_amount')}:</p>
                  <span className='indent-2'>{asset?.assetamount}</span>
                </div>
                <Table
                  bordered
                  columns={columns}
                  dataSource={asset?.assets?.map((a: any) => ({
                    ...a,
                    type: asset.type,
                    key: `${index}`,
                  }))}
                  scroll={{ x: 460 }}
                  pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 5,
                    total: asset?.assets?.length,
                    // onChange: paginationChange,
                    showSizeChanger: true,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
}
