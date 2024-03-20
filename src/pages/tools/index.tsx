import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, message } from 'antd';
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
  // const toSearchUtxo = () => {
  //   nav(ROUTE_PATH.TOOLS_UTXO_ASSET);
  // };

  // const toGetUtxo = () => {
  //   nav(ROUTE_PATH.TOOLS_GET_UTXO);
  // }
  const toUtxo = () => {
    nav(ROUTE_PATH.TOOLS_UTXO);
  }

  const toSplitUtxo = () => {
    message.success('Coming soon!');
  }

  const toTransact = () => {
    nav(ROUTE_PATH.TOOLS_TRANSACT);
  }
  
  return (
    <div className='flex gap-2 max-w-max mx-auto p-2'>
      <Card title={t('pages.tools.split_sat.title')} className='w-60 cursor-pointer' onClick={toSplitSats}>
        {t('pages.tools.split_sat.des')}
      </Card>
      <Card title={t('pages.tools.splitted_inscription.title')} className='w-60 cursor-pointer' onClick={toSplittedInscriptions}>
        {t('pages.tools.splitted_inscription.des')}
      </Card>
      <Card title={t('pages.tools.utxo.title')} className='w-60 cursor-pointer' onClick={toUtxo}>
        {t('pages.tools.utxo.des')}
      </Card>
      {/* <Card title={t('pages.tools.utxo.title')} className='w-60 cursor-pointer' onClick={toSearchUtxo}>
        {t('pages.tools.utxo.des')}
      </Card>
      <Card title='查询UTXO' className='w-60 cursor-pointer' onClick={toGetUtxo}>
        查询utxo中的所有sat。
      </Card> */}
      <Card title='分离UTXO' className='w-60 cursor-pointer' onClick={toSplitUtxo}>
        标注UTXO中的特殊聪位置和资产位置，由用户决定切割方案并进行切割。
      </Card>
      <Card title='Transaction' className='w-60 cursor-pointer' onClick={toTransact}>
        发送和拆分的工具。
      </Card>
    </div>
  );
}
