import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'antd';
import { ROUTE_PATH } from '@/router';

export default function InscribeCheck() {
  const nav = useNavigate();
  const { t } = useTranslation();

  const toSplittedInscriptions = () => {
    nav(ROUTE_PATH.TOOLS_SPLITTED_INSCRIPTION);
  }

  const toUtxo = () => {
    nav(ROUTE_PATH.TOOLS_UTXO);
  }

  const toTransact = () => {
    nav(ROUTE_PATH.TOOLS_TRANSACT, { state: { initInputList: [], initOutputList: [] } });
  }

  return (
    <div className='flex gap-2 max-w-max mx-auto p-2'>
      {['ordx.space'].every((v) => location.hostname !== v) && (
        <Card title={t('pages.tools.splitted_inscription.title')} className='w-60 cursor-pointer' onClick={toSplittedInscriptions}>
        {t('pages.tools.splitted_inscription.des')}
      </Card>
      )}
      
      <Card title={t('pages.tools.utxo.title')} className='w-60 cursor-pointer' onClick={toUtxo}>
        {t('pages.tools.utxo.des')}
      </Card>

      {['ordx.space'].every((v) => location.hostname !== v) && (
      <Card title='Transaction' className='w-60 cursor-pointer' onClick={toTransact}>
        发送和拆分的工具。
      </Card>
       )}
    </div>
  );
}
