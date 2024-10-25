import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useToast,
  Card,
  CardHeader,
  CardBody,
  Input,
  InputGroup,
  InputRightAddon,
  Tooltip,
  Flex,
  ButtonGroup,
  IconButton,
  Button,
  Spacer,
  Image,
  Heading,
  Box,
  FormControl,
  InputLeftAddon,
} from '@chakra-ui/react';
import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useMap } from 'react-use';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { hideStr } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';
import { generateMempoolUrl } from '@/lib/utils';

export default function SearchSat() {
  const { t } = useTranslation();
  const toast = useToast();
  const [address, setAddress] = useState('');
  const [searchSatList, { set: setSearchSatList }] = useMap<any>({
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const { address: currentAccount, network, publicKey } = useReactWalletStore();
  const [satList, setSatList] = useState<any[]>();

  const columns: ColumnsType<any> = useMemo(() => {
    const defaultColumn: any[] = [
      {
        title: 'UTXO',
        dataIndex: 'utxo',
        key: 'utxo',
        align: 'center',
        render: (t) => {
          const txid = t.replace(/:0$/m, '');
          const href = generateMempoolUrl({
            network,
            path: `tx/${txid}`,
          });
          return (
            <div className='flex item-center justify-center'>
              <a
                className='text-blue-500 cursor-pointer mr-2'
                href={href}
                target='_blank'>
                {hideStr(t)}
              </a>
              <CopyButton text={t} tooltip='Copy Utxo' />
            </div>
          );
        },
      },
      {
        title: 'Sats/BTC',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
      },
      {
        title: 'Sat',
        dataIndex: 'specificsat',
        key: 'specificsat',
        align: 'center',
      },
      {
        title: 'Sat Ranges',
        dataIndex: 'sats',
        key: 'sats',
        width: 300,
        align: 'center',
        render: (t) => {
          const ranges = t?.map((r: any) => (
            <div>
              <span>
                {r.size === 1 ? r.start : `${r.start}-${r.start + r.size - 1}`}
              </span>
            </div>
          ));
          return ranges;
        },
      },
    ];
    return defaultColumn;
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      doSearch();
    }
  }

  const setSat = (itemId: number, sat: string) => {
    searchSatList.items[itemId - 1].sat = sat;
    setSearchSatList('items', searchSatList.items);
  };

  const addSat = () => {
    const newId = searchSatList.items.length + 1;
    const newItem = {
      id: newId,
      sat: '',
    };

    setSearchSatList('items', [...searchSatList.items, newItem]);
  };

  const removeSat = (itemId: number) => {
    if (searchSatList.items.length > 1) {
      const tmpItems = searchSatList.items.filter((item) => item.id !== itemId);
      tmpItems.forEach((item, index) => {
        item.id = index + 1;
      });
      setSearchSatList('items', tmpItems);
    }
  };

  const doSearch = async () => {
    setLoading(true);
    setSatList([]);
    const data = await indexer.sat.getSpecificSat({
      address: address,
      sats: searchSatList.items.map((item) => Number(item.sat)),
    });

    if (data.code !== 0) {
      setLoading(false);
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (data.data === null) {
      setLoading(false);
      toast({
        title: 'No data',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(false);
    setSatList(data.data);
  };

  useEffect(() => {
    setSearchSatList('items', [
      {
        id: 1,
        sat: '766947282572069',
      },
      {
        id: 2,
        sat: '623624999999999',
      },
      {
        id: 3,
        sat: '1832757499999999',
      },
    ]);
  }, [currentAccount]);

  return (
    <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
      <Card>
        <CardBody pt={0}>
          <FormControl>
            {searchSatList?.items.map((item) => (
              <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                <InputGroup>
                  <InputLeftAddon>Sat</InputLeftAddon>
                  <Input
                    key={item.id}
                    placeholder={t('pages.tools.sat.search_placeholder_sat')}
                    size='md'
                    value={item.sat}
                    onChange={(e) => setSat(item.id, e.target.value)}
                  />
                </InputGroup>
                <ButtonGroup w={'10%'} gap='1'>
                  <IconButton
                    size='sm'
                    mt={1}
                    onClick={addSat}
                    isRound={true}
                    variant='outline'
                    colorScheme='teal'
                    aria-label='Add'
                    icon={<AddIcon />}
                  />
                  <IconButton
                    size='sm'
                    mt={1}
                    onClick={() => removeSat(item.id)}
                    isRound={true}
                    variant='outline'
                    colorScheme='teal'
                    aria-label='Delete'
                    icon={<MinusIcon />}
                  />
                </ButtonGroup>
              </Flex>
            ))}
            <Flex key={Math.random()} whiteSpace={'nowrap'} gap={4} pt={2}>
              <InputGroup w={'100%'}>
                <InputLeftAddon>
                  {t('pages.tools.sat.btc_address')}
                </InputLeftAddon>
                <Input
                  placeholder={t('pages.tools.sat.search_placeholder_address')}
                  size='md'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <InputRightAddon onClick={() => setAddress(currentAccount)}>
                  <Tooltip label='Fill the BTC address of the current account'>
                    <AddIcon color='teal' />
                  </Tooltip>
                </InputRightAddon>
              </InputGroup>
            </Flex>
            <Flex gap={4} pt={2}>
              <Spacer />
              <Button
                colorScheme='teal'
                size='md'
                onKeyDown={handleKeyDown}
                isLoading={loading}
                onClick={doSearch}>
                Search
              </Button>
            </Flex>
          </FormControl>
          <Flex gap={4} pt={2}>
            <Card className='w-full'>
              <CardHeader>
                <Heading as='h2' size='sm'>
                  {t('pages.tools.sat.search_result')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Table
                  bordered
                  loading={loading}
                  columns={columns}
                  dataSource={satList}
                />
              </CardBody>
            </Card>
          </Flex>
        </CardBody>
      </Card>
    </div>
  );
}
