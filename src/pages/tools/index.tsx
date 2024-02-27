import { useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Card, Input } from 'antd';
import { useState } from 'react';
import { getMintInfo } from '@/api';

export default function InscribeCheck() {
  return (
    <div className='flex gap-2 max-w-xl mx-auto p-2'>
      <Card title='Split Sats' className='w-60'>Split a range of sats into segments.</Card>
    </div>
  );
}
