import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { InscribeBrc20 } from './components/InscribeBrc20';
import { InscribeText } from './components/InscribeText';
import { InscribeStepTwo } from './components/InscribeStepTwo';
import { InscribeStepThree } from './components/InscribeStepThree';
import { LocalOrderList } from './components/LocalOrderList';
import { useMap, useList } from 'react-use';
import { InscribingOrderModal } from './components/InscribingOrderModal';
import { OrderItemType } from '@/store';

export default function Inscribe() {
  const [step, setStep] = useState(3);
  const [type, setType] = useState<string>('text');
  const [tabIndex, setTabIndex] = useState(0);
  const [orderId, setOrderId] = useState<string>();
  const [modalShow, setModalShow] = useState(false);
  const [list, { set: setList, clear: clearList, removeAt }] = useList<any>([
    // {
    //   type: 'brc20_transfer',
    //   name: 'well_0',
    //   value: JSON.stringify({
    //     p: 'brc-20',
    //     op: 'transfer',
    //     tick: 'well',
    //     amt: '10000',
    //   }),
    // },
    // {
    //   type: 'text',
    //   value: 'well4',
    // },
  ]);
  const [brc20Data, { set: setBrc20 }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    repeatMint: 1,
    limitPerMint: 1,
    totalSupply: 21000000,
  });
  const [textData, { set: setTextData, reset: resetText }] = useMap({
    type: 'single',
    text: '',
  });
  const brc20Change = (data: any) => {
    setBrc20('type', data.type);
    setBrc20('tick', data.tick);
    setBrc20('amount', data.amount);
    setBrc20('repeatMint', data.repeatMint);
    setBrc20('limitPerMint', data.limitPerMint);
    setBrc20('totalSupply', data.totalSupply);
  };
  const brc20Next = () => {
    const list: any = [];
    if (brc20Data.type === 'mint') {
      for (let i = 0; i < brc20Data.repeatMint; i++) {
        list.push({
          type: 'brc20',
          name: `mint_${i}`,
          value: JSON.stringify({
            p: 'brc-20',
            op: 'mint',
            tick: brc20Data.tick.toString(),
            amt: brc20Data.amount.toString(),
          }),
        });
      }
    } else if (brc20Data.type === 'deploy') {
      list.push({
        type: 'brc20',
        name: 'deploy_0',
        value: JSON.stringify({
          p: 'brc-20',
          op: 'deploy',
          tick: brc20Data.tick.toString(),
          max: brc20Data.totalSupply.toString(),
          lim: brc20Data.limitPerMint.toString(),
        }),
      });
    } else if (brc20Data.type === 'transfer') {
      list.push({
        type: 'brc20',
        name: 'transfer_0',
        value: JSON.stringify({
          p: 'brc-20',
          op: 'transfer',
          tick: brc20Data.tick.toString(),
          amt: brc20Data.amount.toString(),
        }),
      });
    }
    setList(list);
    setStep(2);
  };
  const textNext = () => {
    const list: any = [];
    if (textData.type === 'single') {
      list.push({
        type: 'text',
        value: textData.text,
      });
    } else {
      const lines = textData.text.split('\n');
      lines.forEach((line: string) => {
        list.push({
          type: 'text',
          value: line,
        });
      });
    }
    console.log(list);
    setList(list);
    setStep(2);
  };
  const textChange = (type: string, value: string) => {
    setTextData('type', type);
    setTextData('text', value);
  };
  const stepTwoNext = () => {
    setStep(3);
  };
  const stepTwoBack = () => {
    setStep(1);
  };
  const handleTabsChange = (i: number) => {
    if (i !== tabIndex) {
      setTabIndex(i);
      clearList();
      setType(i === 0 ? 'text' : 'brc-20');
    }
  };

  const onItemRemove = async (index: number) => {
    await removeAt(index);
  };
  const onOrderClick = (item) => {
    // if (['pending', 'paid'].includes(item.status)) {
      setOrderId(item.orderId);
      setModalShow(true);
    // }
  };
  const onAddOrder = (item) => {
    setOrderId(item.orderId);
    setModalShow(true);
  };
  const onModalClose = () => {
    setOrderId(undefined);
    setModalShow(false);
  };
  const onFinished = () => {
    clear();
  };
  const onRemoveAll = () => {
    clear();
  }
  const clear = () => {
    clearList();
    resetText();
  };
  useEffect(() => {
    if (list.length === 0) {
      setStep(1);
      resetText();
    }
  }, [list]);
  return (
    <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
      <h1 className='text-lg font-bold text-center mb-4'>Ord2 Inscribe</h1>
      <div>
        <Tabs
          variant='soft-rounded'
          index={tabIndex}
          onChange={handleTabsChange}
          className='mb-4'
          colorScheme='green'>
          <TabList>
            <Tab>Text</Tab>
            <Tab>brc-20</Tab>
          </TabList>
        </Tabs>
        <div className=' min-h-[10rem] mx-auto bg-gray-50 p-8 rounded-lg mb-4'>
          {step === 1 && (
            <>
              {type === 'text' && (
                <InscribeText onNext={textNext} onChange={textChange} />
              )}
              {type === 'brc-20' && (
                <InscribeBrc20 onChange={brc20Change} onNext={brc20Next} />
              )}
            </>
          )}
          {step === 2 && (
            <InscribeStepTwo
              list={list}
              type='text'
              onBack={stepTwoBack}
              onNext={stepTwoNext}
            />
          )}
          {step === 3 && (
            <InscribeStepThree
              onItemRemove={onItemRemove}
              onRemoveAll={onRemoveAll}
              onAddOrder={onAddOrder}
              list={list}
              type='text'
            />
          )}
        </div>
        <div>
          <Tabs className='mb-4' colorScheme='green'>
            <TabList>
              <Tab>Local Order</Tab>
            </TabList>
          </Tabs>
          <div>
            <LocalOrderList onOrderClick={onOrderClick} />
          </div>
        </div>
      </div>
      {orderId && (
        <InscribingOrderModal
          show={modalShow}
          orderId={orderId}
          onFinished={onFinished}
          onClose={onModalClose}
        />
      )}
    </div>
  );
}
