import {useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BtcHeightAlert } from '@/components/BtcHeightAlert';
import { Input } from 'antd';
import { useState } from 'react';
import { getMintInfo } from '@/api';

const { Search } = Input;

export default function InscribeCheck() {
    const { state } = useLocation();
    const { t } = useTranslation();
    const [inscribId, setSearch] = useState('');
    const [checkResult, setResult] = useState('');
    const toast = useToast();

    const doSearch = async () => {
        const data = await getMintInfo({
            inscribId: inscribId,
        });
        if (data.code === 0) {
            setResult(t('pages.inscribe_check.success_result'));
        } else {
            setResult(t('pages.inscribe_check.failed_result'));
        }
    };

    return (
        <div>
            <BtcHeightAlert />
            <div className='max-w-[40rem] mx-auto pt-20 mb-4'>
                <h1 className='text-2xl text-orange-500 text-center mb-2'>
                    {t('pages.inscribe_check.title')}
                </h1>
                <div className='flex justify-center mb-12'>
                    <Search
                        allowClear
                        placeholder={t('pages.inscribe_check.search_placeholder')}
                        size='large'
                        value={inscribId}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={doSearch}
                    />
                </div>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='text-center'>
                        {checkResult}
                    </div>
                </div>
            </div>
        </div>
    )
};
