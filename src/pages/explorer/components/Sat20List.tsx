import { useState } from 'react';
import { Segmented } from 'antd';
import { Sat20FullList } from './Sat20FullList';
import { Sat20NameList } from './Sat20NameList';
import { OrdNftList } from './OrdNftList';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { useOrdxVersion } from '@/api';

export const Sat20List = () => {
  const { t } = useTranslation();

  const [type, setType] = useState('FT');
  const { version: ordxVersion } = useOrdxVersion();
  const segmentedList = ['FT', 'Name', 'NFT'];

  return (
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
          {type === segmentedList[0] && <Sat20FullList />}
          {type === segmentedList[1] && <Sat20NameList />}
          {type === segmentedList[2] && <OrdNftList />}
        </CardBody>
      </Card>
    </div>
  );
};
