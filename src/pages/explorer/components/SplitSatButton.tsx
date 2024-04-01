import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useToast } from '@chakra-ui/react';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';

interface SatItemProps {
  id: string;
  start: number;
  size: number;
  offset: number;
}

export const SplitSatButton = ({
  sat,
  tooltip,
}: {
  sat: SatItemProps;
  tooltip?: string;
}) => {
  const nav = useNavigate();
  console.log(sat);
  const clickHandler = () => {
    nav(ROUTE_PATH.TOOLS_SPLIT_SAT + '?utxo=' + sat.id + '&start=' + sat.start + '&size=' + sat.size + '&offset=' + sat.offset);
  }

  return (
    <Tooltip title={tooltip}>
      <Icon
        icon='game-icons:miner'
        className={`text-gray-500 text-lg pt-1`}
        onClick={clickHandler}></Icon>
    </Tooltip>
  );
};
