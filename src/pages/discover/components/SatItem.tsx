import { Tag } from 'antd';
import { CopyButton } from '@/components/CopyButton';
import { SplitSatButton } from './SplitSatButton';
import { useReactWalletStore } from 'btc-connect/dist/react';
import { setSatIcon } from '@/lib/utils/sat';
import { hideStr } from '@/lib/utils';
interface SatItemProps {
  sat: any;
}
export const SatItem = ({ sat }: SatItemProps) => {
  const { network } = useReactWalletStore();

  const txid = sat.utxo.replace(/:0$/m, '');
  const href =
    network === 'testnet'
      ? `https://mempool.space/testnet/tx/${txid}`
      : `https://mempool.space/tx/${txid}`;

  return (
    <div className='group max-w-full mx-auto flex' key={Math.random()}>
      {/* <Tag color='gray'>{format(new Date(sat.time), 'yyyy-MM-dd')}</Tag> */}
      <div className='flex item-center justify-center'>
        <a
          className='text-blue-500 cursor-pointer'
          href={href}
          target='_blank'>
          {hideStr(sat.utxo)}
        </a>{'(' + sat.value + ' sats)'}
        &nbsp;&nbsp;
        <CopyButton text={sat.utxo} tooltip='Copy' className='pt-1'/>&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <Tag color='green' bordered={false}>
        Block#{sat.block}
      </Tag>
      {sat.size === 1 ? (
        <>
          <span className=''>{sat.start}</span>&nbsp;
        </>
      ) : (
        <>
          <span className=''>{sat.start}</span>
          <span className='mx-2'>-</span>
          <span className=''>
            {sat.start + sat.size - 1}({sat.size} sats)
          </span>
          &nbsp;
        </>
      )}
      
      {sat.satributes.map((item, _) => (
        <img src={setSatIcon(item)} className='w-6 h-6 ml-1'/>
      ))}
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div className='flex'>
        <CopyButton text={sat.start} tooltip='Copy Sat' className='pt-1' />&nbsp;&nbsp;
        {/* {sat.canSplit && ['ordx.space'].every((v) => location.hostname !== v) && (
          // <SplitSatButton sat={sat} tooltip='Split Sat'/>
        )} */}
        {/* <SplitSatButton sat={sat} tooltip='Split Sat'/> */}
      </div>
    </div>
  );
};
