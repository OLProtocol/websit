import { useParams } from 'react-router-dom';
import { useRune, useRuneList, useTickerStatus } from '@/swr';
import { useEffect, useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { BlockAndTime } from '@/components/BlockAndTime';
import { InfoHolders } from './components/InfoHolders';
import { TickHistory } from './components/TickHistory';
import { generateMempoolUrl, genOrdServiceUrl, genOrdinalsUrl, getAssetTypeLabel } from '@/lib/utils';
import { Button, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import { useNetwork } from '@/lib/wallet';
import { CopyButton } from '@/components/CopyButton';

export default function RuneInfo() {
  const { t } = useTranslation();
  const { rune: assertName } = useParams();
  const { btcHeight } = useCommonStore((state) => state);
  const [tabText, setTabText] = useState(t('common.holders'));
  const nav = useNavigate();
  const network = useNetwork();

  const { VITE_ORDX_MINT_URL } = import.meta.env;

  const validAssertName = typeof assertName === 'string' ? assertName : '';
  const assertNameInfo = validAssertName.split(":", 3);
  const protocol = assertNameInfo[0];
  const type = assertNameInfo[1];
  const ticker = assertNameInfo[2];
  const { data: runeInfo, isLoading } = useRune({ Protocol: protocol, Type: type, Ticker: ticker });
  const getTimeStr = function(deployBlockTime) {
    const date = new Date(deployBlockTime * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ret = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    return ret
  }
  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{runeInfo?.displayname}</span>
        </div>
        <div className='border-[1px] border-gray-200 rounded-xl mb-4'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-10 items-center'>
            <span> {t('common.overview')} </span>
          </div>
          <div className='p-4'>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.id')}:</p>
              <p className=''>{runeInfo?.id}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.ticker')}:</p>
              <p className=''>{runeInfo?.name.Protocol}:{runeInfo?.name.Type}:{runeInfo?.name.Ticker}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.divisibility')}:</p>
              <p className=''>{runeInfo?.divisibility}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.deployHeight')}:</p>
              <p className=''>{runeInfo?.deployHeight}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.deployBlockTime')}:</p>
              <p className=''>{runeInfo ? getTimeStr(runeInfo.deployBlockTime): ""}</p>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.deployTx')}:</p>
              <div className='flex item-center'>
                <span
                  className='text-blue-500 cursor-pointer mr-2'
                  onClick={() => {
                    const url = generateMempoolUrl({network: network, path: `tx/${runeInfo?.deployTx}` });
                    window.open(url, '_blank');1
                  }}>
                  {runeInfo?.deployTx}
                </span>
                <CopyButton text={runeInfo?.deployTx || ''} tooltip='Copy Tick' />
              </div>
            </div>
            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.limit')}:</p>
              <p className=''>{runeInfo?.limit}</p>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.limit')}:</p>
              <p className=''>{runeInfo?.limit}</p>
            </div>


            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.n')}:</p>
              <p className=''>{runeInfo?.n}</p>
            </div>


            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.totalMinted')}:</p>
              <p className=''>{runeInfo?.totalMinted}</p>
            </div>


            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.mintTimes')}:</p>
              <p className=''>{runeInfo?.mintTimes}</p>
            </div>

            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.maxSupply')}:</p>
              <p className=''>{runeInfo?.maxSupply}</p>
            </div>


            <div className='mb-2'>
              <p className='text-gray-400'>{t('runes.holdersCount')}:</p>
              <p className=''>{runeInfo?.holdersCount}</p>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
