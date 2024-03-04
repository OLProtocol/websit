import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Card, Input } from 'antd';
import { useState } from 'react';
import { getMintInfo } from '@/api';
import { ROUTE_PATH } from '@/router';

export default function InscribeCheck() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const toSplitSats = () => {
    nav(ROUTE_PATH.TOOLS_SPLIT_SATS);
  };
  const toSearchRareSat = () => {
    nav('/tools/rare_sat');
  };

  return (
    <div className='flex gap-2 max-w-xl mx-auto p-2'>
      <Card title='Split Sats' className='w-60' onClick={toSplitSats}>
        Split a range of sats into segments.
      </Card>
      <Card
        title={t('pages.rare_sat.title')}
        className='w-60 cursor-pointer'
        onClick={toSearchRareSat}>
        {t('pages.rare_sat.des')}
      </Card>
    </div>
  );
}
