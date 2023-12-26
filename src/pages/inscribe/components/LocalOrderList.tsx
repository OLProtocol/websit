import { useOrderStore, OrderItemType } from '@/store';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { hideStr } from '@/lib/utils';
import { useUnisatConnect } from '@/lib/hooks/unisat';
import { inscribe } from '../utils';

interface LocalOrderListProps {
  onOrderClick?: (item: OrderItemType) => void;
}
export const LocalOrderList = ({ onOrderClick }: LocalOrderListProps) => {
  const { list } = useOrderStore((state) => state);
  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>Local Order List</TableCaption>
        <Thead>
          <Tr>
            <Th>Order Id</Th>
            <Th>Status</Th>
            <Th>Create Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((item) => (
            <Tr
              key={item.orderId}
              onClick={() => {
                onOrderClick?.(item);
              }}>
              <Td>{hideStr(item.orderId, 10)}</Td>
              <Td>{item.status}</Td>
              <Td>{new Date(item.createAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
