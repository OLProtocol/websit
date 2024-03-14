import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import type { MenuProps } from 'antd';
export const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const items: MenuProps['items'] = [
    { key: 'en', label: 'EN' },
    { key: 'ZH', label: 'zh' },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    i18n.changeLanguage(e.key);
  };
  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}>
      <Button size='middle' className='flex items-center justify-center' type="primary" shape="circle" icon={<TranslationOutlined />}>
      </Button>
    </Dropdown>
  );
};
