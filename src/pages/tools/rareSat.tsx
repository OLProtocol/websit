import {useLocation } from 'react-router-dom';
import { Button, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
// import { Card, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SatRareBox } from '../explorer/components/SatRareBox';
import { getSats } from '@/api';
import { SatTable } from '../explorer/components/SatTable';

// const { Search } = Input;
export default function RareSat() {

    const { state } = useLocation();
    const { t } = useTranslation();
    const [address, setAddress] = useState('');
    const [rareSatList, setRareSatList] = useState<any[]>();
    const [satList, setSatList] = useState<any[]>();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    let uniqueTypes:string[] = [];
    if (satList) {
        let uniqueTypeSet = new Set<string>();
        satList.forEach(item => item.type.forEach(satType => uniqueTypeSet.add(satType)));
        uniqueTypes = Array.from(uniqueTypeSet);
        if (uniqueTypes.length > 0) {
          uniqueTypes.unshift('all');
        }
    }
    
    
    function setFilterType(satType: string): void {
      console.log(satType);
    //   satList = satList.filter((item) => item.type.includes(satType))
    //   alert(satList.length);
    }

    const doSearch = async () => {
        setLoading(true);
        setRareSatList([]);
        setSatList([]);
        const data = await getSats({
            address: address,
        });
        if (data.code !== 0) {
            toast({
                title: data.msg,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }
        // setSats(data.data);
        let tmpSats: any [] | undefined = [];
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].sats !== null && data.data[i].sats.length > 0) {
                tmpSats.push(...data.data[i].sats);
            }
        }
        tmpSats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        setRareSatList(tmpSats);

        tmpSats = tmpSats.filter(item => !item.type.includes('uncommon'))
            .filter(item => !item.type.includes('rare'))
            .filter(item => !item.type.includes('epic'))
            .filter(item => !item.type.includes('legendary'))
            .filter(item => !item.type.includes('mythic'));
        setSatList(tmpSats);
        setLoading(false);
    };

    return (
        <div>
            {/* <BtcHeightAlert /> */}
            <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
                <h1 className='text-lg font-bold text-orange-500 text-center mb-4'>
                    {t('pages.rare_sat.des')}
                </h1>
                <div>
                    <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
                        <InputGroup size='lg' className='rounded-2xl'>
                            <Input placeholder={t('pages.rare_sat.search_placeholder')} value={address} size='lg' onChange={(e) => setAddress(e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button isLoading={loading} size='md' onClick={doSearch} variant="solid" colorScheme='teal'>
                                    Check
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {/* <Search className='rounded-2xl'
                            allowClear
                            placeholder={t('pages.rare_sat.search_placeholder')}
                            size='large'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onSearch={doSearch}
                        /> */}
                    </div>
                    <div className='max-w-7xl mx-auto px-4'>
                        {rareSatList !== undefined && satList !== undefined ?
                        <>
                            <SatRareBox sats={rareSatList} />
                            <div className='rounded-2xl sat-box bg-gray-200 p-4 mt-2.5'>
                                <h3 className='text-2xl mb-2'>Interesting Sats</h3>
                                {uniqueTypes.map((item, _) => (
                                    <Button size='sm' className='m-1' onClick={() => setFilterType(item)}>
                                    {item}
                                    </Button>
                                ))}
                                <SatTable sats={satList} />
                            </div>
                        </> : 
                        <>
                            <SatRareBox sats={[]} />
                            <div className='rounded-2xl sat-box bg-gray-200 p-4 mt-2.5'>
                                <h3 className='text-2xl mb-2'>Interesting Sats</h3>
                                <SatTable sats={[]} />
                            </div>
                        </>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
