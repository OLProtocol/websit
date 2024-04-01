import { useCopyToClipboard } from 'react-use';
import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';

export const CopyButton = ({
  text,
  className,
  tooltip,
}: {
  text: string;
  tooltip?: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const timer = useRef<any>();
  const [copied, setCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const clickHandler = () => {
    if (text) {
      copyToClipboard(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };
  const tooltipText = useMemo(() => copied ? 'Copy Success' : tooltip, [copied, tooltip]);
  return (
    <Tooltip title={tooltipText}>
      <Icon
        icon='mdi:content-copy'
        className={` text-gray-500 text-lg ${className}`}
        onClick={clickHandler}></Icon>
    </Tooltip>
  );
};
