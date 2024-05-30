import { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Segmented } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOrdxStatusList, health } from '@/api';
import { useCommonStore } from '@/store';
import { BlockAndTime } from '@/components/BlockAndTime';
import { useNavigate } from 'react-router-dom';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { OrdxFullList } from './OrdxFullList';
import { OrdxNameList } from './OrdxNameList';
import { NftList } from '@/pages/account/components/NftList';
import { useTranslation } from 'react-i18next';
import { removeObjectEmptyValue } from '../../inscribe/utils';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { cacheData, getCachedData } from '@/lib/utils/cache';

interface DataType {
  tick: string;
  block: string;
  rarity: string;
}

export const OrdxList = () => {
  const { t } = useTranslation();
  const { network, address: currentAccount } = useReactWalletStore();
  const [type, setType] = useState('FT');
  const [ordxVersion, setOrdxVersion] = useState('');
  const segmentedList = ['FT', 'Name', 'Ord NFT'];
  const getOrdxVersion = async () => {
    const resp = await health({ network });
    if (resp.status === 'ok') {
      setOrdxVersion(resp.version);
    }
  };
  useEffect(() => {
    getOrdxVersion();
  }, [network]);
  return (
    // <div className='rounded-3xl p-4 mx-auto bg-gray-200'>
    <div className='flex flex-col max-w-7xl mx-auto mb-4'>
      <Card>
        <CardHeader
          className='text-center flex justify-between'
          w={'full'}
          pt={0}
          pb={0}>
          <SimpleGrid columns={2} spacing={10} w={'full'}>
            <Box
              h='20'
              display='flex'
              alignItems='center'
              justifyContent='left'>
              <Stack spacing={6} textAlign={'left'}>
                <Heading as='h4' size='md'>
                  {t('pages.explorer.list_title')}
                </Heading>
                <Heading as='h6' size='xs' textColor={'gray.500'}>
                  {t('pages.explorer.ordx_version')}: {ordxVersion}
                </Heading>
              </Stack>
            </Box>
            <Box
              h='20'
              display='flex'
              alignItems='center'
              justifyContent='right'>
              {/* <Button onClick={getAllOrdxs}>{t('buttons.fresh')}</Button> */}
            </Box>
          </SimpleGrid>
        </CardHeader>
        <CardBody>
          <div className='mb-4'>
            <Segmented
              options={segmentedList}
              onChange={(value) => {
                setType(value as string);
              }}
            />
          </div>
          {type === segmentedList[0] && <OrdxFullList />}
          {type === segmentedList[1] && <OrdxNameList />}
          {type === segmentedList[2] && <NftList />}
        </CardBody>
      </Card>
    </div>
  );
};
