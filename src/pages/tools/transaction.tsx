import { getOrdxSummary, useOrdxSummary, getUtxoByValue, getOrdxAddressHolders } from "@/api";
import { useUnisat, useUnisatConnect } from "@/lib/hooks";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, Heading, IconButton, Input, InputGroup, InputRightAddon, Select, Spacer, Stack, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-use";
import { Address, Script } from '@cmdcode/tapscript';
import { message } from "antd";
import * as bitcoin from 'bitcoinjs-lib';
import { addressToScriptPublicKey } from "@/lib/utils";

export default function Transaction() {

  const [inputList, { set: setInputList }] = useMap<any>({
    items: [{
      id: 1,
      value: {
        ticker: '',
        utxo: '',
        sats: 0,
        unit: 'sat',
      },
      options: {
        tickers: [],
        utxos: [],
      }
    }]
  });
  const [outputList, { set: setOutputList }] = useMap<any>({
    items: [{
    id: 1,
      value: {
        sats: 0,
        unit: 'sat',
        address: '',
      }
    }]
  })

  const { currentAccount, network, currentPublicKey } = useUnisatConnect();
  const [tickerList, setTickerList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const unisat = useUnisat();
  const toast = useToast();

  const addInputItem = () => {
    const allTickers = tickerList?.map((item) => item.ticker) || [];
    let tickers = allTickers.filter(item => !inputList.items.some(inItem => inItem.value.ticker === item))
    
    const newId = inputList.items.length + 1;
    const newItem = {
      id: newId,
      value: {
        ticker: '',
        utxo: '',
        sats: 0,
        unit: 'sat',
      },
      options: {
        tickers: tickers,
        utxos: [],
      }
    };

    setInputList('items', [...inputList.items, newItem]);
  };

  const removeInputItem = (id: number) => {
    if (inputList.items.length > 1) {
      let tmpItems = inputList.items.filter((item) => item.id !== id)
      tmpItems.forEach((item, index) => {
        item.id = index + 1
      })
      setInputList('items', tmpItems);
    }
  };
  
  const addOuputItem = () => {
    const newId = outputList.items.length + 1;
    const newItem = {
      id: newId,
      value: {
        sats: 0,
        unit: 'sat',
        address: '',
      }
    };

    setOutputList('items', [...outputList.items, newItem]);
  };

  const removeOutputItem = (id: number) => {
    if (outputList.items.length > 1) {
      let tmpItems = outputList.items.filter((item) => item.id !== id)
      tmpItems.forEach((item, index) => {
        item.id = index + 1
      })
      setOutputList('items', tmpItems);
    }
  };

  const handleTickerSelectChange = (itemId, ticker) => {
    inputList.items[itemId - 1].value.ticker = ticker;
    inputList.items[itemId - 1].value.sats = 0;
    inputList.items[itemId - 1].value.utxo = 'sat';

    const selectTicker = tickerList?.find((item) => item.ticker === ticker);
    if (selectTicker !== undefined) {
      inputList.items[itemId - 1].options.utxos = selectTicker.utxos.map((utxo) => ({ txid: utxo.txid, vout: utxo.vout, value: utxo.value })) || inputList.items[itemId - 1].options.utxos.filter((utxo) => utxo.txid !== inputList.items[itemId - 1].value.utxo.vout) || [];
    }

    setInputList('items', inputList.items);
  }

  const handleUtxoSelectChange = (itemId, utxo) => {
    const txid = utxo.split(':')[0];
    const vout = Number(utxo.split(':')[1]);
    inputList.items[itemId - 1].value.sats = inputList.items[itemId - 1].options.utxos.find((item) => item.txid === txid && item.vout === vout)?.value || 0;
    inputList.items[itemId - 1].value.utxo = utxo;
    setInputList('items', inputList.items);
  }

  const setBtcAddress = (itemId: number, address: string) => {
    outputList.items[itemId - 1].value.address = address;
    setOutputList('items', outputList.items);
  }

  const handleInputUnitSelectChange = (itemId: number, unit: string) => {
    inputList.items[itemId - 1].value.unit = unit;
    setInputList('items', inputList.items);
  }

  const handleOutputUnitSelectChange = (itemId: number, unit: string) => {
    inputList.items[itemId - 1].value.unit = unit;
    setInputList('items', inputList.items);
  }

  // const setInputSats = (itemId: number, sats: string) => {
  //   const item = inputList.items[itemId - 1]
  //   const total = inputList.items[itemId - 1].options.utxos.find((v) => v.txid + ':' + v.vout === item.value.utxo)?.value
  //   if (total < Number(sats)) {
  //     toast({
  //       title: 'Not enough sats. This utxo has ' + total + ' sats',
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return
  //   }
  //   inputList.items[itemId - 1].value.sats = Number(sats);
  //   setInputList('items', inputList.items);
  // }

  const setOutputSats = (itemId: number, sats: string) => {
    const unit = outputList.items[itemId - 1].value.unit;
    if (unit === 'sat') {
      outputList.items[itemId - 1].value.sats = Number(sats);
    } else {
      outputList.items[itemId - 1].value.sats = Number(sats)*100000000;
    }
    
    setOutputList('items', outputList.items);
  }

  const splitHandler = async () => {
    console.log(inputList.items);
    if (!currentAccount) {
      return;
    }
    setLoading(true);

    try {
      const psbtNetwork = bitcoin.networks.testnet;
      const psbt = new bitcoin.Psbt({
        network: psbtNetwork,
      });
      const fee = 600;
      let inTotal = 0
      let outTotal = 0;
      inputList.items.map((v) => {
        inTotal += v.value.sats;
        
        psbt.addInput({
          hash: v.value.utxo.split(':')[0],
          index: Number(v.value.utxo.split(':')[1]),
          witnessUtxo: {
            script: Buffer.from(addressToScriptPublicKey(currentAccount), 'hex'),
            value: v.value.sats,
          },
        })
      })

      outputList.items.map((v) => {
        outTotal += v.value.sats;
        psbt.addOutput({
          address: v.value.address,
          value: v.value.sats,
        })
      })

      if (inTotal - outTotal - fee < 0) {
        setLoading(false);
        toast({
          title: 'Not enough sats',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return
      }

      if (inTotal - outTotal - fee > 0) {
        psbt.addOutput({
          address: currentAccount,
          value: inTotal - outTotal - fee,
        })
      }

      const signed = await unisat.signPsbt(psbt.toHex());
      const pushedTxId = await unisat.pushPsbt(signed);
      const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
        network: psbtNetwork,
      });

      const txHex = signedToPsbt.extractTransaction().toHex();
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
  }

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
      ticker: '可花费utxo',
      utxos: data.data
    };
  }

  const getTickers = async () => {
    let tickers: any[] = [];

    let data = await getOrdxSummary({
      address: currentAccount,
      network,
    });

    if (data.code !== 0) {
      setLoading(false);
      messageApi.error(data.msg);
      return;
    }
    const detail = data.data.detail

    detail.map(async (item) => {
      data = await getOrdxAddressHolders({
        start: 0,
        limit: 10000,
        address: currentAccount,
        ticker: item.ticker,
        network: network
      });
      let utxosOfTicker: any[] = [];
      if (data.code === 0) {
        const details = data.data.detail
        details.map((detail) => {
          const utxo = {
            txid: detail.utxo.split(':')[0],
            vout: Number(detail.utxo.split(':')[1]),
            value: detail.amount,
          }
          utxosOfTicker.push(utxo);
        })
      }
      tickers.push({
        ticker: item.ticker,
        utxos: utxosOfTicker
      });
    })

    return tickers;
  }

  const getAllTickers = async () => {
    const tickers = await getTickers()
    const avialableTicker = await getAvialableTicker();
    tickers?.push(avialableTicker);
    setTickerList(tickers);
    console.log(tickerList)
  }

  useEffect(() => {
    getAllTickers();
  }, []);

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
              <Heading flex={8} as='h6' size='sm'>Input</Heading>
            </Flex>
            <FormControl>
              {inputList.items.map((item) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <Select placeholder='Select Ticker' onChange={(e) => handleTickerSelectChange(item.id, e.target.value)}>
                    {tickerList !== undefined && tickerList.map((utxo) => (
                      <option key={utxo.ticker + '-' + item.id} value={(item.value.ticker !== '' && item.value.ticker === utxo.ticker) ? item.value.ticker : utxo.ticker}>{utxo.ticker}</option>
                    ))}
                  </Select>

                  <Select placeholder='Select UTXO' onChange={(e) => handleUtxoSelectChange(item.id, e.target.value)}>
                    {item.options.utxos.map((utxo) => (
                      <option key={item.value.ticker + '-' + utxo.txid + '-' + item.id} value={utxo.txid + ':' + utxo.vout}>{utxo.txid + ':' + utxo.vout}</option>
                    ))}
                  </Select>

                  <InputGroup>
                    <Input key={'input-sat-' + item.id} placeholder='0' size='md' value={item.value.unit === 'sat' ? item.value.sats : item.value.sats / 100000000} readOnly/>
                    {/* <InputRightAddon>sat</InputRightAddon> */}
                    <Select variant='filled' w={24} onChange={(e) => handleInputUnitSelectChange(item.id, e.target.value)}>
                      <option value='sat'>sat</option>
                      <option value='btc'>btc</option>
                    </Select>
                  </InputGroup>

                  <ButtonGroup gap='1'>
                    <IconButton size='sm' mt={1} onClick={addInputItem}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Add'
                      icon={<AddIcon />}
                    />
                    <IconButton size='sm' mt={1} onClick={() => removeInputItem(item.id)}
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
              <Heading flex={8} as='h6' size='sm'>Output</Heading>
            </Flex>
            <FormControl>
              {outputList.items.map((item) => (
                <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                  <Input placeholder='Btc address' size='md' value={item.value.address} onChange={(e) => setBtcAddress(item.id, e.target.value)} />

                  <InputGroup>
                    <Input key={'output-sat-' + item.id} placeholder='0' size='md' value={item.value.unit === 'sat' ? item.value.sats : item.value.sats / 100000000} onChange={(e) => setOutputSats(item.id, e.target.value)} />
                    <Select variant='filled' w={24} onChange={(e) => handleOutputUnitSelectChange(item.id, e.target.value)}>
                      <option value='sat'>sat</option>
                      <option value='btc'>btc</option>
                    </Select>
                  </InputGroup>

                  <ButtonGroup gap='1'>
                    <IconButton size='sm' mt={1} onClick={addOuputItem}
                      isRound={true}
                      variant='outline'
                      colorScheme='teal'
                      aria-label='Add'
                      icon={<AddIcon />}
                    />
                    <IconButton size='sm' mt={1} onClick={() => removeOutputItem(item.id)}
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
        </CardBody>
        <Divider borderColor={'teal.500'} />
        <CardFooter>
          <Button variant='solid' colorScheme='teal' onClick={splitHandler} isLoading={loading}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
