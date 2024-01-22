import HeadBgImg from '@/assets/images/head-bg.png';
import PearlImage from '@/assets/images/pearl.png';
import JadeImage from '@/assets/images/jade.png';
import RubyImage from '@/assets/images/ruby.png';
import SapphireImage from '@/assets/images/sapphire.png';
import GoldImage from '@/assets/images/gold.png';

import { ChakraProvider, background } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ProtocolTable } from "./inscribe/components/ProtocolCompare";


type ProtocolCompare = {
  rowTitle: string;
  ordx: string;
  brc20: string;
  atomicals: string;
};

const data: ProtocolCompare[] = [
  {
    rowTitle: "价值主张",
    ordx: "数字珍宝",
    brc20: "-",
    atomicals: "数字对象"
  },
  {
    rowTitle: "铸造方法",
    ordx: "基于ord的信封，使用deploy和mint",
    brc20: "基于ord的信封，使用deploy、mint、tranfer",
    atomicals: "使用\"atom\"进行承诺&揭露的信封"
  },
  {
    rowTitle: "索引",
    ordx: "依赖ordx索引器跟踪序数系统和ticker",
    brc20: "依赖brc-20索引器",
    atomicals: "依赖electrumx索引器跟踪序数和编号系统"
  },
  {
    rowTitle: "验证",
    ordx: "通过索引服务ordx验证，理论上可以客户端验证",
    brc20: "通过索引服务brc-20验证，无法客户端验证",
    atomicals: "通过索引服务electrumx验证，理论上可以客户端验证"
  },
  {
    rowTitle: "转移",
    ordx: "直接转移",
    brc20: "先铭刻，再转移",
    atomicals: "直接转移"
  },
  {
    rowTitle: "基本单位",
    ordx: "sat",
    brc20: "未定义",
    atomicals: "sat"
  },
  {
    rowTitle: "拆分方案",
    ordx: "不可拆分，受最小utxo限制，需要在Layer2中做拆分",
    brc20: "无限可分",
    atomicals: "使用ST操作符和Exp参数进行拆分（和其原子性原则有冲突）"
  },
  {
    rowTitle: "烧毁可能性",
    ordx: "sat不可烧毁，token也就无法烧毁",
    brc20: "不可烧毁",
    atomicals: "使用错误的钱包或者错误的使用方式容易导致token被烧毁"
  }
];

const columnHelper = createColumnHelper<ProtocolCompare>();

const columns = [
  columnHelper.accessor("rowTitle", {
    cell: (info) => info.getValue(),
    header: "-"
  }),
  columnHelper.accessor("ordx", {
    cell: (info) => info.getValue(),
    header: "Ordx"
  }),
  columnHelper.accessor("brc20", {
    cell: (info) => info.getValue(),
    header: "Brc-20"
  }),
  columnHelper.accessor("atomicals", {
    cell: (info) => info.getValue(),
    header: "Atomicals"
  })
];

export default function Home() {
  return (
    <div className="min-h-full bg-gray-900">
      {/* <div className='mx-auto pt-4' style={{ width: '80%' }}>
        <div style={{ backgroundImage: `url(${HeadBgImg})`, backgroundSize: 'cover', height: '490px' }}>
          <div style={{textAlign: 'right', verticalAlign: 'bottom', paddingTop: '100px', paddingRight: '100px'}}>
          <span style={{ fontSize: '64px', color: '#fff' }}>一</span><span style={{ fontSize: '128px', color: '#fff', fontWeight: 'bold' }}>聪</span><span style={{ fontSize: '64px', color: '#fff' }}>一世界</span>
          </div>
          <div style={{textAlign: 'right', verticalAlign: 'bottom', paddingRight: '100px'}}>
            <span style={{ fontSize: '32px', color: '#fff' }}>One sat, one universe.</span>
          </div>
        </div>
      </div> */}
      <div className='mx-auto pt-4' style={{ width: '80%' }}>
        <div>
          <img src={HeadBgImg} className='w-full' style={{height: 'auto', maxWidth: '100%'}}/>
        </div>
      </div>

      <div className='mx-auto pt-4' style={{ width: '80%', marginTop: '50px' }}>
        <div className='rounded-2xl overflow-hidden'>
          <ChakraProvider>
            <ProtocolTable columns={columns} data={data} />
          </ChakraProvider>
        </div>
      </div>

      <div className='mx-auto pt-4' style={{ width: '60%', marginTop: '50px' }}>
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>东方之珠</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>我们计划在2024年1月25日正式发布协议，并且部署第一个Token：Pearl。</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>
              大概在2024年2月1日前后开启mint，持续到2月10日左右结束（由区块高度828200-830000决定有效的mint时间）。
              这是ordx协议的第一个token，也是一个meme币，仅供试验，没有价值，不要FOMO。
            </section>
            <section style={{ fontSize: '16px', color: '#fff', paddingTop: '32px' }}>
              如果你的BTC很多，可以尝试下是不是可以从BTC中找出闪亮的宝石，只需要输入你的钱包地址，就可以看到结果。或者你认为那些类型的sat更有价值，可以为这些sat部署特别的Token。
            </section>
          </div>
          <div style={{width: '30%', paddingLeft: '100px'}}>
            <img src={PearlImage}/>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '60%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
            <img src={JadeImage} style={{float:'right'}}/>
          </div>
          <div style={{textAlign: 'right', verticalAlign: 'center', width: '70%', paddingTop: '50px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>矿工的翡翠</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>每个区块的第一个sat才能mint成功，预计每个Token值1-10个btc。</section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '60%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '50px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>Domo的红宝石</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>只有rare属性的sat才能mint成红宝石，最多只有3437个红宝石。目前只有不到400个，预计每个值100BTC。</section>
          </div>
          <div style={{width: '30%', paddingLeft: '100px'}}>
            <img src={RubyImage}/>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '60%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
            <img src={SapphireImage} style={{float:'right'}}/>
          </div>
          <div style={{textAlign: 'right', verticalAlign: 'center', width: '70%', paddingTop: '50px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>Casey的蓝宝石</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>只有epic属性的sat才能mint成蓝宝石，最多只有32个蓝宝石。目前只有3个，预计每个值10000BTC。</section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4' style={{ width: '60%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '20px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>数字黄金</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>每个BTC的第一个sat才能mint成功，正则表达式的意思是该sat序号的末尾是8个0。</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>这意味着，每个token值1个BTC。</section>
          </div>
          <div style={{width: '30%', paddingLeft: '100px'}}>
            {/* <img src={GoldImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} /> */}
            <img src={GoldImage}/>
          </div>
        </div>
      </div>
      <div className='mx-auto pt-4' style={{ width: '100%', height: '100px', marginTop: '50px', backgroundColor: '#00152a' }}>
        <div style={{display: 'flex'}}>
          <div style={{color: 'white', textAlign: 'right', verticalAlign: 'center', width: '20%', paddingTop: '20px', lineHeight: '32px'}}>
            <span>Copyright © 2024</span>
          </div>
          <div style={{width: '60%', paddingLeft: '100px', paddingTop: '30px'}}>
            <a href="https://twitter.com/OrdX_Protocol" target="_blank" rel="noopener noreferrer" style={{ color: 'white', float: 'right'}}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0 0 75-94 336.64 336.64 0 0 1-108.2 41.2A170.1 170.1 0 0 0 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 0 0-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 0 1-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 0 1-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"></path>
              </svg>
            </a>
          </div>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '20%', paddingTop: '20px', lineHeight: '32px'}}>
          </div>
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
