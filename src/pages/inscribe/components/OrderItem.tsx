import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';


export const OrderItem = ({ item }: any) => {
  const { taskId, status, type, files, feeRate } = item;
  
  const onRemove = () => {
  };
  return (
    <>
      <Box key={taskId} p={5} shadow='md' borderWidth='1px'>
        <Flex justifyContent='space-between'>
          <Box>
            <Text fontSize='lg'>TaskId: {taskId}</Text>
            <Text fontSize='lg'>Status: {status}</Text>
            <Text fontSize='lg'>Type: {type}</Text>
            <Text fontSize='lg'>FeeRate: {feeRate}</Text>
            <Text fontSize='lg'>Files: {files.length}</Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
