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
    rowTitle: "资产类型",
    ordx: "FT",
    brc20: "FT",
    atomicals: "NFT+FT"
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
    rowTitle: "地址格式",
    ordx: "P2TR",
    brc20: "P2TR",
    atomicals: "P2TR"
  },
  {
    rowTitle: "原子swap",
    ordx: "PBST",
    brc20: "PBST",
    atomicals: "PBST"
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
      <div className='mx-auto pt-4' style={{ width: '80%' }}>
        <div style={{ backgroundImage: `url(${HeadBgImg})`, backgroundSize: 'cover', height: '490px' }}>
          <div style={{textAlign: 'right', verticalAlign: 'bottom', paddingTop: '100px', paddingRight: '100px'}}>
          <span style={{ fontSize: '64px', color: '#fff' }}>一</span><span style={{ fontSize: '128px', color: '#fff', fontWeight: 'bold' }}>聪</span><span style={{ fontSize: '64px', color: '#fff' }}>一世界</span>
          </div>
          <div style={{textAlign: 'right', verticalAlign: 'bottom', paddingRight: '100px'}}>
            <span style={{ fontSize: '32px', color: '#fff' }}>One sat, one universe.</span>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4' style={{ width: '80%', marginTop: '50px' }}>
        <div className='rounded-2xl overflow-hidden'>
          <ChakraProvider>
            <ProtocolTable columns={columns} data={data} />
          </ChakraProvider>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '80%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '50px', paddingLeft: '40px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>东方之珠</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>我们计划在2024年1月25日正式发布协议，并且部署第一个Token：Pearl。</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>
              大概在2024年2月1日前后开启mint，持续到2月10日左右结束（由区块高度828200-830000决定有效的mint时间）。
              这是ordx协议的第一个token，也是一个meme币，仅供试验，没有价值，不要FOMO。
            </section>
            <section style={{ fontSize: '16px', color: '#fff', paddingTop: '32px' }}>
              如果你的BTC很多，可以尝试下是不是可以从BTC中找出闪亮的宝石，只需要输入你的钱包地址，就可以看到结果。或者你认为那些类型的sat更有兼职，可以为这些sat部署特别的Token。
            </section>
          </div>
          <div style={{width: '30%'}}>
            <img src={PearlImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} />
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '80%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
            <img src={JadeImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} />
          </div>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '100px', paddingLeft: '150px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>矿工的翡翠</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>每个区块的第一个sat才能mint成功，预计每个Token值1-10个btc。</section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '80%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '150px', paddingLeft: '40px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>Domo的红宝石</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>只有rare属性的sat才能mint成红宝石，最多只有3437个红宝石。目前只有不到400个，预计每个值100BTC。</section>
          </div>
          <div style={{width: '30%'}}>
            <img src={RubyImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} />
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4'style={{ width: '80%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
            <img src={SapphireImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} />
          </div>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '150px', paddingLeft: '100px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>Casey的蓝宝石</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>只有epic属性的sat才能mint成蓝宝石，最多只有32个蓝宝石。目前只有3个，御姐每个值10000BTC。</section>
          </div>
        </div>
      </div>

      <div className='mx-auto pt-4' style={{ width: '80%', marginTop: '50px' }} >
        <div style={{display: 'flex'}}>
          <div style={{textAlign: 'left', verticalAlign: 'center', width: '70%', paddingTop: '150px', paddingLeft: '40px', lineHeight: '32px'}}>
            <section style={{ fontSize: '64px', color: '#fff', paddingBottom: '64px' }}>数字黄金</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>每个BTC的第一个sat才能mint成功，正则表达式的意思是该sat的序号的末尾是8个0。</section>
            <section style={{ fontSize: '16px', color: '#fff' }}>这意味着，每个token值1个BTC。</section>
          </div>
          <div style={{width: '30%'}}>
            <img src={GoldImage} className='w-full' style={{height: 'auto', maxWidth: '100%'}} />
          </div>
        </div>
      </div>
      <div className='max-w-4xl mx-auto pt-4'>
        <div className='rounded-2xl overflow-hidden'>
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
