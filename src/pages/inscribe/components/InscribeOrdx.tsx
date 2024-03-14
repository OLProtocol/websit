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
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { Checkbox } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useMap } from 'react-use';
import { fetchTipHeight, calcTimeBetweenBlocks } from '@/lib/utils';
import { clacTextSize, encodeBase64, base64ToHex } from '../utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getOrdxInfo, useSatTypes } from '@/api';
import toast from 'react-hot-toast';
import { useCommonStore } from '@/store';

const { Dragger } = Upload;

interface InscribeOrdxProps {
  onNext?: () => void;
  onChange?: (data: any) => void;
}
// const satTypeList = [
//   {
//     icon: '/images/sat/icon-mythic.svg',
//     name: 'mythical',
//     tip: 'The first sat of the genesis block.',
//   },
//   {
//     icon: '/images/sat/icon-legendary.svg',
//     name: 'legendary',
//     tip: 'The first sat of each cycle.',
//   },
//   {
//     icon: '/images/sat/icon-epic.svg',
//     name: 'epic',
//     tip: 'The first saat of each halving epoch.',
//   },
//   {
//     icon: '/images/sat/icon-rare.svg',
//     name: 'rare',
//     tip: 'The first sat of each difficulty adjustment period.',
//   },
//   {
//     icon: '/images/sat/icon-uncommon.svg',
//     name: 'uncommon',
//     tip: 'The first sat of each block.',
//   },
//   // {
//   //   icon: '/images/sat/common.svg',
//   //   name: 'Connom/Unknown',
//   //   tip: 'A sat of unknown rarity.'
//   // },
//   {
//     icon: '/images/sat/icon-bl.svg',
//     name: 'black',
//     tip: 'The last sat of each block.',
//   },
//   {
//     icon: '/images/sat/icon-np.svg',
//     name: 'name_palindrome',
//     tip: 'Sats with palindromic names.',
//   },
//   {
//     icon: '/images/sat/icon-al.svg',
//     name: 'alpha',
//     tip: 'The first sats in each bitcoin.They always end in at least 8 zeros.',
//   },
//   {
//     icon: '/images/sat/icon-om.svg',
//     name: 'omega',
//     tip: 'The last sats in each bitcoin.They always end in at least 8 nines.',
//   },
//   {
//     icon: '/images/sat/icon-9.svg',
//     name: 'block9',
//     tip: 'Sats mined in Block 9(the first block with sats circulating today).',
//   },
//   {
//     icon: '/images/sat/icon-78.svg',
//     name: 'block78',
//     tip: 'Sats mined by Hal Finney in Block 78(the first block mined by someone other than Satoshi).',
//   },
//   {
//     icon: '/images/sat/icon-nk.svg',
//     name: 'nakamoto',
//     tip: 'Sats mined by Satoshi Nakamoto himself.',
//   },
//   {
//     icon: '/images/sat/icon-vt.svg',
//     name: 'vintage',
//     tip: 'Sats mined in the first 1000 bitcoin blocks.',
//   },
//   {
//     icon: '/images/sat/icon-pz.svg',
//     name: 'pizza',
//     tip: 'Sats involved in the famous pizza transaction from 2010.',
//   },
//   {
//     icon: '/images/sat/icon-jp.svg',
//     name: 'jpeg',
//     tip: 'Sats involved in the possible first bitcoin trade for an image on February 24,2010.',
//   },
//   {
//     icon: '/images/sat/icon-hm.svg',
//     name: 'hitman',
//     tip: 'Sats involved in the transaction made by Ross Ulbricht to hire a hitman.',
//   },
// ];

export const InscribeOrdx = ({ onNext, onChange }: InscribeOrdxProps) => {
  const { btcHeight } = useCommonStore((state) => state);
  const { t } = useTranslation();
  const { state } = useLocation();
  const { network } = useUnisatConnect();
  const [time, setTime] = useState({ start: undefined, end: undefined } as any);
  const [data, { set }] = useMap({
    type: 'mint',
    tick: '',
    amount: 1,
    limitPerMint: 10000,
    repeatMint: 1,
    block_start: 0,
    block_end: 0,
    rarity: '',
    cn: 0,
    trz: 0,
    file: '',
    fileName: '',
    fileType: '',
    blockChecked: true,
    rarityChecked: false,
    cnChecked: false,
    trzChecked: false,
    des: '',
    mintRarity: '',
    sat: 0,
  });
  const { data: satTypeData } = useSatTypes({ network });
  console.log(satTypeData);
  const satTypeList = useMemo(() => {
    return satTypeData?.data || [];
  }, [satTypeData]);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickLoading, setTickLoading] = useState(false);
  const [tickChecked, setTickChecked] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [originFiles, setOriginFiles] = useState<any[]>([]);
  const filesChange: UploadProps['onChange'] = async ({ fileList }) => {
    const originFiles = fileList.map((f) => f.originFileObj);
    // onChange?.(originFiles);
    console.log(12313);
    const file = originFiles[0];
    if (file) {
      const b64 = (await encodeBase64(file as any)) as string;
      const base64 = b64.substring(b64.indexOf('base64,') + 7);
      const hex = base64ToHex(base64);
      set('file', hex);
      set('fileName', file.name);
      if (file.type) {
        set('fileType', file.type);
      }
      setOriginFiles(originFiles);
      setFiles([]);
    }
  };
  const onFilesRemove = async () => {
    set('file', '');
    set('fileName', '');
    set('fileType', '');
  };
  const getOrdXInfo = async (tick: string) => {
    // If there is no data in localStorage, fetch it
    try {
      const key = `${network}_${tick}`;
      const cachedData = localStorage.getItem(key);
      // if (cachedData) {
      //   return JSON.parse(cachedData);
      // }
      const info = await getOrdxInfo({ tick, network });
      if (info) {
        localStorage.setItem(key, JSON.stringify(info));
      }
      return info;
    } catch (error) {
      toast.error(t('toast.system_error'));
      console.error('Failed to fetch ordXInfo:', error);
      throw error;
    }
  };
  const nextHandler = async () => {
    setErrorText('');
    const checkStatus = await checkTick();
    if (!checkStatus) {
      return;
    }
    onNext?.();
  };
  const checkTick = async (blur: boolean = false) => {
    setErrorText('');
    let checkStatus = true;
    if (data.tick === undefined || data.tick === '') {
      checkStatus = false;
      return checkStatus;
    }

    console.log(data.repeatMint);
    const textSize = clacTextSize(data.tick);
    if (textSize < 3 || textSize == 4 || textSize > 32) {
      checkStatus = false;
      setErrorText(t('pages.inscribe.ordx.error_1'));
      return checkStatus;
    }
    try {
      setTickLoading(true);
      setTickChecked(false);
      const info = await getOrdXInfo(data.tick);
      setTickLoading(false);
      setTickChecked(true);

      const { rarity, trz, cn, startBlock, endBlock, limit } = info.data || {};
      const isSpecial = rarity !== 'unknow' && rarity !== 'common' && !!rarity;
      let status = 'Completed';
      if (isSpecial) {
        status = 'Minting';
      } else if (
        startBlock &&
        endBlock &&
        btcHeight <= endBlock &&
        btcHeight >= startBlock
      ) {
        status = 'Minting';
      } else if (btcHeight < startBlock) {
        status = 'Pending';
      } else {
        status = 'Completed';
      }
      if (data.type === 'mint') {
        if (!info.data) {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_4', { tick: data.tick }));
          return checkStatus;
        }
        if (blur) {
          set('amount', Number(limit));
          set('mintRarity', rarity);
        }
        // if (isSpecial) {
        //   checkStatus = false;
        //   setErrorText(t('pages.inscribe.ordx.error_8', { tick: data.tick }));
        //   return checkStatus;
        // }
        if (status === 'Pending') {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_6', { tick: data.tick }));
          return checkStatus;
        }
        console.log(status)
        if (status === 'Completed') {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_7', { tick: data.tick }));
          return checkStatus;
        }
        if (data.amount > info.data.limit) {
          checkStatus = false;
          setErrorText(
            t('pages.inscribe.ordx.error_5', { limit: info.data.limit }),
          );
          return checkStatus;
        }
      } else {
        if (info.data) {
          checkStatus = false;
          setErrorText(t('pages.inscribe.ordx.error_3', { tick: data.tick }));
          return checkStatus;
        }
      }
    } catch (error) {
      setTickLoading(true);
      setTickChecked(false);
      console.log('error', error);
      return checkStatus;
    }
    return checkStatus;
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
    set('cnChecked', !e.target.checked);
    set('trzChecked', !e.target.checked);
  };
  const onRarityChecked = (e: any) => {
    set('rarityChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.cnChecked && !data.trzChecked);
    }
  };
  const onCnChecked = (e: any) => {
    set('cnChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.rarityChecked && !data.trzChecked);
    }
  };
  const onTrzChecked = (e: any) => {
    set('trzChecked', e.target.checked);
    if (e.target.checked) {
      set('blockChecked', false);
    } else {
      set('blockChecked', !data.rarityChecked && !data.cnChecked);
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
  // const time = useBlockHeightTime({
  //   height: btcHeight,
  //   start: data.block_start,
  //   end: data.block_end,
  //   network,
  // });
  const onBlockBLur = async () => {
    const res = await calcTimeBetweenBlocks({
      height: btcHeight,
      start: data.block_start,
      end: data.block_end,
      network,
    });
    setTime(res);
  };
  useEffect(() => {
    if (state?.type === 'ordx') {
      const { item } = state;
      console.log(item);
      set('type', 'mint');
      set('tick', item.tick);
      set('amount', item.limit);
      set('mintRarity', item.rarity);
      setTickChecked(true);
    }
  }, [state]);
  useEffect(() => {
    console.log(btcHeight);
    if (btcHeight) {
      set('block_start', btcHeight);
      set('block_end', btcHeight + 4320);
    }
  }, [btcHeight]);
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
                onBlur={() => checkTick(true)}
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
                  onChange={(_, e) => set('amount', isNaN(e) ? 0 : e)}
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
                    checked={data.blockChecked}
                    onChange={onBlockChecked}></Checkbox>
                  <div className='ml-2 flex-1 flex items-center'>
                    <NumberInput
                      value={data.block_start}
                      className='flex-1'
                      onBlur={onBlockBLur}
                      isDisabled={!data.blockChecked}
                      placeholder='Block start'
                      onChange={(_, e) => set('block_start', isNaN(e) ? 0 : e)}
                      min={1}>
                      <NumberInputField />
                    </NumberInput>
                    <Divider mx='2' width='3rem' />
                    <NumberInput
                      value={data.block_end}
                      isDisabled={!data.blockChecked}
                      className='flex-1'
                      onBlur={onBlockBLur}
                      placeholder='Block End'
                      onChange={(_, e) => set('block_end', isNaN(e) ? 0 : e)}
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
                  start: time.start,
                  end: time.end,
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
                    checked={data.rarityChecked}
                    onChange={onRarityChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <Select
                      disabled={!data.rarityChecked}
                      placeholder={t('common.select_option')}
                      value={data.rarity}
                      onChange={(e) => rarityChange(e.target.value)}>
                      {satTypeList.map((item) => {
                        return <option value={item}>{item}</option>;
                      })}
                    </Select>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.cn')}
                  <Tooltip title={t('pages.inscribe.ordx.cn_placeholder')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.cnChecked}
                    onChange={onCnChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <NumberInput
                      value={data.cn}
                      isDisabled={!data.cnChecked}
                      placeholder={t('pages.inscribe.ordx.cn_placeholder')}
                      onChange={(_, e) => set('cn', isNaN(e) ? 0 : e)}
                      min={0}>
                      <NumberInputField />
                    </NumberInput>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormControl>
              <div className='flex items-center  mb-4'>
                <FormLabel className='w-52' marginBottom={0}>
                  {t('common.trz')}
                  <Tooltip title={t('pages.inscribe.ordx.trz_placeholder')}>
                    <span className='text-blue-500'>
                      (sat
                      <QuestionCircleOutlined />)
                    </span>
                  </Tooltip>
                </FormLabel>
                <div className='flex-1 flex items-center'>
                  <Checkbox
                    checked={data.trzChecked}
                    onChange={onTrzChecked}></Checkbox>
                  <div className='ml-2 flex-1'>
                    <NumberInput
                      value={data.trz}
                      placeholder={t('pages.inscribe.ordx.trz_placeholder')}
                      isDisabled={!data.trzChecked}
                      onChange={(_, e) => set('trz', isNaN(e) ? 0 : e)}
                      min={0}>
                      <NumberInputField />
                    </NumberInput>
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
                    onChange={(_, e) => set('limitPerMint', isNaN(e) ? 0 : e)}
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
        {data.type === 'deploy' && (
          <FormControl>
            <div className='flex items-center  mb-4'>
              <FormLabel className='w-52' marginBottom={0}>
                Image
              </FormLabel>
              <div className='flex-1'>
                <Dragger
                  accept='image/*'
                  maxCount={1}
                  onRemove={onFilesRemove}
                  listType='picture'
                  beforeUpload={() => false}
                  onChange={filesChange}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                    {t('pages.inscribe.files.upload_des_1')}
                  </p>
                  <p className='ant-upload-hint'>
                    {t('pages.inscribe.files.upload_des_2')}
                  </p>
                </Dragger>
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
                    onChange={(_, e) =>
                      set('repeatMint', isNaN(e) ? 0 : Math.min(e, 10))
                    }
                    min={1}
                    max={10}>
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
                    max={10}
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
