import { getSatTypes } from "@/api";
import { useUnisatConnect } from "@/lib/hooks";
import { Card, CardBody, CardHeader, Heading, Tooltip, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";


export const SatTypeBox = () => {
  
  const toast = useToast();
  const [satTypeList, setSatTypeList] = useState<any[]>();
  const { network } = useUnisatConnect();

  const typeMap = {
    mythic: {
      icon: '/images/sat/icon-mythic.svg',
      name: 'Mythical',
      tip: 'The first sat of the genesis block.'
    },
    legendary: {
      icon: '/images/sat/icon-legendary.svg',
      name: 'Legendary',
      tip: 'The first sat of each cycle.'
    },
    epic: {
      icon: '/images/sat/icon-epic.svg',
      name: 'Epic',
      tip: 'The first sat of each halving epoch.'
    },
    rare: {
      icon: '/images/sat/icon-rare.svg',
      name: 'Rare',
      tip: 'The first sat of each difficulty adjustment period.'
    },
    uncommon: {
      icon: '/images/sat/icon-uncommon.svg',
      name: 'Uncommon',
      tip: 'The first sat of each block.'
    },
    common: {
      icon: '/images/sat/icon-default.svg',
      name: 'Common/Unknown',
      tip: 'A sat of unknown rarity.'
    },
    black: {
      icon: '/images/sat/icon-bl.svg',
      name: 'Black',
      tip: 'The last sat of each block.'
    },
    fibonacci: {
      icon: '/images/sat/icon-fibonacci.svg',
      name: 'Fibonacci Sequence',
      tip: 'Sats with IDs that follow the Fibonacci Sequence.'
    },
    // {
    //   icon: '/images/sat/icon-np.svg',
    //   name: 'Name Palindrome',
    //   tip: 'Sats with palindromic names.'
    // },
    alpha: {
      icon: '/images/sat/icon-al.svg',
      name: 'Alpha',
      tip: 'The first sats in each bitcoin.They always end in at least 8 zeros.'
    },
    omega: {
      icon: '/images/sat/icon-om.svg',
      name: 'Omega',
      tip: 'The last sats in each bitcoin.They always end in at least 8 nines.'
    },
    block9: {
      icon: '/images/sat/icon-9.svg',
      name: 'Block 9',
      tip: 'Sats mined in Block 9(the first block with sats circulating today).'
    },
    block78: {
      icon: '/images/sat/icon-78.svg',
      name: 'Block 78',
      tip: 'Sats mined by Hal Finney in Block 78(the first block mined by someone other than Satoshi).'
    },
    nakamoto: {
      icon: '/images/sat/icon-nk.svg',
      name: 'Nakamoto',
      tip: 'Sats mined by Satoshi Nakamoto himself.'
    },
    vintage: {
      icon: '/images/sat/icon-vt.svg',
      name: 'Vintage',
      tip: 'Sats mined in the first 1000 bitcoin blocks.'
    },
    pizza: {
      icon: '/images/sat/icon-pz.svg',
      name: 'Pizza',
      tip: 'Sats involved in the famous pizza transaction from 2010.'
    },
    jpeg: {
      icon: '/images/sat/icon-jp.svg',
      name: 'Jpeg',
      tip: 'Sats involved in the possible first bitcoin trade for an image on February 24,2010.'
    },
    hitman: {
      icon: '/images/sat/icon-hm.svg',
      name: 'Hitman',
      tip: 'Sats involved in the transaction made by Ross Ulbricht to hire a hitman.'
    }
  }

  const getSatTypeList = async () => {
    const data = await getSatTypes({
      network,
    });
    if (data.code !== 0) {
      toast({
        title: data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSatTypeList([]);
      return;
    }

    let tmpTypes: any[] | undefined = [];
    for (let i = 0; i < data?.data?.length; i++) {
      if (typeMap[data.data[i]]) {
        tmpTypes.push(typeMap[data.data[i]]);
      } else {
        tmpTypes.push({
          icon: '/images/sat/icon-default.svg',
          name: data.data[i],
          tip: data.data[i]
        })
      }
    }

    setSatTypeList(tmpTypes);
  }

  useEffect(() => {
    getSatTypeList();
  }, []);

  return (
    <Card>
      <CardHeader>
        <Heading size='md'>
          Sat Type
        </Heading>
      </CardHeader>
      <CardBody>
        <div className='flex'>
        { satTypeList !== undefined && (
          satTypeList.map((item, index) => (
            <div key={index}>
              <Tooltip label={item.tip}>
                <img src={item.icon} className='w-6 h-6' />
              </Tooltip>
            </div>
          )
        ))}
        </div>
      </CardBody>
    </Card>
  );
};
