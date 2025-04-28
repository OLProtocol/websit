import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { TranslationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
export const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const language = searchParams.get('language');
  const items: MenuProps['items'] = [
    { key: 'en', label: 'english' },
    { key: 'zh', label: '中文' },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    i18n.changeLanguage(e.key);
  };

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      setSearchParams({});
    }
  }, [language]);
  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        defaultSelectedKeys: [language || "zh"],
        selectable: true,
      }}>
      <button
        // size='middle'
        className='flex items-center justify-center border border-zinc-500 rounded-full px-2 h-8'
        // type='primary'
        // shape='circle'
        // icon={<TranslationOutlined />}
        >
        <span className='text-sm text-zinc-200'>{i18n.language === 'en' ? 'En' : '中'}</span>    
        </button>
    </Dropdown>
  );
};
