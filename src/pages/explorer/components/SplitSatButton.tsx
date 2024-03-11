import { useCopyToClipboard } from 'react-use';
import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
export const SplitSatButton = ({
  text,
  tooltip,
}: {
  text: string;
  tooltip?: string;
}) => {
  const nav = useNavigate();
  const clickHandler = () => { 
    nav(ROUTE_PATH.TOOLS_SPLIT_SATS + '?q='+text);
  };
  
  return (
    <Tooltip title={tooltip}>
      <Icon
        icon='game-icons:miner'
        className={`text-gray-500 text-lg`}
        onClick={clickHandler}></Icon>
    </Tooltip>
  );
};
