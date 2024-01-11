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
import { BtcFeeRate } from './BtcFeeRate';
import { BusButton } from '@/components/BusButton';
import { v4 as uuidV4 } from 'uuid';
// import mempoolJS from '@mempool/mempool.js';
import {
  generteFiles,
  generatePrivateKey,
  generateInscriptions,
} from '../utils';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';
import { OrderItemType, useOrderStore } from '@/store';
import { InscribeType } from '@/types';
interface Brc20SetpOneProps {
  list: any[];
  type: InscribeType;
  onItemRemove?: (index: number) => void;
  onRemoveAll?: () => void;
  onAddOrder?: (order: OrderItemType) => void;
}
export const InscribeStepThree = ({
  list,
  type,
  onItemRemove,
  onAddOrder,
  onRemoveAll,
}: Brc20SetpOneProps) => {
  const toast = useToast();
  const { network, currentAccount } = useUnisatConnect();
  const [data, { set }] = useMap({
    toSingleAddress: currentAccount,
    toMultipleAddresses: '',
  });
  const { add: addOrder, changeStatus } = useOrderStore((state) => state);
  const [fundingData, { set: setFuningData }] = useMap<{
    seckey: any;
    pubkey: any;
  }>({
    seckey: undefined,
    pubkey: undefined,
  });
  const [padding, setPadding] = useState(546);
  const [feeRate, setFeeRate] = useState(0);
  const feeRateChange = (value: number) => {
    console.log('value', value);
    setFeeRate(value);
  };
  const files = useMemo(() => {
    return list;
  }, [list]);
  const baseNum = useMemo(() => {
    if (['brc20', 'text'].includes(type)) {
      return 546;
    } else if (type === 'brc100') {
      return 294;
    } else if (type === 'ordx' && list?.[0]?.op === 'mint') {
      return list?.[0]?.amt > 546 ? list?.[0]?.amt : 546;
    } else {
      return 546;
    }
  }, [type, list]);
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
    const inscriptions = generateInscriptions({
      secret,
      files,
      network,
      feeRate,
    });
    const orderId = uuidV4();
    const order: OrderItemType = {
      orderId,
      type,
      inscriptions,
      secret,
      serviceFee: network === 'testnet' ? 500 : 1000,
      toAddress: [data.toSingleAddress],
      feeRate,
      network,
      inscriptionSize: baseNum,
      status: 'pending',
      createAt: Date.now().valueOf(),
    };
    addOrder(order);
    onAddOrder?.(order);
  };

  return (
    <div>
      <div className='text-lg font-bold flex justify-between mb-2'>
        <span>{list.length} Items</span>
        <Button size='sm' onClick={onRemoveAll}>
          Remove All
        </Button>
      </div>
      <div className='max-h-[30rem] overflow-y-auto p-4 bg-gray-800 rounded-xl'>
        <VStack spacing='10px' className='w-full py-4'>
          {list.map((item, index) => (
            <InscribeRemoveItem
              key={index}
              onRemove={() => onItemRemove?.(index)}
              label={index + 1}
              hex={item.hex}
              value={item.show}
            />
          ))}
        </VStack>
      </div>
      <div className='mb-4'>
        <Tabs className='mb-2'>
          <TabList>
            <Tab>To Single Address</Tab>
            {/* <Tab>To Multiple Addresses</Tab> */}
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
        <BusButton>
          <Button size='md' colorScheme='blue' width='100%' onClick={submit}>
            Submit & Pay invoice
          </Button>
        </BusButton>
      </div>
    </div>
  );
};
