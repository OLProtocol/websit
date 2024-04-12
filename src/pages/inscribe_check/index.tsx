import { useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Card, Input } from 'antd';
import { useState } from 'react';
import { getInscriptiontInfo } from '@/api';
import { useReactWalletStore } from 'btc-connect/dist/react';

const { Search } = Input;

export default function InscribeCheck() {
  const { state } = useLocation();
  const { t } = useTranslation();
  const [inscribId, setSearch] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [resultData, setResultData] = useState('');
  const { network } = useReactWalletStore();
  const toast = useToast();

  const doSearch = async () => {
    const data = await getInscriptiontInfo({
      inscribId: inscribId,
      network,
    });
    if (data.code === 0) {
      setResultMsg(
        t('pages.inscribe_check.success_result', {
          inscribeId: inscribId,
        }),
      );
      // setResultData(data.data);
    } else {
      setResultMsg(
        t('pages.inscribe_check.failed_result', {
          inscribeId: inscribId,
        }),
      );
      // setResultData('');
    }
  };

  return (
    <div>
      <BtcHeightAlert />
      <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
        <h1 className='text-lg font-bold text-orange-500 text-center mb-4'>
          {/* <h1 className='text-2xl text-orange-500 text-center mb-2'> */}
          {t('pages.inscribe_check.title')}
        </h1>
        <div>
          <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
            <Search
              allowClear
              placeholder={t('pages.inscribe_check.search_placeholder')}
              size='large'
              value={inscribId}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={doSearch}
            />
          </div>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='text-center'>
              <Card
                style={{ width: '100%' }}
                title={t('pages.inscribe_check.result')}>
                {resultMsg}
                {/* {resultData} */}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
