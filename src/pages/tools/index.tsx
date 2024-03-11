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
  const toSearchUtxo = () => {
    nav(ROUTE_PATH.TOOLS_UTXO_ASSET);
  };

  return (
    <div className='flex gap-2 max-w-max mx-auto p-2'>
      <Card title={t('pages.tools.split_sat.title')} className='w-60 cursor-pointer' onClick={toSplitSats}>
        {t('pages.tools.split_sat.des')}
      </Card>
      <Card title={t('pages.tools.splitted_inscription.title')} className='w-60 cursor-pointer' onClick={toSplittedInscriptions}>
        {t('pages.tools.splitted_inscription.des')}
      </Card>
      <Card title={t('pages.tools.utxo.title')} className='w-60 cursor-pointer' onClick={toSearchUtxo}>
        {t('pages.tools.utxo.des')}
      </Card>
      {/* <Card title='分离UTXO' className='w-60 cursor-pointer'>
        标注UTXO中的特殊聪位置和资产位置都标注出来。由用户决定切割方案并进行切割。
      </Card> */}
    </div>
  );
}
