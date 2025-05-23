import { Tag } from 'antd';
import { CopyButton } from '@/components/CopyButton';
import { SplitSatButton } from './SplitSatButton';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { setSatIcon } from '@/lib/utils/sat';
import { hideStr } from '@/lib/utils';
import { generateMempoolUrl } from '@/lib/utils';
import { useNetwork } from '@/lib/wallet';

interface SatItemProps {
  utxo: any;
}
export const SatItem = ({ utxo }: SatItemProps) => {
  const network = useNetwork();

  const txid = utxo.utxo.replace(/:0$/m, '');
  const href = generateMempoolUrl({
    network,
    path: `tx/${txid}`,
  });

  return (
    <div className='group max-w-full mx-auto flex' key={Math.random()}>
      <div className='flex item-center justify-center'>
        <a className='text-blue-500 cursor-pointer' href={href} target='_blank'>
          {hideStr(utxo.utxo)}
        </a>
        {'(' + utxo.value + ' sats)'}
        &nbsp;&nbsp;
        <CopyButton text={utxo.utxo} tooltip='Copy' className='pt-1' />
        &nbsp;&nbsp;&nbsp;&nbsp;
      </div>

      <div>
        {utxo.sats.map((sat, index) => (
          <div key={index} className='flex'>
            <Tag color='green' bordered={false}>
              Block#{sat.block}
            </Tag>
            {sat.size === 1 ? (
              <>
                <span className=''>{sat.start}</span>&nbsp;
              </>
            ) : (
              <>
                <span className=''>
                  {sat.start +
                    ' - ' +
                    (sat.start + sat.size - 1) +
                    '(' +
                    sat.size +
                    ' sats)'}
                </span>
                &nbsp;
              </>
            )}
            {sat.satributes.map((item, index) => (
              <img key={index} src={setSatIcon(item)} className='w-6 h-6 ml-1' />
            ))}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className='flex'>
              <CopyButton
                text={sat.start}
                tooltip='Copy Sat'
                className='pt-1'
              />
              &nbsp;&nbsp;
            </div>
          </div>
        ))}
      </div>
      <div>
        {/* {sat.canSplit && ['sat20.org'].every((v) => location.hostname !== v) && sat.value !== sat.size && (
          <SplitSatButton sat={sat} tooltip='Split Sat'/>
        )} */}

        {utxo.sats.length === 1 &&
          utxo.sats[0].value !== utxo.sats[0].size &&
          utxo.sats[0].value > 546 && (
            <SplitSatButton sat={utxo.sats[0]} tooltip='Split Sat' />
          )}
      </div>
    </div>
  );
};



