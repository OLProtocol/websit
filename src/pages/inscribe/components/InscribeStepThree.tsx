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
import { FeeShow } from './FeeShow';
// import mempoolJS from '@mempool/mempool.js';
import { generatePrivateKey, generateInscriptions } from '../utils';
import { useUnisatConnect, useCalcFee } from '@/lib/hooks';
import { OrderItemType, useGlobalStore, useOrderStore } from '@/store';
import { InscribeType } from '@/types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { network, currentAccount } = useUnisatConnect();
  const [data, { set }] = useMap({
    toSingleAddress: currentAccount,
    toMultipleAddresses: '',
  });
  const [loading, setLoading] = useState(false);
  const { add: addOrder, changeStatus } = useOrderStore((state) => state);
  const { serviceStatus } = useGlobalStore((state) => state);
  const [feeRate, setFeeRate] = useState(1);
  const feeRateChange = (value: number) => {
    console.log('value', value);
    setFeeRate(value);
  };

  const files = useMemo(() => {
    return list;
  }, [list]);
  console.log('files', files);
  const inscriptionSize = useMemo(() => {
    console.log('type', type);
    console.log('type', list);
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
  const clacFee = useCalcFee({
    feeRate,
    inscriptionSize,
    files,
    serviceStatus,
  });
  const submit = async () => {
    if (loading) return;
    setLoading(true);
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
      fee: clacFee,
      toAddress: [data.toSingleAddress],
      feeRate,
      files,
      network,
      inscriptionSize: inscriptionSize,
      status: 'pending',
      createAt: Date.now().valueOf(),
    };
    addOrder(order);
    onAddOrder?.(order);
    setLoading(false);
  };
  const calcHex = (file: any) => {
    if (file.fileHex) {
      return file.hex + file.fileHex;
    } else if (file.parent) {
      return file.hex + file.parent;
    } else {
      return file.hex;
    }
  };
  useEffect(() => {
    if (currentAccount) {
      set('toSingleAddress', currentAccount);
    }
  }, [currentAccount]);
  return (
    <div>
      <div className='text-lg font-bold flex justify-between mb-2'>
        <span>
          {list.length} {t('pages.inscribe.step_three.items')}
        </span>
        <Button size='sm' onClick={onRemoveAll}>
          {t('buttons.remove_all')}
        </Button>
      </div>
      <div className='max-h-[30rem] overflow-y-auto p-4 bg-gray-800 rounded-xl'>
        <VStack spacing='10px' className='w-full py-4'>
          {list.map((item, index) => (
            <InscribeRemoveItem
              key={index}
              onRemove={() => onItemRemove?.(index)}
              label={index + 1}
              hex={calcHex(item)}
              value={item.show}
            />
          ))}
        </VStack>
      </div>
      <div className='mb-4'>
        <Tabs className='mb-2'>
          <TabList>
            <Tab>{t('pages.inscribe.step_three.to_single')}</Tab>
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
        <div className='mb-3'>{t('pages.inscribe.step_three.select_fee')}</div>
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
        <p>{t('pages.inscribe.step_three.address_hint')}</p>
      </div>
      <div>
        <FeeShow
          inscriptionSize={inscriptionSize}
          serviceFee={clacFee.serviceFee}
          serviceStatus={clacFee.serviceStatus}
          filesLength={files.length}
          totalFee={clacFee.totalFee}
          networkFee={clacFee.networkFee}
        />
      </div>
      <div className='w-60 mx-auto'>
        <BusButton>
          <Button
            size='md'
            isLoading={loading}
            colorScheme='blue'
            width='100%'
            onClick={submit}>
            {t('buttons.submit_payment')}
          </Button>
        </BusButton>
      </div>
    </div>
  );
};
