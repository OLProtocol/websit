import { Card, CardBody, CardHeader, Heading, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";


export const SatTypeBox = () => {
  const satTypeList = useMemo(
    () => [
      {
        icon: '/images/sat/icon-mythic.svg',
        name: 'Mythical',
        tip: 'The first sat of the genesis block.',
      },
      {
        icon: '/images/sat/icon-legendary.svg',
        name: 'Legendary',
        tip: 'The first sat of each cycle.'
      },
      {
        icon: '/images/sat/icon-epic.svg',
        name: 'Epic',
        tip: 'The first saat of each halving epoch.'
      },
      {
        icon: '/images/sat/icon-rare.svg',
        name: 'Rare',
        tip: 'The first sat of each difficulty adjustment period.'
      },
      {
        icon: '/images/sat/icon-uncommon.svg',
        name: 'Uncommon',
        tip: 'The first sat of each block.'
      },
      // {
      //   icon: '/images/sat/common.svg',
      //   name: 'Connom/Unknown',
      //   tip: 'A sat of unknown rarity.'
      // },
      {
        icon: '/images/sat/icon-bl.svg',
        name: 'Black',
        tip: 'The last sat of each block.'
      },
      {
        icon: '/images/sat/icon-np.svg',
        name: 'Name Palindrome',
        tip: 'Sats with palindromic names.'
      },
      {
        icon: '/images/sat/icon-al.svg',
        name: 'Alpha',
        tip: 'The first sats in each bitcoin.They always end in at least 8 zeros.'
      },
      {
        icon: '/images/sat/icon-om.svg',
        name: 'Omega',
        tip: 'The last sats in each bitcoin.They always end in at least 8 nines.'
      },
      {
        icon: '/images/sat/icon-9.svg',
        name: 'Block 9',
        tip: 'Sats mined in Block 9(the first block with sats circulating today).'
      },
      {
        icon: '/images/sat/icon-78.svg',
        name: 'Block 78',
        tip: 'Sats mined by Hal Finney in Block 78(the first block mined by someone other than Satoshi).'
      },
      {
        icon: '/images/sat/icon-nk.svg',
        name: 'Nakamoto',
        tip: 'Sats mined by Satoshi Nakamoto himself.'
      },
      {
        icon: '/images/sat/icon-vt.svg',
        name: 'Vintage',
        tip: 'Sats mined in the first 1000 bitcoin blocks.'
      },
      {
        icon: '/images/sat/icon-pz.svg',
        name: 'Pizza',
        tip: 'Sats involved in the famous pizza transaction from 2010.'
      },
      {
        icon: '/images/sat/icon-jp.svg',
        name: 'Jpeg',
        tip: 'Sats involved in the possible first bitcoin trade for an image on February 24,2010.'
      },
      {
        icon: '/images/sat/icon-hm.svg',
        name: 'Hitman',
        tip: 'Sats involved in the transaction made by Ross Ulbricht to hire a hitman.'
      }
    ],[]
  );

  function setSatIcon (type:  string) : string {
    switch (type) {
      case 'palindromes_paliblock':
        return '/images/sat/icon-pb.svg';
      case 'palindromes_integer':
        return '/images/sat/icon-dp.svg';
      case 'palindromes_integer_2d':
        return '/images/sat/icon-2dp.svg';
      case 'palindromes_integer_3d':
        return '/images/sat/icon-3dp.svg';
      case 'palindromes_name_2c':
        return '/images/sat/icon-2cp.svg';
      case 'palindromes_name_3c':
        return '/images/sat/icon-3cp.svg';
      case 'silk_road_first_auction':
        return '/images/sat/icon-sr.svg';
      case 'first_transaction':
        return '/images/sat/icon-t1.svg';
      default:
        return '';
    }
  };

  return (
    <Card>
        <CardHeader>
            <Heading size='md'>
                Sat Type
            </Heading>
        </CardHeader>
        <CardBody>
            <div className='flex'>
            {satTypeList.map((item, index) => (
                <div key={index}>
                    <Tooltip label={item.tip}>
                        <img src={item.icon} className='w-6 h-6' />
                    </Tooltip>
                </div>
            ))}
            </div>
        </CardBody>
    </Card>
  );
};
