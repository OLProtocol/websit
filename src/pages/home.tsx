import HeadBgImg from '@/assets/images/head-bg.png';
import PearlImage from '@/assets/images/pearl.png';
import JadeImage from '@/assets/images/jade.png';
import RubyImage from '@/assets/images/ruby.png';
import SapphireImage from '@/assets/images/sapphire.png';
import GoldImage from '@/assets/images/gold.png';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ProtocolTable } from './inscribe/components/ProtocolCompare';
import { t } from 'i18next';

type ProtocolCompare = {
  rowTitle: string;
  ordx: string;
  brc20: string;
  atomicals: string;
};



export default function Home() {
  const nav = useNavigate();
  const data: ProtocolCompare[] = [
    {
      rowTitle: t('pages.home.tb_row01_col01'),
      ordx: t('pages.home.tb_row01_col02'),
      brc20: t('pages.home.tb_row01_col03'),
      atomicals: t('pages.home.tb_row01_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row02_col01'),
      ordx: t('pages.home.tb_row02_col02'),
      brc20: t('pages.home.tb_row02_col03'),
      atomicals: t('pages.home.tb_row02_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row03_col01'),
      ordx: t('pages.home.tb_row03_col02'),
      brc20: t('pages.home.tb_row03_col03'),
      atomicals: t('pages.home.tb_row03_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row04_col01'),
      ordx: t('pages.home.tb_row04_col02'),
      brc20: t('pages.home.tb_row04_col03'),
      atomicals: t('pages.home.tb_row04_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row05_col01'),
      ordx: t('pages.home.tb_row05_col02'),
      brc20: t('pages.home.tb_row05_col03'),
      atomicals: t('pages.home.tb_row05_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row06_col01'),
      ordx: t('pages.home.tb_row06_col02'),
      brc20: t('pages.home.tb_row06_col03'),
      atomicals: t('pages.home.tb_row06_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row07_col01'),
      ordx: t('pages.home.tb_row07_col02'),
      brc20: t('pages.home.tb_row07_col03'),
      atomicals: t('pages.home.tb_row07_col04'),
    },
    {
      rowTitle: t('pages.home.tb_row08_col01'),
      ordx: t('pages.home.tb_row08_col02'),
      brc20: t('pages.home.tb_row08_col03'),
      atomicals: t('pages.home.tb_row08_col04'),
    },
  ];
  console.log(data);
  const columnHelper = createColumnHelper<ProtocolCompare>();
  
  const columns = [
    columnHelper.accessor('rowTitle', {
      cell: (info) => info.getValue(),
      header: '-',
    }),
    columnHelper.accessor('ordx', {
      cell: (info) => info.getValue(),
      header: 'Ordx',
    }),
    columnHelper.accessor('brc20', {
      cell: (info) => info.getValue(),
      header: 'Brc-20',
    }),
    columnHelper.accessor('atomicals', {
      cell: (info) => info.getValue(),
      header: 'Atomicals',
    }),
  ];
  const toMint = () => {
    nav('/inscribe', {
      state: {
        type: 'ordx',
        item: {
          tick: 'Pearl',
          limit: '10000',
          rarity: 'unknow'
        },
      },
    });
  };

  const toVerify = () => {
    nav('/inscribe_check');
  };
  return (
    <div className='min-h-full bg-gray-900'>
      <div className='mx-auto pt-4 w-4/5'>
        <div>
          <img src={HeadBgImg} className='w-full h-auto' />
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='text-2xl text-center align-middle text-white leading-loose'>
          <section>{t('pages.home.summary_01')}</section>
          <section>{t('pages.home.summary_02')}</section>
          <section>{t('pages.home.summary_03')}</section>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='rounded-2xl overflow-hidden'>
          <ChakraProvider>
            <ProtocolTable columns={columns} data={data} />
          </ChakraProvider>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-4/6 text-2xl text-left align-middle'>
            <section className='text-6xl pb-16 text-white'>{t('pages.home.pearl_01')}</section>
            <section className='text-base text-white'>
              {t('pages.home.pearl_02')}(<span onClick={toVerify} className='underline underline-offset-4 text-yellow-500 cursor-pointer'>{t('pages.home.pearl_03')}</span>)
            </section>
            <section className='text-base text-white'>
              {t('pages.home.pearl_04')}
            </section>
          </div>
          <div className='w-2/6'>
            <img src={PearlImage} />
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-2/6 '>
            <img src={JadeImage} className='float-right' />
          </div>
          <div className='w-4/6 pt-12 text-right align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>{t('pages.home.jade_01')}</section>
            <section className='text-base text-white'>
              {t('pages.home.jade_02')}
            </section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-4/6 pt-12 text-left align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>
              {t('pages.home.sapphire_01')}
            </section>
            <section className='text-base text-white'>
              {t('pages.home.sapphire_02')}
            </section>
          </div>
          <div className='w-2/6'>
            <img src={SapphireImage} />
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4  w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-2/6'>
            <img src={RubyImage} className='float-right' />
          </div>
          <div className='w-4/6 pt-12 text-right align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>
              {t('pages.home.ruby_01')}
            </section>
            <section className='text-base text-white'>
              {t('pages.home.ruby_02')}
            </section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-4/6 pt-5 text-left align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>{t('pages.home.gold_01')}</section>
            <section className='text-base text-white'>
              {t('pages.home.gold_02')}
            </section>
            <section className='text-base text-white'>
              {t('pages.home.gold_03')}
            </section>
          </div>
          <div className='w-2/6'>
            <img src={GoldImage} />
          </div>
        </div>
      </div>
      <div
        className='mx-auto pt-4 w-full h-24 mt-12'
        style={{ backgroundColor: '#00152a' }}>
        <div className='flex'>
          <div className='w-1/5 pt-5 text-right align-middle leading-8 text-white'>
            <span>Copyright © 2024</span>
          </div>
          <div className='w-3/5 pl-24 pt-8'>
            <a
              href='https://twitter.com/OrdX_Protocol'
              target='_blank'
              rel='noopener noreferrer'
              className='float-right text-white'
              style={{ color: 'white' }}>
              <svg
                stroke='currentColor'
                fill='currentColor'
                strokeWidth='0'
                viewBox='0 0 1024 1024'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0 0 75-94 336.64 336.64 0 0 1-108.2 41.2A170.1 170.1 0 0 0 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 0 0-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 0 1-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 0 1-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z'></path>
              </svg>
            </a>
          </div>
          <div className='w-1/5 pt-5 text-left align-middle leading-8'></div>
        </div>
      </div>

      {/* <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
          <img src={Home07Image} alt='banner' className='w-full' />
        </div>
      </div> */}
    </div>
  );
}
