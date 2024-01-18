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
  Flex,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Checkbox } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-use';
import { fetchTipHeight } from '@/lib/utils';
import { useBlockHeightTime } from '@/lib/hooks';
import { clacTextSize } from '../utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { requstOrd2Info, useBtcHeight } from '@/api';

interface InscribeOrdxProps {
  onNext?: () => void;
  onChange?: (data: any) => void;
}
export const InscribeOrdx = ({ onNext, onChange }: InscribeOrdxProps) => {
  const { t } = useTranslation();
  const { state } = useLocation();
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
  const { data: heightData } = useBtcHeight(network as any);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickLoading, setTickLoading] = useState(false);
  const [tickChecked, setTickChecked] = useState(false);
  const nextHandler = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 16) {
      setErrorText(t('pages.inscribe.ordx.error_1'));
      return;
    }
    if (
      data.type === 'deploy' &&
      !data.blockChecked &&
      !data.rarityChecked &&
      !data.regChecked
    ) {
      setErrorText(t('pages.inscribe.ordx.error_2'));
      return;
    }
    setLoading(true);

    const info = await requstOrd2Info({ tick: data.tick });
    setLoading(false);
    if (data.type === 'deploy') {
      if (info.data) {
        setErrorText(t('pages.inscribe.ordx.error_3', { tick: data.tick }));
        return;
      }
    } else if (data.type === 'mint') {
      if (!info.data) {
        setErrorText(t('pages.inscribe.ordx.error_4', { tick: data.tick }));
        return;
      }
      if (data.amount > info.data.limit) {
        setErrorText(t('pages.inscribe.ordx.error_5', { limit: info.data.limit }));
        return;
      }
    }

    onNext?.();
  };
  const onTickBlur = async () => {
    setErrorText('');
    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 32) {
      setErrorText(t('pages.inscribe.ordx.error_1'));
      return;
    }
    if (data.type === 'mint') {
      try {
        setTickLoading(true);
        setTickChecked(false);
        const info = await requstOrd2Info({ tick: data.tick });
        setTickLoading(false);
        setTickChecked(true);
        if (!info.data) {
          setErrorText(t('pages.inscribe.ordx.error_3', { tick: data.tick }));
          return;
        } else {
          set('amount', Number(info.data.limit));
          set('mintRarity', info.data.rarity);
        }
        if (data.amount > info.data.limit) {
          setErrorText(t('pages.inscribe.ordx.error_5', { limit: info.data.limit }));
          return;
        }
      } catch (error) {
        console.log('error', error);
      }
    }
    setTickLoading(false);
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
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.regChecked);
    }
  };
  const onRegChecked = (e: any) => {
    set('regChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.rarityChecked);
    }
  };
  const getHeight = async () => {
    const height = await fetchTipHeight(network as any);
    console.log('height', height);
    set('block_start', height);
    set('block_end', height + 4320);
  };
  const showSat = useMemo(() => {
    return (
      data.mintRarity !== 'common' &&
      data.mintRarity !== 'unknow' &&
      data.mintRarity
    );
  }, [data.mintRarity]);
  const buttonDisabled = useMemo(() => {
    return !data.tick || (data.type === 'mint' && !tickChecked);
  }, [data, tickChecked]);
  const time = useBlockHeightTime({
    height: heightData,
    start: data.block_start,
    end: data.block_end,
  });
  console.log(time);
  useEffect(() => {
    if (state?.type === 'ordx') {
      const { item } = state;
      set('type', 'mint');
      set('tick', item.tick);
      set('amount', item.limit);
      set('mintRarity', item.rarity);
      setTickChecked(true);
    }
  }, [state]);
  useEffect(() => {
    console.log(heightData);
    if (heightData) {
      set('block_start', heightData);
      set('block_end', heightData + 4320);
    }
  }, [heightData]);
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
            <Radio value='mint'>{t('common.mint')}</Radio>
            <Radio value='deploy'>{t('common.deploy')}</Radio>
          </Stack>
        </RadioGroup>
      </div>
      {errorText && (
        <div className='mb-2 text-xl text-center text-red-500'>{errorText}</div>
      )}

      <div className='mb-4'>
        <FormControl>
          <div className='flex items-center mb-4'>
            <FormLabel className='w-52' marginBottom={0}>
              {t('common.tick')}
            </FormLabel>
            <div className='flex-1'>
              <Input
                type='text'
                onBlur={onTickBlur}
                maxLength={32}
                placeholder={t('pages.inscribe.ordx.tick_placeholder')}
                value={data.tick}
                onChange={(e) => set('tick', e.target.value)}
              />
            </div>
          </div>
        </FormControl>
        {data.type !== 'deploy' && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                {t('common.amount')}
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
              <div className='flex items-center mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.block')}
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    disabled
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
                  </div>
                </div>
              </div>
            </FormControl>
            {time.start && time.end && (
              <div className='ml-60 mb-2 text-xs text-gray-600'>
                {t('pages.inscribe.ordx.block_helper', {
                  start: format(time.start, 'yyyy-MM-dd HH:mm'),
                  end: format(time.end, 'yyyy-MM-dd HH:mm'),
                })}
              </div>
            )}

            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.rarity')}
                  <Tooltip title={t('pages.inscribe.ordx.rarity_helper')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    disabled
                    checked={data.rarityChecked}
                    onChange={onRarityChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <Select
                      disabled={!data.rarityChecked}
                      placeholder={t('common.select_option')}
                      value={data.rarity}
                      onChange={(e) => rarityChange(e.target.value)}>
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
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.reg')}
                  <Tooltip title={t('pages.inscribe.ordx.rarity_helper')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    disabled
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
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.limit_per_mint')}
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
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.description')}
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
              <FormLabel className='w-52' marginBottom={0}>
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
        {data.type === 'mint' && tickChecked && !showSat && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                {t('common.repeat_mint')}
              </FormLabel>
              <div className='flex-1'>
                <Flex>
                  <NumberInput
                    maxW='100px'
                    mr='2rem'
                    value={data.repeatMint}
                    onChange={(_, e) => set('repeatMint', e)}
                    min={1}
                    max={100}>
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
                    max={100}
                    onChange={(e) => set('repeatMint', e)}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb fontSize='sm' boxSize='16px' />
                  </Slider>
                </Flex>
              </div>
            </div>
          </FormControl>
        )}
      </div>
      <div className='w-60 mx-auto'>
        <Button
          size='large'
          loading={loading}
          disabled={buttonDisabled}
          type='primary'
          className='w-60'
          onClick={nextHandler}>
          {t('buttons.next')}
        </Button>
      </div>
    </div>
  );
};