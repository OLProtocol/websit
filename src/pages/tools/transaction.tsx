import {
  getOrdxSummary,
  getUtxoByValue,
  getOrdxAddressHolders,
  getSats,
} from '@/api';
import { useUnisat, useUnisatConnect } from '@/lib/hooks';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import { Tooltip, message, Select as AntSelect } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/store';
import {
  buildTransaction,
  calcNetworkFee,
  signAndPushPsbt,
} from '@/lib/utils/btc';
import { hideStr } from '@/lib/utils';

export default function Transaction() {
  const { t } = useTranslation();
  const { feeRate } = useCommonStore((state) => state);
  const [fee, setFee] = useState(0);

  const [inputList, { set: setInputList }] = useMap<any>({
    items: [
      {
        id: 1,
        value: {
          ticker: '',
          utxo: '',
          sats: 0,
          unit: 'sats',
        },
        options: {
          tickers: [],
          utxos: [],
        },
      },
    ],
  });

  const [outputList, { set: setOutputList }] = useMap<any>({
    items: [
      {
        id: 1,
        value: {
          sats: 0,
          unit: 'sats',
          address: '',
        },
      },
    ],
  });

  const [balance, { set: setBalance }] = useMap<any>({
    sats: 0,
    unit: 'sats',
  });

  const { currentAccount, network, currentPublicKey } = useUnisatConnect();
  const [tickerList, setTickerList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const unisat = useUnisat();
  const toast = useToast();

  const addInputItem = () => {
    const tickers = tickerList?.map((item) => item.ticker) || [];

    const newId = inputList.items.length + 1;
    const newItem = {
      id: newId,
      value: {
        ticker: '',
        utxo: '',
        sats: 0,
        unit: 'sats',
      },
      options: {
        tickers: tickers,
        utxos: [],
      },
    };

    setInputList('items', [...inputList.items, newItem]);
  };

  const removeInputItem = (id: number) => {
    if (inputList.items.length > 1) {
      const tmpItems = inputList.items.filter((item) => item.id !== id);
      tmpItems.forEach((item, index) => {
        item.id = index + 1;
      });
      setInputList('items', tmpItems);
    }
  };

  const addOuputItem = () => {
    const newId = outputList.items.length + 1;
    const newItem = {
      id: newId,
      value: {
        sats: 0,
        unit: 'sats',
        address: '',
      },
    };

    setOutputList('items', [...outputList.items, newItem]);
  };

  const removeOutputItem = (id: number) => {
    if (outputList.items.length > 1) {
      const tmpItems = outputList.items.filter((item) => item.id !== id);
      tmpItems.forEach((item, index) => {
        item.id = index + 1;
      });
      setOutputList('items', tmpItems);
    }
  };

  const handleTickerSelectChange = (itemId, ticker) => {
    inputList.items[itemId - 1].value.ticker = ticker;
    inputList.items[itemId - 1].value.sats = 0;
    inputList.items[itemId - 1].value.unit = 'sats';
    inputList.items[itemId - 1].value.utxo = '';
    inputList.items[itemId - 1].value.utxos = [];
    const selectTicker =
      tickerList?.find((item) => item.ticker === ticker) || [];
    let utxos = selectTicker.utxos;
    if (inputList.items.length > 1) {
      inputList.items.forEach((inItem, index) => {
        if (index !== itemId - 1) {
          utxos = utxos.filter(
            (utxo) => utxo.txid + ':' + utxo.vout !== inItem.value.utxo,
          );
          utxos = [...new Set(utxos)];
        }
      });
    }

    // inputList.items[itemId - 1].options.utxos = selectTicker.utxos.map((utxo) => ({ txid: utxo.txid, vout: utxo.vout, value: utxo.value })) || inputList.items[itemId - 1].options.utxos.filter((utxo) => utxo.txid + ':' + utxo.vout !== inputList.items[itemId - 1].value.utxo) || [];
    inputList.items[itemId - 1].options.utxos = utxos;
    console.log(inputList.items[itemId - 1].options.utxos);
    setInputList('items', inputList.items);
  };

  const handleUtxoSelectChange = (itemId, utxo) => {
    console.log(itemId, utxo);
    const txid = utxo.split(':')[0];
    const vout = Number(utxo.split(':')[1]);
    inputList.items[itemId - 1].value.sats =
      inputList.items[itemId - 1].options.utxos.find(
        (item) => item.txid === txid && item.vout === vout,
      )?.value || 0;
    inputList.items[itemId - 1].value.utxo = utxo;
    setInputList('items', inputList.items);
    calculateBalance();
  };

  const setBtcAddress = (itemId: number, address: string) => {
    outputList.items[itemId - 1].value.address = address;
    setOutputList('items', outputList.items);
  };

  const handleInputUnitSelectChange = (itemId: number, unit: string) => {
    inputList.items[itemId - 1].value.unit = unit;
    setInputList('items', inputList.items);
  };

  const handleOutputUnitSelectChange = (itemId: number, unit: string) => {
    inputList.items[itemId - 1].value.unit = unit;
    setInputList('items', inputList.items);
  };

  const handleBalanceUnitSelectChange = (unit: string) => {
    setBalance('unit', unit);
  };

  const calculateBalance = async () => {
    let inTotal = 0;
    let outTotal = 0;
    inputList.items.map((v) => {
      inTotal += v.value.sats;
    });
    if (inTotal === 0) {
      return;
    }

    outputList.items.map((v) => {
      outTotal += v.value.sats;
    });
    if (outTotal === 0) {
      return;
    }

    // const realityFee = calculateRate(
    //   inputList.items.length,
    //   outputList.items.length,
    //   feeRate.value,
    // );
    const utxos = inputList.items.map((v) => {
      return {
        txid: v.value.utxo.split(':')[0],
        vout: Number(v.value.utxo.split(':')[1]),
        value: v.value.sats,
      };
    });
    const fee = await calcNetworkFee({
      utxos,
      outputs: outputList.items.map((v) => ({
        address: v.value.address,
        value: v.value.sats,
      })),
      feeRate: feeRate.value,
      network,
      address: currentAccount,
      publicKey: currentPublicKey,
    });
    setFee(fee);
    setBalance('sats', inTotal - outTotal - fee);
  };

  const setOutputSats = (itemId: number, sats: string) => {
    const unit = outputList.items[itemId - 1].value.unit;
    if (unit === 'sats') {
      outputList.items[itemId - 1].value.sats = Number(sats);
    } else {
      outputList.items[itemId - 1].value.sats = Number(sats) * 100000000;
    }

    setOutputList('items', outputList.items);
  };

  const outputSatsOnBlur = (e) => {
    console.log(e);
    calculateBalance();
  };

  const splitHandler = async () => {
    if (!currentAccount) {
      return;
    }
    setLoading(true);

    try {
      const inTotal = inputList.items.reduce((acc, cur) => {
        return acc + cur.value.sats;
      }, 0);
      const outTotal = outputList.items.reduce((acc, cur) => {
        return acc + cur.value.sats;
      }, 0);
      const utxos = inputList.items.map((v) => {
        return {
          txid: v.value.utxo.split(':')[0],
          vout: Number(v.value.utxo.split(':')[1]),
          value: v.value.sats,
        };
      });
      // inputList.items.map((v) => {
      //   inTotal += v.value.sats;

      //   psbt.addInput({
      //     hash: v.value.utxo.split(':')[0],
      //     index: Number(v.value.utxo.split(':')[1]),
      //     witnessUtxo: {
      //       script: Buffer.from(addressToScriptPublicKey(currentAccount), 'hex'),
      //       value: v.value.sats,
      //     },
      //   })
      // })

      // outputList.items.map((v) => {
      //   outTotal += v.value.sats;
      //   psbt.addOutput({
      //     address: v.value.address,
      //     value: v.value.sats,
      //   })
      // })

      // const realityFee = calculateRate(inputList.items.length, outputList.items.length, feeRate.value);
      const fee = await calcNetworkFee({
        utxos,
        outputs: outputList.items.map((v) => ({
          address: v.value.address,
          value: v.value.sats,
        })),
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: currentPublicKey,
      });
      if (inTotal - outTotal - fee < 0) {
        setLoading(false);
        toast({
          title: 'Not enough sats',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // if (inTotal - outTotal - realityFee > 0) {
      //   psbt.addOutput({
      //     address: currentAccount,
      //     value: inTotal - outTotal - realityFee,
      //   })
      // }
      const psbt = await buildTransaction({
        utxos,
        outputs: outputList.items.map((v) => ({
          address: v.value.address,
          value: v.value.sats,
        })),
        feeRate: feeRate.value,
        network,
        address: currentAccount,
        publicKey: currentPublicKey,
      });
      await signAndPushPsbt(psbt);
      setLoading(false);
      toast({
        title: 'Split & Send success',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log('error = ', error);
      setLoading(false);
      toast({
        title: error.message || 'Split & Send failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRareSatTicker = async () => {
    const data = await getSats({
      address: currentAccount,
      network,
    });

    let tickers: any[] = [];

    if (data.code === 0) {
      data.data.map((item) => {
        if (item.hasRareStats) {
          const utxo = {
            txid: item.id.split(':')[0],
            vout: Number(item.id.split(':')[1]),
            value: item.value,
          };

          if (
            tickers.some(
              (obj) =>
                obj['ticker'] ===
                t('pages.tools.transaction.rare_sats') +
                  '-' +
                  item.sats[0].type[0],
            )
          ) {
            tickers = tickers.map((obj) => {
              if (
                obj['ticker'] ===
                t('pages.tools.transaction.rare_sats') +
                  '-' +
                  item.sats[0].type[0]
              ) {
                return {
                  ...obj,
                  utxos: [...obj.utxos, utxo],
                };
              }
            });
          } else {
            tickers.push({
              ticker:
                t('pages.tools.transaction.rare_sats') +
                '-' +
                item.sats[0].type[0],
              utxos: [utxo],
            });
          }
        }
      });
    }

    return tickers;
  };

  const getAvialableTicker = async () => {
    let data = await getUtxoByValue({
      address: currentAccount,
      value: 600,
      network,
    });

    if (data.code !== 0) {
      setLoading(false);
      messageApi.error(data.msg);
      return;
    }

    data = await getUtxoByValue({
      address: currentAccount,
      value: 600,
      network,
    });
    if (data.code !== 0) {
      setLoading(false);
      messageApi.error(data.msg);
      return;
    }

    return {
      ticker: t('pages.tools.transaction.available_utxo'),
      utxos: data.data,
    };
  };

  const getTickers = async () => {
    const tickers: any[] = [];

    let data = await getOrdxSummary({
      address: currentAccount,
      network,
    });

    if (data.code !== 0) {
      setLoading(false);
      messageApi.error(data.msg);
      return;
    }
    const detail = data.data.detail;

    detail.map(async (item) => {
      data = await getOrdxAddressHolders({
        start: 0,
        limit: 10000,
        address: currentAccount,
        ticker: item.ticker,
        network: network,
      });
      const utxosOfTicker: any[] = [];
      if (data.code === 0) {
        const details = data.data.detail;
        details.map((detail) => {
          const utxo = {
            txid: detail.utxo.split(':')[0],
            vout: Number(detail.utxo.split(':')[1]),
            value: detail.amount,
            assetamount: detail.assetamount,
          };
          utxosOfTicker.push(utxo);
        });
      }
      tickers.push({
        ticker: item.ticker,
        utxos: utxosOfTicker,
      });
    });

    return tickers;
  };

  const getAllTickers = async () => {
    const tickers = await getTickers();
    const avialableTicker = await getAvialableTicker();
    tickers?.push(avialableTicker);

    const rareSatTickers = await getRareSatTicker();

    const combinedArray = tickers?.concat(rareSatTickers);

    setTickerList(combinedArray);
  };

  useEffect(() => {
    calculateBalance();
  }, [feeRate]);

  useEffect(() => {
    setTickerList([]);
    setInputList('items', [
      {
        id: 1,
        value: {
          ticker: '',
          utxo: '',
          sats: 0,
          unit: 'sats',
        },
        options: {
          tickers: [],
          utxos: [],
        },
      },
    ]);
    setBalance('sats', 0);
    setBalance('unit', 'sats');

    setFee(0);
    setOutputList('items', [
      {
        id: 1,
        value: {
          sats: 0,
          unit: 'sats',
          address: '',
        },
      },
    ]);
    getAllTickers();
  }, [currentAccount]);

  return (
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardHeader>
          <Heading size='md'>拆分&发送</Heading>
        </CardHeader>
        <Divider borderColor={'teal.500'} />
        <CardBody>
          <Stack>
            <Flex>
              <Heading flex={8} as='h6' size='sm'>
                Input
              </Heading>
            </Flex>
            <FormControl>
              {inputList.items.map((item, i) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <Select
                    placeholder='Select Ticker'
                    w={'20%'}
                    onChange={(e) =>
                      handleTickerSelectChange(item.id, e.target.value)
                    }>
                    {tickerList !== undefined &&
                      tickerList.map((utxo) => (
                        <option
                          key={utxo.ticker + '-' + item.id}
                          value={
                            item.value.ticker !== '' &&
                            item.value.ticker === utxo.ticker
                              ? item.value.ticker
                              : utxo.ticker
                          }>
                          {utxo.ticker}
                        </option>
                      ))}
                  </Select>
                  <AntSelect
                    placeholder='Select UTXO'
                    className='w-[40%]'
                    value={inputList.items[i]?.value?.utxo}
                    options={
                      inputList.items[i]?.options?.utxos.map((utxo) => ({
                        label: (
                          <div>
                            {utxo.assetamount && utxo.assetamount + ' Asset/'}
                            {utxo.value +
                              ' sats - ' +
                              hideStr(utxo.txid + ':' + utxo.vout)}
                          </div>
                        ),
                        value: utxo.txid + ':' + utxo.vout,
                      })) || []
                    }
                    onChange={(e) =>
                      handleUtxoSelectChange(item.id, e)
                    }>
                  </AntSelect>

                  <InputGroup w={'30%'}>
                    <Input
                      key={'input-sat-' + item.id}
                      placeholder='0'
                      w={'70%'}
                      size='md'
                      value={
                        item.value.unit === 'sats'
                          ? item.value.sats
                          : item.value.sats / 100000000
                      }
                      readOnly
                    />
                    {/* <InputRightAddon>sat</InputRightAddon> */}
                    <Select
                      variant='filled'
                      w={'30%'}
                      onChange={(e) =>
                        handleInputUnitSelectChange(item.id, e.target.value)
                      }>
                      <option value='sats'>sats</option>
                      <option value='btc'>btc</option>
                    </Select>
                  </InputGroup>

                  <ButtonGroup w={'10%'} gap='1'>
                    <IconButton
                      size='sm'
                      mt={1}
                      onClick={addInputItem}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Add'
                      icon={<AddIcon />}
                    />
                    <IconButton
                      size='sm'
                      mt={1}
                      onClick={() => removeInputItem(item.id)}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Delete'
                      icon={<MinusIcon />}
                    />
                  </ButtonGroup>
                </Flex>
              ))}
            </FormControl>
          </Stack>
          <Divider borderColor={'teal.500'} mt={4} mb={4} />
          <Stack>
            <Flex>
              <Heading flex={8} as='h6' size='sm'>
                Output
              </Heading>
            </Flex>
            <FormControl>
              {outputList.items.map((item) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <InputGroup w={'60%'}>
                    <Input
                      placeholder='Btc address'
                      size='md'
                      value={item.value.address}
                      onChange={(e) => setBtcAddress(item.id, e.target.value)}
                    />
                    <InputRightAddon
                      onClick={() => setBtcAddress(item.id, currentAccount)}>
                      <Tooltip title='Fill the BTC address of the current account'>
                        <AddIcon color='gray.300' />
                      </Tooltip>
                    </InputRightAddon>
                  </InputGroup>

                  <InputGroup w={'30%'}>
                    <Input
                      key={'output-sat-' + item.id}
                      placeholder='0'
                      w={'70%'}
                      size='md'
                      value={
                        item.value.unit === 'sats'
                          ? item.value.sats
                          : item.value.sats / 100000000
                      }
                      onChange={(e) => setOutputSats(item.id, e.target.value)}
                      onBlur={(e) => outputSatsOnBlur(e)}
                    />
                    <Select
                      variant='filled'
                      w={'30%'}
                      onChange={(e) =>
                        handleOutputUnitSelectChange(item.id, e.target.value)
                      }>
                      <option value='sats'>sats</option>
                      <option value='btc'>btc</option>
                    </Select>
                  </InputGroup>

                  <ButtonGroup gap='1' w={'10%'}>
                    <IconButton
                      size='sm'
                      mt={1}
                      onClick={addOuputItem}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Add'
                      icon={<AddIcon />}
                    />
                    <IconButton
                      size='sm'
                      mt={1}
                      onClick={() => removeOutputItem(item.id)}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Delete'
                      icon={<MinusIcon />}
                    />
                  </ButtonGroup>
                </Flex>
              ))}
            </FormControl>
          </Stack>
          <Divider borderColor={'teal.500'} mt={4} mb={4} />
          <Stack>
            <Flex>
              <Heading flex={8} as='h6' size='sm'>
                余额
              </Heading>
            </Flex>
            <FormControl>
              {outputList.items.length === 0 ? (
                <div className='max-w-max mx-auto p-2'>
                  <Image src='/images/no_data.svg' className='w-10 h-10 ml-1' />
                  <span className='text-gray-300'>No data</span>
                </div>
              ) : (
                <Flex key={Math.random()} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <InputGroup w={'60%'}>
                    <InputLeftAddon>Current Address</InputLeftAddon>
                    <Input size='md' value={currentAccount} readOnly />
                  </InputGroup>

                  <InputGroup w={'30%'}>
                    <Input
                      key={'balance-sat'}
                      placeholder='0'
                      w={'70%'}
                      size='md'
                      value={
                        balance.unit === 'sats'
                          ? balance.sats
                          : balance.sats / 100000000
                      }
                      readOnly
                    />
                    <Select
                      variant='filled'
                      w={'30%'}
                      onChange={(e) =>
                        handleBalanceUnitSelectChange(e.target.value)
                      }>
                      <option value='sats'>sats</option>
                      <option value='btc'>btc</option>
                    </Select>
                  </InputGroup>
                  <ButtonGroup gap='1' w={'10%'}>
                    {/* 占位 */}
                  </ButtonGroup>
                </Flex>
              )}
            </FormControl>
          </Stack>
        </CardBody>
        <Divider borderColor={'teal.500'} />
        <CardFooter>
          <Button
            variant='solid'
            colorScheme='teal'
            onClick={splitHandler}
            isLoading={loading}>
            Send
          </Button>
          <Button variant='ghost' colorScheme='teal'>
            ({'Fee: ' + fee + ' sats'})
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
