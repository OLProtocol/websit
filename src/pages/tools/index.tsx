import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'antd';
import { ROUTE_PATH } from '@/router';

export default function InscribeCheck() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const toSplitSats = () => {
    nav(ROUTE_PATH.TOOLS_SPLIT_SATS);
  };
  const toSplittedInscriptions = () => {
    nav(ROUTE_PATH.TOOLS_SPLITTED_INSCRIPTION);
  }
  const toSearchRareSat = () => {
    nav('/tools/rare_sat');
  };

  return (
    <div className='flex gap-2 max-w-max mx-auto p-2'>
      <Card title={t('pages.split_sat.title')} className='w-60 cursor-pointer' onClick={toSplitSats}>
        {t('pages.split_sat.des')}
      </Card>
      <Card title={t('pages.splitted_inscription.title')} className='w-60 cursor-pointer' onClick={toSplittedInscriptions}>
        {t('pages.splitted_inscription.des')}
      </Card>
      <Card title={t('pages.rare_sat.title')} className='w-60 cursor-pointer' onClick={toSearchRareSat}>
        {t('pages.rare_sat.des')}
      </Card>
    </div>
  );
}
