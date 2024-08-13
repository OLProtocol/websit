import { useParams } from 'react-router-dom';
import { useNsName } from '@/api';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { CopyButton } from '@/components/CopyButton';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { generateMempoolUrl } from '@/lib/utils';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import { useNetwork } from '@/lib/wallet';

export default function Sat20NameInfo() {
  const { t } = useTranslation();
  const { name } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const network = useNetwork();
  const handleTabsChange = (type: any) => {
    if (type !== tabText) {
      setTabText(type);
    }
  };
  const { data, trigger, isLoading } = useNsName({ name, network });
  const detail = useMemo(() => data?.data || {}, [data]);

  const toInscribe = () => {
    console.log(detail);
    nav('/inscribe', {
      state: {
        type: 'ordx',
        item: {
          tick: detail.ticker,
          rarity: detail.rarity,
          limit: detail.limit,
        },
      },
    });
  };
  const ordinalLink = useMemo(() => {
    if (network === 'testnet') {
      return `https://testnet.ordinals.com/inscription/${detail?.inscriptionId}`;
    } else {
      return `https://ordinals.com/inscription/${detail?.inscriptionId}`;
    }
  }, [network, detail]);
  const txLink = useMemo(() => {
    const href = generateMempoolUrl({
      network,
      path: `tx/${detail?.txid}`,
    });
    return href;
  }, [network, detail]);
  useEffect(() => {
    if (name) {
      trigger();
    }
  }, [name, network]);
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
              <a href={ordinalLink} className='indent-2' target='_blank'>
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
                <CopyButton text={detail?.utxo} tooltip='Copy Tick' />
              </div>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('common.holder')}:</p>
              <p className='indent-2'>{detail?.address}</p>
            </div>
          </div>
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
