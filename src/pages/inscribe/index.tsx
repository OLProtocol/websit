import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { InscribeBrc20 } from './components/InscribeBrc20';
import { InscribeText } from './components/InscribeText';
import { InscribeStepTwo } from './components/InscribeStepTwo';
import { InscribeStepThree } from './components/InscribeStepThree';
import { useMap, useList } from 'react-use';
import { text } from 'stream/consumers';
export default function Inscribe() {
  const [step, setStep] = useState(3);
  const [type, setType] = useState<string>('text');
  const [tabIndex, setTabIndex] = useState(0);
  const [list, { set: setList, clear: clearList, removeAt }] = useList<any>([
    {
      type: 'text',
      value: '12345',
    },
  ]);
  const [textData, { set: setTextData, reset: resetText }] = useMap({
    type: 'single',
    text: '',
  });
  const brc20Next = () => {
    setStep(2);
  };
  const textNext = () => {
    setList([
      {
        type: textData.type,
        value: textData.text,
      },
    ]);
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
  useEffect(() => {
    if (list.length === 0) {
      setStep(1);
      resetText();
    }
  }, [list]);
  return (
    <div className='flex flex-col max-w-[40rem] mx-auto'>
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
        <div className=' min-h-[10rem] mx-auto bg-gray-50 p-8 rounded-lg'>
          {step === 1 && (
            <>
              {type === 'text' && (
                <InscribeText onNext={textNext} onChange={textChange} />
              )}
              {type === 'brc-20' && <InscribeBrc20 onNext={brc20Next} />}
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
              list={list}
              type='text'
            />
          )}
        </div>
      </div>
    </div>
  );
}
