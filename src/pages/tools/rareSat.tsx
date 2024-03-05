import { useLocation } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Heading, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react';
// import { Button, useToast } from '@chakra-ui/react';
// import { Card, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SatRareBox } from '../explorer/components/SatRareBox';
import { getSats } from '@/api';
import { SatTable } from '../explorer/components/SatTable';

// const { Search } = Input;
export default function RareSat() {

    const { t } = useTranslation();
    const [address, setAddress] = useState('mmhMAiNisqkpUSMz7k4ufUQbqWN6Yf3RmS');
    const [rareSatList, setRareSatList] = useState<any[]>();
    const [satList, setSatList] = useState<any[]>();
    const [satFilterList, setSatFilterList] = useState<any[]>();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    let uniqueTypes: string[] = [];
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
        if (satType === 'all') {
            setSatFilterList([]);
        } else {
            if (satList !== undefined) {
                setSatFilterList(satList.filter((item) => item.type.includes(satType)));
            }
        }
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
        let tmpSats: any[] | undefined = [];
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
            <div className='flex flex-col max-w-[48rem] mx-auto pt-8'>
                <h1 className='text-lg font-bold text-orange-500 text-center mb-4'>
                    {t('pages.rare_sat.des')}
                </h1>
                <div>
                    <div className='flex justify-center mb-12 max-w-7xl mx-auto px-4'>
                        <InputGroup size='lg' className='rounded-2xl'>
                            <Input placeholder={t('pages.rare_sat.search_placeholder')} value={address} size='lg' onChange={(e) => setAddress(e.target.value)} />
                            <InputRightElement width='4.5rem' className='mr-1'>
                                <Button isLoading={loading} size='md' onClick={doSearch} variant="solid" colorScheme='blue'>
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
                            <div>
                                <SatRareBox sats={rareSatList} />
                                <div className='pt-4'/>
                                <Card>
                                    <CardHeader>
                                        <Heading size='md'>
                                            Interesting Sats
                                        </Heading>
                                    </CardHeader>
                                    <CardBody>
                                    {uniqueTypes.map((item, _) => (
                                        <Button size='sm' className='m-1' onClick={() => setFilterType(item)}>
                                            {item}
                                        </Button>
                                    ))}
                                    {satFilterList && satFilterList.length > 0 ?
                                        <SatTable sats={satFilterList} /> :
                                        <SatTable sats={satList} />
                                    }
                                    </CardBody>
                                </Card>
                            </div> :
                            <div>
                                <SatRareBox sats={[]} />
                                <div className='pt-4'/>
                                <Card>
                                    <CardHeader>
                                        <Heading size='md'>
                                            Interesting Sats
                                        </Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <SatTable sats={[]} />
                                    </CardBody>
                                </Card>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
