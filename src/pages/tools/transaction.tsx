import indexer from '@/api/indexer';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
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
} from '@/lib/wallet/btc';
import { hideStr } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export default function Transaction() {

  const location = useLocation();
  const initInputList = location.state?.initInputList;
  const initOutputList = location.state?.initOutputList;

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
    items: []
  });

  const [balance, { set: setBalance }] = useMap<any>({
    sats: 0,
    unit: 'sats',
  });

  const { address, network, publicKey } = useReactWalletStore();
  const [tickerList, setTickerList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
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
      address: address,
      publicKey,
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
    if (!address) {
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

      const fee = await calcNetworkFee({
        utxos,
        outputs: outputList.items.map((v) => ({
          address: v.value.address,
          value: v.value.sats,
        })),
        feeRate: feeRate.value,
        network,
        address: address,
        publicKey,
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
        address: address,
        publicKey,
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
    const resp = await indexer.exotic.getExoticSatInfoList({ address: address });

    let tickers: any[] = [];

    if (resp.code === 0) {
      resp.data.map((item) => {
        let hasRareStats = false;
        if (item.sats && item.sats.length > 0) {
          item.sats.map((sat) => {
            if (sat.satributes && sat.satributes.length > 0) {
              hasRareStats = true;
              return;
            }
          })
        }

        if (hasRareStats) {
          const utxo = {
            txid: item.utxo.split(':')[0],
            vout: Number(item.utxo.split(':')[1]),
            value: item.value,
          };

          if (tickers.length === 0) {
            tickers.push({
              ticker: t('pages.tools.transaction.rare_sats') + '-' + item.sats[0].satributes[0],
              utxos: [utxo],
            });
          } else {
            let utxoExist = false;
            tickers.map((obj) => {
              obj.utxos.map((tmp) => {
                if (tmp === utxo.txid + ':' + utxo.vout) {
                  utxoExist = true;// utxo already exists
                  return;
                }
              })
            })
            if (!utxoExist) {// utxo does not exist
              if (tickers.some((obj) => obj['ticker'] === t('pages.tools.transaction.rare_sats') + '-' + item.sats[0].satributes[0])) { // the type of rare sat already exists
                tickers = tickers.map((obj) => {
                  if (obj['ticker'] === t('pages.tools.transaction.rare_sats') + '-' + item.sats[0].satributes[0]) {
                    return {
                      ticker: obj['ticker'],
                      utxos: [...obj.utxos, utxo],
                    };
                  } else {
                    return obj;
                  }
                });
              } else {
                tickers.push({
                  ticker: t('pages.tools.transaction.rare_sats') + '-' + item.sats[0].satributes[0],
                  utxos: [utxo],
                });
              }
            }
          }
        }
      });
    }

    return tickers;
  };

  const getAvialableTicker = async () => {
    const data = await indexer.utxo.getPlainUtxoList({
      address: address,
      value: 0,
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

    let resp = await indexer.address.getAssetsSummary({start:0, limit: 100, address});
    if (resp.code !== 0) {
      setLoading(false);
      messageApi.error(resp.msg);
      return;
    }
    const detail = resp?.data?.detail;

    detail?.map(async (item) => {
      let resp = await indexer.address.getUtxoList({
        start: 0,
        limit: 10,
        address,
        ticker: item.ticker,
      });
      const utxosOfTicker: any[] = [];
      // if (resp.code === 0) {
      //   const details = resp?.data?.detail;
      //   details?.map((detail) => {
      // const utxo = {
      //   txid: detail.utxo.split(':')[0],
      //   vout: Number(detail.utxo.split(':')[1]),
      //   value: detail.amount,
      //   assetamount: detail.assetamount,
      // };
      // utxosOfTicker.push(utxo);
      // });
      // }
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
  }, [feeRate, inputList, outputList]);

  useEffect(() => {
    if (initInputList && initInputList.length > 0) {
      return
    }
    if (initOutputList && initOutputList.length > 0) {
      return
    }

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
  }, [address]);

  useEffect(() => {
    const outputItems: any[] = [];
    if (initOutputList && initOutputList.length > 0) {
      if (initOutputList[0].address === address) {
        initOutputList.map((item) => {
          const newItem = {
            id: outputItems.length + 1,
            value: {
              sats: item.sats,
              unit: 'sats',
              address: item.address,
            },
          }
          outputItems.push(newItem);
        })
      }
    } else {
      const newItem = {
        id: 1,
        value: {
          sats: 0,
          unit: 'sats',
          address: '',
        },
      }
      outputItems.push(newItem);
    }
    setOutputList('items', outputItems);

    const inputItems: any[] = [];
    if (initInputList && initInputList.length > 0) {
      initInputList.map((item) => {
        const newItem = {
          id: inputItems.length + 1,
          value: {
            ticker: item.ticker,
            utxo: item.utxo,
            sats: item.sats,
            unit: 'sats',
          },
          options: {
            tickers: [],
            utxos: [],
          },
        }
        inputItems.push(newItem);
      })
    } else {
      const newItem = {
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
      }
      inputItems.push(newItem);
    }
    setInputList('items', inputItems);
    if (initOutputList && initOutputList.length > 0) {
      calculateBalance();
    }
  }, [initInputList, initOutputList]);

  return (
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardHeader>
          <Heading size='md'>{t('pages.tools.transaction.title')}</Heading>
        </CardHeader>
        <Divider borderColor={'teal.500'} />
        <CardBody>
          <Stack>
            <FormControl>
              <Flex>
                <Heading flex={8} as='h6' size='sm'>
                  {t('pages.tools.transaction.input')}
                </Heading>
              </Flex>
              {inputList.items.map((item, i) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <AntSelect
                    placeholder='Select Ticker'
                    className={'w-[20%]'} style={{ height: '40px' }}
                    value={item.value?.ticker ? item.value?.ticker : undefined}
                    options={
                      tickerList?.map((utxo) => ({
                        label: (
                          <div>
                            {utxo.ticker}
                          </div>
                        ),
                        value: utxo.ticker,
                      })) || []
                    }
                    onChange={(e) =>
                      handleTickerSelectChange(item.id, e)
                    }>
                  </AntSelect>
                  <AntSelect
                    placeholder='Select UTXO'
                    className='w-[40%]' style={{ height: '40px' }}
                    value={inputList.items[i]?.value?.utxo ? inputList.items[i]?.value?.utxo : undefined}
                    options={
                      inputList.items[i]?.options?.utxos.map((utxo) => ({
                        label: (
                          <div>
                            {utxo.assetamount && utxo.assetamount + ' Asset/'}
                            {utxo.value + ' sats - ' + hideStr(utxo.txid + ':' + utxo.vout)}
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
                    <AntSelect
                      className={'w-[30%]'} style={{ height: '40px' }}
                      value={item.value.unit}
                      defaultValue='sats'
                      options={[{ label: 'sats', value: 'sats' }, { label: 'btc', value: 'btc' }]}
                      onChange={(e) =>
                        handleInputUnitSelectChange(item.id, e)
                      }>
                    </AntSelect>
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
            <FormControl>
              <Flex>
                <Heading flex={8} as='h6' size='sm'>
                  {t('pages.tools.transaction.output')}
                </Heading>
              </Flex>

              {outputList.items.map((item) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <InputGroup w={'60%'}>
                    <Input
                      placeholder='Btc address'
                      size='md'
                      value={item.value.address}
                      onChange={(e) => setBtcAddress(item.id, e.target.value)}
                    />
                    <InputRightAddon onClick={() => setBtcAddress(item.id, address)}>
                      <Tooltip title='Fill the BTC address of the current account'>
                        <AddIcon color='teal' />
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
                    <AntSelect
                      className={'w-[30%]'} style={{ height: '40px' }}
                      value={item.value.unit}
                      defaultValue='sats'
                      options={[{ label: 'sats', value: 'sats' }, { label: 'btc', value: 'btc' }]}
                      onChange={(e) =>
                        handleOutputUnitSelectChange(item.id, e)
                      }>
                      <option value='sats'>sats</option>
                      <option value='btc'>btc</option>
                    </AntSelect>
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
            <FormControl>
              <Flex>
                <Heading flex={8} as='h6' size='sm'>
                  {t('pages.tools.transaction.balance')}
                  <span className='text-gray-400 text-sm font-light'>({t('pages.tools.transaction.balance_des')})</span>
                </Heading>

              </Flex>

              {outputList.items.length === 0 ? (
                <div className='max-w-max mx-auto p-2'>
                  <Image src='/images/no_data.svg' className='w-10 h-10 ml-1' />
                  <span className='text-gray-300'>No data</span>
                </div>
              ) : (
                <Flex key={Math.random()} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <InputGroup w={'60%'}>
                    <InputLeftAddon>Current Address</InputLeftAddon>
                    <Input size='md' value={address} readOnly />
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
                    <AntSelect
                      className={'w-[30%]'} style={{ height: '40px' }}
                      value={balance.unit}
                      defaultValue='sats'
                      options={[{ label: 'sats', value: 'sats' }, { label: 'btc', value: 'btc' }]}
                      onChange={(e) =>
                        handleBalanceUnitSelectChange(e)
                      }>
                      <option value='sats'>sats</option>
                      <option value='btc'>btc</option>
                    </AntSelect>
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
