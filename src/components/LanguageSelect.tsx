import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { TranslationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useEffect } from 'react';
export const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const language = searchParams.get('language');
  const items: MenuProps['items'] = [
    { key: 'en', label: 'EN' },
    { key: 'ZH', label: 'zh' },
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
      }}>
      <Button
        size='middle'
        className='flex items-center justify-center'
        type='primary'
        shape='circle'
        icon={<TranslationOutlined />}></Button>
    </Dropdown>
  );
};
