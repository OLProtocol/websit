import { Icon } from '@iconify/react';
import { Tooltip } from 'antd';
import { useToast } from '@chakra-ui/react';

export const SplitSatButton = ({
  text,
  tooltip,
}: {
  text: string;
  tooltip?: string;
}) => {
  const toast = useToast();
  console.log(text)
  const clickHandler = () => { 
    // nav(ROUTE_PATH.TOOLS_SPLIT_SATS + '?q='+text);
    toast({
      title: 'Comming soon!',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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
