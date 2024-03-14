import { useTranslation } from 'react-i18next';
import { Dropdown, Popover, Tag, Divider, Space } from 'antd';
import type { DropdownProps, MenuProps } from 'antd';
export const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const handleChange = (lang: string) => {
      i18n.changeLanguage(lang);
  };
  const items: MenuProps['items'] = [
    { key: 'en', label: 'EN' },
    { key: 'ZH', label: 'zh' },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      // setOpen(false);
    }
  };
  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      // onOpenChange={handleOpenChange}
      // open={open}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
        </Space>
      </a>
    </Dropdown>
  );
}