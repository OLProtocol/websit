import {
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Divider,
} from '@chakra-ui/react';
import { Button } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Checkbox } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-use';
import { fetchTipHeight } from '@/lib/utils';
import { clacTextSize } from '../utils';
import { requstOrd2Info } from '@/api';

interface InscribeOrdxProps {
  onNext?: () => void;
  onChange?: (data: any) => void;
}
export const InscribeOrdx = ({ onNext, onChange }: InscribeOrdxProps) => {
  const { network } = useUnisatConnect();
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    limitPerMint: 10000,
    repeatMint: 1,
    block_start: 0,
    block_end: 0,
    rarity: '',
    reg: '',
    blockChecked: true,
    rarityChecked: false,
    regChecked: false,
    des: '',
    mintRarity: '',
    sat: 0,
  });
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickLoading, setTickLoading] = useState(false);
  const nextHandler = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 16) {
      setErrorText('Tick must be 3, 5-16 byte long');
      return;
    }
    if (
      data.type === 'deploy' &&
      !data.blockChecked &&
      !data.rarityChecked &&
      !data.regChecked
    ) {
      setErrorText('Deploy must have Block or Rarity or Regular Expression');
      return;
    }
    setLoading(true);
    const info = await requstOrd2Info({ tick: data.tick });
    setLoading(false);
    if (data.type === 'deploy') {
      if (info.data) {
        setErrorText(`${data.tick} has been deployed`);
        return;
      }
    } else if (data.type === 'mint') {
      if (!info.data) {
        setErrorText(`${data.tick} has not been deployed`);
        return;
      }
      if (data.amount > info.data.limit) {
        setErrorText(`Mint amount must be less than ${info.data.limit}`);
        return;
      }
    }

    onNext?.();
  };
  const onTickBlur = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 32) {
      setErrorText('Tick must be 3, 5-32 byte long');
      return;
    }
    if (data.type === 'mint') {
      setTickLoading(true);
      const info = await requstOrd2Info({ tick: data.tick });
      setTickLoading(false);

      if (!info.data) {
        setErrorText(`${data.tick} has not been deployed`);
        return;
      } else {
        console.log('info.data.limit', info.data.limit);
        set('amount', Number(info.data.limit));
        set('mintRarity', info.data.rarity);
      }
      if (data.amount > info.data.limit) {
        setErrorText(`Mint amount must be less than ${info.data.limit}`);
        return;
      }
    }
  };
  const rarityChange = (value: string) => {
    set('rarity', value);
    if (value !== 'common' || !value) {
      set('limitPerMint', 1);
    } else {
      set('limitPerMint', 10000);
    }
  };
  const onBlockChecked = (e: any) => {
    set('blockChecked', e.target.checked);
    set('rarityChecked', !e.target.checked);
    set('regChecked', !e.target.checked);
  };
  const onRarityChecked = (e: any) => {
    set('rarityChecked', e.target.checked);
    if (e.target.checked && !data.regChecked) {
      set('blockChecked', true);
    }
  };
  const onRegChecked = (e: any) => {
    set('regChecked', e.target.checked);
    if (e.target.checked && !data.rarityChecked) {
      set('blockChecked', true);
    }
  };
  const getHeight = async () => {
    const height = await fetchTipHeight(network as any);
    console.log('height', height);
    set('block_start', height);
    set('block_end', height + 4320);
  };
  const showSat = useMemo(() => {
    return data.mintRarity !== 'common' && data.mintRarity !== 'unknow' && data.mintRarity;
  }, [data.mintRarity]);
  useEffect(() => {
    getHeight();
  }, []);
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
        <div className='mb-2 text-xl text-center text-red-500'>{errorText}</div>
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
                onBlur={onTickBlur}
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
                  isDisabled={tickLoading}
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
                  <Checkbox
                    checked={data.blockChecked}
                    onChange={onBlockChecked}></Checkbox>
                  <div className='ml-2 flex-1 flex items-center'>
                    <NumberInput
                      value={data.block_start}
                      className='flex-1'
                      isDisabled={!data.blockChecked}
                      placeholder='Block start'
                      onChange={(_, e) => set('block_start', e)}
                      min={1}>
                      <NumberInputField />
                    </NumberInput>
                    <Divider mx='2' width='3rem' />
                    <NumberInput
                      value={data.block_end}
                      isDisabled={!data.blockChecked}
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
                      onChange={onRarityChecked}>
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
                    onChange={onRegChecked}></Checkbox>
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
        {data.type === 'mint' && showSat && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-40' marginBottom={0}>
                Sat
              </FormLabel>
              <div className='flex-1'>
                <NumberInput
                  value={data.sat}
                  isDisabled={tickLoading}
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
          size='large'
          loading={loading}
          disabled={!data.tick || tickLoading || !!errorText}
          type='primary'
          className='w-60'
          onClick={nextHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};
