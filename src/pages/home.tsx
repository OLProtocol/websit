import HeadBgImg from '@/assets/images/head-bg.png';
import PearlImage from '@/assets/images/pearl.png';
import JadeImage from '@/assets/images/jade.png';
import RubyImage from '@/assets/images/ruby.png';
import SapphireImage from '@/assets/images/sapphire.png';
import GoldImage from '@/assets/images/gold.png';

import { useNavigate } from 'react-router-dom';
import { ChakraProvider, background } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ProtocolTable } from './inscribe/components/ProtocolCompare';

type ProtocolCompare = {
  rowTitle: string;
  ordx: string;
  brc20: string;
  atomicals: string;
};

const data: ProtocolCompare[] = [
  {
    rowTitle: '价值主张',
    ordx: '数字珍宝',
    brc20: '-',
    atomicals: '数字对象',
  },
  {
    rowTitle: '铸造方法',
    ordx: '基于ord的信封写入隔离见证区',
    brc20: '基于ord的信封写入隔离见证区',
    atomicals: '使用"atom"进行承诺&揭露的信封',
  },
  {
    rowTitle: '索引',
    ordx: '依赖ordx索引器',
    brc20: '依赖brc-20索引器',
    atomicals: '依赖electrumx索引器',
  },
  {
    rowTitle: '验证',
    ordx: '通过ordx索引器验证，可以客户端验证',
    brc20: '通过brc-20索引器验证，无法客户端验证',
    atomicals: '通过electrumx索引器验证，理论上可以客户端验证',
  },
  {
    rowTitle: '转移',
    ordx: '直接转移',
    brc20: '先铭刻，再转移',
    atomicals: '直接转移',
  },
  {
    rowTitle: '基本单位',
    ordx: '一份资产，一个sat，强绑定，不可变更',
    brc20: '未定义',
    atomicals: '期望one token one sat，但实际会根据EXP参数调整',
  },
  {
    rowTitle: '拆分方案',
    ordx: '可拆分，灵活使用utxo进行拆分',
    brc20: '无限可分',
    atomicals: '使用ST操作符和EXP参数进行拆分（和其原子性原则有冲突）',
  },
  {
    rowTitle: '烧毁可能性',
    ordx: 'sat不可烧毁，资产也就无法烧毁',
    brc20: '不可烧毁',
    atomicals: '使用错误的钱包或者错误的使用方式容易导致token被烧毁',
  },
];

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

export default function Home() {
  const nav = useNavigate();
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
          <section>
            OrdinalsX是一个增强的Ordinals协议（简称ordx协议），支持使用Ordinals协议发行Fungible
            Token。
          </section>
          <section>一份资产，一个sat，永久绑定，不可变更。</section>
          <section>
            转移sat时，资产也就跟着转移，不存在因为误操作导致资产烧毁的问题。
          </section>
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
            <section className='text-6xl pb-16 text-white'>东方之珠</section>
            <section className='text-base text-white'>
              我们已经在2024年1月25日正式部署了协议的第一个Token：Pearl。(<span onClick={toVerify} className='underline underline-offset-4 text-yellow-500 cursor-pointer'>去验真伪</span>)
            </section>
            <section className='text-base text-white'>
              Pearl已经完成了铸造，铸造高度828200-828800，历时四天，有效铸造的铭文序号为59088177-59800871，总计15528次有效铸造，由社区657人公平铸造。
              因为市面上有许多假的Pearl，请大家交易前，在这里验证下铭文序号对应的资产是否是Pearl，避免上当受骗。
            </section>
            {/* <section className='text-base text-white'>
              如果你的BTC很多，可以尝试下是不是可以从BTC中找出闪亮的宝石，只需要输入你的钱包地址，就可以看到结果。或者你认为那些类型的sat更有价值，可以为这些sat部署特别的Token。
            </section> */}
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
            <section className='text-6xl pb-16 text-white'>矿工的翡翠</section>
            <section className='text-base text-white'>
              每个区块的第一个sat才能mint成功，预计每个Token值1-10个btc。
            </section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-4/6 pt-12 text-left align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>
              Domo的蓝宝石
            </section>
            <section className='text-base text-white'>
              只有rare属性的sat才能mint成蓝宝石，最多只有3437个蓝宝石。目前只有不到400个，预计每个值100BTC。
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
              Casey的红宝石
            </section>
            <section className='text-base text-white'>
              只有epic属性的sat才能mint成红宝石，最多只有32个红宝石。目前只有3个，预计每个值10000BTC。
            </section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4 w-4/5 mt-6'>
        <div className='flex'>
          <div className='w-4/6 pt-5 text-left align-middle leading-8'>
            <section className='text-6xl pb-16 text-white'>数字黄金</section>
            <section className='text-base text-white'>
              每个BTC的第一个sat才能mint成功，也就是该sat序号的末尾是8个0。
            </section>
            <section className='text-base text-white'>
              这意味着，每个token值1个BTC。
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
