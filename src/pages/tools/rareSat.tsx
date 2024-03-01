import {useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { Card, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { SatRareBox } from '../explorer/components/SatRareBox';
import { getSats } from '@/api';
import { SatTable } from '../explorer/components/SatTable';

const { Search } = Input;
export default function RareSat() {

    const { state } = useLocation();
    const { t } = useTranslation();
    const [address, setAddress] = useState('');
    const [satList, setSatList] = useState<any[]>();
    const toast = useToast();

    const doSearch = async () => {
        const data = await getSats({
            address: address,
        });
        // if (data.code !== 0) {
        //     toast({
        //         title: data.msg,
        //         status: 'error',
        //         duration: 3000,
        //         isClosable: true,
        //       });
        //     return;
        // }
        // setSats(data.data);
        let aaa: any [] | undefined = [];
        for (let i = 0; i < data.length; i++) {
            aaa.push(...data[i].sats);
          }
        setSatList(aaa);
    };

    return (
        <div>
            <BtcHeightAlert />
            <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
                <h1 className='text-lg font-bold text-orange-500 text-center mb-4'>
                    {t('pages.rare_sat.des')}
                </h1>
                <div>
                    <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
                        <Search
                            allowClear
                            placeholder={t('pages.rare_sat.search_placeholder')}
                            size='large'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onSearch={doSearch}
                        />
                    </div>
                    <div className='max-w-7xl mx-auto px-4'>
                        {satList !== undefined ?
                        <>
                            <SatRareBox sats={satList} />
                            <SatTable sats={satList} />
                        </> : 
                        <>
                            <SatRareBox sats={[]} />
                            <SatTable sats={[]} />
                        </>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
