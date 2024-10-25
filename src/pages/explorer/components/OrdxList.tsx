import { useState } from 'react';
import { Segmented } from 'antd';
import { FullList } from './FullList';
import { NameList } from './NameList';
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
import { useIndexHealth } from '@/swr';

export const OrdxList = () => {
  const { t } = useTranslation();

  const [type, setType] = useState('FT');
  const { data } = useIndexHealth();
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
                  {t('pages.explorer.ordx_version')}: {data?.version}
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
          {type === segmentedList[0] && <FullList />}
          {type === segmentedList[1] && <NameList />}
          {type === segmentedList[2] && <OrdNftList />}
        </CardBody>
      </Card>
    </div>
  );
};
