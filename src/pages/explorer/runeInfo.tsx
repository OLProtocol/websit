import { useParams } from 'react-router-dom';
import { useRune } from '@/swr';
import { useState, useMemo } from 'react';
import { Segmented } from 'antd';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';

import { TickHolders } from './components/tickHolders';
import { TickHistory } from './components/TickHistory';
import { generateMempoolUrl } from '@/lib/utils';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import { useNetwork } from '@/lib/wallet';
import { CopyButton } from '@/components/CopyButton';
import { NewAssetNameFromString } from '@/api/type';
import { TickMintHistory } from './components/tickMintHistory';


export default function RuneInfo() {
  const { t } = useTranslation();
  const params = useParams();
  const runeTicker = params.rune || '';
  const [tabText, setTabText] = useState(t('common.holders'));
  const network = useNetwork();
  
  const runeAssetName = useMemo(() => NewAssetNameFromString(runeTicker), [runeTicker]);
  const runeReq = runeAssetName ? { Protocol: runeAssetName.Protocol, Type: runeAssetName.Type, Ticker: runeAssetName.Ticker} : undefined;
  const { data: runeInfo, isLoading } = useRune(runeReq);

  const getTimeStr = function(deployBlockTime) {
    const date = new Date(deployBlockTime * 1000);
    const month = date.getMonth() + 1;
    const ret = `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    return ret
  }

  const handleTabsChange = (type: any) => {
    if (type !==  tabText) {
      setTabText(type);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <BtcHeightAlert />
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='flex justify-between mb-4 items-center'>
          <span className='text-orange-400 text-2xl '>{runeInfo?.name.Ticker}</span>
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
              <p className='text-gray-400'>runeId:</p>
              <p className=''>{runeInfo?.displayname}</p>
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
        <div className='border-[1px] border-gray-200 rounded-xl'>
          <div className='border-b-[1px] border-gray-200 flex justify-between px-4 h-14 items-center'>
            <Segmented
              // options={[t('common.holders'), t('common.minted_history')]}
              options={[t('common.holders')]}
              block
              onChange={handleTabsChange}
              className='w-72'
            />
          </div>
          {tabText === t('common.holders') &&
            runeInfo?.name.Ticker &&
            (
              <div className='p-4'>
                <TickHolders ticker={runeTicker} totalQuantity={runeInfo?.totalMinted} divisibility={runeInfo?.divisibility || 0} />
              </div>
            )}
          {tabText === t('common.minted_history') && runeInfo?.name.Ticker && (
            <div className='p-4'>
              <TickMintHistory ticker={runeTicker} />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}
