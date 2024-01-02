import {
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Select,
  Button,
  Divider,
} from '@chakra-ui/react';
import { Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { useMap } from 'react-use';
import { clacTextSize } from '../utils';

interface InscribeOrd2Props {
  onNext?: () => void;
  onChange?: (data: any) => void;
}
export const InscribeOrd2 = ({ onNext, onChange }: InscribeOrd2Props) => {
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    repeatMint: 1,
    limitPerMint: 1,
    block_start: 0,
    block_end: 0,
    rarity: 'common',
    reg: '',
    rarityChecked: false,
    regChecked: false,
    des: '',
    sat: 0,
  });
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const nextHandler = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    console.log('textSize', textSize);
    console.log(textSize < 4);
    if (textSize < 3 || textSize == 4 || textSize > 32) {
      setErrorText('Tick must be 3, 5-32 byte long');
      return;
    }
    setLoading(true);
    onNext?.();
    // const info = await fetchBrc20Info();

    // if (info.error === 'no ticker info' && data.type === 'deploy') {
    //   setErrorText(`${data.tick} has been deployed`);
    //   return;
    // }
    // if (data.type === 'mint') {
    //   console.log(data.type);
    //   console.log(data.amount);
    //   if (data.amount > (info.limit || 1000)) {
    //     setErrorText(`Mint amount must be less than ${info.limit} Tick`);
    //   }
    // }
    setLoading(false);
  };
  const onRarityChange = (e) => {
    console.log(e.target.checked);
  };
  useEffect(() => {
    onChange?.(data);
  }, [data]);
  return (
    <div>
      <div className='mb-4'>
        <RadioGroup
          size='lg'
          onChange={(e) => set('type', e)}
          value={data.type}>
          <Stack direction='row' justify='center' spacing='20px'>
            <Radio value='mint'>Mint</Radio>
            <Radio value='deploy'>Deploy</Radio>
          </Stack>
        </RadioGroup>
      </div>
      {errorText && (
        <div className='mb-2 text-md text-center text-red-500'>{errorText}</div>
      )}

      <div className='mb-4'>
        <FormControl>
          <div className='flex items-center mb-4'>
            <FormLabel className='w-40' marginBottom={0}>
              Tick
            </FormLabel>
            <div className='flex-1'>
              <Input
                type='text'
                maxLength={32}
                placeholder='3 or 5-32 letters'
                value={data.tick}
                onChange={(e) => set('tick', e.target.value)}
              />
            </div>
          </div>
        </FormControl>
        {data.type !== 'deploy' && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-40' marginBottom={0}>
                Amount
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.amount}
                  onChange={(_, e) => set('amount', e)}
                  min={1}>
                  <NumberInputField />
                </NumberInput>
              </div>
            </div>
          </FormControl>
        )}

        {data.type === 'deploy' && (
          <>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Block
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <NumberInput
                    value={data.block_start}
                    className='flex-1'
                    placeholder='Block start'
                    onChange={(_, e) => set('block_start', e)}
                    min={1}>
                    <NumberInputField />
                  </NumberInput>
                  <Divider mx='2' width='3rem' />
                  <NumberInput
                    value={data.block_end}
                    className='flex-1'
                    placeholder='Block End'
                    onChange={(_, e) => set('block_end', e)}
                    min={1}>
                    <NumberInputField />
                  </NumberInput>
                  {/* <Input
                    type='text'
                    maxLength={32}
                    placeholder='like "10-100"'
                    value={data.block}
                    onChange={(e) => set('block', e.target.value)}
                  /> */}
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Limit Per Mint
                </FormLabel>
                <div className='flex-1'>
                  <NumberInput
                    value={data.limitPerMint}
                    onChange={(_, e) => set('limitPerMint', e)}
                    min={1}>
                    <NumberInputField />
                  </NumberInput>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Rarity
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.rarityChecked}
                    onChange={(e) =>
                      set('rarityChecked', e.target.checked)
                    }></Checkbox>
                  <div className='ml-2 flex-1'>
                    <Select
                      disabled={!data.rarityChecked}
                      placeholder='Select option'
                      value={data.rarity}
                      onChange={(e) => set('rarity', e.target.value)}>
                      <option value='common'>common</option>
                      <option value='uncommon'>uncommon</option>
                      <option value='rare'>rare</option>
                      <option value='epic'>epic</option>
                      <option value='legendary'>legendary</option>
                      <option value='mythic'>mythic</option>
                    </Select>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Regular Expression
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.regChecked}
                    onChange={(e) =>
                      set('regChecked', e.target.checked)
                    }></Checkbox>
                  <div className='ml-2 flex-1'>
                    <Input
                      type='text'
                      disabled={!data.regChecked}
                      maxLength={32}
                      placeholder='like "^[1-9][0-9]*0{n}$"'
                      value={data.reg}
                      onChange={(e) => set('reg', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-40' marginBottom={0}>
                  Description
                </FormLabel>
                <div className='flex-1'>
                  <Input
                    type='text'
                    maxLength={32}
                    value={data.des}
                    onChange={(e) => set('des', e.target.value)}
                  />
                </div>
              </div>
            </FormControl>
          </>
        )}
        {data.type === 'mint' && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-40' marginBottom={0}>
                Sat
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.sat}
                  onChange={(_, e) => set('sat', e)}
                  min={1}>
                  <NumberInputField />
                </NumberInput>
              </div>
            </div>
          </FormControl>
        )}
        {/* {data.type === 'mint' && (
          <FormControl >
            <FormLabel>Repeat Mint</FormLabel>
            <Flex>
              <NumberInput
                maxW='100px'
                mr='2rem'
                value={data.repeatMint}
                onChange={(_, e) => set('repeatMint', e)}
                min={1}
                max={1000}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex='1'
                focusThumbOnChange={false}
                value={data.repeatMint}
                min={1}
                max={1000}
                onChange={(e) => set('repeatMint', e)}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize='sm' boxSize='16px' />
              </Slider>
            </Flex>
          </FormControl>
        )} */}
      </div>
      <div className='w-60 mx-auto'>
        <Button
          size='md'
          colorScheme='blue'
          isLoading={loading}
          isDisabled={!data.tick}
          width='100%'
          onClick={nextHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};
