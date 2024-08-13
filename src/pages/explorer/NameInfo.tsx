import { useParams } from 'react-router-dom';

import { useMemo } from 'react';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { CopyButton } from '@/components/CopyButton';
import { Button, Tag, Segmented, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNetwork } from '@/lib/wallet';
import { useNameInfoHook } from "@/hooks/NameInfo";
import { Table } from 'antd';

export default function NameInfo() {
  const { t } = useTranslation();
  const { name } = useParams();
  const nav = useNavigate();
  const network = useNetwork();
  const { value, isLoading } = useNameInfoHook({ name: name || '' });
  const detail = useMemo(() => value?.data, [value]);

  const getOrdinalLink = (inscriptionId: string) => {
    if (!inscriptionId) {
      return ''
    }
    if (network === 'testnet') {
      return `https://ord-testnet4.ordx.space/content/${inscriptionId}`;
    } else {
      return `https://ordinals.com/inscription/${inscriptionId}`;
    }
  }

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Inscription ID',
      dataIndex: 'inscriptionId',
      key: 'inscriptionId',
      render: (text) => (
        <a href={getOrdinalLink(text)} className='indent-2' target='_blank'>
          {text || '-'}
        </a>
      ),
    },
  ];

  const dataSource = detail?.kvs || [];

  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{name}</span>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-10 items-center'>
            <span> {t('common.overview')} </span>
          </div>
          <div className='p-4'>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.inscriptionId')}:</p>
              <a href={getOrdinalLink(detail?.inscriptionId || '')} className='indent-2' target='_blank'>
                {detail?.inscriptionId || '-'}
              </a>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.sat')}:</p>
              <p className=''>{detail?.sat}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.utxo')}:</p>
              <div className='flex item-center'>
                <span
                  className='text-blue-500 cursor-pointer mr-2'
                  onClick={() => nav(`/explorer/utxo/${detail?.utxo}`)}>
                  {detail?.utxo}
                </span>
                <CopyButton text={detail?.utxo || ''} tooltip='Copy Tick' />
              </div>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.holder')}:</p>
              <p className='indent-2'>{detail?.address}</p>
            </div>
          </div>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <Table columns={columns} dataSource={dataSource} rowKey="key" />
        </div>
        {/* <div className='border-[1px] border-gray-200 rounded-xl'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-14 items-center'>
            <Segmented
              options={[t('common.holders'), t('common.minted_history')]}
              block
              onChange={handleTabsChange}
              className='w-72'
            />
          </div>
        </div> */}
      </div>
    </Spin>
  );
}
