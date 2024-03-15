import { getOrdxSummary, useOrdxSummary, getUtxoByValue, getOrdxAddressHolders } from "@/api";
import { useUnisat, useUnisatConnect } from "@/lib/hooks";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, Heading, IconButton, Input, InputGroup, InputRightAddon, Select, Spacer, Stack, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-use";
import { Address, Script } from '@cmdcode/tapscript';
import { message } from "antd";
import * as bitcoin from 'bitcoinjs-lib';

export default function Transaction() {

  const [utxoList, { set: setUtxoList }] = useMap({
    items: [{
      id: 1, 
      value: {
        ticker: '',
        sats: '0',
        address: '',
      }
    }]
  });

  const { currentAccount, network, currentPublicKey } = useUnisatConnect();
  // const ordxData = useOrdxSummary({ address: currentAccount, network });
  // const utxoList = useMemo(() => ordxData?.data?.data?.detail || [], [ordxData?.data]);
  const [tickerList, setTickerList] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const unisat = useUnisat();
  const toast = useToast();

  const addItem = () => {
    const newId = utxoList.items.length + 1;
    const newItem = {
      id: newId, 
      value: {
        ticker: '',
        sats: '0',
        address: '',
      }
    };
    setUtxoList('items', [...utxoList.items, newItem]);
  };
 
  const removeItem = (id: number) => {
    if (utxoList.items.length > 1) {
      let tmpItems = utxoList.items.filter((item) => item.id !== id)
      tmpItems.forEach((item, index) => {
        item.id = index + 1
      })
      setUtxoList('items', tmpItems);
    }
  };

  const handleTickerSelectChange = (itemId, ticker) => {
    if (tickerList !== undefined) {
      for (let i = 0; i < tickerList.length; i++) {
        if (tickerList[i].ticker === ticker) {
          utxoList.items[itemId-1].value.ticker = tickerList[i].ticker;
          utxoList.items[itemId-1].value.sats = tickerList[i].balance + '';
        }
      }
      setUtxoList('items', utxoList.items);
    }
  }

  const setBtcAddress = (itemId: number, address: string) => {
    utxoList.items[itemId-1].value.address = address;
    setUtxoList('items', utxoList.items);
  }

  const setSats = (itemId: number, sats: string) => {
    utxoList.items[itemId-1].value.sats = sats;
    setUtxoList('items', utxoList.items);
  }

  const addressToScriptPublicKey = (address: string) => {
    const scriptPublicKey = Script.fmt.toAsm(
      Address.toScriptPubKey(address),
    )?.[0];
    // const asmScript = Address.toScriptPubKey(currentAccount) as string[];
    // const scriptPubKey = bitcoin.script.fromASM(asmScript.join(' '));
    return scriptPublicKey;
  };

  const splitHandler = async () => {
    console.log(utxoList.items);
    if (!currentAccount) {
      return;
    }
    setLoading(true);

    // try {
    //   const btcUtxos = utxos.map((v) => {
    //     return {
    //       txid: v.txid,
    //       vout: v.vout,
    //       satoshis: v.value,
    //       scriptPk: addressToScriptPublicKey(currentAccount),
    //       addressType: 2,
    //       inscriptions: [],
    //       pubkey: currentPublicKey,
    //       atomicals: [],
    //     };
    //   });
    //   console.log(btcUtxos);
    //   const inputs: any[] = [
    //     {
    //       hash: btcUtxos[1].txid,
    //       index: btcUtxos[1].vout,
    //       witnessUtxo: {
    //         script: Buffer.from(btcUtxos[1].scriptPk, 'hex'),
    //         value: btcUtxos[1].satoshis,
    //       },
    //     },
    //     {
    //       hash: btcUtxos[0].txid,
    //       index: btcUtxos[0].vout,
    //       witnessUtxo: {
    //         script: Buffer.from(btcUtxos[0].scriptPk, 'hex'),
    //         value: btcUtxos[0].satoshis,
    //       },
    //     },
    //     {
    //       hash: btcUtxos[2].txid,
    //       index: btcUtxos[2].vout,
    //       witnessUtxo: {
    //         script: Buffer.from(btcUtxos[2].scriptPk, 'hex'),
    //         value: btcUtxos[2].satoshis,
    //       },
    //     },
    //   ];
    //   console.log(inputs);
    //   const psbtNetwork = bitcoin.networks.testnet;
    //   const psbt = new bitcoin.Psbt({
    //     network: psbtNetwork,
    //   });
    //   inputs.forEach((input) => {
    //     console.log(input);
    //     psbt.addInput(input);
    //   });
    //   const total = inputs.reduce((acc, cur) => {
    //     return acc + cur.witnessUtxo.value;
    //   }, 0);
    //   const fee = 280;
    //   const firstOutputValue = btcUtxos[1].satoshis + offset;
    //   const secondOutputValue = total - firstOutputValue - fee;
    //   psbt.addOutput({
    //     address: currentAccount,
    //     value: firstOutputValue,
    //   });
    //   psbt.addOutput({
    //     address: currentAccount,
    //     value: secondOutputValue,
    //   });
    //   const signed = await unisat.signPsbt(psbt.toHex());
    //   console.log(signed);
    //   const pushedTxId = await unisat.pushPsbt(signed);
    //   const signedToPsbt = bitcoin.Psbt.fromHex(signed, {
    //     network: psbtNetwork,
    //   });
    //   console.log(pushedTxId);
    //   const txHex = signedToPsbt.extractTransaction().toHex();
    //   console.log(txHex);
    //   setTxId(pushedTxId);
    //   setLoading(false);
    // } catch (error: any) {
    //   messageApi.error(error.message || 'Split & Send failed');
    //   setLoading(false);
    // }
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
    const totalValue = (data?.data || []).reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);

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
            vout: detail.utxo.split(':')[1],
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
    console.log('aaaaaaaaaaaaaaaaaaaaaa')
    getAllTickers();
  }, []);
  
  return (
    <div className='flex flex-col max-w-7xl mx-auto pt-8'>
      <Card>
        <CardHeader>
          <Heading size='md'>拆分&发送</Heading>
        </CardHeader>
        <Divider borderColor={'teal.500'}/>
        <CardBody>
          <Stack>
            <Flex>
              <Heading flex={8} as='h6' size='sm'>Select UTXO</Heading>
            </Flex>
            <FormControl>
              {utxoList.items.map((item) => (
              <Flex key={item.id} whiteSpace={'nowrap'} gap={4} pt={2}>
                <Select placeholder='Select Ticker' onChange={(e) => handleTickerSelectChange(item.id, e.target.value)}>
                  {tickerList !== undefined && tickerList.map((utxo) => (
                    <option key={utxo.ticker + '-' + item.id} value={ (item.value.ticker!== '' && item.value.ticker===utxo.ticker) ? item.value.ticker : utxo.ticker }>{utxo.ticker}</option>
                  ))}
                </Select>

                <Select placeholder='Select UTXO'>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                </Select>

                <InputGroup>
                  <Input key={'input-sat-' + item.id} placeholder='0' size='md' value={item.value.sats} onChange={(e) => setSats(item.id, e.target.value)}/>
                  <InputRightAddon>sat</InputRightAddon>
                </InputGroup>
                
                <Input placeholder='Btc address' size='md' value={item.value.address} onChange={(e) => setBtcAddress(item.id, e.target.value)} />
                <ButtonGroup gap='1'>
                  <IconButton size='sm' mt={1} onClick={addItem}
                    isRound={true}
                    variant='outline'
                    colorScheme='teal'
                    aria-label='Add'
                    icon={<AddIcon />}
                  />
                  <IconButton size='sm' mt={1} onClick={() => removeItem(item.id)}
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
        <Divider borderColor={'teal.500'}/>
        <CardFooter>
          <Button variant='solid' colorScheme='teal' onClick={splitHandler} isLoading={loading}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
