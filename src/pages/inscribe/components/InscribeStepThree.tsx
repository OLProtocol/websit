import {
  Tabs,
  TabList,
  Tab,
  VStack,
  SimpleGrid,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useMemo, useState, useEffect } from 'react';
import { useMap, useList } from 'react-use';
import { InscribeRemoveItem } from './InscribeRemoveItem';
import { Tap, Script, Address, Tx, Signer } from '@cmdcode/tapscript';
import { BtcFeeRate } from './BtcFeeRate';
import { BtcFeeCalc } from './BtcFeeCalc';
import { v4 as uuidV4 } from 'uuid';
// import mempoolJS from '@mempool/mempool.js';
import {
  generteFiles,
  generatePrivateKey,
  generateInscribe,
  inscribe,
  loopTilAddressReceivesMoney,
} from '../utils';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { OrderItemType, useOrderStore } from '@/store';
import { InscribeType } from '@/types';
interface Brc20SetpOneProps {
  list: any[];
  type: InscribeType;
  onItemRemove?: (index: number) => void;
  onAddOrder?: (order: OrderItemType) => void;
}
console.log(window.mempoolJS);
export const InscribeStepThree = ({
  list,
  type,
  onItemRemove,
  onAddOrder,
}: Brc20SetpOneProps) => {
  const toast = useToast();
  const [data, { set }] = useMap({
    toSingleAddress:
      'tb1pt9c60e43sxcvksr7arx9qvczj0w9sqjellk6xg9chw2d5pv7ax4sdy5r7n',
    toMultipleAddresses: '',
  });
  const {
    add: addOrder,
    changeStatus,
    addTxid,
  } = useOrderStore((state) => state);
  const [fundingData, { set: setFuningData }] = useMap<{
    seckey: any;
    pubkey: any;
  }>({
    seckey: undefined,
    pubkey: undefined,
  });
  const unisat = useUnisat();
  const { network } = useUnisatConnect();
  const [padding, setPadding] = useState(546);
  const [feeRate, setFeeRate] = useState(0);
  const feeRateChange = (value: number) => {
    console.log('value', value);
    setFeeRate(value);
  };
  const {
    bitcoin: { transactions },
  } = window.mempoolJS({
    hostname: 'mempool.space',
    network,
  });
  const files = useMemo(() => {
    return generteFiles(list);
  }, [list]);
  const baseNum = useMemo(() => {
    if (['brc20', 'text'].includes(type)) {
      return 546;
    } else if (type === 'brc100') {
      return 294;
    } else {
      return 546;
    }
  }, [feeRate]);
  useEffect(() => {
    const isBin = !!files[0]?.sha256;
    if (!isBin) {
      setPadding(546);
    } else {
      setPadding(1000);
    }
  }, [files]);

  const submit = async () => {
    const secret = generatePrivateKey();
    const inscriptionAddress = generateInscribe(
      secret,
      files[0].text,
      network as any,
    );
    const fee = feeRate * 154 + baseNum;
    console.log('fee', fee);
    console.log('feeRate', feeRate);
    const orderId = uuidV4();
    const order: OrderItemType = {
      orderId,
      type,
      files,
      secret,
      inscriptionAddress,
      toAddress: [data.toSingleAddress],
      fee,
      feeRate,
      inscriptionSize: baseNum,
      status: 'pending',
      createAt: Date.now().valueOf(),
    };
    addOrder(order);
    onAddOrder?.(order);
  };

  return (
    <div>
      <div className='text-lg font-bold flex justify-between'>
        {list.length} Items
      </div>
      <div className='p-4 bg-gray-800 rounded-xl'>
        <VStack spacing='10px' className='w-full py-4'>
          {list.map((item, index) => (
            <InscribeRemoveItem
              key={item.value}
              onRemove={() => onItemRemove?.(index)}
              label={index + 1}
              value={item.value}
            />
          ))}
        </VStack>
      </div>
      <div className='mb-4'>
        <Tabs className='mb-2'>
          <TabList>
            <Tab>To Single Address</Tab>
            <Tab>To Multiple Addresses</Tab>
          </TabList>
        </Tabs>
        <div>
          <Input
            placeholder='Basic usage'
            value={data.toSingleAddress}
            onChange={(e) => set('toSingleAddress', e.target.value)}
          />
        </div>
      </div>
      <div className='mb-4'>
        <div className='mb-3'>Select the network fee you want to pay:</div>
        <BtcFeeRate onChange={feeRateChange} />
      </div>
      <div className='mb-4'>
        {/* <BtcFeeCalc
          feeRate={feeRate}
          padding={padding}
          networkFee={networkFee}
          total={totalFees}
          overheadFee={overhead}
        /> */}
      </div>
      <div className='mb-4'>
        <p>
          Please note the inscribing transaction delivers the inscription to the
          receiving address directly.
        </p>
      </div>
      <div className='w-60 mx-auto'>
        <Button size='md' colorScheme='blue' width='100%' onClick={submit}>
          Submit & Pay invoice
        </Button>
      </div>
    </div>
  );
};
