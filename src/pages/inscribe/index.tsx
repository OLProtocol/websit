import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { InscribeBrc20 } from './components/InscribeBrc20';
import { InscribeOrd2 } from './components/InscribeOrd2';
import { InscribeText } from './components/InscribeText';
import { InscribeStepTwo } from './components/InscribeStepTwo';
import { InscribeStepThree } from './components/InscribeStepThree';
import { LocalOrderList } from './components/LocalOrderList';
import { useMap, useList } from 'react-use';
import { InscribingOrderModal } from './components/InscribingOrderModal';
import { removeObjectEmptyValue } from './utils';
import { OrderItemType } from '@/store';

export default function Inscribe() {
  const [step, setStep] = useState(3);
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
  const [ord2Data, { set: setOrd2Data }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    repeatMint: 1,
    limitPerMint: 1,
    block: '',
    reg: '',
    des: '',
    sat: '',
  });
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
  const ord2Change = (data: any) => {
    console.log(data);
    setOrd2Data('type', data.type);
    setOrd2Data('tick', data.tick);
    setOrd2Data('amount', data.amount);
    setOrd2Data('repeatMint', data.repeatMint);
    setOrd2Data('limitPerMint', data.limitPerMint);
    setOrd2Data('block', `${data.block_start}-${data.block_end}`);
    setOrd2Data('reg', data.reg);
    setOrd2Data('des', data.des);
    setOrd2Data('sat', data.sat);
    console.log(ord2Data)
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
  const ord2Next = () => {
    const list: any = [];
    if (ord2Data.type === 'mint') {
      for (let i = 0; i < ord2Data.repeatMint; i++) {
        list.push({
          type: 'ord2',
          name: `mint_${i}`,
          value: JSON.stringify(
            removeObjectEmptyValue({
              p: 'ord2',
              op: 'mint',
              tick: ord2Data.tick.toString(),
              amt: ord2Data.amount.toString(),
              sat: ord2Data.sat.toString(),
            }),
          ),
        });
      }
    } else if (ord2Data.type === 'deploy') {
      console.log(ord2Data);
      list.push({
        type: 'ord2',
        name: 'deploy_0',
        value: JSON.stringify(
          removeObjectEmptyValue({
            p: 'ord2',
            op: 'deploy',
            tick: ord2Data.tick.toString(),
            block: ord2Data.block.toString(),
            lim: ord2Data.limitPerMint.toString(),
            reg: ord2Data.reg.toString(),
            des: ord2Data.des.toString(),
          }),
        ),
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
    }
  };
  const type = useMemo(() => {
    const typeMap = ['text', 'brc-20', 'ord2'];
    return typeMap[tabIndex];
  }, [tabIndex]);
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
  };
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
      <h1 className='text-lg font-bold text-center mb-4'>Inscribe</h1>
      <div>
        <Tabs
          variant='soft-rounded'
          index={tabIndex}
          onChange={handleTabsChange}
          className='mb-4'
          colorScheme='green'>
          <TabList>
            <Tab>Text</Tab>
            <Tab>Brc-20</Tab>
            <Tab>Ord2</Tab>
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
              {type === 'ord2' && (
                <InscribeOrd2 onChange={ord2Change} onNext={ord2Next} />
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
